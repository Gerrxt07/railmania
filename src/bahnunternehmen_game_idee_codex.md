# Projektidee: Europäischer Bahnunternehmen-Karrieremodus

> **Status: frühe Konzeptidee / Kontextdokument**  
> Dieses Dokument ist **kein Arbeitsauftrag**. Codex soll daraus weder selbstständig Code erzeugen noch ein Projekt initialisieren, Dateien anlegen, Abhängigkeiten installieren oder technische Entscheidungen umsetzen. Es beschreibt nur die derzeitige Spielidee, damit spätere einzelne Aufträge im richtigen Zusammenhang verstanden werden. Inhalte sind vorläufig und dürfen nach Rücksprache verändert, vereinfacht oder gestrichen werden.

## 1. Kurzbeschreibung

Geplant ist ein Management- und Simulationsspiel auf Web-Basis, später als Desktop-Spiel mit Electron. Der Spieler gründet ein eigenes Eisenbahnverkehrsunternehmen und operiert auf einer realen beziehungsweise realitätsnahen Europakarte, deren geografische und eisenbahnbezogene Grundlage aus OpenStreetMap und OpenRailwayMap stammen kann.

Der Spieler baut nicht primär neue Eisenbahninfrastruktur wie in Transport Fever. Stattdessen nutzt er größtenteils das vorhandene europäische Schienennetz und tritt als Eisenbahnverkehrsunternehmen auf. Er plant Verbindungen, beschafft Fahrzeuge, beantragt oder kauft Trassen, bezahlt Infrastruktur- und Stationsentgelte, organisiert Personal, Wartung und Abstellung und muss seine Angebote wirtschaftlich betreiben.

Die zentrale Fantasie lautet:

> Aus einem kleinen Bahnunternehmen soll durch kluge Fahrzeugwahl, realistische Linienplanung und wirtschaftliche Entscheidungen ein nationaler oder europaweit tätiger Betreiber entstehen.

Das Spiel soll Eisenbahnkenntnisse belohnen, aber auch für Spieler verständlich bleiben, die nicht jedes Strom- oder Zugsicherungssystem kennen.

## 2. Wichtige Abgrenzung

Das Spiel soll zunächst **kein** vollständiger:

- Zugfahrsimulator mit begehbaren Führerständen,
- Stellwerksimulator mit jeder realen Fahrstraße,
- Eisenbahninfrastruktur-Bausimulator,
- exakter Echtzeit-Zwilling des europäischen Bahnverkehrs,
- oder reiner Tabellen- und Fahrplaneditor

sein.

Der Fokus liegt auf Unternehmensführung, Linien- und Angebotsplanung, Fahrzeugkompatibilität und den betrieblichen Folgen von Entscheidungen. Züge sollen sichtbar und nachvollziehbar über die Karte verkehren, aber nicht vom Spieler manuell gefahren werden müssen.

## 3. Kernprinzipien

### 3.1 Vorhandene Infrastruktur statt beliebiger Gleisbau

Der Spieler nutzt das vorhandene Schienennetz. Eine neue Linie entsteht, indem ein Laufweg über existierende Strecken geplant wird. Trassenkapazität, Streckengeschwindigkeit, Elektrifizierung, Grenzübergänge und Bahnhofseigenschaften begrenzen die Möglichkeiten.

Ein späterer, begrenzter Infrastrukturausbau ist denkbar, etwa:

- Anmietung oder Bau einer Werkstatt,
- Abstellanlagen,
- Lade- oder Tankinfrastruktur,
- kleine Anschlussgleise,
- Bahnsteigverlängerungen im Rahmen eines Vertrags,
- Mitfinanzierung einer Elektrifizierung.

Freies Zeichnen kompletter Schnellfahrstrecken gehört vorerst nicht zum Kernkonzept.

### 3.2 Fahrzeuge sind konkrete, dauerhaft vorhandene Einheiten

Jedes gekaufte oder geleaste Fahrzeug soll eine eigene Identität und einen Standort besitzen. Es kann nicht gleichzeitig auf mehreren Linien eingesetzt werden. Zu berücksichtigen sind unter anderem:

- Baureihe und konkrete Konfiguration,
- Kauf- oder Leasingkosten,
- Sitz- beziehungsweise Ladekapazität,
- Höchstgeschwindigkeit und Leistung,
- Länge und Bahnsteigkompatibilität,
- elektrische Systeme oder Diesel-/Batteriebetrieb,
- vorhandene Zugsicherungssysteme,
- Länder- und Streckenzulassungen,
- Wartungszustand und Fristen,
- Zuverlässigkeit,
- Energieverbrauch,
- Innenausstattung und Komfort,
- aktueller Umlauf und Abstellort.

### 3.3 Keine einfachen Länder-Sperren

Ein Fahrzeug soll nicht nur deshalb gesperrt sein, weil auf seiner Karte kein bestimmtes Land steht. Die tatsächliche Kompatibilität ergibt sich aus mehreren Faktoren.

Beispiel: Ein ICE ist nicht grundsätzlich „in Polen verboten“. Entscheidend sind konkrete Baureihe, Stromsystem, Zugsicherung, Zulassung, Lichtraumprofil und weitere Anforderungen. Der Spieler kann fehlende Voraussetzungen gegebenenfalls durch Nachrüstung, Zulassungsverfahren, Lokwechsel oder Kooperation mit einem Partner lösen.

Spanien und Portugal können durch andere Spurweiten beziehungsweise geeignete Hochgeschwindigkeitsstrecken zusätzliche Besonderheiten bieten. Auch Stromsystemwechsel, nationale Sicherungssysteme und Tunnelanforderungen sollen spielerisch relevant sein.

### 3.4 Betrieb auf fremder Infrastruktur kostet Geld

Eine Linie verursacht nicht nur Fahrzeug- und Energiekosten. Mögliche Kostenpositionen sind:

- Trassenentgelte,
- Stations- und Bahnsteigentgelte,
- Energie oder Kraftstoff,
- Personal,
- Wartung und Reinigung,
- Abstellung,
- Rangierleistungen,
- Reserven und Ersatzfahrzeuge,
- Vertrieb und Buchungsprovisionen,
- nationale Zulassungen und Nachrüstungen,
- Fahrgastentschädigungen,
- Versicherungen und Finanzierung.

Eine stark ausgelastete Linie soll trotzdem Verlust machen können, wenn Tickets zu billig, Trassen zu teuer oder Fahrzeuge ungeeignet sind.

## 4. Kern-Gameplay-Schleife

Der wiederkehrende Spielablauf soll ungefähr so aussehen:

1. Markt, Orte und vorhandene Verkehrsangebote analysieren.
2. Eine mögliche Linie, Ausschreibung oder Sonderfahrt auswählen.
3. Nachfrage und Konkurrenz einschätzen.
4. Geeigneten Laufweg und Halte festlegen.
5. Fahrzeugbedarf und technische Kompatibilität prüfen.
6. Trassen und Bahnhofsnutzung sichern.
7. Fahrzeuge kaufen, leasen oder aus dem Bestand zuweisen.
8. Umläufe, Reserven, Wartung und Personal planen.
9. Takt, Fahrplan, Tarif und Servicekonzept festlegen.
10. Betrieb starten und auf der Karte beobachten.
11. Verspätungen, Auslastung, Kosten und Kundenzufriedenheit auswerten.
12. Angebot anpassen oder in weitere Regionen expandieren.

Codex soll bei späteren Arbeiten darauf achten, dass diese Schleife der spielerische Mittelpunkt bleibt. Einzelne realistische Systeme dürfen das Kernspiel nicht unnötig blockieren oder in reine Büroarbeit verwandeln.

## 5. Spielstart und Karriere

Der Spieler gründet ein Unternehmen mit:

- Name,
- Logo und Farbgebung,
- Unternehmenssitz,
- Heimatmarkt,
- Startkapital beziehungsweise Finanzierung,
- anfänglichen Genehmigungen,
- gewähltem Geschäftsmodell.

Mögliche Startarten:

### Regionaler Betreiber

Der Spieler startet mit wenigen Triebzügen und übernimmt kleinere regionale Leistungen oder bewirbt sich auf Verkehrsverträge. Die Einnahmen sind vergleichsweise stabil, dafür gelten Pünktlichkeits- und Qualitätsvorgaben.

### Open-Access-Fernverkehr

Der Spieler betreibt eigenwirtschaftliche Fernzüge. Er kann Preise und Angebot weitgehend selbst bestimmen, trägt aber das volle Nachfragerisiko und konkurriert mit bestehenden Verbindungen.

### Nachtzugunternehmen

Der Spieler beginnt mit Lokomotiven und gebrauchten Reisezugwagen. Internationale Zulassungen, Wagenbehandlung, Personalwechsel und passende nächtliche Trassen sind wichtiger als maximale Geschwindigkeit.

### Charter- und Sonderverkehr

Der Spieler fährt zunächst einzelne Leistungen für Veranstaltungen, Urlaubsreisen, Fußballspiele oder andere Auftraggeber. Dadurch ist ein Einstieg ohne dichten eigenen Taktverkehr möglich.

### Güterverkehr

Güterverkehr ist als späteres oder alternatives Geschäftsfeld denkbar. Er sollte nicht automatisch Teil der ersten spielbaren Version sein, da Terminals, Wagenlogistik und Ladungsverträge ein eigenes großes System bilden.

## 6. Europakarte

Die Karte soll grundsätzlich ganz Europa umfassen und verschiedene Zoomstufen bieten:

- Europaansicht für das Unternehmensnetz,
- Länder- und Regionsansicht für Marktanalysen,
- Streckenansicht für Laufwege und Engpässe,
- Bahnhofsansicht für Halte, Bahnsteige, Abstellung und Anschlüsse.

Die Karte kann reale Geografie und reale Bahnstrecken verwenden, muss aber nicht jede betriebliche Einzelheit vollständig abbilden. Fehlende oder unvollständige offene Daten sollen durch vereinfachte Spielwerte ergänzt werden können.

Relevante Karteneigenschaften sind beispielsweise:

- Städte und Bevölkerungszentren,
- touristische und wirtschaftliche Ziele,
- Bahnhöfe und Haltepunkte,
- Streckenverläufe,
- Streckengeschwindigkeiten,
- Elektrifizierung und Stromsysteme,
- Spurweiten,
- wichtige Knoten und Grenzübergänge,
- Hochgeschwindigkeitsstrecken,
- Engpässe und ungefähre Kapazitäten,
- geeignete Werkstatt- und Abstellstandorte.

Die reale Karte ist eine Grundlage für Gameplay und Atmosphäre. Sie darf nicht dazu führen, dass das Spiel nur dort funktioniert, wo OSM/ORM-Daten vollständig gepflegt wurden.

## 7. Linien- und Fahrplanplanung

Der Spieler erstellt ein Angebot aus:

- Start- und Zielbahnhof,
- Zwischenhalten,
- Laufweg,
- Betriebstagen,
- Tageszeiten,
- Takt,
- Zuglänge,
- Fahrzeugtyp,
- Komfort- und Tarifkonzept.

Vor der Eröffnung sollen Prognosen angezeigt werden:

- potenzielle Nachfrage,
- erwartete Auslastung,
- Fahrzeit,
- Konkurrenzangebote,
- Umsteigeverbindungen,
- notwendige Fahrzeuge,
- laufende Kosten,
- erwartete Einnahmen,
- technisches Risiko,
- mögliche Trassenkonflikte.

Der Spieler entscheidet zwischen schnellen, teuren Trassen und langsameren, günstigeren Möglichkeiten. Ein schneller Zug soll nur dann einen Vorteil besitzen, wenn Strecke und Fahrplan seine Geschwindigkeit tatsächlich nutzen können.

Mögliche Angebotsformen:

- einzelne Zugpaare,
- Zwei-Stunden-Takt,
- Stundentakt,
- Halbstundentakt,
- Hauptverkehrszeit-Verstärker,
- Nacht- oder Tagesrandzüge,
- Saisonverbindungen,
- Event- und Charterzüge.

## 8. Trassen und Kapazität

Trassen sollen ein wichtiges strategisches System sein, aber nicht zwingend als vollständige professionelle Fahrplankonstruktion umgesetzt werden.

Der Spieler gibt gewünschte Abfahrtszeit, Laufweg, Halte und Priorität an. Das System kann daraufhin:

- die Wunschtrasse genehmigen,
- eine zeitlich verschobene Trasse anbieten,
- einen Überholhalt einplanen,
- eine alternative Route anbieten,
- nur bestimmte Verkehrstage zulassen,
- eine Anfrage wegen Kapazitätsmangel ablehnen.

Attraktive Trassen in Hauptverkehrszeiten sollen knapp und teuer sein. Nacht- und Gütertrassen können günstiger, aber langsamer oder unzuverlässiger sein.

Noch offen ist, ob konkurrierende Unternehmen tatsächlich dieselben minutengenauen Kapazitäten belegen oder ob die Knappheit zunächst abstrahiert wird.

## 9. Fahrzeugbeschaffung

Fahrzeuge können:

- neu bestellt,
- gebraucht gekauft,
- kurz- oder langfristig geleast,
- gemietet,
- verkauft,
- an andere Unternehmen vermietet werden.

### Neufahrzeuge

Bei Neubestellungen kann der Spieler eine Plattform konfigurieren:

- Zuglänge und Wagenzahl,
- Sitzplatzaufteilung,
- erste und zweite Klasse,
- Bistro oder Restaurant,
- Familien-, Fahrrad- oder Ruhebereiche,
- Gepäckkapazität,
- Stromsysteme,
- Zugsicherungssysteme,
- Länderpakete,
- Höchstgeschwindigkeit,
- Winter- oder Tunnelpakete,
- Wartungsvertrag,
- Lackierung und Innenraum.

Mehr Ausstattung erhöht Kaufpreis, Lieferzeit, Gewicht und Wartungsaufwand. Eine zu stark spezialisierte Flotte kann bei späteren Netzänderungen unflexibel werden.

### Gebrauchtfahrzeuge

Der Gebrauchtmarkt soll dynamische Chancen bieten. Ältere Fahrzeuge sind schneller verfügbar und günstiger, können aber höhere Wartungs- und Energiekosten verursachen. Technische Untersuchungen vor dem Kauf reduzieren das Risiko versteckter Mängel.

## 10. Nachfrage und Fahrgäste

Nachfrage soll nicht nur aus Stadtgröße entstehen. Relevante Faktoren sind:

- Bevölkerungszahl und regionale Verflechtung,
- Geschäfts- und Pendlerverkehr,
- Tourismus und Veranstaltungen,
- Fahrzeit,
- Preis,
- Takt und Abfahrtslage,
- Anzahl der Umstiege,
- Zuverlässigkeit,
- Komfort,
- Konkurrenz durch andere Züge, Auto, Bus oder Flugzeug,
- passende Anschlüsse,
- Markenbekanntheit.

Mögliche Fahrgastgruppen:

- Pendler,
- preisbewusste Reisende,
- Geschäftsreisende,
- Touristen,
- Familien,
- Fahrgäste mit Fahrrad oder viel Gepäck,
- Nachtzugreisende,
- mobilitätseingeschränkte Reisende.

Die Fahrgäste müssen nicht alle als einzelne dauerhaft simulierte Personen existieren. Für das Gameplay reicht eine glaubwürdige, nachvollziehbare Nachfrageberechnung, solange Entscheidungen erkennbare Folgen haben.

## 11. Tarife und Service

Der Spieler soll ein Angebot positionieren können, beispielsweise als Billig-, Standard- oder Premiumprodukt.

Mögliche Tarif- und Serviceelemente:

- Spar- und Flextickets,
- erste und zweite Klasse,
- Reservierungen,
- Abonnements und Zeitkarten,
- Gruppen- und Familientickets,
- Fahrradmitnahme,
- WLAN,
- Bordgastronomie,
- Loungezugang,
- Anschlussgarantien,
- dynamische Preise,
- Schlaf-, Liege- und Sitzwagenangebote.

Zu viele kleinteilige Gebühren und Tarifregeln könnten unübersichtlich werden. Dieses System soll strategische Entscheidungen ermöglichen, nicht jede reale Tarifbedingung nachbilden.

## 12. Personal

Personal ist notwendig, soll aber nicht zu einem vollständigen HR-Simulator werden.

Relevante Personalgruppen können sein:

- Triebfahrzeugführer,
- Zugbegleiter,
- Bordgastronomie,
- Disponenten,
- Werkstatt- und Reinigungspersonal,
- Rangierpersonal,
- Kundenservice.

Bestimmte Qualifikationen können relevant sein:

- Fahrzeugbaureihen,
- Länder und Betriebssprachen,
- Streckenkenntnis,
- Zugsicherungssysteme,
- Hochgeschwindigkeits- oder Rangierbetrieb.

Bei internationalen Linien kann ein Personalwechsel erforderlich sein. Alternativ investiert der Spieler in zusätzliche Ausbildung. Eine knappe Personaldecke spart Geld, erhöht aber die Gefahr von Ausfällen.

Noch offen ist, ob Personal als konkrete Einzelpersonen oder überwiegend als qualifizierte Personalpools verwaltet wird. Für den Spielfluss erscheint ein Pool-System mit einzelnen wichtigen Führungskräften wahrscheinlich sinnvoller.

## 13. Umläufe, Abstellung und Wartung

Fahrzeuge verschwinden nach der Ankunft nicht. Sie benötigen einen nachvollziehbaren Umlauf:

- Ankunft,
- Wendezeit,
- Reinigung und Versorgung,
- nächste Fahrt,
- Abstellung,
- geplante Wartung,
- Reserveeinsatz.

Der Spieler soll Umläufe automatisch erstellen lassen und anschließend optimieren können. Eine ausschließlich manuelle minutengenaue Umlaufplanung könnte optionaler Expertenmodus sein.

Wartungsaspekte:

- Laufleistung und Betriebsstunden,
- planmäßige Fristen,
- technischer Zustand,
- Verschleiß und Zuverlässigkeit,
- Werkstattkapazität,
- Ersatzteile,
- Hersteller-Wartungsverträge.

Mögliche Wartungsstrategien sind reaktive, intervallbasierte oder zustandsbasierte Instandhaltung. Schlechte Wartung senkt kurzfristig Kosten, erhöht aber das Ausfallrisiko und schädigt die Reputation.

## 14. Störungen und Disposition

Der laufende Betrieb soll dynamische Ereignisse erzeugen:

- Fahrzeugstörungen,
- Infrastrukturprobleme,
- Baustellen,
- Unwetter,
- Personalausfälle,
- Streiks,
- verspätete Vorleistungen,
- überfüllte Züge,
- kurzfristige Streckensperrungen.

Der Spieler kann bei größeren Problemen entscheiden:

- warten,
- umleiten,
- Halte auslassen,
- vorzeitig wenden,
- Ersatzzug einsetzen,
- Fahrgäste umbuchen,
- Partnerunternehmen nutzen,
- Ersatzbusse oder Hotelübernachtungen organisieren.

Störungen sollen strategische Entscheidungen und Kettenreaktionen erzeugen. Sie dürfen aber nicht so häufig sein, dass sorgfältige Planung bedeutungslos wird.

## 15. Regionalverkehr und Ausschreibungen

Bestellter Regionalverkehr kann über Ausschreibungen beziehungsweise Verkehrsverträge funktionieren. Der Spieler bietet unter anderem:

- benötigten Zuschuss,
- Fahrzeugkonzept,
- Kapazität,
- Takt,
- Qualitätsniveau,
- Betriebsstart und Vertragsdauer.

Nach einem Zuschlag gelten Vorgaben zu Pünktlichkeit, Ausfällen, Kapazität und Service. Nichterfüllung führt zu Vertragsstrafen oder im Extremfall zum Vertragsverlust.

Dieses System bildet einen Gegenpol zum eigenwirtschaftlichen Fernverkehr: geringeres Nachfragerisiko, dafür weniger Freiheit und strenge Leistungspflichten.

## 16. Internationaler Betrieb

Internationale Expansion soll ein spürbarer Karriereschritt sein. Relevante Hürden können sein:

- Fahrzeugzulassung,
- Strom- und Zugsicherungssysteme,
- Spurweite,
- Personalqualifikation und Sprache,
- unterschiedliche Infrastrukturbetreiber,
- Stations- und Vertriebsverträge,
- lokale Wartungs- und Abstellmöglichkeiten.

Lösungswege:

- Mehrsystemfahrzeuge beschaffen,
- vorhandene Fahrzeuge nachrüsten,
- Lok- oder Personalwechsel an Grenzbahnhöfen,
- Fahrzeuge eines Partners nutzen,
- ein ausländisches Tochterunternehmen gründen,
- gemeinsame Linien mit anderen Betreibern anbieten.

## 17. Konkurrenz und Kooperation

Andere Bahnunternehmen sollen nicht nur dekorativ sein. Sie können:

- eigene Verbindungen anbieten,
- auf Nachfrage und Preise reagieren,
- Fahrzeuge bestellen oder verkaufen,
- Ausschreibungen gewinnen,
- unrentable Angebote einstellen,
- Partnerschaften anbieten,
- Trassenkapazität beanspruchen.

Mögliche Kooperationen:

- gegenseitige Ticketanerkennung,
- garantierte Anschlüsse,
- gemeinsamer Vertrieb,
- Fahrzeugvermietung,
- gemeinsame Werkstätten,
- Ersatzbeförderung,
- gemeinsam betriebene internationale Linien.

Noch offen ist, wie detailliert KI-Unternehmen simuliert werden. Sie sollten glaubwürdig reagieren, ohne die komplette Wirtschaft jedes europäischen Unternehmens im gleichen Detail wie das Spielerunternehmen berechnen zu müssen.

## 18. Finanzen und Unternehmensentwicklung

Mögliche Finanzierungsformen:

- Eigenkapital,
- Bankkredite,
- Leasing,
- Investoren,
- Förderprogramme,
- Verkauf und Rückleasing von Fahrzeugen,
- langfristige Verkehrsverträge als Kreditsicherheit.

Wichtige Unternehmenskennzahlen:

- Umsatz und Betriebsergebnis,
- Liquidität,
- Verschuldung,
- Fahrzeug- und Leasingverpflichtungen,
- Auslastung,
- Kosten pro Zugkilometer,
- Pünktlichkeit und Ausfallquote,
- Reputation,
- Marktanteil auf einzelnen Relationen.

Die Karriere soll nicht über ein künstliches Erfahrungspunkte-Level bestimmt werden. Fortschritt entsteht hauptsächlich durch Kapital, Wissen, Flotte, Verträge, Zulassungen, Personal und betriebliche Reichweite.

## 19. Reputation und Unternehmensprofil

Ein Unternehmen kann in mehreren Kategorien unterschiedlich wahrgenommen werden:

- Pünktlichkeit,
- Zuverlässigkeit,
- Preis-Leistung,
- Komfort,
- Kundenservice,
- Barrierefreiheit,
- Nachhaltigkeit,
- Arbeitgeberattraktivität,
- finanzielle Stabilität.

Ein Billiganbieter muss nicht denselben Komfort wie ein Premiumanbieter liefern. Er darf aber trotzdem nicht dauerhaft unzuverlässig sein. Medienereignisse und Kundenreaktionen können den Ruf beeinflussen.

## 20. Mögliche langfristige Geschäftsmodelle

Der Spieler soll sich spezialisieren oder mehrere Bereiche kombinieren können:

- Regionalverkehr,
- nationaler Fernverkehr,
- internationaler Fernverkehr,
- Hochgeschwindigkeitsverkehr,
- Nachtzüge,
- Charter- und Eventzüge,
- saisonale Urlaubszüge,
- Fahrzeugleasing,
- später eventuell Güterverkehr.

Güterverkehr, vollständige Fahrzeugvermietung und eigene Infrastrukturunternehmen sind mögliche Erweiterungen, aber noch keine verbindlichen Kernanforderungen.

## 21. Progression als mögliche Orientierung

### Frühe Phase

- ein Heimatland,
- wenige Fahrzeuge,
- gemietete Abstell- und Wartungsleistungen,
- einzelne Linien oder Aufträge,
- hohe Abhängigkeit von Leasing und Partnern.

### Mittlere Phase

- regionales Liniennetz,
- Reservefahrzeuge,
- erste größere Verkehrsverträge,
- eigene kleinere Betriebsbasis,
- mehrere Fahrzeugtypen.

### Nationale Phase

- Fernverkehr,
- größere Fahrzeugbestellungen,
- mehrere Standorte,
- eigenes Tarif- und Markenprofil,
- direkte Konkurrenz mit etablierten Betreibern.

### Internationale Phase

- Mehrsystemflotte,
- Grenzverbindungen,
- Nacht- oder Hochgeschwindigkeitsverkehr,
- ausländische Partnerschaften oder Tochterunternehmen,
- europaweite Werkstatt- und Personalplanung.

Diese Phasen sind keine starren Level. Der Spieler kann bewusst klein und spezialisiert bleiben.

## 22. Beispielhafter Start in Dortmund

Ein möglicher Spielstart dient nur zur Veranschaulichung:

- Unternehmenssitz Dortmund,
- begrenztes Startkapital,
- zwei oder drei geleaste Elektrotriebzüge,
- zunächst nur deutsche Zulassung,
- angemietete Abstellung und Wartung,
- kleiner Personalpool.

Der Spieler untersucht mögliche Angebote, etwa Dortmund–Münster, Dortmund–Köln oder später Dortmund–Eindhoven. Eine stark nachgefragte Verbindung kann wegen hoher Trassenkosten und Konkurrenz riskanter sein als eine kleinere regionale Linie.

Die erste wichtige Entscheidung könnte sein:

- vorhandene Linie zum Stundentakt verdichten,
- ein Reservefahrzeug beschaffen,
- eine zweite Linie eröffnen,
- oder Geld für internationale Ausrüstung und Zulassungen ansparen.

## 23. Schwierigkeits- und Komfortoptionen

Realismus sollte möglichst modular sein. Denkbare Einstellungen:

- vereinfachte oder detaillierte Trassenvergabe,
- automatische oder manuelle Umlaufplanung,
- vereinfachte Länderpakete oder konkrete Fahrzeugausrüstung,
- Personalpools oder einzelne Mitarbeiter,
- vereinfachte Wartung oder detaillierte Fristen,
- sichtbare Nachfragewerte oder unsichere Prognosen,
- geringe oder realistische Störungsdichte,
- vereinfachte oder detaillierte Fahrgastentschädigungen.

Damit kann das Grundspiel zugänglich bleiben, während ein Expertenmodus mehr betriebliche Tiefe bietet.

## 24. Vorläufige Alleinstellungsmerkmale

1. **Ganz Europa als zusammenhängender Betriebsraum** auf realer geografischer Grundlage.
2. **Bahnunternehmen statt Infrastrukturbauer:** Der Spieler kauft Trassen und nutzt vorhandene Strecken.
3. **Technisch nachvollziehbare Fahrzeugkompatibilität** statt pauschaler Länder-Sperren.
4. **Physisch vorhandene Fahrzeuge mit Umläufen, Standort, Wartung und Reservebedarf.**
5. **Internationale Expansion als echte betriebliche Herausforderung.**
6. **Verknüpfung aus Markt, Fahrplan, Fahrzeugwahl und Unternehmensfinanzen.**
7. **Verschiedene Unternehmensstrategien** wie Regional-, Billigfern-, Premium-, Hochgeschwindigkeits- oder Nachtverkehr.

## 25. Noch nicht festgelegte Punkte

Folgende Fragen müssen vor einer konkreten Umsetzung gemeinsam entschieden werden:

- Nur Personenverkehr zum Start oder zusätzlich Güterverkehr?
- Gegenwart als feste Epoche oder Karriere über mehrere Jahrzehnte?
- Reale Fahrzeug- und Unternehmensnamen oder fiktive Alternativen?
- Wie realitätsnah sollen Trassen und Kapazitäten sein?
- Werden KI-Unternehmen vollständig simuliert oder abstrahiert?
- Wie viel Personalverwaltung ist unterhaltsam?
- Wie detailliert werden Fahrpläne, Bahnsteige und Wenden geplant?
- Gibt es begrenzten Infrastrukturausbau?
- Können Strecken dauerhaft ausgebaut oder nur betrieblich genutzt werden?
- Wie werden unvollständige OSM-/ORM-Daten ergänzt?
- Wie stark werden nationale Vorschriften vereinfacht?
- Gibt es einen festen Kampagnenstart oder nur freie Karriere?
- Soll Multiplayer später möglich sein?
- Wie stark darf der Spieler Zeit beschleunigen?
- Wie sichtbar und grafisch detailliert werden Züge auf der Karte dargestellt?

## 26. Bewusst unverbindliche oder möglicherweise unerwünschte Ideen

Die folgenden Aspekte wurden als Möglichkeiten genannt, gelten aber ausdrücklich **nicht** als beschlossen:

- Güterverkehr,
- vollständige Ausschreibungssimulation,
- konkrete Einzelpersonen beim Personal,
- minutengenaue manuelle Fahrplankonstruktion,
- dynamische Medien- und Presseereignisse,
- Aktien, Investoren oder komplexe Konzernstrukturen,
- historische Kampagnen,
- Multiplayer,
- eigener Bau von Infrastruktur,
- detaillierte Werkstattkomponenten und Ersatzteile,
- vollständig simulierte KI-Konkurrenz in ganz Europa.

Codex darf diese Punkte in späteren Vorschlägen erwähnen, soll sie aber nicht ohne ausdrückliche Bestätigung als Anforderung behandeln.

## 27. Hinweise für spätere Arbeit mit Codex CLI

Wenn dieses Dokument einem Codex-CLI-Auftrag beigefügt wird, gelten folgende Regeln:

1. Dieses Dokument liefert **Produktkontext**, aber keinen selbstständigen Implementierungsauftrag.
2. Nur die jeweils zusätzlich formulierte Aufgabe soll bearbeitet werden.
3. Vorläufige Ideen und offene Punkte dürfen nicht stillschweigend als fest beschlossen gelten.
4. Bei Konflikten hat der aktuelle Auftrag Vorrang vor diesem Dokument.
5. Technische Architektur, Frameworks, Datenmodell und Dateistruktur müssen in einem getrennten Auftrag beschlossen werden.
6. Codex soll keine Funktionen „vorsorglich“ implementieren, die nicht Teil des aktuellen Auftrags sind.
7. Bei wesentlichen Gameplay-Entscheidungen soll Codex zuerst Varianten mit Vor- und Nachteilen nennen.
8. Reale Eisenbahndaten dürfen nicht erfunden werden. Unsichere Annahmen müssen gekennzeichnet oder überprüft werden.
9. Der erste Prototyp soll später nur einen kleinen, klar begrenzten Ausschnitt umsetzen; ganz Europa beschreibt die langfristige Produktvision.
10. Spielbarkeit und verständliche Entscheidungen sind wichtiger als maximale Regelwerksgenauigkeit.

## 28. Vorläufiges Zielbild

Das gewünschte Spiel soll sich wie ein echter Bahnunternehmen-Karrieremodus anfühlen: Der Spieler sieht Möglichkeiten im europäischen Netz, entwickelt ein passendes Angebot, beschafft die richtigen Züge und trägt die wirtschaftlichen und betrieblichen Folgen.

Es soll nicht nur darum gehen, möglichst viele Linien einzuzeichnen. Der interessante Teil liegt in den Abwägungen:

- Ist ein gebrauchter Zug günstig genug, obwohl er unzuverlässiger ist?
- Lohnt sich eine schnelle, aber teure Trasse?
- Wird ein zusätzlicher Halt mehr Fahrgäste bringen oder die Linie unattraktiv langsam machen?
- Soll ein Fahrzeug teuer für ein weiteres Land zugelassen oder an der Grenze gewechselt werden?
- Ist ein dichter Takt wertvoller als eine neue Relation?
- Wie viel Reserve kann sich das Unternehmen leisten?
- Wird eine internationale Premiumverbindung profitabler als ein stabiler Regionalvertrag?

Die Kombination dieser Entscheidungen soll die eigentliche Identität des Spiels bilden.

