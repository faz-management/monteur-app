/* FAZ Monteur-App – Service Worker (V34, 26.11.2026)
   1. App-Hülle im Handy speichern: die App startet auch ohne Netz.
   2. Hintergrund-Senden: wartende Stempel und Ticket-Eingaben werden gesendet,
      sobald wieder Netz da ist – auch wenn die App geschlossen ist (Background Sync).
   Doppelschutz: jede Eingabe hat eine feste ID (cid), der Server erkennt Wiederholungen. */
var CACHE = "faz-v34";
var HUELLE = ["./", "index.html", "app.js?v=34", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (e) {
  // V34: cache "reload" – die Dateien frisch vom Server holen, nicht aus dem Zwischenspeicher des Browsers (GitHub Pages hält 10 min).
  // Sonst kann die alte Seite im neuen Speicher landen und offline nach app.js der alten Version suchen.
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(HUELLE.map(function (u) { return new Request(u, { cache: "reload" }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("faz-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function mitZeitlimit(p, ms) {
  return new Promise(function (res, rej) {
    var t = setTimeout(function () { rej(new Error("zeit")); }, ms);
    p.then(function (x) { clearTimeout(t); res(x); }, function (x) { clearTimeout(t); rej(x); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Server-Aufrufe (Apps Script) nie anfassen
  if (req.mode === "navigate") {
    // Seite: erst Netz (max. 4 s, damit Neuerungen ankommen), sonst gespeicherte Hülle
    e.respondWith(
      mitZeitlimit(fetch(req), 4000).then(function (r) {
        if (r && r.ok) { var k = r.clone(); caches.open(CACHE).then(function (c) { c.put("./", k); }); }
        return r;
      }).catch(function () {
        return caches.match("./").then(function (r) { return r || caches.match("index.html"); });
      })
    );
    return;
  }
  // Dateien der Hülle: aus dem Speicher, sonst Netz
  e.respondWith(caches.match(req).then(function (r) {
    return r || fetch(req).then(function (n) {
      if (n && n.ok) { var k = n.clone(); caches.open(CACHE).then(function (c) { c.put(req, k); }); }
      return n;
    });
  }));
});

/* ---------- Hintergrund-Senden ---------- */
function db() {
  return new Promise(function (res, rej) {
    var r = indexedDB.open("faz_tq", 2);
    r.onupgradeneeded = function () {
      var d = r.result;
      if (!d.objectStoreNames.contains("q")) d.createObjectStore("q", { keyPath: "id" });
      if (!d.objectStoreNames.contains("st")) d.createObjectStore("st", { keyPath: "id" });
      if (!d.objectStoreNames.contains("kv")) d.createObjectStore("kv");
    };
    r.onsuccess = function () { res(r.result); };
    r.onerror = function () { rej(r.error); };
  });
}
function alle(d, store) {
  return new Promise(function (res) {
    var q = d.transaction(store).objectStore(store).getAll();
    q.onsuccess = function () { res((q.result || []).sort(function (a, b) { return a.ts - b.ts; })); };
    q.onerror = function () { res([]); };
  });
}
function wert(d, key) {
  return new Promise(function (res) {
    var q = d.transaction("kv").objectStore("kv").get(key);
    q.onsuccess = function () { res(q.result); };
    q.onerror = function () { res(null); };
  });
}
function weg(d, store, id) {
  return new Promise(function (res) {
    var tx = d.transaction(store, "readwrite"); tx.objectStore(store).delete(id);
    tx.oncomplete = tx.onerror = tx.onabort = function () { res(); };
  });
}
function post(ep, body) {
  return fetch(ep, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body), redirect: "follow" })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); });
}
/* V34: Die App bekommt mit, WAS gesendet wurde (Schott + neuer Stand vom Server). Vorher kam nur „gesendet“: Die App nahm den Eintrag
   aus der Warteliste, zeigte das Schott aber weiter im alten Stand – eben gespeicherte Felder standen wieder als „offen“ da
   („le-am scris, dar nu se salvează“, Victor 26.11.2026). */
function melden(tickets) {
  return self.clients.matchAll({ type: "window" }).then(function (cs) { cs.forEach(function (c) { c.postMessage({ typ: "gesendet", tickets: tickets || [] }); }); });
}

var laeuft = null;
function senden() {
  if (laeuft) return laeuft;
  // V34: rest = es ist etwas liegen geblieben (Ortung läuft noch, Wartezeit, „busy“, abgelehnt). Dann endet der Lauf mit Fehler,
  // damit der Browser den Hintergrund-Versand von selbst wiederholt. Vorher galt der Lauf als erledigt und es kam kein neuer Versuch –
  // ein Stempel, bei dem die App vor Ende der Ortung geschlossen wurde, blieb bis zum nächsten Öffnen liegen.
  var netzFehler = false, gesendet = 0, rest = false;
  laeuft = db().then(function (d) {
    return wert(d, "endpoint").then(function (ep) {
      if (!ep) return;
      // 1. Stempel (jede Stempelung für sich)
      return alle(d, "st").then(function (st) {
        return st.reduce(function (p, it) {
          return p.then(function () {
            if (netzFehler) return;
            if (it.gpsBis && it.gpsBis > Date.now()) { rest = true; return; }
            return post(ep, it.body).then(function (r) {
              if (r && (r.ok || r.error === "alt")) { gesendet++; return weg(d, "st", it.id); }
              rest = true;
            }, function () { netzFehler = true; });
          });
        }, Promise.resolve());
      }).then(function () {
        // 2. Ticket-Eingaben. V34: erst die kleinen (Haken, Felder, Punkte, Material), dann Fotos und FERTIG/Problem in ihrer Reihenfolge –
        //    wie in der App (tqNext). Lehnt der Server einen Eintrag ab, bleibt er für die App liegen (sie zeigt den Fehler);
        //    vom selben Schott wird dann nichts Weiteres gesendet, andere Schotts laufen weiter. „busy“ = läuft gerade → ganz anhalten.
        return alle(d, "q").then(function (q) {
          var stop = false, zu = {}, jetzt = Date.now();
          var klein = function (it) { var w = it.p && it.p.was; return w !== "foto" && w !== "status"; };
          var reihe = q.filter(klein).concat(q.filter(function (it) { return !klein(it); }));
          return reihe.reduce(function (p, it) {
            return p.then(function () {
              if (netzFehler) return;
              if (stop || zu[it.tk]) { rest = true; return; }
              if (it.next && it.next > jetzt) { zu[it.tk] = 1; rest = true; return; } // Wartezeit nach Serverfehler (setzt die App)
              return post(ep, it.p).then(function (r) {
                if (r && r.ok) {
                  gesendet++;
                  // was/status mitgeben: kommt kein neuer Stand vom Server zurück, kann die App FERTIG/Problem trotzdem am Schott zeigen
                  return weg(d, "q", it.id).then(function () { if (it.tk) return melden([{ tk: it.tk, ticket: r.ticket || null, was: (it.p && it.p.was) || "", status: (it.p && it.p.status) || "" }]).catch(function () {}); });
                }
                rest = true;
                if (r && r.error === "busy") { stop = true; return; }
                zu[it.tk] = 1;
              }, function () { netzFehler = true; });
            });
          }, Promise.resolve());
        });
      });
    });
  }).then(function () {
    laeuft = null;
    if (gesendet) melden();
    if (netzFehler) throw new Error("kein Netz"); // Browser versucht es später erneut
    if (rest) throw new Error("Rest in der Warteliste");
  }, function (e) { laeuft = null; throw e; });
  return laeuft;
}

self.addEventListener("sync", function (e) {
  if (e.tag === "faz-sync") e.waitUntil(senden());
});
self.addEventListener("message", function (e) {
  if (e.data && e.data.typ === "senden") e.waitUntil(senden().catch(function () {}));
});
