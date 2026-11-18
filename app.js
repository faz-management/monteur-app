
/* ===== Konfiguration =====
   ENDPOINT: Web-App-URL des Google-Apps-Script (endet auf /exec).
   Wird die Seite direkt aus Apps Script ausgeliefert, wird der Wert automatisch gesetzt. */
/* V28 (18.11.2026): Oberfläche liegt auf GitHub Pages (offlinefähig), Server bleibt Apps Script. */
var APP_VERSION = "28";
var EPS = {
  live: "https://script.google.com/macros/s/AKfycbyvvbt__AT77uIZXixBWaxYZk5A8xAdyJMF3qZcngFnpnOTZ5b0EOSP0CuSSRKXKMtE-g/exec",
  test: "https://script.google.com/macros/s/AKfycbxY7Otv8aduO8SyULy5SAcxsrWd5kuetX8wKVdYde4psC_k6OuF3TUP_S1YZRHZumWcSw/exec"
};
var ENDPOINT = EPS.live;

var T = {
  ro:{statusLabel:"Stare actuală",kommen:"SOSIRE",kommenSub:"Început lucru",gehen:"PLECARE",gehenSub:"Sfârșit lucru",
      pause:"PAUZĂ",pauseSub:"Început pauză",weiter:"CONTINUARE",weiterSub:"Sfârșit pauză",heute:"Astăzi",
      sOff:"Nu lucrez",sOn:"La lucru",sPause:"În pauză",last:"Ultima înregistrare: ",
      saved:"Salvat ✓",queued:"Fără internet. Salvat pe telefon, se trimite automat.",gpsWait:"Se caută locația…",
      noGps:"Locația nu a putut fi determinată. Înregistrarea a fost salvată fără locație.",
      confirm:"Sigur? Ultima înregistrare a fost deja: ",yes:"Da",no:"Nu",
      notSetup:"Acest telefon nu este încă configurat. Vă rugăm contactați biroul.",
      invalid:"Telefonul nu este activat. Vă rugăm contactați biroul.",
      pending:"în așteptare",
      tabAuf:"Montatori",aufTitle:"Alege montatorul",aufStamp:"Pontajul merge doar pe contul tău. Întâi înapoi la Montatori.",aufView:"Vizualizare: ",aufQueue:"Întâi se trimit datele în așteptare.",
      tabStempel:"Pontaj",tabAzi:"Azi",tabSapt:"Săptămâna",pNone:"Nimic planificat",pLoad:"Se încarcă planul…",
      pOffline:"Fără internet – ultimul plan salvat",pStand:"Actualizat la ",pReload:"Actualizează",pTomorrow:"Mâine",pToday:"Azi",
      pWith:"Cu: ",pRes:"cu rezervă",pOpen:"tichete deschise",pNoProj:"Fără proiect Fieldwire pentru acest termen",
      pMore:"… și încă ",pPlan:"Plan (Fieldwire)",pNoName:"Acest telefon nu are nume pentru calendar. Vă rugăm contactați biroul.",
      pErr:"Planul nu a putut fi încărcat.",pRoom:"Camera ",pLevel:"Nivel ",pCarry:"reportat din ziua anterioară",tkS1:"Găsește trecerea",tkS2:"Foto înainte",tkS3:"Ce este de făcut",tkS4:"Date de completat",tkS5:"Foto după",tkS6:"Încheiere",tkFoto:"Fă o poză",tkFotoMehr:"Încă o poză",tkUpload:"Se trimite poza…",tkKeinePunkte:"Nicio listă de lucrări în tichet – întreabă biroul.",tkPunktNeu:"Ce ai mai făcut / observații",tkPunktAdd:"Adaugă punct",tkWaehlen:"– alege –",tkFehlt:"Lipsește:",tkUebernehmen:"Salvează datele",tkMatFrage:"Ce material ai folosit? Modifică doar ce nu este corect.",tkMatExtra:"Alt material / observații",tkMatOk:"Corect – trimite GATA",tkMatLeer:"Nu există estimare – scrie materialul folosit.",tkMatLaden:"Se calculează materialul…",tkFertig:"GATA",tkFertigFrage:"Trecerea este gata și totul este completat?",tkProblem:"Problemă",tkGrundText:"Scrie sau dictează care este problema",tkMelden:"Trimite la birou",tkNeu:"Trecere nouă găsită",tkNeuName:"Numărul # din Fieldwire",tkNeuGo:"Preia",tkNeuHinweis:"Mai întâi creează trecerea în aplicația Fieldwire, direct pe plan, la locul corect. Apoi introdu aici numărul # din Fieldwire.",tkNeuNicht:"Numărul nu a fost găsit în acest proiect.",tkMat:"Material pentru ",tkProblemFoto:"Poză (opțional, înainte de text)",tkKeinPin:"Lipsește pinul pe plan: pune-l în Fieldwire, apoi revino în aplicație.",tkDone:"Gata – trimis la birou",tkProblemDone:"Problemă trimisă la birou",tkVoll:"Memoria telefonului este plină. Încearcă din nou când ai internet.",tkNurOnline:"Pentru aceasta este nevoie de internet.",tkFotosAlt:"Poze existente",zuAlt:"Pontaj mai vechi de 24 de ore – nu a fost trimis. Anunță biroul.",tkWarte:"în așteptare: ",days:["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"],
      foot:"Locația se salvează doar în momentul apăsării unui buton, nu în restul timpului.",
      footNoGps:"Pentru acest telefon nu se salvează nicio locație.",
      names:{"Kommen":"Sosire","Gehen":"Plecare","Pause Beginn":"Început pauză","Pause Ende":"Sfârșit pauză"},
      sTitle:"Prima configurare",sName:"Numele și prenumele dumneavoastră",sDsiTitle:"Informare privind protecția datelor (pe scurt)",
      sRead:"Am citit informarea privind protecția datelor.",sGpsTitle:"Locația în momentul pontajului (voluntar)",
      sGpsJa:"Sunt de acord ca la fiecare pontaj să se salveze locația mea.",sGpsNein:"Nu sunt de acord. Pontez fără locație.",
      sSave:"Salvează și începe",eName:"Vă rugăm introduceți numele.",eRead:"Vă rugăm confirmați că ați citit informarea.",
      eGps:"Vă rugăm alegeți: de acord sau nu.",eNet:"Fără conexiune la internet. Vă rugăm încercați din nou.",change:"Modificare nume / acord",
      dsi:["Operator: Fire Safety A-Z Management GmbH, Römerstr. 13, 84107 Weihmichl, info@faz-management.de.",
           "Se salvează: numele, firma, momentul și tipul fiecărui pontaj, un cod al telefonului. Numai cu acordul dumneavoastră: locația în momentul apăsării butonului. În rest telefonul nu este localizat.",
           "Scop: înregistrarea timpului de lucru și salarizarea (angajații FAZ, obligație legală conform § 16 ArbZG, § 17 MiLoG), respectiv dovada prezenței pe șantier (angajații subcontractanților).",
           "Destinatari: conducerea, biroul, consultantul fiscal, pentru subcontractanți angajatorul dumneavoastră, la controale autoritățile. Datele se salvează la Google (Google Ireland Ltd.).",
           "Durata de păstrare: timpii cel puțin 2 ani, locația 3 luni.",
           "Drepturi: acces, rectificare, ștergere, restricționare, opoziție, plângere la autoritatea de supraveghere din Bavaria (BayLDA). Acordul pentru locație poate fi retras oricând în această aplicație sau la birou, fără niciun dezavantaj.",
           "Informarea completă o primiți pe hârtie la birou."]},
  de:{statusLabel:"Aktueller Stand",kommen:"KOMMEN",kommenSub:"Arbeitsbeginn",gehen:"GEHEN",gehenSub:"Arbeitsende",
      pause:"PAUSE",pauseSub:"Pausenbeginn",weiter:"WEITER",weiterSub:"Pausenende",heute:"Heute",
      sOff:"Nicht im Dienst",sOn:"Bei der Arbeit",sPause:"In Pause",last:"Letzte Stempelung: ",
      saved:"Gespeichert ✓",queued:"Kein Internet. Auf dem Handy gespeichert, wird automatisch nachgesendet.",gpsWait:"Standort wird ermittelt…",
      noGps:"Standort konnte nicht ermittelt werden. Stempelung wurde ohne Standort gespeichert.",
      confirm:"Wirklich? Die letzte Stempelung war bereits: ",yes:"Ja",no:"Nein",
      notSetup:"Dieses Handy ist noch nicht eingerichtet. Bitte im Büro melden.",
      invalid:"Dieses Handy ist nicht freigeschaltet. Bitte im Büro melden.",
      pending:"wartet",
      tabAuf:"Monteure",aufTitle:"Monteur wählen",aufStamp:"Stempeln geht nur für dich selbst. Erst zurück zu Monteure.",aufView:"Ansicht: ",aufQueue:"Erst werden wartende Daten gesendet.",
      tabStempel:"Stempeln",tabAzi:"Heute",tabSapt:"Woche",pNone:"Nichts geplant",pLoad:"Plan wird geladen…",
      pOffline:"Kein Internet – letzter gespeicherter Plan",pStand:"Stand ",pReload:"Aktualisieren",pTomorrow:"Morgen",pToday:"Heute",
      pWith:"Mit: ",pRes:"mit Vorbehalt",pOpen:"offene Tickets",pNoProj:"Kein Fieldwire-Projekt zu diesem Termin",
      pMore:"… und noch ",pPlan:"Plan (Fieldwire)",pNoName:"Für dieses Handy ist kein Kalendername hinterlegt. Bitte im Büro melden.",
      pErr:"Plan konnte nicht geladen werden.",pRoom:"Raum ",pLevel:"Ebene ",pCarry:"vom Vortag übertragen",tkS1:"Schott finden",tkS2:"Foto vorher",tkS3:"Was zu tun ist",tkS4:"Angaben eintragen",tkS5:"Foto nachher",tkS6:"Abschluss",tkFoto:"Foto machen",tkFotoMehr:"Noch ein Foto",tkUpload:"Foto wird gesendet…",tkKeinePunkte:"Keine Arbeitsliste im Ticket – bitte im Büro fragen.",tkPunktNeu:"Was noch gemacht wurde / Bemerkung",tkPunktAdd:"Punkt hinzufügen",tkWaehlen:"– wählen –",tkFehlt:"Es fehlt:",tkUebernehmen:"Angaben übernehmen",tkMatFrage:"Welches Material hast du verbraucht? Nur ändern, was nicht stimmt.",tkMatExtra:"Weiteres Material / Bemerkung",tkMatOk:"Passt – FERTIG melden",tkMatLeer:"Keine Schätzung – bitte verbrauchtes Material eintragen.",tkMatLaden:"Material wird berechnet…",tkFertig:"FERTIG",tkFertigFrage:"Ist das Schott fertig und alles eingetragen?",tkProblem:"Problem",tkGrundText:"Problem eintippen oder diktieren",tkMelden:"Ans Büro melden",tkNeu:"Neues Schott gefunden",tkNeuName:"#-Nummer aus Fieldwire",tkNeuGo:"Übernehmen",tkNeuHinweis:"Zuerst in der Fieldwire-App das Schott direkt auf dem Plan an der richtigen Stelle anlegen. Dann hier die #-Nummer aus Fieldwire eingeben.",tkNeuNicht:"Nummer in diesem Projekt nicht gefunden.",tkMat:"Material für ",tkProblemFoto:"Foto (freiwillig, vor dem Text)",tkKeinPin:"Pin im Plan fehlt: in Fieldwire setzen, dann zurück in die App.",tkDone:"Fertig – ans Büro gemeldet",tkProblemDone:"Problem ans Büro gemeldet",tkVoll:"Handyspeicher voll. Bei Internet erneut versuchen.",tkNurOnline:"Dafür ist Internet nötig.",tkFotosAlt:"Vorhandene Fotos",zuAlt:"Stempelung älter als 24 Stunden – nicht gesendet. Bitte im Büro melden.",tkWarte:"wartet: ",days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
      foot:"Der Standort wird nur im Moment des Knopfdrucks gespeichert, sonst nie.",
      footNoGps:"Für dieses Handy wird kein Standort gespeichert.",
      names:{"Kommen":"Kommen","Gehen":"Gehen","Pause Beginn":"Pausenbeginn","Pause Ende":"Pausenende"},
      sTitle:"Ersteinrichtung",sName:"Ihr Vor- und Nachname",sDsiTitle:"Datenschutzinformation (Kurzfassung)",
      sRead:"Ich habe die Datenschutzinformation gelesen.",sGpsTitle:"Standort beim Stempeln (freiwillig)",
      sGpsJa:"Ich bin einverstanden, dass bei jeder Stempelung mein Standort gespeichert wird.",sGpsNein:"Ich bin nicht einverstanden. Ich stempele ohne Standort.",
      sSave:"Speichern und starten",eName:"Bitte Namen eingeben.",eRead:"Bitte bestätigen, dass Sie die Datenschutzinformation gelesen haben.",
      eGps:"Bitte wählen: einverstanden oder nicht.",eNet:"Keine Internetverbindung. Bitte erneut versuchen.",change:"Name / Einwilligung ändern",
      dsi:["Verantwortlich: Fire Safety A-Z Management GmbH, Römerstr. 13, 84107 Weihmichl, info@faz-management.de.",
           "Gespeichert werden: Name, Firma, Zeitpunkt und Art jeder Stempelung, eine Kennung des Handys. Nur mit Ihrer Einwilligung: der Standort im Moment des Knopfdrucks. Sonst wird das Handy nicht geortet.",
           "Zweck: Arbeitszeiterfassung und Lohnabrechnung (FAZ-Mitarbeiter, gesetzliche Pflicht nach § 16 ArbZG, § 17 MiLoG) bzw. Nachweis der Anwesenheit auf der Baustelle (Mitarbeiter von Nachunternehmern).",
           "Empfänger: Geschäftsführung, Büro, Steuerberater, bei Nachunternehmern Ihr Arbeitgeber, bei Prüfungen Behörden. Gespeichert wird bei Google (Google Ireland Ltd.).",
           "Speicherdauer: Zeiten mindestens 2 Jahre, Standort 3 Monate.",
           "Rechte: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Beschwerde beim Bayerischen Landesamt für Datenschutzaufsicht. Die Einwilligung zum Standort können Sie jederzeit in dieser App oder im Büro widerrufen, ohne Nachteile.",
           "Die vollständige Datenschutzinformation erhalten Sie in Papierform im Büro."]}
};

function ls(k,v){try{ if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v);}catch(e){return null}}
var lang = ls("faz_lang") || "ro";
var token = null, info = null;
var queue = []; try{queue = JSON.parse(ls("faz_queue")||"[]")}catch(e){queue=[]}
var log = []; try{log = JSON.parse(ls("faz_log")||"[]")}catch(e){log=[]}

// Token aus Einrichtungslink übernehmen (?t=...)
(function(){
  var m = location.hash.match(/[#&]t=([A-Za-z0-9]+)/) || location.search.match(/[?&]t=([A-Za-z0-9]+)/);
  var e = location.hash.match(/[#&]e=(live|test)/);
  if(e) ls("faz_ep", e[1]);
  var neu = m ? m[1] : (window.__TOKEN__ || null);
  if(neu && neu !== ls("faz_token")){ ls("faz_token", neu); ls("faz_info", null); ls("faz_plan", null); }
  token = ls("faz_token");
  ENDPOINT = EPS[ls("faz_ep")||"live"] || EPS.live;
  if(m || e){ try{ history.replaceState(null, "", location.pathname); }catch(x){} } // Token nicht in der Adresszeile lassen
  try{ info = JSON.parse(ls("faz_info")||"null"); }catch(e){ info=null; }
})();

function $(id){return document.getElementById(id)}
var ALS=ls("faz_als")||""; // Aufsicht: gewählter Monteur (Vorname), leer = eigene Ansicht
function t(k){return T[lang][k]}
function pad(n){return (n<10?"0":"")+n}
function hm(ms){var d=new Date(ms);return pad(d.getHours())+":"+pad(d.getMinutes())}
function dayKey(ms){var d=new Date(ms);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,10)}

function applyLang(){
  document.documentElement.lang = lang;
  $("l-ro").className = lang==="ro"?"on":""; $("l-de").className = lang==="de"?"on":"";
  document.querySelectorAll("[data-i]").forEach(function(el){el.textContent=t(el.getAttribute("data-i"))});
  $("ovYes").textContent=t("yes"); $("ovNo").textContent=t("no");
  var ul=$("sDsi"); ul.innerHTML=""; t("dsi").forEach(function(x){var li=document.createElement("li");li.textContent=x;ul.appendChild(li)});
  render(); if(window.renderPlan) renderPlan();
}
$("l-ro").onclick=function(){lang="ro";ls("faz_lang",lang);applyLang()};
$("l-de").onclick=function(){lang="de";ls("faz_lang",lang);applyLang()};

var srv=[]; // heutige Stempelungen vom Server (whoami)
function srvMerge(r){ srv=(r&&r.heute)||[];
  // V20: Stempel von heute, die im Handy stehen, aber weder beim Server noch in der Warteschlange sind, erneut senden
  if(ALS||!(r&&r.heute)) return;
  try{ var k=dayKey(Date.now()), neu=0;
    log.forEach(function(e){
      if(dayKey(e.ts)!==k||Date.now()-e.ts<60000) return;
      if(srv.some(function(s){return s.id===e.id})) return;
      if(queue.some(function(q){return q.id===e.id})) return;
      var qi={id:e.id,typ:e.typ,ts:e.ts,tzOffset:new Date(e.ts).getTimezoneOffset(),pos:null,plausibel:true}; queue.push(qi); stPut(qi); neu++;
    });
    if(neu){ ls("faz_queue",JSON.stringify(queue)); setTimeout(flush,500); }
  }catch(x){}
}
function entriesAll(){ if(ALS) return srv.slice(); var ids={}, a=log.slice(); a.forEach(function(e){ids[e.id]=1}); srv.forEach(function(e){ if(!ids[e.id] && !a.some(function(x){return x.typ===e.typ && Math.abs(x.ts-e.ts)<120000})) a.push(e); }); a.sort(function(x,y){return x.ts-y.ts}); return a; }
function todayEntries(){var k=dayKey(Date.now());return entriesAll().filter(function(e){return dayKey(e.ts)===k})}
function lastEntry(){var a=entriesAll();return a.length?a[a.length-1]:null}
function state(){
  var l=lastEntry(); if(!l||dayKey(l.ts)!==dayKey(Date.now())) return "off";
  if(l.typ==="Kommen"||l.typ==="Pause Ende") return "on";
  if(l.typ==="Pause Beginn") return "pause";
  return "off";
}
function render(){
  $("who").textContent = info ? ((ALS?t("aufView"):"")+info.name + (info.firma? " · "+info.firma:"")) : " ";
  var s=state();
  $("state").textContent = s==="on"?t("sOn"):s==="pause"?t("sPause"):t("sOff");
  var l=lastEntry();
  $("last").textContent = l ? t("last")+T[lang].names[l.typ]+" "+hm(l.ts) : "";
  var ul=$("list"); ul.innerHTML="";
  todayEntries().forEach(function(e){
    var li=document.createElement("li");
    var a=document.createElement("span"); a.textContent=T[lang].names[e.typ];
    var b=document.createElement("span"); b.textContent=hm(e.ts);
    if(queue.some(function(q){return q.id===e.id})){var q=document.createElement("span");q.className="q";q.textContent=" ("+t("pending")+")";b.appendChild(q)}
    li.appendChild(a); li.appendChild(b); ul.appendChild(li);
  });
  $("foot").textContent = info && info.gps===false ? t("footNoGps") : t("foot");
  if(info && info.onb===false) return;
  var cb=document.createElement("button"); cb.className="linkbtn"; cb.textContent=t("change"); cb.onclick=function(){showSetup(true)};
  $("foot").appendChild(document.createElement("br")); $("foot").appendChild(cb);
}
setInterval(function(){var d=new Date();$("clock").textContent=pad(d.getHours())+":"+pad(d.getMinutes())},1000);
(function(){var d=new Date();$("clock").textContent=pad(d.getHours())+":"+pad(d.getMinutes())})();

function show(kind,text){var m=$("msg");m.className="msg "+kind;m.textContent=text;clearTimeout(show._t);show._t=setTimeout(function(){m.className="msg"},6000)}

// Übertragung: innerhalb von Apps Script über google.script.run, sonst per fetch
function send(payload){
  if(ALS) payload.als=ALS;
  if(window.google && google.script && google.script.run){
    return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej).api(payload)});
  }
  var ctl = window.AbortController ? new AbortController() : null;
  var tm = setTimeout(function(){ if(ctl) ctl.abort(); }, payload.was==="foto" ? 90000 : 45000);
  return fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow",signal:ctl?ctl.signal:undefined})
    .then(function(r){ clearTimeout(tm); if(!r.ok) throw new Error("http "+r.status); return r.json(); },
          function(err){ clearTimeout(tm); throw err; });
}

function flush(){
  if(!queue.length||flush.busy) return Promise.resolve();
  if(queue[0].gpsBis&&queue[0].gpsBis>Date.now()){ setTimeout(flush, queue[0].gpsBis-Date.now()+500); return Promise.resolve(); }
  flush.busy=true;
  var item=queue[0];
  return send({action:"stamp",token:token,cid:"s"+item.id,stamp:item}).then(function(r){
    flush.busy=false;
    if(r&&r.ok){queue.shift();ls("faz_queue",JSON.stringify(queue));stDel(item.id);render();return flush()}
    if(r&&r.error==="alt"){queue.shift();ls("faz_queue",JSON.stringify(queue));stDel(item.id);render();show("err",t("zuAlt"));return flush()}
    if(r&&r.error==="token"){show("err",t("invalid"))}
    if(r&&r.error==="setup"){showSetup(true)}
  }).catch(function(){flush.busy=false});
}
setInterval(flush,30000);
window.addEventListener("online",flush);

function getPos(){
  return new Promise(function(res){
    if(!navigator.geolocation||(info&&info.gps===false)) return res(null);
    var done=false;
    navigator.geolocation.getCurrentPosition(function(p){if(done)return;done=true;res({lat:p.coords.latitude,lon:p.coords.longitude,acc:Math.round(p.coords.accuracy)})},
      function(){if(done)return;done=true;res(null)},{enableHighAccuracy:true,timeout:15000,maximumAge:0});
    setTimeout(function(){if(!done){done=true;res(null)}},17000);
  });
}

function ask(text){return new Promise(function(res){$("ovText").textContent=text;$("ov").className="overlay on";
  $("ovYes").onclick=function(){$("ov").className="overlay";res(true)};$("ovNo").onclick=function(){$("ov").className="overlay";res(false)}})}

function plausible(typ){
  var s=state();
  if(typ==="Kommen") return s==="off";
  if(typ==="Gehen") return s!=="off";
  if(typ==="Pause Beginn") return s==="on";
  if(typ==="Pause Ende") return s==="pause";
  return true;
}

var busy=false;
document.querySelectorAll(".btn").forEach(function(b){
  b.onclick=function(){
    if(busy) return;
    if(ALS){show("warn",t("aufStamp"));return;}
    var typ=b.getAttribute("data-typ");
    var go = plausible(typ) ? Promise.resolve(true) : ask(t("confirm")+(lastEntry()?T[lang].names[lastEntry().typ]+" "+hm(lastEntry().ts):"–"));
    go.then(function(yes){
      if(!yes) return;
      busy=true; document.querySelectorAll(".btn").forEach(function(x){x.disabled=true});
      var ts=Date.now();
      // V20: Stempel sofort beim Druecken speichern (vor GPS), damit nichts verloren geht
      var item={id:uid(),typ:typ,ts:ts,tzOffset:new Date(ts).getTimezoneOffset(),pos:null,plausibel:plausible(typ),gpsBis:ts+18000};
      log.push({id:item.id,typ:typ,ts:ts}); log=log.slice(-60); ls("faz_log",JSON.stringify(log));
      queue.push(item); ls("faz_queue",JSON.stringify(queue)); stPut(item);
      render();
      show("warn",t("gpsWait"));
      getPos().then(function(pos){
        queue.forEach(function(q){ if(q.id===item.id){ q.pos=pos; delete q.gpsBis; } });
        item.pos=pos; delete item.gpsBis; ls("faz_queue",JSON.stringify(queue)); stPut(item); syncAnmelden();
        var gpsNote = (!pos && !(info&&info.gps===false)) ? " "+t("noGps") : "";
        return flush().then(function(){
          if(queue.some(function(q){return q.id===item.id})) show("warn",t("queued")+gpsNote);
          else show(gpsNote?"warn":"ok",t("saved")+gpsNote);
        });
      }).then(function(){busy=false;document.querySelectorAll(".btn").forEach(function(x){x.disabled=false})});
    });
  };
});

function showSetup(on){
  $("main").style.display = on ? "none" : "";
  $("setup").className = on ? "on" : "";
  if(on){
    $("sName").value = (info && info.setup) ? info.name : (ls("faz_name_draft")||"");
    $("sRead").checked = false;
    $("sGpsJa").checked = !!(info && info.setup && info.gps); $("sGpsNein").checked = !!(info && info.setup && !info.gps);
    $("sMsg").className="msg";
  }
}
function sErr(k){var m=$("sMsg");m.className="msg err";m.textContent=t(k)}
$("sSave").onclick=function(){
  var name=$("sName").value.replace(/\s+/g," ").trim();
  if(name.length<3) return sErr("eName");
  if(!$("sRead").checked) return sErr("eRead");
  if(!$("sGpsJa").checked && !$("sGpsNein").checked) return sErr("eGps");
  var gps=$("sGpsJa").checked;
  $("sSave").disabled=true;
  send({action:"onboard",token:token,name:name,read:true,gps:gps,lang:lang,version:"DSI-2026-10"}).then(function(r){
    $("sSave").disabled=false;
    if(r&&r.ok){
      info={name:r.name,firma:r.firma,gps:r.gps,setup:true};ls("faz_info",JSON.stringify(info));
      showSetup(false);render();
      if(gps&&navigator.geolocation){navigator.geolocation.getCurrentPosition(function(){},function(){},{timeout:10000})}
    } else if(r&&r.error==="token"){ sErr("eNet"); show("err",t("invalid")); }
    else sErr("eNet");
  }).catch(function(){$("sSave").disabled=false;sErr("eNet")});
};

/* ===== Reiter Azi / Săptămâna (Plan, nur lesend) ===== */
var plan=null; try{plan=JSON.parse(ls("faz_plan")||"null")}catch(e){plan=null}
var tagDetail={}; // Wochenansicht: Tag antippen zeigt Schotts und Material im Voraus (Anja, 28.10.2026)
var planBusy=false;
function showPane(p){
  document.querySelectorAll(".pane").forEach(function(x){x.className="pane"+(x.id==="p-"+p?" on":"")});
  document.querySelectorAll("#tabs button").forEach(function(b){b.className=b.getAttribute("data-p")===p?"on":""});
  ls("faz_pane",p);
  if(p==="std"){ loadStd(); } else if(p!=="stempel"){ renderPlan(); if(!plan||Date.now()-(plan._t||0)>10*60*1000) loadPlan(); }
}
document.querySelectorAll("#tabs button").forEach(function(b){b.onclick=function(){showPane(b.getAttribute("data-p"))}});
function fmtDay(key){var p=key.split("-");var d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));return t("days")[d.getDay()]+", "+p[2]+"."+p[1]+"."}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function evNode(ev,withTickets){
  var d=el("div","ev");
  var b=el("div","b",(ev.zeit?ev.zeit+" ":"")+(ev.baustelle||ev.titel));
  if(ev.vorbehalt) b.appendChild(el("span","res",t("pRes")));
  d.appendChild(b);
  var me=(plan.vorname||"").toLowerCase();
  var andere=(ev.leute||[]).filter(function(n){return n.toLowerCase().indexOf(me)<0});
  if(andere.length) d.appendChild(el("div","l",t("pWith")+andere.join(", ")));
  if(ev.ort) d.appendChild(el("div","l",ev.ort));
  if(ev.hinweis) d.appendChild(el("div","h",ev.hinweis));
  // Material-Erinnerung (Anja, 27.10.2026): nur Anzeige mit Datum, kein Haken
  if(ev.material&&ev.material.length){ var mb=el("div","miss"); mb.appendChild(el("div","","📦 "+t("tkMat")+(ev.materialDatum?fmtDay(ev.materialDatum):"")+":")); ev.material.forEach(function(x){ mb.appendChild(el("div","","• "+(lang==="de"?(x.de||x.ro):(x.ro||x.de)))); }); d.appendChild(mb); }
  if(withTickets){
    if(!ev.projekte||!ev.projekte.length) d.appendChild(el("div","l",t("pNoProj")));
    (ev.projekte||[]).forEach(function(pr){
      var p=el("div","proj");
      var pn=el("div","pn",pr.name+" · "+pr.gesamt+" "+t("pOpen"));
      if(pr.uebertrag) pn.appendChild(el("span","res",t("pCarry")));
      p.appendChild(pn);
      pr.tickets.forEach(function(tk){ p.appendChild(tkNode(pr,tk)); });
      // Neues Schott vor Ort gefunden (Anja, 27.10.2026): in Fieldwire auf dem Plan anlegen, hier die #-Nummer eingeben, danach gleicher Ablauf
      var nbtn=el("button","neu","+ "+t("tkNeu"));
      nbtn.onclick=function(){
        var box=el("div","probbox"); box.appendChild(el("div","l",t("tkNeuHinweis"))); var ni=document.createElement("input"); ni.type="number"; ni.inputMode="numeric"; ni.placeholder=t("tkNeuName");
        var go=el("button","neu",t("tkNeuGo"));
        go.onclick=function(){ if(navigator.onLine===false){ show("err",t("tkNurOnline")); return; } go.disabled=true;
          if(!ni.value.trim()){ go.disabled=false; return; } send({action:"ticket",token:token,projekt:pr.id,was:"neu",terme:(ev.terme||[]),nr:ni.value.trim(),cid:"n"+uid()}).then(function(r){
            if(r&&r.ok&&r.ticket){ pr.tickets=pr.tickets.filter(function(x){return x.id!==r.ticket.id}); pr.tickets.push(r.ticket); pr.gesamt=(pr.gesamt||0)+1; ls("faz_plan",JSON.stringify(plan)); renderPlan(); show("ok",t("saved")); }
            else { go.disabled=false; show("err",(r&&r.error==="nicht_gefunden"?t("tkNeuNicht"):t("eNet"))+(r&&r.msg?" ("+r.msg+")":"")); }
          }).catch(function(){ go.disabled=false; show("err",t("eNet")); });
        };
        box.appendChild(ni); box.appendChild(go); nbtn.replaceWith(box);
      };
      p.appendChild(nbtn);
      if(pr.gesamt>pr.tickets.length) p.appendChild(el("div","l",t("pMore")+(pr.gesamt-pr.tickets.length)));
      d.appendChild(p);
    });
  }
  return d;
}
function dayNode(tag,label,withTickets,isToday){
  var d=el("div","day"+(isToday?" today":""));
  d.appendChild(el("h3","",label));
  if(!tag||!tag.termine.length){d.appendChild(el("div","none",t("pNone")));return d}
  tag.termine.forEach(function(ev){d.appendChild(evNode(ev,withTickets))});
  return d;
}
function renderPlan(){
  var A=$("aziBox"),S=$("saptBox");
  if(!A||!S) return;
  $("aziReload").textContent=t("pReload");
  if(!plan){A.textContent=t("pLoad");S.textContent=t("pLoad");return}
  A.innerHTML="";S.innerHTML="";
  if(plan.hinweis==="kein_vorname"){A.appendChild(el("div","day",t("pNoName")));S.appendChild(el("div","day",t("pNoName")));return}
  var todayKey=dayKey(Date.now());
  if(plan.azi) A.appendChild(dayNode(plan.azi,t("pToday")+" – "+fmtDay(plan.azi.datum),true,true));
  if(plan.maine) A.appendChild(dayNode(plan.maine,t("pTomorrow")+" – "+fmtDay(plan.maine.datum),true,false));
  (plan.woche||[]).forEach(function(tag){ var det=tagDetail[tag.datum]; var dn=dayNode(det||tag,fmtDay(tag.datum)+(det?" ▲":" ▼"),!!det,tag.datum===todayKey); var h=dn.firstChild; h.style.cursor="pointer";
    h.onclick=function(){ if(det){ delete tagDetail[tag.datum]; renderPlan(); return; } if(navigator.onLine===false){ show("err",t("tkNurOnline")); return; } show("warn",t("pLoad"));
      send({action:"plan",token:token,tag:tag.datum}).then(function(r){ if(r&&r.ok&&r.tag){ tagDetail[tag.datum]=r.tag; renderPlan(); show("ok",t("saved")); } else show("err",t("pErr")); }).catch(function(){ show("err",t("pErr")); }); };
    S.appendChild(dn); });
  var st=(plan._offline?t("pOffline")+" · ":"")+t("pStand")+(plan.stand||"")+(tq.length?" · "+t("tkWarte")+tq.length:"");
  $("aziStand").textContent=st;$("saptStand").textContent=st;
}
function loadPlan(frisch){
  if(planBusy||!token||!$("aziBox")) return Promise.resolve();
  planBusy=true;
  if(!plan){$("aziBox").textContent=t("pLoad");$("saptBox").textContent=t("pLoad")}
  return send({action:"plan",token:token,frisch:!!frisch}).then(function(r){
    planBusy=false;
    if(r&&r.ok){r._t=Date.now();r._offline=false;plan=r;ls("faz_plan",JSON.stringify(plan));renderPlan()}
    else if(r&&r.error==="plan"){ if(plan){plan._offline=true;renderPlan()} else {$("aziBox").textContent=t("pErr")+" "+(r.msg||"");$("saptBox").textContent=t("pErr")} }
  }).catch(function(){planBusy=false;if(plan){plan._offline=true;renderPlan()}else{$("aziBox").textContent=t("pOffline");$("saptBox").textContent=t("pOffline")}});
}
$("aziReload").onclick=function(){if(plan)plan._t=0;loadPlan(true)};

/* ===== Offline-Warteschlange für Ticket-Aktionen (21.10.2026) =====
   Ohne Netz (oder solange noch etwas wartet) werden Haken, Felder, Fotos, eigene Punkte und
   Fertig/Problem in IndexedDB gemerkt und der Reihe nach nachgesendet. Die App zeigt den
   Stand so, als wäre es schon gesendet (gelb "wartet"); die echte Ticketsicht kommt nach dem Senden. */
var tq=[];
function idb(){ if(idb._p) return idb._p; idb._p=new Promise(function(res,rej){ try{ var r=indexedDB.open("faz_tq",2);
  r.onupgradeneeded=function(){ var d=r.result; if(!d.objectStoreNames.contains("q")) d.createObjectStore("q",{keyPath:"id"}); if(!d.objectStoreNames.contains("st")) d.createObjectStore("st",{keyPath:"id"}); if(!d.objectStoreNames.contains("kv")) d.createObjectStore("kv"); };
  r.onsuccess=function(){res(r.result)}; r.onerror=function(){idb._p=null;rej(r.error)}; }catch(e){idb._p=null;rej(e)} }); return idb._p; }
function idbPut(store,val,key){ return idb().then(function(db){ return new Promise(function(res){ var tx=db.transaction(store,"readwrite"); if(key===undefined) tx.objectStore(store).put(val); else tx.objectStore(store).put(val,key); tx.oncomplete=function(){res(true)}; tx.onerror=tx.onabort=function(){res(false)}; }); }).catch(function(){return false}); }
function idbDel(store,id){ return idb().then(function(db){ return new Promise(function(res){ var tx=db.transaction(store,"readwrite"); tx.objectStore(store).delete(id); tx.oncomplete=tx.onerror=tx.onabort=function(){res()}; }); }).catch(function(){}); }
function stPut(item){ if(!token) return; var c=JSON.parse(JSON.stringify(item)); return idbPut("st",{id:item.id,ts:item.ts,gpsBis:item.gpsBis||0,body:{action:"stamp",token:token,cid:"s"+item.id,stamp:c}}); }
function stDel(id){ return idbDel("st",id); }
function kvSave(){ idbPut("kv",ENDPOINT,"endpoint"); }
/* Hintergrund-Senden (Background Sync): der Service Worker sendet die Warteschlangen auch bei geschlossener App */
function syncAnmelden(){ try{ if(navigator.serviceWorker&&navigator.serviceWorker.ready) navigator.serviceWorker.ready.then(function(r){ if(r.sync) return r.sync.register("faz-sync"); }).catch(function(){}); }catch(e){} }
function tqLoad(){ return idb().then(function(db){ return new Promise(function(res){
  var rq=db.transaction("q").objectStore("q").getAll();
  rq.onsuccess=function(){ tq=(rq.result||[]).sort(function(a,b){return a.ts-b.ts}); res(); }; rq.onerror=function(){res()}; }); }).catch(function(){}); }
function tqSave(item){ return idb().then(function(db){ return new Promise(function(res,rej){
  var tx=db.transaction("q","readwrite"); tx.objectStore("q").put(item);
  tx.oncomplete=function(){res(true)}; tx.onerror=function(){rej(tx.error)}; tx.onabort=function(){rej(tx.error)}; }); }); }
function tqDel(id){ return idb().then(function(db){ return new Promise(function(res){
  var tx=db.transaction("q","readwrite"); tx.objectStore("q").delete(id); tx.oncomplete=res; tx.onerror=res; tx.onabort=res; }); }).catch(function(){}); }
function tqPush(pr,tk,payload){
  if(!payload.cid) payload.cid="t"+uid();
  if(ALS && !payload.als) payload.als=ALS;
  var item={id:payload.cid,ts:Date.now(),pr:pr.id,tk:tk.id,p:payload};
  return tqSave(item).then(function(){return true}).catch(function(){return false}).then(function(ok){
    if(!ok){ show("err",t("tkVoll")); return false; }
    tq.push(item); renderPlan(); show("warn",t("queued")); syncAnmelden(); return true;
  });
}
function tqFuer(tkId){ return tq.filter(function(q){return q.tk===tkId}); }
var tqBusy=false;
function tqFlush(){
  if(tqBusy||!tq.length||!token) return Promise.resolve();
  tqBusy=true;
  var item=tq[0];
  return send(item.p).then(function(r){
    tqBusy=false;
    if(!r) return;
    if(r.error==="busy"||r.error==="token"){ if(r.error==="token") show("err",t("invalid")); return; } // später erneut
    tq=tq.filter(function(q){return q.id!==item.id}); tqDel(item.id);
    if(r.ok&&r.ticket) tkUpdate(item.tk,r.ticket);
    else if(r.ok) renderPlan();
    else if(r.error==="unvollstaendig"){ if(r.ticket) tkUpdate(item.tk,r.ticket); show("err",t("tkFehlt")+" "+(r.fehlt||[]).join(", ")); }
    else { show("err",t("eNet")+(r.msg?" ("+r.msg+")":"")); renderPlan(); }
    return tqFlush();
  }).catch(function(){ tqBusy=false; });
}
setInterval(tqFlush,30000);
window.addEventListener("online",tqFlush);
/* Ticketsicht mit den wartenden Aktionen überlagert (nur für die Anzeige). */
function tkEff(tk){
  var q=tqFuer(tk.id); if(!q.length) return tk;
  var e=JSON.parse(JSON.stringify(tk)); e._q=q.length;
  e.fehlt=(e.fehlt||[]).slice(); e.fotos=e.fotos||{vorher:0,nachher:0,gesamt:0}; e.bilder=(e.bilder||[]).slice(); e.punkte=e.punkte||[]; e.offen=e.offen||[];
  function drop(n){ e.fehlt=e.fehlt.filter(function(x){return x!==n}); }
  q.forEach(function(it){ var p=it.p||{};
    if(p.was==="haken"){ e.punkte.forEach(function(x){ if(x.id===p.punkt){ x.s=p.wert?1:0; x._p=true; } }); }
    else if(p.was==="punkt"){ e.punkte.push({id:"q"+it.id,n:p.text+" ("+(plan&&plan.vorname||"")+")",s:1,_p:true}); }
    else if(p.was==="feld"){ var f=e.offen.filter(function(x){return x.id===p.feld})[0]; e.offen=e.offen.filter(function(x){return x.id!==p.feld}); if(f) drop(f.name); }
    else if(p.was==="foto"){ if(p.art==="nachher"){e.fotos.nachher++;drop("Foto nachher")} else {e.fotos.vorher++;drop("Foto vorher")} e.bilder.push({u:p.b64,f:p.b64,a:p.art==="nachher"?"n":"v",_p:true}); }
    else if(p.was==="status"){ e._status=p.status; }
  });
  var hatBH=!e.offen.some(function(x){return /breite|höhe|hoehe|duchbruch|durchbruch|durchmesser/i.test(x.name)});
  if(hatBH){ drop("Maße"); } // kein Durchmesser mehr, immer Breite x Höhe (01.11.2026)
  var op=e.punkte.filter(function(x){return x.s===0&&!/^info:/i.test(x.n)}).length;
  e.fehlt=e.fehlt.filter(function(x){return !/Punkte ohne Haken/.test(x)}); if(op) e.fehlt.push(op+" Punkte ohne Haken");
  e.fertigMoeglich=e.fehlt.length===0;
  return e;
}
function picsNode(bilder, art){
  var list=(bilder||[]).filter(function(b){return (b.a||"")===art});
  if(!list.length) return null;
  var d=el("div","pics");
  list.forEach(function(b){
    var img=document.createElement("img"); img.src=b.u; img.loading="lazy"; img.alt="";
    var w;
    if(b._p){ w=el("span","pic"); w.appendChild(img); w.appendChild(el("span","wait",t("pending"))); }
    else { w=el("a"); w.href=b.f||b.u; w.target="_blank"; w.rel="noopener"; w.appendChild(img); }
    d.appendChild(w);
  });
  return d;
}

/* ===== Stufe 2: geführter Ablauf je Schott (nur offene Punkte, Felder, Fotos) ===== */
var tkBusy = {}; var fVers = {}, tkAuf = {};
function tkFind(id){
  // Anzeige-Fix (11.11.2026): auch aufgeklappte Tage der Wochenansicht durchsuchen und alle Treffer merken
  var out=null, alle=[];
  var tage=[plan&&plan.azi, plan&&plan.maine]; Object.keys(tagDetail||{}).forEach(function(k){ tage.push(tagDetail[k]); });
  tage.forEach(function(tag){ if(!tag||!tag.termine) return;
    tag.termine.forEach(function(ev){ (ev.projekte||[]).forEach(function(pr){ (pr.tickets||[]).forEach(function(tk){ if(tk.id===id){ out={pr:pr,tk:tk}; alle.push(out); } }); }); }); });
  if(out) out.alle=alle;
  return out;
}
function tkUpdate(id, neu){
  var f=tkFind(id); if(!f){ loadPlan(true); return; } // nicht gefunden: Plan frisch laden statt nichts anzuzeigen
  f.alle.forEach(function(x){ Object.keys(neu).forEach(function(k){ x.tk[k]=neu[k]; }); });
  ls("faz_plan",JSON.stringify(plan)); renderPlan();
}
function tkSend(pr, tk, payload, btn){
  if(tkBusy[tk.id]) return Promise.resolve(null);
  payload.action="ticket"; payload.token=token; payload.projekt=pr.id; payload.ticket=tk.id;
  if(!payload.cid) payload.cid="t"+uid(); // feste ID je Eingabe: Server erkennt Wiederholungen (keine doppelten Fotos)
  // Ohne Netz, oder solange noch etwas wartet (Reihenfolge!), in die Warteschlange
  if(navigator.onLine===false || tq.length) return tqPush(pr,tk,payload).then(function(){return null});
  tkBusy[tk.id]=true; if(btn) btn.disabled=true;
  return send(payload).then(function(r){
    tkBusy[tk.id]=false; if(btn) btn.disabled=false;
    if(r&&r.ok&&r.ticket){ tkUpdate(tk.id, r.ticket); show("ok",t("saved")); }
    else if(r&&r.ok){ show("ok",t("saved")); }
    else if(r&&r.error==="unvollstaendig"){ if(r.ticket) tkUpdate(tk.id,r.ticket); show("err",t("tkFehlt")+" "+(r.fehlt||[]).join(", ")); }
    else if(r&&r.error==="busy"){ return tqPush(pr,tk,payload).then(function(){return null}); }
    else show("err",t("eNet")+(r&&r.msg?" ("+r.msg+")":""));
    return r;
  }).catch(function(){ tkBusy[tk.id]=false; if(btn) btn.disabled=false; return tqPush(pr,tk,payload).then(function(){return null}); });
}
function fotoAufnehmen(pr, tk, art, btn){
  var inp=$("fotoInput"); if(!inp) return;
  inp.value="";
  inp.onchange=function(){
    var f=inp.files&&inp.files[0]; if(!f) return;
    show("warn",t("tkUpload"));
    var img=new Image(); var url=URL.createObjectURL(f);
    img.onload=function(){
      var max=1600, w=img.width, h=img.height, s=Math.min(1, max/Math.max(w,h));
      var c=document.createElement("canvas"); c.width=Math.round(w*s); c.height=Math.round(h*s);
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      URL.revokeObjectURL(url);
      var b64=c.toDataURL("image/jpeg",0.72);
      tkSend(pr, tk, {was:"foto", art:art, b64:b64}, btn);
    };
    img.onerror=function(){ URL.revokeObjectURL(url); show("err",t("eNet")); };
    img.src=url;
  };
  inp.click();
}
var fEing={}; // getippte Angaben je Ticket|Feld, überleben Neuaufbau der Ansicht (03.11.2026)
function tkNode(pr, tk){
  tk=tkEff(tk); // wartende Aktionen überlagern
  var k=el("div","tk"+(tk.status==="Geschottet"?" gata":(tk.fertigMoeglich?" ready":"")));
  var tn=el("div","tn","#"+tk.nr+" "+tk.name);
  if(tk._q) tn.appendChild(el("span","pend",t("tkWarte")+tk._q));
  k.appendChild(tn);
  // Zugeklappt: nur Nummer und Name, Tippen klappt auf (28.10.2026)
  tn.style.cursor="pointer"; tn.appendChild(el("span","tm"," "+(tkAuf[tk.id]?"▲":"▼")));
  tn.onclick=function(){ tkAuf[tk.id]=!tkAuf[tk.id]; renderPlan(); };
  if(!tkAuf[tk.id]){ if(tk.status) k.appendChild(el("div","tm",tk.status==="Geschottet"?"✓ "+t("tkDone"):tk.status)); return k; }
  var info=tk.info||{};
  var meta=[tk.eb?t("pLevel")+tk.eb:"", info.raum?t("pRoom")+info.raum:"", info.einbau, info.masse?info.masse+" mm":"", info.hoehe?info.hoehe+" m":"", info.art, tk.status].filter(Boolean).join(" · ");
  if(meta) k.appendChild(el("div","tm",meta));
  if(info.notiz) k.appendChild(el("div","h","ℹ "+info.notiz));
  if(info.bsk) k.appendChild(el("div","h","BSK: "+info.bsk));
  var done=tk.status==="Geschottet";
  // Schritt 1: hinfinden
  var s1=el("div","step"); s1.appendChild(el("div","sh","1 · "+t("tkS1")));
  if(tk.plan===false) s1.appendChild(el("div","miss",t("tkKeinPin")));
  var a=el("a","",t("pPlan")); a.href=tk.url; a.target="_blank"; a.rel="noopener"; s1.appendChild(a);
  var alt=picsNode(tk.bilder,""); if(alt){ s1.appendChild(el("div","l",t("tkFotosAlt"))); s1.appendChild(alt); }
  k.appendChild(s1);
  if(done) k.appendChild(el("div","okline","✓ "+t("tkDone"))); // Nachbearbeitung am selben Tag: Fotos, Punkte, Felder bleiben offen (Florin 31.10.2026)
  if(tk._status==="fertig"){ k.appendChild(el("div","okline","✓ "+t("tkDone")+" ("+t("pending")+")")); return k; }
  if(tk._status==="klaeren"){ k.appendChild(el("div","miss",t("tkProblemDone")+" ("+t("pending")+")")); return k; }
  // PROBLEM gleich am Anfang (Anja, 27.10.2026): ohne Foto, Haken oder Felder, für jeden Grund (kein Zugang, nicht machbar, noch nicht fertig)
  var bp=el("button","prob",t("tkProblem")); bp.style.cssText="width:100%;margin-top:8px;padding:14px;border:0;border-radius:12px;font-size:18px;font-weight:700";
  bp.onclick=function(){
    var box=el("div","probbox");
    var fb=el("button","cam",t("tkProblemFoto")); fb.onclick=function(){ fotoAufnehmen(pr,tk,"vorher",fb); };
    var txt=document.createElement("textarea"); txt.rows=3; txt.placeholder=t("tkGrundText");
    var go=el("button","prob",t("tkMelden"));
    go.onclick=function(){ var g=txt.value.trim(); if(!g) return; tkSend(pr,tk,{was:"status",status:"klaeren",grund:g},go); };
    box.appendChild(fb); box.appendChild(txt); box.appendChild(go);
    s1.appendChild(box); bp.disabled=true;
  };
  if(!done) s1.appendChild(bp);
  // Schritt 2: Foto vorher
  var fo=tk.fotos||{};
  var s2=el("div","step"+(fo.vorher?" ok":"")); s2.appendChild(el("div","sh","2 · "+t("tkS2")+(fo.vorher?" ✓ "+fo.vorher:"")));
  var p2=picsNode(tk.bilder,"v"); if(p2) s2.appendChild(p2);
  var b2=el("button","cam",fo.vorher?t("tkFotoMehr"):t("tkFoto")); b2.onclick=function(){fotoAufnehmen(pr,tk,"vorher",b2)}; s2.appendChild(b2); k.appendChild(s2);
  // Schritt 3: Arbeiten (offene Punkte)
  var offenP=(tk.punkte||[]).filter(function(p){return p.s===0 && !/^info:/i.test(p.n)});
  var s3=el("div","step"+(offenP.length?"":" ok")); s3.appendChild(el("div","sh","3 · "+t("tkS3")+(offenP.length?"":" ✓")));
  if(!(tk.punkte||[]).length) s3.appendChild(el("div","l",t("tkKeinePunkte")));
  (tk.punkte||[]).forEach(function(p){
    // alle Punkte zeigen, erledigte durchgestrichen (28.10.2026)
    var row=el("label","chk"+(p.s===1?" done":"")+(p._p?" pend2":""));
    var cb=document.createElement("input"); cb.type="checkbox"; cb.checked=p.s===1; cb.disabled=/^info:/i.test(p.n);
    cb.onchange=function(){ tkSend(pr,tk,{was:"haken",punkt:p.id,wert:cb.checked}); };
    row.appendChild(cb); row.appendChild(el("span","",p.n)); s3.appendChild(row);
  });
  var np=el("div","fi"); var ni=document.createElement("input"); ni.type="text"; ni.placeholder=t("tkPunktNeu"); ni.maxLength=160;
  var nb=el("button","sv","+"); nb.title=t("tkPunktAdd"); nb.onclick=function(){ var v=ni.value.trim(); if(v) tkSend(pr,tk,{was:"punkt",text:v},nb); };
  np.appendChild(ni); np.appendChild(nb); s3.appendChild(np);
  k.appendChild(s3);
  // Schritt 4: Felder
  var offenF=tk.offen||[];
  var s4=el("div","step"+(offenF.some(function(f){return f.pflicht})?"":" ok")); s4.appendChild(el("div","sh","4 · "+t("tkS4")+(offenF.length?"":" ✓")));
  var inputs=[];
if(offenF.some(function(f){return /breite|höhe|hoehe/i.test(f.name)})) s4.appendChild(el("div","l",lang==="de"?"Rund: Durchmesser bei Breite und Höhe eintragen (z. B. 200 × 200).":"Rotund: diametrul la lățime și la înălțime (ex. 200 × 200)."));
  offenF.forEach(function(f){
    var row=el("div","fld");
    row.appendChild(el("div","fl",f.name+(f.pflicht?" *":""))); if(f.pflicht && fVers[tk.id]) row.className="fld rot";
    if(f.typ==="wahl"){
      var sel=document.createElement("select"); var o0=document.createElement("option"); o0.value=""; o0.textContent=t("tkWaehlen"); sel.appendChild(o0);
      f.werte.forEach(function(w){ var o=document.createElement("option"); o.value=w.id; o.textContent=w.t; sel.appendChild(o); });
      var sk=tk.id+"|"+f.id; if(fEing[sk]) sel.value=fEing[sk]; sel.onchange=function(){fEing[sk]=sel.value}; inputs.push({f:f,el:sel,wahl:true});
      row.appendChild(sel);
    } else {
      var wrap=el("div","fi"); var inp=document.createElement("input"); inp.type="text"; if(f.typ==="zahl"||/mm|\(m\)/.test(f.name)) inp.inputMode="decimal"; inp.placeholder=f.name; var fk=tk.id+"|"+f.id; inp.value=fEing[fk]||""; inp.oninput=function(){fEing[fk]=inp.value}; // Text statt number: Komma wird sonst geleert (03.11.2026)
      inputs.push({f:f,el:inp});
      wrap.appendChild(inp); row.appendChild(wrap);
    }
    s4.appendChild(row);
  });
  if(offenF.length){ var ub=el("button","neu",t("tkUebernehmen")); ub.onclick=function(){
    var jobs=inputs.filter(function(x){return String(x.el.value||"").trim()}).map(function(x){ return x.wahl?{was:"feld",feld:x.f.id,uuid:x.el.value}:{was:"feld",feld:x.f.id,wert:String(x.el.value).trim()}; });
    if(!jobs.length){ fVers[tk.id]=true; renderPlan(); return; } ub.disabled=true;
    jobs.reduce(function(pz,j){ return pz.then(function(){ return tkSend(pr,tk,j); }); }, Promise.resolve()).then(function(){ fVers[tk.id]=true; renderPlan(); }); };
    s4.appendChild(ub); }
  k.appendChild(s4);
  // Schritt 5: Foto nachher
  var s5=el("div","step"+(fo.nachher?" ok":"")); s5.appendChild(el("div","sh","5 · "+t("tkS5")+(fo.nachher?" ✓ "+fo.nachher:"")));
  var p5=picsNode(tk.bilder,"n"); if(p5) s5.appendChild(p5);
  var b5=el("button","cam",fo.nachher?t("tkFotoMehr"):t("tkFoto")); b5.onclick=function(){fotoAufnehmen(pr,tk,"nachher",b5)}; s5.appendChild(b5); k.appendChild(s5);
  // Schritt 6: Fertig / Problem (nicht bei Nachbearbeitung)
if(done) return k;
  var s6=el("div","step"); s6.appendChild(el("div","sh","6 · "+t("tkS6")));
  if(tk.fehlt&&tk.fehlt.length) s6.appendChild(el("div","miss",t("tkFehlt")+" "+tk.fehlt.join(", ")));
  var row6=el("div","row6");
  var bf=el("button","fin",t("tkFertig")); bf.disabled=!tk.fertigMoeglich;
  bf.onclick=function(){ ask(t("tkFertigFrage")).then(function(y){ if(!y) return;
    // Material bei FERTIG (Anja 28.10.2026): Schätzung zeigen, Monteur ändert nur, was nicht stimmt
    if(navigator.onLine===false||tq.length){ tkSend(pr,tk,{was:"status",status:"fertig"},bf); return; }
    bf.disabled=true; show("warn",t("tkMatLaden"));
    send({action:"ticket",token:token,projekt:pr.id,ticket:tk.id,was:"material",schaetzen:true}).then(function(r){
      var liste=(r&&r.ok&&r.material)||[]; var box=el("div","probbox"); var inps=[];
      box.appendChild(el("div","l",t(liste.length?"tkMatFrage":"tkMatLeer")));
      liste.forEach(function(x){ var w=el("div","fi"); var lab=el("div","",lang==="de"?x.de:x.ro); lab.style.flex="1"; lab.style.alignSelf="center";
        var inp=document.createElement("input"); inp.type="number"; inp.step="any"; inp.inputMode="decimal"; inp.value=x.soll; inp.style.maxWidth="90px"; inp.style.flex="none";
        w.appendChild(lab); w.appendChild(inp); box.appendChild(w); inps.push([x,inp]); });
      var ex=document.createElement("textarea"); ex.rows=2; ex.placeholder=t("tkMatExtra"); box.appendChild(ex);
      var ok=el("button","prob",t("tkMatOk")); ok.style.background="var(--kommen)";
      ok.onclick=function(){ ok.disabled=true;
        var li=inps.map(function(q){ return {i:q[0].i,de:q[0].de,e:q[0].e,soll:q[0].soll,ist:q[1].value===""?0:Number(String(q[1].value).replace(",","."))}; });
        tkSend(pr,tk,{was:"material",liste:li,extra:ex.value.trim(),nr:tk.nr,tname:tk.name,pname:pr.name}).then(function(){ tkSend(pr,tk,{was:"status",status:"fertig"},bf); }); };
      box.appendChild(ok); s6.appendChild(box); bf.style.display="none";
    }).catch(function(){ bf.disabled=false; tkSend(pr,tk,{was:"status",status:"fertig"},bf); });
  }); };
  row6.appendChild(bf); s6.appendChild(row6); k.appendChild(s6);
  return k;
}

// Aufsicht (31.10.2026): Büro-Handy wählt einen Monteur und sieht dessen Ansicht; Aktionen laufen unter seinem Vornamen
function aufInit(){
  var auf=!!(info&&info.aufsicht);
  $("tabAuf").style.display=auf?"":"none";
  if(!auf&&ALS){ALS="";ls("faz_als","");}
  if(auf) aufRender();
  if(auf&&!ALS&&ls("faz_pane")!=="auf") showPane("auf");
}
function aufRender(){
  var box=$("aufBox"); if(!box) return; box.innerHTML="";
  (info&&info.monteure||[]).forEach(function(mo){
    var b=document.createElement("button"); b.className="reload"; b.style.margin="6px 0";
    b.textContent=(mo.vorname===ALS?"✓ ":"")+mo.vorname+(mo.firma?" · "+mo.firma:"")+(mo.vorarbeiter?" (VA)":"");
    b.onclick=function(){aufWahl(mo.vorname)};
    box.appendChild(b);
  });
}
function aufWahl(vn){
  if(tq&&tq.length){show("warn",t("aufQueue"));tqFlush();return;}
  ALS=vn; ls("faz_als",vn);
  plan=null; ls("faz_plan","");
  aufRender(); render();
  showPane("azi"); loadPlan(true);
  send({action:"whoami",token:token}).then(function(r){ if(r&&r.ok){info.name=r.name;info.firma=r.firma;srvMerge(r);render();} });
}

/* ===== Reiter Stunden (17.11.2026, Florin): Ist, Soll, Plus/Minus je Person ===== */
var TS={ro:{tab:"Ore",load:"Se încarcă orele…",err:"Orele nu au putut fi încărcate.",off:"Fără internet.",none:"Pentru acest telefon nu se afișează ore.",
heute:"Azi",laeuft:"în lucru de la ",von:"din ",noch:"Încă nu ai pontat azi.",monat:"Luna până ieri",ist:"Lucrat",soll:"Normă",plus:"Ore în plus",minus:"Ore în minus",
at1:" din ",at2:" zile lucrătoare",ueb:"Report luna trecută: ",konto:"Total cont ore",woche:"Săptămâna ",tage:["Du","Lu","Ma","Mi","Jo","Vi","Sâ"],
hk:"Sosire lipsă",hg:"Plecare lipsă",hp:"Sfârșit pauză lipsă",hn:"fără pauză pontată",gest:"pontat ",U:"Concediu",K:"Bolnav",KG:"Indemnizație de boală",F:"Liber","Ü":"Liber din ore suplimentare",
regel:"Luni–vineri: sosirea până la 07:30 se calculează de la 07:00.",frage:"Ceva nu e corect? Scrie-i Claudiei.",url:"Concediu rămas: ",urlT:" zile (la ",nurIst:"Ore lucrate luna aceasta (până ieri)",pause:"pauză "},
de:{tab:"Stunden",load:"Stunden werden geladen…",err:"Stunden konnten nicht geladen werden.",off:"Kein Internet.",none:"Für dieses Handy werden keine Stunden angezeigt.",
heute:"Heute",laeuft:"läuft seit ",von:"von ",noch:"Heute noch nicht gestempelt.",monat:"Monat bis gestern",ist:"Ist",soll:"Soll",plus:"Plusstunden",minus:"Minusstunden",
at1:" von ",at2:" Arbeitstagen",ueb:"Übertrag Vormonat: ",konto:"Stundenkonto gesamt",woche:"Woche ",tage:["So","Mo","Di","Mi","Do","Fr","Sa"],
hk:"Kommen fehlt",hg:"Gehen fehlt",hp:"Pausenende fehlt",hn:"keine Pause gestempelt",gest:"gestempelt ",U:"Urlaub",K:"Krank",KG:"Krankengeld",F:"Frei","Ü":"Frei auf Überstunden",
regel:"Mo–Fr: Kommen bis 07:30 zählt ab 07:00.",frage:"Stimmt etwas nicht? Schreib Claudia.",url:"Resturlaub: ",urlT:" Tage (Stand ",nurIst:"Geleistete Stunden diesen Monat (bis gestern)",pause:"Pause "}};
T.ro.tabStd=TS.ro.tab; T.de.tabStd=TS.de.tab;
function ts(k){return TS[lang][k]}
var std=null, stdBusy=false, stdErr=""; try{ std=JSON.parse(ls("faz_std")||"null"); if(std) std._t=0; }catch(e){ std=null; }
function hhmm(m){ if(m===null||m===undefined) return "–"; var n=Math.abs(Math.round(m)); return Math.floor(n/60)+":"+pad(n%60) }
function pm(m){ m=Math.round(m||0); return (m<0?"−":"+")+hhmm(m) }
function uhr(m){ if(m===null||m===undefined) return ""; m=Math.floor(m); return pad(Math.floor(m/60))+":"+pad(m%60) }
function loadStd(force){
renderStd();
if(stdBusy||!token) return;
if(!force&&std&&std._als===ALS&&Date.now()-std._t<120000) return;
stdBusy=true; stdErr=""; renderStd();
send({action:"stunden",token:token}).then(function(r){ stdBusy=false;
if(r&&r.ok){ std=r; std._t=Date.now(); std._stand=hm(Date.now()); std._als=ALS; ls("faz_std",JSON.stringify(std)); } else stdErr=ts("err");
renderStd(); }).catch(function(){ stdBusy=false; stdErr=navigator.onLine===false?ts("off"):ts("err"); renderStd(); });
}
function renderStd(){
var box=$("stdBox"); if(!box) return; box.innerHTML="";
var rb=$("stdReload"); rb.textContent=t("pReload"); rb.onclick=function(){loadStd(true)};
if(stdErr) box.appendChild(el("div","msg warn",stdErr+(std&&std._stand?" · "+t("pStand")+std._stand:"")));
if(!std||std._als!==ALS){ if(!stdErr) box.appendChild(el("div","stand",ts("load"))); return; }
if(std.modus==="aus"){ box.appendChild(el("div","sk",ts("none"))); return; }
var voll=std.modus==="voll", h=null, tage=[];
(std.tage||[]).forEach(function(x){ if(x.heute) h=x; else tage.push(x); });
var c=el("div","sk"); c.appendChild(el("h3","",ts("heute")+" · "+fmtDay(std.heute)));
if(h&&h.a!==null&&h.a!==undefined){
var big=el("div","big",hhmm(h.a));
if(voll){ var sm=el("span","sub"," "+ts("von")+hhmm(std.sollTag)); sm.style.fontSize="15px"; sm.style.fontWeight="400"; big.appendChild(sm); }
c.appendChild(big);
c.appendChild(el("div","sub",(h.laeuft?ts("laeuft")+uhr(h.b):uhr(h.b)+"–"+uhr(h.e))+(h.bs!==null&&h.bs!==h.b?" ("+ts("gest")+uhr(h.bs)+")":"")+(h.p?" · "+ts("pause")+hhmm(h.p):"")));
} else if(h&&h.art){ c.appendChild(el("div","sub",ts(h.art)||h.art)); }
else c.appendChild(el("div","sub",ts("noch")));
box.appendChild(c);
var m=el("div","sk");
if(voll){
m.appendChild(el("h3","",ts("monat")));
var g=el("div","sk3");
var cell=function(l,v,cls){var d=el("div");d.appendChild(el("div","l",l));d.appendChild(el("div","v"+(cls?" "+cls:""),v));return d};
g.appendChild(cell(ts("ist"),hhmm(std.sumIst))); g.appendChild(cell(ts("soll"),hhmm(std.sumSoll)));
g.appendChild(cell(std.saldo<0?ts("minus"):ts("plus"),pm(std.saldo),std.saldo<0?"minus":"plus"));
m.appendChild(g);
m.appendChild(el("div","sub",std.at[0]+ts("at1")+std.at[1]+ts("at2")+" · "+ts("ueb")+pm(std.uebertrag)));
var kz=el("div","skw"); kz.appendChild(el("span","",ts("konto"))); kz.appendChild(el("span",std.konto<0?"minus":"plus",pm(std.konto))); m.appendChild(kz);
if(std.urlaub!==null&&std.urlaub!==undefined) m.appendChild(el("div","sub",ts("url")+zahlK(std.urlaub)+ts("urlT")+std.urlaubStand+")"));
} else {
m.appendChild(el("h3","",ts("nurIst"))); m.appendChild(el("div","big",hhmm(std.sumIst)));
}
box.appendChild(m);
var wochen={}, keys=[];
tage.forEach(function(x){ if(!voll&&!x.n) return;
var p=x.d.split("-"), d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]),12); var mo=new Date(d.getTime()-((d.getDay()+6)%7)*86400000); var k=dayKey(mo.getTime());
if(!wochen[k]){wochen[k]=[];keys.push(k)} wochen[k].push(x); });
keys.sort().reverse();
var hmap={kommen:"hk",gehen:"hg",pauseende:"hp",keinepause:"hn"};
keys.forEach(function(k){
var w=wochen[k], c2=el("div","sk"), si=0, ss=0;
w.forEach(function(x){si+=x.a||0;ss+=x.s||0});
var a=w[0].d.split("-"), b=w[w.length-1].d.split("-");
var hd=el("div","skw kopf");
hd.appendChild(el("span","",ts("woche")+a[2]+"."+a[1]+".–"+b[2]+"."+b[1]+"."));
hd.appendChild(el("span",voll?(si-ss<0?"minus":"plus"):"",hhmm(si)+(voll?" · "+pm(si-ss):""))); c2.appendChild(hd);
w.forEach(function(x){
var p=x.d.split("-"), d=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]),12);
var r=el("div","skr");
r.appendChild(el("span","",ts("tage")[d.getDay()]+" "+p[2]+"."));
r.appendChild(el("span","m",(x.b===null||x.b===undefined)?(x.art?(ts(x.art)||x.art):"–"):uhr(x.b)+"–"+((x.e!==null&&x.e!==undefined)?uhr(x.e):"?")));
r.appendChild(el("span","r",hhmm(x.a||0)));
r.appendChild(voll?el("span","r "+((x.a||0)-x.s<0?"minus":"plus"),pm((x.a||0)-x.s)):el("span",""));
var n=[]; (x.h||[]).forEach(function(q){ n.push(ts(hmap[q])) });
if(x.bs!==null&&x.bs!==undefined&&x.bs!==x.b) n.push(ts("gest")+uhr(x.bs));
if(x.art&&x.b!==null&&x.b!==undefined) n.push(ts(x.art)||x.art);
if(n.length) r.appendChild(el("span","skn",n.join(" · ")));
c2.appendChild(r);
});
box.appendChild(c2);
});
renderUrl(box);
box.appendChild(el("div","foot",(voll&&std.regel7?ts("regel")+" ":"")+ts("frage")));
}
var applyLang0=applyLang; applyLang=function(){ applyLang0(); renderStd(); };

/* ===== Urlaubsantrag (17.11.2026, Florin): nur Angestellte FAZ, Anzeige im Reiter Stunden ===== */
var TU={ro:{t:"Concediu",rest:"Concediu rămas: ",zile:" zile",offen:"în cerere: ",von:"De la",bis:"Până la",bem:"Observație (opțional)",btn:"Cere concediu",senden:"Se trimite…",ok:"Cererea a fost trimisă. Florin decide.",liste:"Cererile mele",neu:"trimisă",gemeldet:"la birou",genehmigt:"aprobat",abgelehnt:"respins",zurueck:"retrasă",weg:"Retrage cererea",at:" zile lucrătoare",hin:"Concediul este valabil doar după ce Florin a aprobat.",
e_datum:"Verifică datele.",e_vergangen:"Data este în trecut.",e_keintag:"Nicio zi lucrătoare în această perioadă.",e_lang:"Perioadă prea lungă. Vorbește cu Florin.",e_doppelt:"Ai deja o cerere pentru aceste zile.",e_schon:"Deja decis. Vorbește cu Florin.",e_darf:"Pentru acest telefon nu se poate cere concediu.",e_net:"Nu s-a putut trimite. Încearcă din nou."},
de:{t:"Urlaub",rest:"Resturlaub: ",zile:" Tage",offen:"beantragt: ",von:"Von",bis:"Bis",bem:"Bemerkung (freiwillig)",btn:"Urlaub beantragen",senden:"Wird gesendet…",ok:"Antrag ist raus. Florin entscheidet.",liste:"Meine Anträge",neu:"eingereicht",gemeldet:"im Büro",genehmigt:"genehmigt",abgelehnt:"abgelehnt",zurueck:"zurückgezogen",weg:"Antrag zurückziehen",at:" Arbeitstage",hin:"Der Urlaub gilt erst, wenn Florin genehmigt hat.",
e_datum:"Bitte Datum prüfen.",e_vergangen:"Das Datum liegt in der Vergangenheit.",e_keintag:"In dem Zeitraum liegt kein Arbeitstag.",e_lang:"Zeitraum zu lang. Bitte mit Florin sprechen.",e_doppelt:"Für diese Tage gibt es schon einen Antrag.",e_schon:"Schon entschieden. Bitte mit Florin sprechen.",e_darf:"Für dieses Handy ist kein Urlaubsantrag möglich.",e_net:"Senden hat nicht geklappt. Bitte nochmal versuchen."}};
function tu(k){var v=TU[lang]&&TU[lang][k]; return v===undefined?(k.indexOf("e_")===0?TU[lang].e_net:k):v}
var urlBusy=false, urlMsg="", urlOk=false, urlV={};
function zahlK(x){ var n=Number(String(x).replace(",",".")); if(isNaN(n)) return String(x); return String(Math.round(n*10)/10).replace(".",","); }
function urlFd(k){var p=String(k||"").split("-"); return p.length<3?String(k||""):p[2]+"."+p[1]+"."+p[0]}
function renderUrl(box){
var u=std&&std.url; if(!u||!u.darf) return;
var c=el("div","sk"); c.appendChild(el("h3","",tu("t")));
c.appendChild(el("div","sub",tu("rest")+zahlK(u.rest)+tu("zile")+(u.offen?" · "+tu("offen")+u.offen+tu("zile"):"")));
var f=el("div","probbox");
var mk=function(lab,val){ f.appendChild(el("div","sub",lab)); var i=document.createElement("input"); i.type="date"; if(!(info&&info.aufsicht)) i.min=u.heute; if(val) i.value=val; f.appendChild(i); return i };
var iv=mk(tu("von"),urlV.von), ib=mk(tu("bis"),urlV.bis);
iv.onchange=function(){ urlV.von=iv.value; if(!ib.value||ib.value<iv.value){ ib.value=iv.value; urlV.bis=iv.value } };
ib.onchange=function(){ urlV.bis=ib.value };
var tb=document.createElement("input"); tb.type="text"; tb.maxLength=120; tb.placeholder=tu("bem"); tb.value=urlV.bem||""; tb.oninput=function(){ urlV.bem=tb.value }; f.appendChild(tb);
var b=el("button","prob",urlBusy?tu("senden"):tu("btn")); b.style.background="var(--kommen)"; b.disabled=urlBusy; b.onclick=urlSend; f.appendChild(b);
c.appendChild(f);
if(urlMsg) c.appendChild(el("div",urlOk?"okline":"msg warn",urlMsg));
c.appendChild(el("div","sub",tu("hin")));
if(u.liste&&u.liste.length){
var lh=el("h3","",tu("liste")); lh.style.marginTop="14px"; c.appendChild(lh);
u.liste.forEach(function(x){
var r=el("div","skw kopf"); r.style.fontWeight="400";
r.appendChild(el("span","",urlFd(x.von)+(x.bis!==x.von?" – "+urlFd(x.bis):"")+" · "+x.tage+tu("at")));
var s=el("span",x.status==="genehmigt"?"plus":(x.status==="abgelehnt"?"minus":""),tu(x.status)); s.style.fontWeight="700"; r.appendChild(s); c.appendChild(r);
if(x.info&&(x.status==="genehmigt"||x.status==="abgelehnt")) c.appendChild(el("div","sub",x.info));
if(x.status==="neu"||x.status==="gemeldet"){ var w=el("button","linkbtn",tu("weg")); w.disabled=urlBusy; w.onclick=function(){ urlWeg(x.id) }; c.appendChild(w) }
});
}
box.appendChild(c);
}
function urlDone(r,okText){ urlBusy=false;
if(r&&r.ok){ if(std&&r.url) std.url=r.url; urlV={}; urlOk=true; urlMsg=okText }
else { urlOk=false; urlMsg=tu("e_"+((r&&r.code)||"net")) }
renderStd() }
function urlSend(){
if(urlBusy) return; var v=urlV.von, b=urlV.bis||urlV.von;
if(!v||b<v){ urlOk=false; urlMsg=tu("e_datum"); renderStd(); return }
urlBusy=true; urlMsg=""; renderStd();
send({action:"urlaubNeu",token:token,von:v,bis:b,bem:urlV.bem||"",cid:"u"+uid()}).then(function(r){ urlDone(r,tu("ok")) }).catch(function(){ urlDone(null,"") });
}
function urlWeg(id){
if(urlBusy) return; urlBusy=true; urlMsg=""; renderStd();
send({action:"urlaubZurueck",token:token,id:id}).then(function(r){ urlDone(r,tu("zurueck")) }).catch(function(){ urlDone(null,"") });
}

function start(){
  if(!token){ $("main").innerHTML='<div class="setup">'+T.ro.notSetup+'<br><br>'+T.de.notSetup+'</div>'; return; }
  applyLang();
  if(!(info&&info.setup)) $("main").style.visibility="hidden";
  send({action:"whoami",token:token}).then(function(r){
    $("main").style.visibility="";
    if(r&&r.ok){srvMerge(r);info={name:r.name,firma:r.firma,gps:r.gps,setup:!!r.setup,onb:!!r.onb,aufsicht:!!r.aufsicht,monteure:r.monteure||[]};aufInit();ls("faz_info",JSON.stringify(info));render();
      if(!r.setup) showSetup(true); else flush();}
    else if(r&&r.error==="token"){show("err",t("invalid"))}
  }).catch(function(){ $("main").style.visibility=""; if(!(info&&info.setup)) showSetup(true); });
}
start();
kvSave();
if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").then(function(){ syncAnmelden(); }).catch(function(){}); 
  navigator.serviceWorker.addEventListener("message", function(ev){ if(ev.data&&ev.data.typ==="gesendet"){ flush(); tqLoad().then(function(){ renderPlan(); tqFlush(); }); } }); }
// Stempel aus älteren Versionen (nur localStorage) in den Hintergrund-Speicher übernehmen
queue.forEach(function(q){ stPut(q); });
document.addEventListener("visibilitychange", function(){ if(document.visibilityState==="visible"){ flush(); tqFlush(); } });
showPane(ls("faz_pane")||"stempel");
tqLoad().then(function(){ if(tq.length){ renderPlan(); tqFlush(); } });
setTimeout(loadPlan, 1500);
