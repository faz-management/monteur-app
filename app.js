
/* ===== Konfiguration =====
   ENDPOINT: Web-App-URL des Google-Apps-Script (endet auf /exec).
   Wird die Seite direkt aus Apps Script ausgeliefert, wird der Wert automatisch gesetzt. */
/* V28 (18.11.2026): Oberfläche liegt auf GitHub Pages (offlinefähig), Server bleibt Apps Script. */
var APP_VERSION = "34";
/* V34 (26.11.2026, Meldungen von Victor, Ghețau, Alex per WhatsApp):
   - Eingaben gehen nicht mehr verloren und hängen nicht mehr hinter Fotos fest: Haken/Felder/Material werden vor den Fotos gesendet,
     ein dauerhaft abgelehnter Eintrag blockiert die Warteschlange nicht mehr, Serverfehler heißen nicht mehr „kein Internet“.
   - Material wird bei FERTIG immer abgefragt (auch ohne Netz / mit wartenden Fotos) und kann nach FERTIG nachgetragen werden.
   - Plan: erst kleines Bild, „Nochmal laden“, Punkte auch ohne Bild richtig, Zoom bis 40-fach, Start auf den Punkten, Nummernliste.
   - Projekte ohne Maßfelder (Pro7, Securetec): Hinweis, wohin die Maße gehören. App-Version im Fuß und an den Server. */
/* V33 (25.11.2026): Geldbeträge (€/EUR/Euro) aus Büro-Texten ausblenden – Monteur sah „KV an Sabina 23.11. (2.520,39 €)“ in der Termin-Notiz. */
function ohnePreis(s){
  if(!s) return s;
  return String(s)
    .replace(/\(?\s*(?:€|\bEUR\b|\bEuro\b)\s*\d[\d.,' ]*\d?\s*\)?/gi," ") // V34: Wortgrenzen – vorher wurde aus „Monteur 2 fehlt“ „Mont fehlt“ („eur 2“ galt als Betrag)
    .replace(/\(?\s*\d[\d.,' ]*\s*(?:€|EUR\b|Euro\b)\s*\)?/gi," ")
    .replace(/\(\s*\)/g,"").replace(/\s+([.,;:])/g,"$1").replace(/([^.])\.\.(?!\.)/g,"$1.").replace(/\s{2,}/g," ").trim();
}
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
      pvBtn:"🗺 Plan cu toate trecerile",pvHint:"Apasă pe un punct ca să lucrezi la trecere.",pvOhne:"Fără pin pe plan: ",pvErr:"Planul nu s-a încărcat (internet slab?). Punctele funcționează oricum.",pAlt:"Plan vechi din ",pAltHin:"Apasă „Actualizează” (cu internet).",pvZu:"Închide",pvRetry:"Încarcă din nou planul",pvLade:"Se încarcă planul…",pvListe:"Toate trecerile de pe acest plan:",
      eSrv:"Serverul încă nu a salvat. Datele rămân pe telefon și se trimit din nou automat – nu le scrie a doua oară.",eZahl:"Aici se scriu doar cifre: ",eFest:"NU s-a salvat: ",eFest2:" Scrie din nou sau trimite-i Claudiei un mesaj.",eWeg:"Am înțeles",
      eFoto:"Poza nu a putut fi citită. Te rog, fă poza încă o dată.",eNochmal:"Serverul nu a răspuns corect. Apasă din nou peste un minut.",
      tkHaengt:"Date care nu se pot trimite de mult timp: ",tkVerwerfen:"Șterge din așteptare",tkVerwerfenFrage:"Sigur ștergi aceste date din așteptare? Nu se mai trimit la birou. Anunț-o pe Claudia.",
      eMassZahl:"Doar cifre, în milimetri (ex. 150): ",eMassNull:"0 nu este o dimensiune. Scrie dimensiunea în mm: ",fMassKlein:" mm? Dimensiunile se scriu în milimetri (1 cm = 10 mm). Este corect?",fMassGross:" mm, adică peste 3 metri. Este corect?",
      eHoeheZahl:"Doar cifre, în metri (ex. 3 sau 2,5): ",fHoeheNull:"Înălțimea de montaj 0 m este corectă doar la podea. Trecerea este în podea?",fHoeheGross:" m înălțime de montaj? Înălțimea se scrie în metri (ex. 3). Este corect?",
      tkMatNach:"Adaugă materialul folosit",tkMatSpeichern:"Salvează materialul",tkMatOhne:"Ce material ai folosit și cât? (ex. folie 5 m², CP 673 2 kg)",
      tkMassHinweis:"Dimensiunile: scrie-le mai sus, la „Ce ai mai făcut / observații” (ex. 1x RD 0,32x0,18), apoi apasă +.",tkWarteHin:"Salvat pe telefon. Se trimite automat, pe rând. Nu trebuie scris din nou.",
      tabStempel:"Pontaj",tabAzi:"Azi",tabSapt:"Săptămâna",pNone:"Nimic planificat",pLoad:"Se încarcă planul…",
      pOffline:"Fără internet – ultimul plan salvat",pStand:"Actualizat la ",pReload:"Actualizează",pTomorrow:"Mâine",pToday:"Azi",
      pWith:"Cu: ",pRes:"cu rezervă",pOpen:"tichete deschise",pNoProj:"Fără proiect Fieldwire pentru acest termen",
      pMore:"… și încă ",pPlan:"Plan (Fieldwire)",pNoName:"Acest telefon nu are nume pentru calendar. Vă rugăm contactați biroul.",
      pErr:"Planul nu a putut fi încărcat.",pRoom:"Camera ",pLevel:"Nivel ",pCarry:"reportat din ziua anterioară",tkS1:"Găsește trecerea",tkS2:"Foto înainte",tkS3:"Ce este de făcut",tkS4:"Date de completat",tkS5:"Foto după",tkS6:"Încheiere",tkFoto:"Fă o poză",tkFotoMehr:"Încă o poză",tkUpload:"Se trimite poza…",tkKeinePunkte:"Nicio listă de lucrări în tichet – întreabă biroul.",tkPunktNeu:"Ce ai mai făcut / observații",tkPunktAdd:"Adaugă punct",tkWaehlen:"– alege –",tkFehlt:"Lipsește:",tkUebernehmen:"Salvează datele",tkMatFrage:"Ce material ai folosit? Modifică doar ce nu este corect.",tkMatExtra:"Alt material / observații",tkMatOk:"Corect – trimite GATA",tkMatLeer:"Nu există estimare – scrie materialul folosit.",tkMatLaden:"Se calculează materialul…",tkFertig:"GATA",tkFertigFrage:"Trecerea este gata și totul este completat?",tkProblem:"Problemă",tkGrundText:"Scrie sau dictează care este problema",tkMelden:"Trimite la birou",tkNeu:"Trecere nouă găsită",tkNeuName:"Numărul # din Fieldwire",tkNeuGo:"Preia",tkNeuHinweis:"Mai întâi creează trecerea în aplicația Fieldwire, direct pe plan, la locul corect. Apoi introdu aici numărul # din Fieldwire.",tkNeuNicht:"Numărul nu a fost găsit în acest proiect.",tkMat:"Material pentru ",tkProblemFoto:"Poză (opțional, înainte de text)",tkKeinPin:"Lipsește pinul pe plan: pune-l în Fieldwire, apoi revino în aplicație.",tkDone:"Gata – trimis la birou",tkProblemDone:"Problemă trimisă la birou",tkVoll:"Memoria telefonului este plină. Încearcă din nou când ai internet.",tkNurOnline:"Pentru aceasta este nevoie de internet.",tkFotosAlt:"Poze existente",zuAlt:"Pontaj mai vechi de 24 de ore – nu a fost trimis. Anunță biroul.",tkWarte:"în așteptare: ",tkGalerie:"Poză din galerie",days:["Duminică","Luni","Marți","Miercuri","Joi","Vineri","Sâmbătă"],
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
      pvBtn:"🗺 Plan mit allen Schotts",pvHint:"Auf einen Punkt tippen, um das Schott zu bearbeiten.",pvOhne:"Ohne Pin im Plan: ",pvErr:"Plan nicht geladen (schwaches Internet?). Die Punkte gehen trotzdem.",pAlt:"Alter Plan vom ",pAltHin:"Bitte „Aktualisieren“ tippen (mit Internet).",pvZu:"Schließen",pvRetry:"Plan nochmal laden",pvLade:"Plan wird geladen…",pvListe:"Alle Schotts auf diesem Plan:",
      eSrv:"Der Server hat noch nicht gespeichert. Die Eingabe bleibt im Handy und wird automatisch nochmal gesendet – nicht doppelt eintragen.",eZahl:"Hier gehen nur Zahlen: ",eFest:"NICHT gespeichert: ",eFest2:" Bitte nochmal eintragen oder Claudia schreiben.",eWeg:"Verstanden",
      eFoto:"Das Foto konnte nicht gelesen werden. Bitte das Foto noch einmal machen.",eNochmal:"Der Server hat nicht richtig geantwortet. Bitte in einer Minute noch einmal tippen.",
      tkHaengt:"Gehen seit Langem nicht durch: ",tkVerwerfen:"Aus der Warteliste löschen",tkVerwerfenFrage:"Diese Einträge wirklich aus der Warteliste löschen? Sie gehen dann nicht ans Büro. Bitte Claudia Bescheid geben.",
      eMassZahl:"Nur Zahlen, in Millimetern (z. B. 150): ",eMassNull:"0 ist kein Maß. Bitte die Größe in mm eintragen: ",fMassKlein:" mm? Maße stehen in Millimetern (1 cm = 10 mm). Stimmt das?",fMassGross:" mm, das sind über 3 Meter. Stimmt das?",
      eHoeheZahl:"Nur Zahlen, in Metern (z. B. 3 oder 2,5): ",fHoeheNull:"Montagehöhe 0 m stimmt nur im Boden. Ist das Schott im Boden?",fHoeheGross:" m Montagehöhe? Die Angabe ist in Metern (z. B. 3). Stimmt das?",
      tkMatNach:"Verbrauchtes Material nachtragen",tkMatSpeichern:"Material speichern",tkMatOhne:"Welches Material und wie viel? (z. B. Folie 5 m², CP 673 2 kg)",
      tkMassHinweis:"Maße: oben bei „Was noch gemacht wurde / Bemerkung“ eintragen (z. B. 1x RD 0,32x0,18) und + tippen.",tkWarteHin:"Im Handy gespeichert. Wird automatisch der Reihe nach gesendet. Nicht nochmal eintragen.",
      tabStempel:"Stempeln",tabAzi:"Heute",tabSapt:"Woche",pNone:"Nichts geplant",pLoad:"Plan wird geladen…",
      pOffline:"Kein Internet – letzter gespeicherter Plan",pStand:"Stand ",pReload:"Aktualisieren",pTomorrow:"Morgen",pToday:"Heute",
      pWith:"Mit: ",pRes:"mit Vorbehalt",pOpen:"offene Tickets",pNoProj:"Kein Fieldwire-Projekt zu diesem Termin",
      pMore:"… und noch ",pPlan:"Plan (Fieldwire)",pNoName:"Für dieses Handy ist kein Kalendername hinterlegt. Bitte im Büro melden.",
      pErr:"Plan konnte nicht geladen werden.",pRoom:"Raum ",pLevel:"Ebene ",pCarry:"vom Vortag übertragen",tkS1:"Schott finden",tkS2:"Foto vorher",tkS3:"Was zu tun ist",tkS4:"Angaben eintragen",tkS5:"Foto nachher",tkS6:"Abschluss",tkFoto:"Foto machen",tkFotoMehr:"Noch ein Foto",tkUpload:"Foto wird gesendet…",tkKeinePunkte:"Keine Arbeitsliste im Ticket – bitte im Büro fragen.",tkPunktNeu:"Was noch gemacht wurde / Bemerkung",tkPunktAdd:"Punkt hinzufügen",tkWaehlen:"– wählen –",tkFehlt:"Es fehlt:",tkUebernehmen:"Angaben übernehmen",tkMatFrage:"Welches Material hast du verbraucht? Nur ändern, was nicht stimmt.",tkMatExtra:"Weiteres Material / Bemerkung",tkMatOk:"Passt – FERTIG melden",tkMatLeer:"Keine Schätzung – bitte verbrauchtes Material eintragen.",tkMatLaden:"Material wird berechnet…",tkFertig:"FERTIG",tkFertigFrage:"Ist das Schott fertig und alles eingetragen?",tkProblem:"Problem",tkGrundText:"Problem eintippen oder diktieren",tkMelden:"Ans Büro melden",tkNeu:"Neues Schott gefunden",tkNeuName:"#-Nummer aus Fieldwire",tkNeuGo:"Übernehmen",tkNeuHinweis:"Zuerst in der Fieldwire-App das Schott direkt auf dem Plan an der richtigen Stelle anlegen. Dann hier die #-Nummer aus Fieldwire eingeben.",tkNeuNicht:"Nummer in diesem Projekt nicht gefunden.",tkMat:"Material für ",tkProblemFoto:"Foto (freiwillig, vor dem Text)",tkKeinPin:"Pin im Plan fehlt: in Fieldwire setzen, dann zurück in die App.",tkDone:"Fertig – ans Büro gemeldet",tkProblemDone:"Problem ans Büro gemeldet",tkVoll:"Handyspeicher voll. Bei Internet erneut versuchen.",tkNurOnline:"Dafür ist Internet nötig.",tkFotosAlt:"Vorhandene Fotos",zuAlt:"Stempelung älter als 24 Stunden – nicht gesendet. Bitte im Büro melden.",tkWarte:"wartet: ",tkGalerie:"Foto aus der Galerie",days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
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
  // V34: Version sichtbar, damit ein Bildschirmfoto zeigt, mit welchem Stand das Handy arbeitet (Florin 26.11.2026)
  $("foot").appendChild(document.createElement("br")); $("foot").appendChild(el("span","","App V"+APP_VERSION));
  if(info && info.onb===false) return;
  var cb=document.createElement("button"); cb.className="linkbtn"; cb.textContent=t("change"); cb.onclick=function(){showSetup(true)};
  $("foot").appendChild(document.createElement("br")); $("foot").appendChild(cb);
}
setInterval(function(){var d=new Date();$("clock").textContent=pad(d.getHours())+":"+pad(d.getMinutes())},1000);
(function(){var d=new Date();$("clock").textContent=pad(d.getHours())+":"+pad(d.getMinutes())})();

function show(kind,text){var m=$("msg");m.className="msg "+kind;m.textContent=text;clearTimeout(show._t);show._t=setTimeout(function(){m.className="msg"},kind==="err"?14000:6000)} // V34: Fehler länger lesbar

/* V34: Antworten des Servers richtig einordnen. Vorher hieß jeder Fehler „Fără conexiune la internet“, und in der Warteschlange
   wurde auch ein Eintrag, den der Server nie annehmen kann (z. B. Text in einem Zahlenfeld), endlos wiederholt – alles dahinter blieb liegen. */
// „format“ und „server“ stehen bewusst NICHT hier: Server bis V35 meldete jede Ausnahme (z. B. Zeitüberschreitung der Tabelle) als „format“ → vorübergehend.
var FEST={zahl:1,"null":1,daten:1,aktion:1,nummer:1,nicht_gefunden:1,status_fehlt:1,als:1,aufsicht:1};
function istFest(r){
  if(!r||r.ok) return false;
  if(FEST[r.error]) return true;
  if(r.error==="fieldwire"){ var m=String(r.msg||"").match(/(\d{3})/), c=m?Number(m[1]):0; return c>=400&&c<500&&c!==401&&c!==408&&c!==409&&c!==423&&c!==429; }
  return false;
}
function fehlerText(r){
  if(r&&r.error==="zahl") return t("eZahl")+(r.msg||"");
  if(r&&r.error==="null") return t("eMassNull")+(r.msg||"");
  if(istFest(r)) return t("eFest")+(r.msg||r.error||"")+"."+t("eFest2");
  return t("eSrv")+(r&&(r.msg||r.error)?" ("+(r.msg||r.error)+")":"");
}
/* Dauerhafte Fehler bleiben am Ticket stehen, bis der Monteur sie wegtippt (die kurze Meldung oben verschwindet nach Sekunden). */
var tkErr={}; try{ tkErr=JSON.parse(ls("faz_tkerr")||"{}")||{}; }catch(e){ tkErr={}; }
function tkErrSet(id,text){
  if(!text) delete tkErr[id];
  else if(tkErr[id]&&tkErr[id].indexOf(text)<0) tkErr[id]=(tkErr[id]+" · "+text).slice(-600); // mehrere Fehler am selben Schott nacheinander zeigen
  else tkErr[id]=text;
  ls("faz_tkerr",JSON.stringify(tkErr));
}

// Übertragung: innerhalb von Apps Script über google.script.run, sonst per fetch
function send(payload){
  // V32: eigene Stempel nie im Namen des gewählten Monteurs; wartende Eingaben behalten das "als" vom Zeitpunkt des Eingebens
  if(ALS && payload.action!=="stamp" && payload.als===undefined) payload.als=ALS;
  payload.v=APP_VERSION; // V34: Server hält je Handy fest, welche App-Version zuletzt geöffnet wurde (Blatt Geräte)
  if(window.google && google.script && google.script.run){
    return new Promise(function(res,rej){google.script.run.withSuccessHandler(res).withFailureHandler(rej).api(payload)});
  }
  var ctl = window.AbortController ? new AbortController() : null;
  var tm = setTimeout(function(){ if(ctl) ctl.abort(); }, payload.was==="foto" ? 90000 : 45000);
  return fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow",signal:ctl?ctl.signal:undefined})
    .then(function(r){ if(!r.ok){ clearTimeout(tm); throw new Error("http "+r.status); }
            // V34: Zeitlimit gilt bis zum Ende der Antwort (vorher nur bis zum Antwortkopf – hing der Rest, blieb das Senden stehen)
            return r.json().then(function(j){ clearTimeout(tm); return j; }, function(e){ clearTimeout(tm); throw e; }); },
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
    // V34: nicht mehr die erste (oft grobe, „2000 m“) Ortung nehmen, sondern bis zu 8 s die beste abwarten; ab 100 m Genauigkeit sofort fertig.
    // Anlass: Ghețau 24./25.11.2026 – alle Stempel mit „2000 m“ oder ohne GPS. Ohne jede Ortung endet das Warten jetzt nach 8 s (vorher 17 s).
    var done=false, best=null, wid=null;
    var ende=function(){ if(done) return; done=true; try{ if(wid!==null) navigator.geolocation.clearWatch(wid); }catch(e){} res(best); };
    try{
      wid=navigator.geolocation.watchPosition(function(p){
        var q={lat:p.coords.latitude,lon:p.coords.longitude,acc:Math.round(p.coords.accuracy)};
        if(!best||q.acc<best.acc) best=q;
        if(best.acc<=100) ende();
      }, function(err){ if(err&&err.code===1) ende(); }, {enableHighAccuracy:true,timeout:8000,maximumAge:0}); // Ortung am Handy verweigert: nicht 8 s warten
    }catch(e){}
    setTimeout(ende,8000);
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
      queue.push(item); ls("faz_queue",JSON.stringify(queue)); stPut(item); syncAnmelden(); // V34: Hintergrund-Versand sofort anmelden – wird die App vor Ende der Ortung geschlossen, geht der Stempel trotzdem raus
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
  if(ev.hinweis) d.appendChild(el("div","h",ohnePreis(ev.hinweis)));
  // Material-Erinnerung (Anja, 27.10.2026): nur Anzeige mit Datum, kein Haken
  if(ev.material&&ev.material.length){ var mb=el("div","miss"); mb.appendChild(el("div","","📦 "+t("tkMat")+(ev.materialDatum?fmtDay(ev.materialDatum):"")+":")); ev.material.forEach(function(x){ mb.appendChild(el("div","","• "+(lang==="de"?(x.de||x.ro):(x.ro||x.de)))); }); d.appendChild(mb); }
  if(withTickets){
    if(!ev.projekte||!ev.projekte.length) d.appendChild(el("div","l",t("pNoProj")));
    (ev.projekte||[]).forEach(function(pr){
      var p=el("div","proj");
      var pn=el("div","pn",pr.name+" · "+pr.gesamt+" "+t("pOpen"));
      if(pr.uebertrag) pn.appendChild(el("span","res",t("pCarry")));
      p.appendChild(pn);
      if(pvPlaene(pr).length){ var pb=el("button","planbtn",t("pvBtn")+" ("+pr.tickets.filter(function(x){return x.fpid&&pr.plaene[x.fpid]}).length+")"); pb.onclick=function(){ pvOpen(pr); }; p.appendChild(pb); }
      if(istPro7(pr)) p.appendChild(ordnerNode(pr)); else pr.tickets.forEach(function(tk){ p.appendChild(tkNode(pr,tk)); });
      // Neues Schott vor Ort gefunden (Anja, 27.10.2026): in Fieldwire auf dem Plan anlegen, hier die #-Nummer eingeben, danach gleicher Ablauf
      var nbtn=el("button","neu","+ "+t("tkNeu"));
      nbtn.onclick=function(){
        var box=el("div","probbox"); box.appendChild(el("div","l",t("tkNeuHinweis"))); var ni=document.createElement("input"); ni.type="number"; ni.inputMode="numeric"; ni.placeholder=t("tkNeuName");
        var go=el("button","neu",t("tkNeuGo"));
        go.onclick=function(){ if(navigator.onLine===false){ show("err",t("tkNurOnline")); return; } go.disabled=true;
          if(!ni.value.trim()){ go.disabled=false; return; } send({action:"ticket",token:token,projekt:pr.id,was:"neu",terme:(ev.terme||[]),nr:ni.value.trim(),cid:"n"+uid()}).then(function(r){
            if(r&&r.ok&&r.ticket){ pr.tickets=pr.tickets.filter(function(x){return x.id!==r.ticket.id}); pr.tickets.push(r.ticket); pr.gesamt=(pr.gesamt||0)+1; ls("faz_plan",JSON.stringify(plan)); renderPlan(); show("ok",t("saved")); }
            else if(r&&r.ok){ show("ok",t("saved")); if(plan) plan._t=0; loadPlan(true); } // V34: übernommen, Stand kam nicht mit → Plan frisch laden
            else { go.disabled=false; show("err",(r&&(r.error==="nicht_gefunden"||r.error==="nummer"))?t("tkNeuNicht")+(r.msg?" ("+r.msg+")":""):(istFest(r)?fehlerText(r):t("eNochmal")+(r&&(r.msg||r.error)?" ("+(r.msg||r.error)+")":""))); } // V34: Serverfehler nicht mehr als „kein Internet“ melden; „Neues Schott“ wird nicht von selbst wiederholt
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
/* ===== Pro7: Ordneransicht (Florin 19.11.2026) =====
   Nur Offen und Zu Schotten (Geschottet kommt vom Server nicht mehr), aufklappbar: Status → Bauteil (BT B / BT C) → Ebene.
   Bauteil und Ebene aus dem Ticketnamen ("BT B OG.2"), sonst "BT ?" bzw. Ebene vom Server. */
var fAuf={}; try{ fAuf=JSON.parse(localStorage.getItem("faz_ordner")||"{}")||{}; }catch(e){ fAuf={}; }
function istPro7(pr){ return /pro7|prosieben/i.test(String(pr&&pr.name||"")); }
var EB_ORD=["UG.2","UG.1","EG","OG.1","OG.2","OG.3","OG.4","OG.5","OG.6","DG"];
function tkBT(tk){ var m=String(tk.name||"").match(/\bBT[\s.\-]*([ABC])\b/i); return m?"BT "+m[1].toUpperCase():"BT ?"; }
function tkEbene(tk){ var m=String(tk.name||"").match(/\b(UG|OG)[\s.]*(\d)\b|\b(EG|DG)\b/i); if(m) return m[3]?m[3].toUpperCase():m[1].toUpperCase()+"."+m[2]; return tk.eb?t("pLevel")+tk.eb:"?"; }
function ebRang(e){ var i=EB_ORD.indexOf(e); return i<0?99:i; }
function fNode(label,n,key,lvl){
  var w=el("div","fo f"+lvl); var h=el("div","fh",(fAuf[key]?"▼ ":"▶ ")+label+" ("+n+")");
  h.onclick=function(){ fAuf[key]=!fAuf[key]; try{ localStorage.setItem("faz_ordner",JSON.stringify(fAuf)); }catch(e){} renderPlan(); };
  w.appendChild(h); var b=el("div","fb"); w.appendChild(b); return {head:w, body:b};
}
function ordnerNode(pr){
  var box=el("div","ordner");
  var zu=function(s){ return s==="Zu Schotten"||s==="In Bearbeitung"; };
  var list=(pr.tickets||[]).filter(function(tk){ return tk.status!=="Geschottet"||tk._jetzt; });
  [["Offen",function(s){ return !zu(s); }],["Zu Schotten",zu]].forEach(function(g){
    var tks=list.filter(function(tk){ return g[1](tk._vorher||tk.status); });
    if(!tks.length) return;
    var k1=pr.id+"|"+g[0], f1=fNode(g[0],tks.length,k1,1); box.appendChild(f1.head); if(!fAuf[k1]) return;
    var bts={}; tks.forEach(function(tk){ var b=tkBT(tk); (bts[b]=bts[b]||[]).push(tk); });
    Object.keys(bts).sort().forEach(function(b){
      var k2=k1+"|"+b, f2=fNode(b,bts[b].length,k2,2); f1.body.appendChild(f2.head); if(!fAuf[k2]) return;
      var ebs={}; bts[b].forEach(function(tk){ var e=tkEbene(tk); (ebs[e]=ebs[e]||[]).push(tk); });
      Object.keys(ebs).sort(function(a,c){ return (ebRang(a)-ebRang(c))||a.localeCompare(c); }).forEach(function(e){
        var k3=k2+"|"+e, f3=fNode(e,ebs[e].length,k3,3); f2.body.appendChild(f3.head); if(!fAuf[k3]) return;
        ebs[e].sort(function(a,c){ return a.nr-c.nr; }).forEach(function(tk){ f3.body.appendChild(tkNode(pr,tk)); });
      });
    });
  });
  return box;
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
  // V34: Ist der gespeicherte Plan nicht von heute (App über Nacht offen oder morgens ohne Netz gestartet), nicht „Azi“ darüber schreiben
  var planAlt=!!(plan.azi&&plan.azi.datum!==todayKey);
  if(planAlt) A.appendChild(el("div","miss",t("pAlt")+fmtDay(plan.azi.datum)+" "+t("pAltHin")));
  if(plan.azi) A.appendChild(dayNode(plan.azi,(planAlt?"":t("pToday")+" – ")+fmtDay(plan.azi.datum),true,!planAlt));
  if(plan.maine) A.appendChild(dayNode(plan.maine,t("pTomorrow")+" – "+fmtDay(plan.maine.datum),true,false));
  (plan.woche||[]).forEach(function(tag){ var det=tagDetail[tag.datum]; var dn=dayNode(det||tag,fmtDay(tag.datum)+(det?" ▲":" ▼"),!!det,tag.datum===todayKey); var h=dn.firstChild; h.style.cursor="pointer";
    h.onclick=function(){ if(det){ delete tagDetail[tag.datum]; renderPlan(); return; } if(navigator.onLine===false){ show("err",t("tkNurOnline")); return; } show("warn",t("pLoad"));
      send({action:"plan",token:token,tag:tag.datum}).then(function(r){ if(r&&r.ok&&r.tag){ tagDetail[tag.datum]=r.tag; renderPlan(); show("ok",t("saved")); } else show("err",t("pErr")); }).catch(function(){ show("err",t("pErr")); }); };
    S.appendChild(dn); });
  var st=(plan._offline?t("pOffline")+" · ":"")+t("pStand")+(plan.stand||"")+(tq.length?" · "+t("tkWarte")+tq.length:"");
  $("aziStand").textContent=st;$("saptStand").textContent=st;
  if(pv&&pv.on) pvRender();
}

/* ===== Plan-Übersicht (Florin 23.11.2026) =====
   Je Projekt ein Knopf: Planbild aus Fieldwire mit allen Schotts als Punkte. Tippen auf einen Punkt öffnet das Schott
   unten im selben Fenster mit dem normalen geführten Ablauf (Foto, Haken, Felder, FERTIG). */
var pv={on:false,pr:null,prId:null,fp:null,sel:null,z:1,key:""};
function pvPlaene(pr){
  var out=[], pl=(pr&&pr.plaene)||{};
  Object.keys(pl).forEach(function(id){
    var tks=(pr.tickets||[]).filter(function(x){return x.fpid===id});
    if(tks.length&&pl[id].u&&pl[id].w&&pl[id].h) out.push({id:id,n:pl[id].n||"Plan",u:pl[id].u,a:pl[id].a||"",w:pl[id].w,h:pl[id].h,tks:tks,eb:tks[0].ebNr||0}); // a = kleines Bild (ab Server V36)
  });
  out.sort(function(a,b){ return (a.eb-b.eb)||a.n.localeCompare(b.n); });
  return out;
}
function pvProj(){
  var hit=null, erst=null;
  var tage=[plan&&plan.azi, plan&&plan.maine]; Object.keys(tagDetail||{}).forEach(function(k){ tage.push(tagDetail[k]); });
  tage.forEach(function(tag){ if(!tag||!tag.termine) return; tag.termine.forEach(function(ev){ (ev.projekte||[]).forEach(function(pr){ if(pr===pv.pr) hit=pr; if(!erst&&pr.id===pv.prId) erst=pr; }); }); });
  return hit||erst;
}
function pvOpen(pr){
  pv.on=true; pv.pr=pr; pv.prId=pr.id; pv.sel=null; pv.z=1; pv.key="";
  var fps=pvPlaene(pr); pv.fp=fps.length?fps[0].id:null;
  try{ history.pushState({pv:1},""); }catch(e){}
  pvRender();
}
function pvClose(vonZurueck){
  if(!pv.on) return; pv.on=false; pv.key="";
  var b=$("pv"); if(b){ b.className=""; b.innerHTML=""; }
  if(!vonZurueck){ try{ if(history.state&&history.state.pv){ pv.ignPop=true; setTimeout(function(){ pv.ignPop=false; },700); history.back(); } }catch(e){} }
}
// V34: Das eigene „Zurück“ beim Schließen nicht noch einmal als Schließen werten (schloss sonst einen sofort danach geöffneten Plan wieder)
window.addEventListener("popstate",function(){ if(pv.ignPop){ pv.ignPop=false; return; } if(pv.on) pvClose(true); });
function pvFarbe(tk){ var s=tk._status==="fertig"?"Geschottet":tk.status; return s==="Geschottet"?"ge":(s==="In Bearbeitung"?"ib":(s==="Offen"?"of":"zu")); }
var PV_ZMAX=40; // V34: vorher 8 – bei T1 Modul A (60 Punkte auf engem Raum) ließen sich die Punkte nicht einzeln antippen (Ghețau 26.11.2026)
function pvZoom(z,cx,cy){
  var sc=$("pvS"), c=$("pvC"); if(!sc||!c) return;
  z=Math.max(1,Math.min(PV_ZMAX,z));
  var w0=c.offsetWidth||1, h0=c.offsetHeight||1;
  if(cx===undefined){ cx=sc.clientWidth/2; cy=sc.clientHeight/2; }
  var fx=(sc.scrollLeft+cx)/w0, fy=(sc.scrollTop+cy)/h0;
  pv.z=z; c.style.width=(z*100)+"%";
  sc.scrollLeft=fx*c.offsetWidth-cx; sc.scrollTop=fy*c.offsetHeight-cy;
  if(pv.scharf) pv.scharf();
}
/* V34: Beim Öffnen gleich auf den Bereich zoomen, in dem die Punkte liegen (statt ganzes Blatt mit einem Punkthaufen). */
function pvAufPunkte(cur){
  var sc=$("pvS"), c=$("pvC"); if(!sc||!c||!cur.tks.length) return;
  var x0=1,x1=0,y0=1,y1=0;
  cur.tks.forEach(function(k){ var x=k.px/cur.w, y=k.py/cur.h; if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; });
  var W=sc.clientWidth||1, H=sc.clientHeight||1, bw=Math.max(x1-x0,0.02)*1.25, bh=Math.max(y1-y0,0.02)*1.25;
  var z=Math.min(1/bw, (H*cur.w)/(W*cur.h*bh)); z=Math.max(1,Math.min(12,z));
  pv.z=z; c.style.width=(z*100)+"%";
  sc.scrollLeft=((x0+x1)/2)*c.offsetWidth-W/2; sc.scrollTop=((y0+y1)/2)*c.offsetHeight-H/2;
}
function pvRender(){
  var box=$("pv"); if(!box) return;
  var pr=pvProj(); if(!pr){ pvClose(); return; }
  pv.pr=pr;
  var fps=pvPlaene(pr); if(!fps.length){ pvClose(); return; }
  var cur=fps.filter(function(f){return f.id===pv.fp})[0]||fps[0]; pv.fp=cur.id;
  var key=pr.id+"|"+cur.id+"|"+lang;
  var neu=false;
  if(pv.key!==key){
    neu=true; pv.key=key; pv.z=1; pv.gezeigt=null; pv.scharf=null; pv.bild=""; box.innerHTML=""; box.className="on";
    var h=el("div","pvh"); h.appendChild(el("div","ti",pr.name));
    var zm=el("button","","−"); zm.onclick=function(){ pvZoom(pv.z/2); }; h.appendChild(zm);
    var zp=el("button","","+"); zp.onclick=function(){ pvZoom(pv.z*2); }; h.appendChild(zp);
    var x=el("button","","✕ "+t("pvZu")); x.onclick=function(){ pvClose(); }; h.appendChild(x);
    box.appendChild(h);
    if(fps.length>1){ var tb=el("div","pvt"); fps.forEach(function(f){ var b=el("button",f.id===cur.id?"on":"",f.n+" ("+f.tks.length+")"); b.onclick=function(){ pv.fp=f.id; pv.sel=null; pvRender(); }; tb.appendChild(b); }); box.appendChild(tb); }
    else box.appendChild(el("div","pvn",cur.n));
    var st=el("div","pvst"); st.id="pvSt"; box.appendChild(st); // V34: Lade-/Fehlerzeile, immer sichtbar (vorher nur ohne gewähltes Schott)
    var sc=el("div","pvs"); sc.id="pvS"; var c=el("div","pvc"); c.id="pvC";
    // V34: Fläche hat immer das Seitenverhältnis des Plans → die Punkte sitzen richtig, auch wenn das Bild fehlt.
    // Vorher fiel die Fläche ohne Bild auf Höhe 0 zusammen und alle Punkte lagen oben in einer Reihe (Victor 26.11.2026).
    try{ c.style.aspectRatio=cur.w+" / "+cur.h; }catch(e){}
    var img=document.createElement("img"); img.alt=""; img.style.height="100%";
    // Erst das kleine Bild (höchstens 2048 px, schnell auch bei schwachem Netz), sonst das große; „Nochmal laden“ statt Sackgasse.
    var quellen=[]; if(cur.a) quellen.push(cur.a); if(quellen.indexOf(cur.u)<0) quellen.push(cur.u);
    var qi=0, gross=quellen.length<2, zurueck=false;
    var laden=function(){ pv.bild="lade"; st.className="pvst on"; st.textContent=t("pvLade"); img.src=quellen[qi]; };
    // Jeder Handler prüft pv.key===key: Nach einem Planwechsel darf das alte Bild den Zustand des neuen Plans nicht mehr ändern.
    img.onload=function(){ if(pv.key!==key) return; pv.bild="ok"; st.className="pvst"; st.textContent=""; if(pv.scharf) pv.scharf(); }; // ist schon hineingezoomt (Start auf den Punkten): scharfes Bild gleich nachholen
    img.onerror=function(){
      if(pv.key!==key) return;
      if(pv.bild==="ok"){ if(!zurueck){ zurueck=true; img.src=quellen[qi]; } return; } // scharfes Bild kam nicht: das kleine bleibt
      if(qi<quellen.length-1){ qi++; img.src=quellen[qi]; return; }
      pv.bild="fehler"; st.className="pvst on err"; st.textContent=t("pvErr")+" ";
      var rb=el("button","",t("pvRetry")); rb.onclick=function(){ qi=0; img.removeAttribute("src"); laden(); }; st.appendChild(rb);
    };
    // Beim Hineinzoomen das scharfe Bild nachladen (nur wenn es ein anderes und nicht riesig ist)
    pv.scharf=function(){
      if(gross||pv.bild!=="ok"||pv.z<3||cur.w*cur.h>40e6||navigator.onLine===false) return;
      gross=true; var g=new Image(); g.onload=function(){ if(pv.on&&pv.key===key) img.src=cur.u; };
      g.onerror=function(){ setTimeout(function(){ gross=false; },15000); }; // scharfes Bild kam nicht: beim nächsten Zoomen (frühestens nach 15 s) noch einmal versuchen
      g.src=cur.u;
    };
    c.appendChild(img); var pins=el("div",""); pins.id="pvP"; c.appendChild(pins); sc.appendChild(c); box.appendChild(sc);
    laden();
    // Zwei-Finger-Zoom
    var d0=0,z0=1;
    function dist(e){ var a=e.touches[0],b=e.touches[1]; return Math.sqrt(Math.pow(a.clientX-b.clientX,2)+Math.pow(a.clientY-b.clientY,2)); }
    sc.addEventListener("touchstart",function(e){ if(e.touches.length===2){ d0=dist(e); z0=pv.z; } },{passive:true});
    sc.addEventListener("touchmove",function(e){ if(e.touches.length===2&&d0){ e.preventDefault(); var r=sc.getBoundingClientRect(); pvZoom(z0*dist(e)/d0,(e.touches[0].clientX+e.touches[1].clientX)/2-r.left,(e.touches[0].clientY+e.touches[1].clientY)/2-r.top); } },{passive:false});
    sc.addEventListener("touchend",function(e){ if(e.touches.length<2) d0=0; },{passive:true});
    var k=el("div","pvk"); k.id="pvK"; box.appendChild(k);
  }
  // Punkte
  var P=$("pvP"); P.innerHTML="";
  cur.tks.forEach(function(tk0){
    var tk=tkEff(tk0);
    var b=el("button","pin "+pvFarbe(tk)+(pv.sel===tk.id?" sel":""),(tk.status==="Geschottet"||tk._status==="fertig"?"✓":"")+tk.nr);
    b.style.left=(tk.px/cur.w*100)+"%"; b.style.top=(tk.py/cur.h*100)+"%";
    b.onclick=function(){ pv.sel=(pv.sel===tk.id?null:tk.id); if(pv.sel) tkAuf[tk.id]=true; pvRender(); };
    P.appendChild(b);
  });
  // Unten: gewähltes Schott mit dem normalen Ablauf
  var K=$("pvK"); var top=K.scrollTop; K.innerHTML="";
  var selTk=pv.sel?(pr.tickets||[]).filter(function(x){return x.id===pv.sel})[0]:null;
  if(selTk){
    var zu=el("button","pvx","▼"); zu.onclick=function(){ pv.sel=null; pvRender(); }; K.appendChild(zu);
    K.appendChild(tkNode(pr,selTk)); K.className="pvk auf"; K.scrollTop=top;
  } else {
    K.className="pvk";
    var m=el("div","l",t("pvHint")); m.id="pvMsg"; K.appendChild(m);
    var leg=el("div","pvl"); [["zu","Zu Schotten"],["ib","In Bearbeitung"],["of","Offen"],["ge","Geschottet"]].forEach(function(g){ var n=cur.tks.filter(function(x){return pvFarbe(tkEff(x))===g[0]}).length; if(!n) return; var s=el("span","pin "+g[0],String(n)); s.style.position="static"; s.style.transform="none"; leg.appendChild(s); leg.appendChild(el("span","",g[1])); }); K.appendChild(leg);
    // V34: alle Schotts dieses Plans auch als Nummern zum Antippen – erreichbar, selbst wenn Punkte übereinander liegen
    K.appendChild(el("div","l",t("pvListe")));
    var cl=el("div","pvchips");
    cur.tks.slice().sort(function(a,b){return a.nr-b.nr}).forEach(function(tk0){ var tk=tkEff(tk0);
      var cb=el("button","pin "+pvFarbe(tk),(tk.status==="Geschottet"||tk._status==="fertig"?"✓":"")+"#"+tk.nr); cb.style.position="static"; cb.style.transform="none";
      cb.onclick=function(){ pv.sel=tk.id; tkAuf[tk.id]=true; pvRender(); }; cl.appendChild(cb); });
    K.appendChild(cl);
    var ohne=(pr.tickets||[]).filter(function(x){return !x.fpid||!pr.plaene[x.fpid]});
    if(ohne.length) K.appendChild(el("div","l",t("pvOhne")+ohne.map(function(x){return "#"+x.nr}).join(", ")));
  }
  if(neu) pvAufPunkte(cur); // erst hier: das Feld unten ist gefüllt, die Planhöhe steht fest
  // V34: gewählten Punkt in den sichtbaren Teil des Plans holen (das Feld unten wird beim Öffnen größer und verdeckte ihn)
  if(pv.sel&&pv.gezeigt!==pv.sel){
    var sp=P.querySelector(".pin.sel"), scv=$("pvS");
    if(sp&&scv){ var r1=sp.getBoundingClientRect(), r2=scv.getBoundingClientRect();
      if(r1.left<r2.left+24||r1.right>r2.right-24||r1.top<r2.top+24||r1.bottom>r2.bottom-24){ scv.scrollLeft+=(r1.left+r1.width/2)-(r2.left+r2.width/2); scv.scrollTop+=(r1.top+r1.height/2)-(r2.top+r2.height/2); } }
  }
  pv.gezeigt=pv.sel;
}
function loadPlan(frisch){
  if(planBusy||!token||!$("aziBox")) return Promise.resolve();
  planBusy=true;
  if(!plan){$("aziBox").textContent=t("pLoad");$("saptBox").textContent=t("pLoad")}
  return send({action:"plan",token:token,frisch:!!frisch}).then(function(r){
    planBusy=false;
    if(r&&r.ok){r._t=Date.now();r._offline=false;plan=r;ls("faz_plan",JSON.stringify(plan));renderPlan()}
    else if(r&&r.error==="plan"){ if(plan){plan._offline=true;renderPlan();show("err",t("pErr")+(r.msg?" ("+r.msg+")":""))} else {$("aziBox").textContent=t("pErr")+" "+(r.msg||"");$("saptBox").textContent=t("pErr")} } // V34: Serverfehler beim Laden auch dann melden, wenn ein alter Plan da ist
    else if(r&&r.error==="token"){ show("err",t("invalid")); }
    else { // V34: jeder andere Serverfehler (server, busy …) – vorher passierte nichts und „Se încarcă planul…“ blieb stehen
      if(plan){ plan._offline=true; renderPlan(); } else { $("aziBox").textContent=t("pErr"); $("saptBox").textContent=t("pErr"); }
      show("err",t("pErr")+(r&&(r.msg||r.error)?" ("+(r.msg||r.error)+")":"")); }
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
  if(payload.als===undefined) payload.als=ALS||""; // "" = eigene Ansicht, auch wenn später ein anderer Monteur gewählt wird
  if(!payload.zeit) payload.zeit=Date.now(); // V34: Zeitpunkt der Eingabe am Handy – der Server (ab V36) nimmt ihn für Foto, Problem und Material statt der Sendezeit
  var jetzt=Date.now(); tqPush._ts=Math.max(jetzt,(tqPush._ts||0)+1); // streng aufsteigend: die Reihenfolge je Ticket bleibt eindeutig
  var item={id:payload.cid,ts:tqPush._ts,pr:pr.id,tk:tk.id,p:payload};
  if(payload._next){ item.n=1; item.next=payload._next; delete payload._next; } // kam mit Serverfehler zurück: erst nach kurzer Pause erneut
  return tqSave(item).then(function(){return true}).catch(function(){return false}).then(function(ok){
    if(!ok){ show("err",t("tkVoll")); return false; }
    tq.push(item); renderPlan(); if(!item.next) show("warn",t(navigator.onLine===false?"queued":"tkWarteHin")); syncAnmelden();
    if(!item.next) setTimeout(tqFlush,60); // V34: gleich lossenden, nicht erst beim nächsten 30-Sekunden-Takt
    return true;
  });
}
function tqFuer(tkId){ return tq.filter(function(q){return q.tk===tkId}); }
var tqBusy=false;
function tkLaeuft(){ return Object.keys(tkBusy).some(function(k){return tkBusy[k]}); }
/* V34: Reihenfolge beim Nachsenden. Vorher streng der Reihe nach – Raum, Höhe, Haken warteten hinter jedem Foto (im Keller Minuten bis Stunden),
   das Büro sah „Angaben fehlen“, der Monteur „ich habe es doch eingetragen“ (Victor, Hangar 1 #105, 26.11.2026).
   Jetzt: 1. kleine Eingaben (Haken, Felder, Punkte, Material), 2. Fotos, 3. FERTIG/Problem erst, wenn vom selben Schott nichts Früheres mehr wartet.
   Innerhalb eines Schotts bleibt die Reihenfolge der kleinen Eingaben erhalten. Einträge in der Wartezeit nach einem Serverfehler werden übersprungen. */
function tqKlein(q){ var w=q&&q.p&&q.p.was; return w!=="foto"&&w!=="status"; }
function tqNext(){
  var now=Date.now(), zu={}, i, q;
  function frei(x){ return !(x.next&&x.next>now); }
  for(i=0;i<tq.length;i++){ q=tq[i]; if(!tqKlein(q)) continue; if(zu[q.tk]) continue; if(frei(q)) return q; zu[q.tk]=1; }
  for(i=0;i<tq.length;i++){ q=tq[i]; if(tqKlein(q)||!frei(q)) continue;
    if(q.p.was==="status"){ var vor=false; for(var j=0;j<i;j++){ if(tq[j].tk===q.tk){ vor=true; break; } } if(vor) continue; }
    return q; }
  return null;
}
function tqFlush(){
  if(tqBusy||!tq.length||!token||tkLaeuft()) return Promise.resolve();
  if(tqFlush.pause&&tqFlush.pause>Date.now()) return Promise.resolve();
  var item=tqNext();
  if(!item) return Promise.resolve(); // alles in der Wartezeit nach einem Serverfehler (schont das Google-Tageskontingent)
  tqBusy=true;
  return send(item.p).then(function(r){
    tqBusy=false;
    if(!r) return;
    if(r.error==="busy"||r.error==="token"){ if(r.error==="token") show("err",t("invalid")); return; } // später erneut
    if(r.ok||r.error==="unvollstaendig"){
      tq=tq.filter(function(q){return q.id!==item.id}); tqDel(item.id);
      if(r.ok&&r.ticket) tkUpdate(item.tk,r.ticket);
      else if(r.ok){ // V34: gespeichert, aber ohne neuen Stand vom Server (ab V36 möglich) → Status selbst nachführen und den Plan nachladen
        if(item.p.was==="status"&&tkFind(item.tk)) tkUpdate(item.tk,{status:item.p.status==="fertig"?"Geschottet":"zu Klären/Offen",fertigMoeglich:false});
        renderPlan(); if(plan){ plan._t=0; loadPlan(); } }
      else { // V34: abgelehntes FERTIG bleibt am Schott stehen (die kurze Meldung sieht der Monteur oft nicht mehr)
        if(r.ticket) tkUpdate(item.tk,r.ticket);
        if(item.p.was==="status"&&item.p.status==="fertig") matDa[item.tk]=true; // Material ging vor FERTIG schon raus → beim nächsten GATA nur FERTIG (kein doppeltes Material)
        var ft=t("tkFertig")+" – "+t("tkFehlt")+" "+(r.fehlt||[]).join(", "); tkErrSet(item.tk,ft); show("err",ft); renderPlan(); }
      if(r.ok&&!tq.length) show("ok",t("saved")); // alles aus der Warteliste ist beim Server
      return tqFlush();
    }
    if(istFest(r)&&item.p.was!=="foto"){
      // V34: Der Server nimmt diesen Eintrag nie an (z. B. Text im Zahlenfeld, Punkt in Fieldwire gelöscht) → nicht endlos wiederholen
      // und nichts dahinter aufhalten. Der Monteur sieht am Schott, was nicht gespeichert wurde.
      // Fotos werden nie von selbst gelöscht (ein „Foto vorher“ lässt sich nicht nachholen): sie bleiben mit Wartezeit liegen
      // und lassen sich nach einer halben Stunde am Schott von Hand löschen.
      tq=tq.filter(function(q){return q.id!==item.id}); tqDel(item.id);
      tkErrSet(item.tk,fehlerText(r)); show("err",fehlerText(r)); renderPlan();
      return tqFlush();
    }
    // V32: sonstiger Serverfehler -> Eingabe (z. B. Foto) NICHT wegwerfen, später erneut (30 s, 1, 2, 4 … max. 30 min)
    if(!tq.some(function(q){return q.id===item.id})) return; // inzwischen vom Monteur gelöscht: nicht wieder anlegen
    item.n=(item.n||0)+1; item.next=Date.now()+Math.min(30000*Math.pow(2,item.n-1),1800000); item.fehler=r.msg||r.error||"";
    tqSave(item).catch(function(){});
    show("err",item.p.was==="foto"?t("eSrv"):fehlerText(r)); renderPlan(); // Foto bleibt immer liegen, also nie „nicht gespeichert, nochmal schreiben“
    // V34: der nächste Eintrag darf trotzdem raus (z. B. Felder, während ein Foto nicht durchgeht) – aber erst beim nächsten Takt,
    // damit bei einer Serverstörung nicht die ganze Warteschlange auf einmal anklopft.
    tqFlush.pause=Date.now()+20000;
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
    // V34: wartender eigener Punkt ist OFFEN wie auf dem Server (vorher als abgehakt gezeigt → FERTIG ging in die Warteschlange und
    // wurde später mit „Punkte ohne Haken“ abgelehnt). Der Monteur kann ihn schon abhaken: der Haken geht dann mit dem Punkt mit (erledigt).
    else if(p.was==="punkt"){ e.punkte.push({id:"q"+it.id,n:p.text+" ("+(plan&&plan.vorname||"")+")",s:p.erledigt?1:0,_p:true,_qid:it.id}); }
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
    var img=document.createElement("img"); img.loading="lazy"; img.alt="";
    var w;
    // V34: Vorschau kommt nicht (Ghețau 26.11.2026: leere Kästchen bei „Poze existente“) → einmal das Originalbild probieren, sonst Kästchen ausblenden
    var zweit=false; img.onerror=function(){ if(!zweit&&b.f&&b.f!==b.u){ zweit=true; img.src=b.f; } else if(w){ w.style.display="none"; } };
    img.src=b.u;
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
  f.alle.forEach(function(x){ var alt=x.tk.status; Object.keys(neu).forEach(function(k){ x.tk[k]=neu[k]; });
    if(x.tk.status==="Geschottet"&&alt&&alt!=="Geschottet"){ x.tk._jetzt=true; x.tk._vorher=alt; } }); // Pro7-Ordner: heute fertig gemeldet bleibt bis zum Neuladen sichtbar
  ls("faz_plan",JSON.stringify(plan)); renderPlan();
}
function tkSend(pr, tk, payload, btn){
  payload.action="ticket"; payload.token=token; payload.projekt=pr.id; payload.ticket=tk.id;
  if(!payload.cid) payload.cid="t"+uid(); // feste ID je Eingabe: Server erkennt Wiederholungen (keine doppelten Fotos)
  // Ohne Netz, solange noch etwas wartet (Reihenfolge!) oder eine Eingabe gerade läuft (V32: vorher verworfen), in die Warteschlange
  if(navigator.onLine===false || tq.length || tkLaeuft()) return tqPush(pr,tk,payload).then(function(){return null});
  tkBusy[tk.id]=true; if(btn) btn.disabled=true;
  return send(payload).then(function(r){
    tkBusy[tk.id]=false; if(btn) btn.disabled=false; setTimeout(tqFlush,0); // Wartendes danach der Reihe nach senden
    if(r&&r.ok&&r.ticket){ tkUpdate(tk.id, r.ticket); show("ok",t("saved")); }
    else if(r&&r.ok){ show("ok",t("saved")); if(plan){ plan._t=0; loadPlan(); } } // V34: ohne neuen Stand vom Server → Plan nachladen
    else if(r&&r.error==="unvollstaendig"){ if(r.ticket) tkUpdate(tk.id,r.ticket); show("err",t("tkFehlt")+" "+(r.fehlt||[]).join(", ")); }
    else if(r&&r.error==="busy"){ return tqPush(pr,tk,payload).then(function(){return null}); }
    else if(r&&r.error==="token"){ show("err",t("invalid")); }
    else if(istFest(r)){ tkErrSet(tk.id,fehlerText(r)); show("err",fehlerText(r)); renderPlan(); } // V34: klar sagen, was nicht gespeichert wurde
    else { // V34: vorübergehender Serverfehler → Eingabe nicht wegwerfen (vorher: Meldung „kein Internet“, Eingabe weg), automatisch wiederholen
      show("err",fehlerText(r)); payload._next=Date.now()+30000; return tqPush(pr,tk,payload).then(function(){return null}); }
    return r;
  }).catch(function(){ tkBusy[tk.id]=false; if(btn) btn.disabled=false; return tqPush(pr,tk,payload).then(function(){return null}); });
}
function fotoAufnehmen(pr, tk, art, btn, galerie){
  var inp=$("fotoInput"); if(!inp) return;
  inp.value="";
  // 19.11.2026 (Ghețau): "Fă o poză" öffnet direkt die Kamera (capture), Galerie über eigenen Knopf
  if(galerie) inp.removeAttribute("capture"); else inp.setAttribute("capture","environment");
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
      fotoSenden(pr, tk, {was:"foto", art:art, b64:b64});
    };
    img.onerror=function(){ URL.revokeObjectURL(url); show("err",t("eFoto")); }; // V34: vorher „kein Internet“, obwohl nur das Bild nicht lesbar war
    img.src=url;
  };
  inp.click();
}
/* 19.11.2026: Foto sofort auf dem Handy speichern (Warteschlange) und im Hintergrund senden –
   kein Warten bei schwachem Netz im Keller, Foto ist gleich als "wartet" sichtbar. */
function fotoSenden(pr, tk, p){
  p.action="ticket"; p.token=token; p.projekt=pr.id; p.ticket=tk.id;
  tqPush(pr,tk,p).then(function(ok){ if(ok){ if(navigator.onLine!==false) show("warn",t("tkUpload")); tqFlush(); } });
}
function galBtn(pr, tk, art){ var g=el("button","linkbtn","🖼 "+t("tkGalerie")); g.onclick=function(){ fotoAufnehmen(pr,tk,art,g,true); }; return g; }
var fEing={}; // getippte Angaben je Ticket|Feld, überleben Neuaufbau der Ansicht (03.11.2026)
var pEing={}, probAuf={}; // V34: getippter Text im „+“-Feld und offener Problem-Kasten je Ticket, überleben das Neuzeichnen
/* V34: Eingabe-Prüfung für Maße und Montagehöhe (Florin 26.11.2026). Anlass: tägliche Rückfragen per WhatsApp –
   „05 x 05“ bei Breite/Höhe (Victor 25.11.), „60 x 3“ mit 3 = Montagehöhe (Ghețau 25.11.), 0 als Maß, „O“ statt 0.
   Liefert {wert} (bereinigt, ohne Einheit), {fehler} (wird nicht gesendet) oder {frage, wert} (Monteur bestätigt). */
function zahlLesen(roh){
  var s=String(roh||"").trim().replace(/\s+/g," ");
  var m=s.match(/^([0-9oO.,]+) ?(mm|cm|m)?\.?$/i); if(!m) return null;
  var z=m[1].replace(/[oO]/g,"0").replace(",",".");
  if(!/^\d+(\.\d+)?$/.test(z)) return null;
  return {n:parseFloat(z), e:(m[2]||"").toLowerCase(), dez:z.indexOf(".")>=0};
}
function feldPruefen(f,roh){
  var n=f.name, v=String(roh).trim(), z;
  if(/\(mm\)/i.test(n)){
    z=zahlLesen(v); if(!z) return {fehler:t("eMassZahl")+n};
    // Einheit umrechnen; ohne Einheit mit Komma unter 10 = Meter (so rechnet auch der Server seit 03.11.: 0,15 → 150)
    var mm=z.e==="cm"?z.n*10:(z.e==="m"?z.n*1000:((z.dez&&z.n<10&&!z.e)?z.n*1000:z.n));
    mm=Math.round(mm*10)/10;
    if(mm===0) return {fehler:t("eMassNull")+n};
    var w=mm>=10?String(mm).replace(".",","):String(Math.max(1,Math.round(mm)));
    if(mm<10) return {frage:n+": "+w+t("fMassKlein"), wert:w};
    if(mm>3000) return {frage:n+": "+w+t("fMassGross"), wert:w};
    return {wert:w};
  }
  if(/montageh/i.test(n)){
    z=zahlLesen(v); if(!z) return {fehler:t("eHoeheZahl")+n};
    var me=z.e==="cm"?z.n/100:(z.e==="mm"?z.n/1000:z.n); me=Math.round(me*100)/100;
    var wm=String(me).replace(".",",");
    if(me===0) return {frage:t("fHoeheNull"), wert:"0"};
    if(me>15) return {frage:wm+t("fHoeheGross"), wert:wm};
    return {wert:wm};
  }
  if(f.typ==="zahl"&&!/^-?\d+([.,]\d+)?$/.test(v)) return {fehler:t("eZahl")+n};
  return {wert:v};
}
function tkNode(pr, tk){
  tk=tkEff(tk); // wartende Aktionen überlagern
  var k=el("div","tk"+(tk.status==="Geschottet"?" gata":(tk.fertigMoeglich?" ready":"")));
  var tn=el("div","tn","#"+tk.nr+" "+tk.name);
  if(tk._q) tn.appendChild(el("span","pend",t("tkWarte")+tk._q));
  k.appendChild(tn);
  // V34: dauerhaft abgelehnte Eingabe bleibt sichtbar, bis der Monteur sie bestätigt
  if(tkErr[tk.id]){ var eb=el("div","miss","⚠ "+tkErr[tk.id]+" "); var ew=el("button","linkbtn",t("eWeg")); ew.onclick=function(){ tkErrSet(tk.id,null); renderPlan(); }; eb.appendChild(ew); k.appendChild(eb); }
  // V34: Einträge, die nach 8 Versuchen (rund anderthalb Stunden) nicht durchgehen, blockieren sonst FERTIG für immer → der Monteur kann sie löschen
  var haengt=tqFuer(tk.id).filter(function(q){return (q.n||0)>=8});
  if(haengt.length){ var hb=el("div","miss","⚠ "+t("tkHaengt")+haengt.length+(haengt[0].fehler?" ("+haengt[0].fehler+")":"")+" "); var hx=el("button","linkbtn",t("tkVerwerfen"));
    hx.onclick=function(){ ask(t("tkVerwerfenFrage")).then(function(y){ if(!y) return; haengt.forEach(function(q){ tq=tq.filter(function(x){return x.id!==q.id}); tqDel(q.id); }); renderPlan(); tqFlush(); }); };
    hb.appendChild(hx); k.appendChild(hb); }
  // Zugeklappt: nur Nummer und Name, Tippen klappt auf (28.10.2026)
  tn.style.cursor="pointer"; tn.appendChild(el("span","tm"," "+(tkAuf[tk.id]?"▲":"▼")));
  tn.onclick=function(){ tkAuf[tk.id]=!tkAuf[tk.id]; renderPlan(); };
  if(!tkAuf[tk.id]){ if(tk.status) k.appendChild(el("div","tm",tk.status==="Geschottet"?"✓ "+t("tkDone"):tk.status)); return k; }
  var info=tk.info||{};
  var meta=[tk.eb?t("pLevel")+tk.eb:"", info.raum?t("pRoom")+info.raum:"", info.einbau, info.masse?info.masse+" mm":"", info.hoehe?info.hoehe+" m":"", info.art, tk.status].filter(Boolean).join(" · ");
  if(meta) k.appendChild(el("div","tm",meta));
  if(info.notiz) k.appendChild(el("div","h","ℹ "+ohnePreis(info.notiz)));
  if(info.bsk) k.appendChild(el("div","h","BSK: "+info.bsk));
  var done=tk.status==="Geschottet";
  // V34: Nach PROBLEM steht das Schott auf „zu Klären/Offen“ (oder das Büro hat es weitergestellt): nur noch die Meldung zeigen.
  // Vorher blieben alle Schritte samt GATA tippbar, bis der Plan neu geladen war – FERTIG hätte das gemeldete Problem überschrieben.
  if(tk.status&&["Offen","Zu Schotten","In Bearbeitung","Geschottet"].indexOf(tk.status)<0){ k.appendChild(el("div","miss",t("tkProblemDone")+" ("+tk.status+")")); return k; }
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
  // V34: Der Problem-Kasten ist ein gemerkter Zustand (probAuf). Vorher verschwand er samt getipptem Text, sobald die Ansicht neu gezeichnet
  // wurde – zum Beispiel direkt nach dem Problem-Foto.
  bp.onclick=function(){ probAuf[tk.id]={text:""}; renderPlan(); };
  if(!done){
    s1.appendChild(bp);
    if(probAuf[tk.id]){
      bp.disabled=true;
      var box=el("div","probbox");
      var fb=el("button","cam",t("tkProblemFoto")); fb.onclick=function(){ fotoAufnehmen(pr,tk,"vorher",fb); }; var fbG=galBtn(pr,tk,"vorher");
      var txt=document.createElement("textarea"); txt.rows=3; txt.placeholder=t("tkGrundText"); txt.value=probAuf[tk.id].text||""; txt.oninput=function(){ if(probAuf[tk.id]) probAuf[tk.id].text=txt.value; };
      var go=el("button","prob",t("tkMelden"));
      go.onclick=function(){ var g=txt.value.trim(); if(!g){ txt.focus(); return; } delete probAuf[tk.id]; tkSend(pr,tk,{was:"status",status:"klaeren",grund:g},go); };
      var pzu=el("button","linkbtn","✕"); pzu.onclick=function(){ delete probAuf[tk.id]; renderPlan(); };
      box.appendChild(fb); box.appendChild(fbG); box.appendChild(txt); box.appendChild(go); box.appendChild(pzu);
      s1.appendChild(box);
    }
  }
  // Schritt 2: Foto vorher
  var fo=tk.fotos||{};
  var s2=el("div","step"+(fo.vorher?" ok":"")); s2.appendChild(el("div","sh","2 · "+t("tkS2")+(fo.vorher?" ✓ "+fo.vorher:"")));
  var p2=picsNode(tk.bilder,"v"); if(p2) s2.appendChild(p2);
  var b2=el("button","cam",fo.vorher?t("tkFotoMehr"):t("tkFoto")); b2.onclick=function(){fotoAufnehmen(pr,tk,"vorher",b2)}; s2.appendChild(b2); s2.appendChild(galBtn(pr,tk,"vorher")); k.appendChild(s2);
  // Schritt 3: Arbeiten (offene Punkte)
  var offenP=(tk.punkte||[]).filter(function(p){return p.s===0 && !/^info:/i.test(p.n)});
  var s3=el("div","step"+(offenP.length?"":" ok")); s3.appendChild(el("div","sh","3 · "+t("tkS3")+(offenP.length?"":" ✓")));
  if(!(tk.punkte||[]).length) s3.appendChild(el("div","l",t("tkKeinePunkte")));
  (tk.punkte||[]).forEach(function(p){
    // alle Punkte zeigen, erledigte durchgestrichen (28.10.2026)
    var row=el("label","chk"+(p.s===1?" done":"")+(p._p?" pend2":""));
    var cb=document.createElement("input"); cb.type="checkbox"; cb.checked=p.s===1; cb.disabled=/^info:/i.test(p.n);
    cb.onchange=function(){
      if(p._qid){ // eigener Punkt, noch nicht gesendet: Haken am wartenden Eintrag merken
        var it=tq.filter(function(q){return q.id===p._qid})[0];
        if(it){ it.p.erledigt=cb.checked; tqSave(it).catch(function(){}); }
        renderPlan(); return;
      }
      tkSend(pr,tk,{was:"haken",punkt:p.id,wert:cb.checked}); };
    row.appendChild(cb); row.appendChild(el("span","",ohnePreis(p.n))); s3.appendChild(row);
  });
  var np=el("div","fi"); var ni=document.createElement("input"); ni.type="text"; ni.placeholder=t("tkPunktNeu"); ni.maxLength=160;
  ni.value=pEing[tk.id]||""; ni.oninput=function(){ pEing[tk.id]=ni.value; }; // V34: getippter Text übersteht das Neuzeichnen (z. B. wenn im Hintergrund ein Foto fertig wird)
  var nb=el("button","sv","+"); nb.title=t("tkPunktAdd"); nb.onclick=function(){ var v=ni.value.trim(); if(v){ delete pEing[tk.id]; tkSend(pr,tk,{was:"punkt",text:v},nb); } };
  np.appendChild(ni); np.appendChild(nb); s3.appendChild(np);
  k.appendChild(s3);
  // Schritt 4: Felder
  var offenF=tk.offen||[];
  var s4=el("div","step"+(offenF.some(function(f){return f.pflicht})?"":" ok")); s4.appendChild(el("div","sh","4 · "+t("tkS4")+(offenF.length?"":" ✓")));
  var inputs=[];
  // V34: Projekt ohne Maßfelder in Fieldwire (Pro7, Securetec): sagen, wohin die Maße gehören (Alex 26.11.2026: „nu apare lungimea și lățimea“)
  if(tk.ohneMass&&!done) s4.appendChild(el("div","l",t("tkMassHinweis")));
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
    var gef=inputs.filter(function(x){return String(x.el.value||"").trim()});
    if(!gef.length){ fVers[tk.id]=true; renderPlan(); return; }
    // V34: Eingabe-Prüfung vor dem Senden (feldPruefen). Ein Fehler hält alles an und zeigt, welches Feld; eine Rückfrage („5 mm?“) muss bestätigt werden.
    var jobs=[], fragen=[];
    for(var gi=0;gi<gef.length;gi++){ var x=gef[gi];
      if(x.wahl){ jobs.push({was:"feld",feld:x.f.id,uuid:x.el.value}); continue; }
      var pz=feldPruefen(x.f,x.el.value);
      if(pz.fehler){ show("err",pz.fehler); try{ x.el.parentNode.parentNode.className="fld rot"; x.el.focus(); }catch(e){} return; }
      if(pz.frage) fragen.push(pz.frage);
      jobs.push({was:"feld",feld:x.f.id,wert:pz.wert});
    }
    fragen.reduce(function(p,f){ return p.then(function(ok){ return ok?ask(f):false; }); }, Promise.resolve(true)).then(function(ok){
      if(!ok) return; // „Nein“: nichts senden, der Monteur korrigiert
      ub.disabled=true;
      jobs.reduce(function(p2,j){ return p2.then(function(){ return tkSend(pr,tk,j); }); }, Promise.resolve()).then(function(){ fVers[tk.id]=true; renderPlan(); });
    }); };
    s4.appendChild(ub); }
  k.appendChild(s4);
  // Schritt 5: Foto nachher
  var s5=el("div","step"+(fo.nachher?" ok":"")); s5.appendChild(el("div","sh","5 · "+t("tkS5")+(fo.nachher?" ✓ "+fo.nachher:"")));
  var p5=picsNode(tk.bilder,"n"); if(p5) s5.appendChild(p5);
  var b5=el("button","cam",fo.nachher?t("tkFotoMehr"):t("tkFoto")); b5.onclick=function(){fotoAufnehmen(pr,tk,"nachher",b5)}; s5.appendChild(b5); s5.appendChild(galBtn(pr,tk,"nachher")); k.appendChild(s5);
  // Schritt 6: Fertig / Problem (nicht bei Nachbearbeitung)
  // Nach FERTIG (Nachbearbeitung): Material lässt sich nachtragen (V34 – Victor 26.11.2026: „nu am putut să trec câtă folie am folosit“)
  if(done){
    var sN=el("div","step");
    if(!matBox(pr,tk,sN,null)){ var mn=el("button","linkbtn","📦 "+t("tkMatNach")); mn.onclick=function(){ matAuf[tk.id]={liste:[],werte:{},extra:"",ohne:true,nach:true}; renderPlan(); }; sN.appendChild(mn); }
    k.appendChild(sN); return k;
  }
  var s6=el("div","step"); s6.appendChild(el("div","sh","6 · "+t("tkS6")));
  if(tk.fehlt&&tk.fehlt.length) s6.appendChild(el("div","miss",t("tkFehlt")+" "+tk.fehlt.join(", ")));
  var row6=el("div","row6");
  var bf=el("button","fin",t("tkFertig")); bf.disabled=!tk.fertigMoeglich;
  bf.onclick=function(){ ask(t("tkFertigFrage")).then(function(y){ if(!y) return;
    // Material bei FERTIG (Anja 28.10.2026): Schätzung zeigen, Monteur ändert nur, was nicht stimmt.
    // V34: Die Abfrage kommt IMMER. Vorher wurde sie ohne Netz und immer dann übersprungen, wenn noch etwas wartete –
    // also fast jedes Mal, weil das „Foto nachher“ gerade erst in die Warteschlange gegangen war. Ohne Netz gibt es
    // keine Schätzung, dann schreibt der Monteur das Material frei hinein.
    // Die Schätzung des Servers gibt es nur mit Netz und nur, wenn von DIESEM Schott keine Haken/Felder mehr warten (sonst rechnet er mit altem Stand).
    // Wartende Fotos stören die Schätzung nicht.
    if(fertigUnterwegs(tk.id)) return;
    if(matDa[tk.id]){ // Material ist schon gemeldet, nur FERTIG fehlte (Speicher war voll) → kein zweiter Material-Dialog
      var pf={was:"status",status:"fertig",action:"ticket",token:token,projekt:pr.id,ticket:tk.id};
      tqPush(pr,tk,pf).then(function(da3){ if(da3){ delete matDa[tk.id]; tqFlush(); } }); return; }
    if(navigator.onLine===false||tqFuer(tk.id).some(tqKlein)){ matAuf[tk.id]={liste:[],werte:{},extra:"",ohne:true}; renderPlan(); return; }
    bf.disabled=true; show("warn",t("tkMatLaden"));
    send({action:"ticket",token:token,projekt:pr.id,ticket:tk.id,was:"material",schaetzen:true}).then(function(r){
      if(fertigUnterwegs(tk.id)) return; // späte Antwort: FERTIG läuft schon
      matAuf[tk.id]={liste:(r&&r.ok&&r.material)||[],werte:{},extra:""}; renderPlan();
    }).catch(function(){ if(fertigUnterwegs(tk.id)) return; matAuf[tk.id]={liste:[],werte:{},extra:"",ohne:true}; renderPlan(); });
  }); };
  row6.appendChild(bf); s6.appendChild(row6);
  if(matBox(pr,tk,s6,bf)) bf.style.display="none";
  k.appendChild(s6);
  return k;
}
/* V34: Material-Dialog als gemerkter Zustand je Schott. Vorher hing er nur am gerade gezeichneten Schott und verschwand samt Eingaben,
   sobald die Ansicht neu gezeichnet wurde (z. B. wenn im Hintergrund ein Foto fertig gesendet war). */
var matAuf={}, matDa={}; // matDa: Material schon in der Warteliste, FERTIG konnte nicht gespeichert werden
/* true, wenn für das Schott schon ein Material-Dialog offen ist, FERTIG/Problem in der Warteliste steht oder es schon „Geschottet“ ist */
function fertigUnterwegs(id){ var f=tkFind(id); return !!matAuf[id]||tqFuer(id).some(function(q){return q.p&&q.p.was==="status"})||!!(f&&f.tk.status==="Geschottet"); }
function matBox(pr,tk,ziel,bf){
  var st=matAuf[tk.id]; if(!st) return false;
  var box=el("div","probbox"), inps=[];
  box.appendChild(el("div","l",t(st.liste.length?"tkMatFrage":(st.ohne?"tkMatOhne":"tkMatLeer"))));
  st.liste.forEach(function(x,i){ var w=el("div","fi"); var lab=el("div","",lang==="de"?x.de:x.ro); lab.style.flex="1"; lab.style.alignSelf="center";
    var inp=document.createElement("input"); inp.type="number"; inp.step="any"; inp.inputMode="decimal"; inp.value=(st.werte[i]!==undefined?st.werte[i]:x.soll); inp.style.maxWidth="90px"; inp.style.flex="none";
    inp.oninput=function(){ st.werte[i]=inp.value; };
    w.appendChild(lab); w.appendChild(inp); box.appendChild(w); inps.push([x,inp]); });
  var ex=document.createElement("textarea"); ex.rows=2; ex.placeholder=t("tkMatExtra"); ex.value=st.extra||""; ex.oninput=function(){ st.extra=ex.value; }; box.appendChild(ex);
  var ok=el("button","prob",t(st.nach?"tkMatSpeichern":"tkMatOk")); ok.style.background="var(--kommen)";
  if(st.sendet) ok.disabled=true; // wird gerade gespeichert: neu gezeichneter Knopf bleibt gesperrt (kein Doppeltipp)
  ok.onclick=function(){
    if(st.sendet) return;
    var li=inps.map(function(q){ return {i:q[0].i,de:q[0].de,e:q[0].e,soll:q[0].soll,ist:q[1].value===""?0:Number(String(q[1].value).replace(",","."))}; });
    var extra=ex.value.trim();
    if(st.nach&&!extra){ ex.focus(); return; } // Nachtrag ohne Text: nichts senden
    ok.disabled=true; st.sendet=true;
    // V34: Material UND FERTIG gehen zusammen sofort in die Warteliste (wie Fotos) und von dort der Reihe nach raus.
    // Vorher hing FERTIG nur im Arbeitsspeicher hinter der Material-Antwort: App zu → Material gebucht, FERTIG nie gesendet;
    // zweiter Tipp auf GATA in der Zwischenzeit → Material doppelt. Das Schott zeigt jetzt sofort „✓ Gata (în așteptare)“.
    var kopf=function(o){ o.action="ticket"; o.token=token; o.projekt=pr.id; o.ticket=tk.id; return o; };
    tqPush(pr,tk,kopf({was:"material",liste:li,extra:extra,nr:tk.nr,tname:tk.name,pname:pr.name})).then(function(da){
      if(!da){ st.sendet=false; ok.disabled=false; renderPlan(); return; } // Speicher voll: Dialog und Eingaben bleiben stehen
      delete matAuf[tk.id];
      if(st.nach){ renderPlan(); tqFlush(); return; }
      return tqPush(pr,tk,kopf({was:"status",status:"fertig"})).then(function(da2){
        if(!da2){ matDa[tk.id]=true; renderPlan(); } // Material liegt schon in der Warteliste: beim nächsten GATA nur noch FERTIG nachschieben
        tqFlush(); });
    });
  };
  box.appendChild(ok);
  if(st.nach){ var ab=el("button","linkbtn","✕"); ab.onclick=function(){ delete matAuf[tk.id]; renderPlan(); }; box.appendChild(ab); }
  ziel.appendChild(box); return true;
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
  matAuf={}; fEing={}; pEing={}; probAuf={}; // V34: offene Dialoge und getippte Angaben nicht zum nächsten Monteur mitnehmen
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
  navigator.serviceWorker.addEventListener("message", function(ev){ if(ev.data&&ev.data.typ==="gesendet"){ flush(); tqLoad().then(function(){
    // V34: Was der Service Worker im Hintergrund gesendet hat, auch am Schott anzeigen (neuer Stand vom Server).
    // Vorher blieb das Schott auf dem alten Stand: eben gespeicherte Felder und Haken standen wieder als offen da.
    var nachladen=!ev.data.tickets; // alter Service Worker (bis V33) nennt keine Schotts → Plan nachladen
    (ev.data.tickets||[]).forEach(function(x){ try{ if(!x||!x.tk) return;
      if(x.ticket&&tkFind(x.tk)) tkUpdate(x.tk,x.ticket);
      else if(!x.ticket){ nachladen=true; if(x.was==="status"&&tkFind(x.tk)) tkUpdate(x.tk,{status:x.status==="fertig"?"Geschottet":"zu Klären/Offen",fertigMoeglich:false}); }
    }catch(e){} });
    renderPlan(); tqFlush();
    if(nachladen&&plan){ plan._t=0; loadPlan(); } // gesendet, aber ohne neuen Stand vom Server → Plan nachladen
  }); } }); }
// Stempel aus älteren Versionen (nur localStorage) in den Hintergrund-Speicher übernehmen
queue.forEach(function(q){ stPut(q); });
document.addEventListener("visibilitychange", function(){
  if(document.visibilityState==="visible"){ flush(); tqFlush();
    // V34: App wird wieder nach vorn geholt → Plan auffrischen, wenn er nicht von heute oder älter als 10 Minuten ist
    if(plan&&token&&(Date.now()-(plan._t||0)>10*60*1000||(plan.azi&&plan.azi.datum!==dayKey(Date.now())))) loadPlan();
  } else { syncAnmelden(); } // V34: beim Weglegen der App den Hintergrund-Versand anmelden, falls noch etwas wartet
});
showPane(ls("faz_pane")||"stempel");
tqLoad().then(function(){ if(tq.length){ renderPlan(); tqFlush(); } });
setTimeout(loadPlan, 1500);
