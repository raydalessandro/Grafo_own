export const GRAPH_DATA = {
  nodes: [
    // ─── PERSONE ───
    {
      id: "Ray", type: "persona", label: "Ray", sub: "Fondatore & Direttore",
      details: {
        ruolo: "Fondatore & Direttore Strategico",
        reparto: "Direzione",
        competenze: "Strategia, sviluppo software, framework EAR, AI orchestration, R&D prodotto",
        decide_su: "Tutto. Ultima parola su ogni decisione strategica, prodotto e comunicazione.",
        lingua: "Italiano (primaria), Inglese (tecnico)",
        nota: "Non è un dipendente, è il fondatore. Gli agenti AI lo trattano come il decisore finale."
      }
    },
    {
      id: "Pietro", type: "persona", label: "Pietro", sub: "Comunicazione & Community",
      details: {
        ruolo: "Responsabile Comunicazione Esterna & Community Manager Internazionale",
        reparto: "Comunicazione Esterna & Vendite",
        competenze: "Comunicazione diretta, vendita, inglese fluente, energia, velocità d'azione, analisi contesti esterni, mappatura opportunità, orchestrazione comunicazione verso community e social, contributo ai flussi agentici",
        decide_su: "Contatti community, relazioni internazionali, vendita assistita, direzione strategica contenuti social",
        lingua: "Italiano, Inglese (operativo)",
        fase_attuale: "Deve entrare nelle community open-source, trovare repository coerenti, costruire alleanze",
        pattern_operativo: "Va avanti senza aspettare validazione. Tende a saltare spec. Ha bisogno di vincoli tecnici esterni. Veloce nell'esecuzione, meno nella riflessione preliminare.",
        pattern_apprendimento: "Impara per esposizione diretta e risultato concreto. La comprensione arriva dopo l'errore reale. Chiede la cosa successiva prima di metabolizzare quella attuale.",
        relazione_ai: "'Tool veloce' → in transizione verso 'collaboratore'. Dopo Workshop 2 ha parlato da solo con l'AI per un'ora. Ha colto il potenziale autonomamente.",
        leadership: "Direttore della direzione creativa, non esecutore. Va posizionato come direttore sui social — decide il cosa e il perché. Rischio: scende nel concreto e invade lo spazio operativo di Ash.",
        ruolo_esteso: "Copre tre aree — community open-source, comunicazione social esterna (direzione strategica, non esecuzione), contributo alla costruzione dei flussi agentici nel grafo in collaborazione con Ray.",
        relazione_ash: "Pietro decide il cosa e il perché sui social. Ash decide il come e lo esegue. Il confine è esplicito.",
        contributo_sistema: "Può contribuire alla definizione dei flussi agentici per la comunicazione esterna. Non è ancora un architetto del sistema — impara lavorando.",
        doc_sorgente: "OWN_Aggiornamento_Ruolo_Pietro.md — 20 Marzo 2026"
      }
    },
    {
      id: "Ash", type: "persona", label: "Ash", sub: "Contenuti & Social",
      details: {
        ruolo: "Social Media Manager & Content Creator",
        reparto: "Contenuti & Comunicazione",
        competenze: "Creatività visiva, Canva, CapCut, sensibilità estetica, impegno nel miglioramento",
        decide_su: "Contenuti social, identità visiva, calendario editoriale",
        fase_attuale: "Deve creare i primi contenuti per account OWN su Instagram e TikTok",
        pattern_operativo: "Si ferma in momenti intermedi — non resistenza, è perdita del filo del prossimo passo. Si riattiva con segnale leggero. Autonomia in crescita progressiva.",
        pattern_apprendimento: "Più lento a partire ma applica con coerenza. Apprende per deduzione dal confronto. Ha capito il meccanismo del progetto Claude facendo l'errore.",
        relazione_ai: "In fase di costruzione della fiducia nel sistema. Si avvicina al frame 'ho un team a disposizione'.",
        relazione_pietro: "Ash decide il come e lo esegue sui social. La direzione strategica (cosa e perché) viene da Pietro. Il confine è esplicito.",
        contributo_flusso: "Riceve brief multi-agente strutturati → produce contenuti calibrati su linguaggio reale della community → dà feedback diretto a Muse su formato e chiarezza dei brief.",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },

    // ─── AGENTI AI ───
    {
      id: "Athena", type: "agente", label: "Athena", sub: "Orchestratrice",
      details: {
        ruolo: "Orchestratrice Strategica",
        tipo: "Strategico — Trasversale",
        funzione: "Punto d'ingresso per Pietro e Ash. Ascolta il task, capisce chi deve farlo, indirizza all'agente giusto. Coordina flussi cross-reparto.",
        sa_fare: "Pianificazione, prioritizzazione, routing task, visione d'insieme, framework EAR",
        non_fa: "Esecuzione diretta di task operativi (li delega agli agenti specializzati)",
        supervisiona: "Archivist — valida ogni proposta prima che arrivi a Ray"
      }
    },
    {
      id: "Scout", type: "agente", label: "Scout", sub: "Ricercatore",
      details: {
        ruolo: "Ricercatore Repository & Community",
        tipo: "Operativo",
        reparto: "Community & Vendite",
        funzione: "Trova repository GitHub/Codeberg coerenti con OWN. Analizza community, identifica maintainer, valuta livello di coerenza.",
        sa_fare: "Ricerca web, analisi repository (stelle, commit, linguaggio, attività), mappatura community, valutazione coerenza con OWN",
        non_fa: "Contattare le community (Mercury), analisi tecnica profonda del codice (Forge)",
        output_tipico: "Scheda repository con nome, stelle, ultimo commit, linguaggio, maintainer principali, canali community, livello coerenza OWN",
        contributo_flusso: "Riceve osservazioni raw di Pietro → replica il pattern di osservazione su thread diversi → confronta risultati → produce output strutturato per il processamento multi-agente."
      }
    },
    {
      id: "Mercury", type: "agente", label: "Mercury", sub: "Outreach",
      details: {
        ruolo: "Drafting Messaggi & Outreach",
        tipo: "Operativo",
        reparto: "Community & Vendite",
        funzione: "Scrive bozze di messaggi per contattare community, developer, maintainer. Adatta il tono al contesto.",
        sa_fare: "Copywriting EN, etiquette community open-source, adattamento tono (Discord / email / GitHub issue)",
        non_fa: "Decidere chi contattare (Pietro con Scout), inviare messaggi (Pietro manualmente)",
        stato_operativo: "Standby — in attesa di autorizzazioni outreach",
        contributo_flusso: "Quando autorizzazioni disponibili: fornisce benchmark di tono autentico e story angles validati esternamente."
      }
    },
    {
      id: "Muse", type: "agente", label: "Muse", sub: "Contenuti Social",
      details: {
        ruolo: "Ideatrice Contenuti & Copywriter Social",
        tipo: "Operativo",
        reparto: "Contenuti & Comunicazione",
        funzione: "Genera idee per contenuti social, scrive copy per IG/TikTok/blog, applica le 7 tecniche di deprogrammazione.",
        sa_fare: "Ideazione creativa, copywriting IT, format social (reel, carousel, post, story), 7 tecniche psyop, tono OWN",
        non_fa: "Design visivo (suggerisce direzione ma non genera immagini), decisioni editoriali (quelle sono di Ash)",
        output_tipico: "Idee contenuto con hook + format + tecnica utilizzata + copy bozza",
        contributo_flusso: "Riceve quote emotive reali → valida quali sono hook sociali forti → propone format e tecnica di deprogrammazione → produce brief per Ash."
      }
    },
    {
      id: "Forge", type: "agente", label: "Forge", sub: "Analista Tecnico",
      details: {
        ruolo: "Analista Tecnico Prodotti",
        tipo: "Operativo",
        reparto: "R&D (anche per workshop)",
        funzione: "Ricerca e analisi tecnica prodotti wearable, valutazione compatibilità, confronti, schede prodotto.",
        sa_fare: "Analisi hardware, firmware, BLE, sicurezza, open-source licensing, confronti, pricing",
        non_fa: "Scrivere copy di vendita (Quill), decisioni su catalogo (Ray)",
        output_tipico: "Scheda tecnica prodotto con specifiche, pro/contro, rischi, compatibilità, prezzo, raccomandazione",
        contributo_flusso: "Riceve claims tecnici emersi dalle osservazioni community → valuta rilevante/non rilevante con motivazione in ~30 secondi → output binario che alimenta il brief per Ash."
      }
    },
    {
      id: "Quill", type: "agente", label: "Quill", sub: "Copywriter",
      details: {
        ruolo: "Copywriter Prodotti & Schede",
        tipo: "Operativo",
        reparto: "Contenuti (anche per workshop)",
        funzione: "Scrive descrizioni prodotto per e-commerce, caption social specifiche per prodotti, schede comparative.",
        sa_fare: "Copywriting prodotto IT/EN, tono OWN, struttura beneficio-prima-feature-dopo, SEO base",
        non_fa: "Analisi tecnica (Forge), ideazione contenuti editoriali (Muse)",
        output_tipico: "Descrizione prodotto pronta per Shopify/sito, con varianti per social se richiesto",
        contributo_flusso: "Attivato solo se contenuto ha potenziale commerciale. Standby nella fase attuale."
      }
    },
    {
      id: "Archivist", type: "agente", label: "Archivist", sub: "Custode Grafo",
      details: {
        ruolo: "Custode e Aggiornatore del Grafo OWN",
        tipo: "Operativo con funzione di controllo qualità",
        reparto: "Trasversale",
        supervisione: "Athena — ogni aggiornamento proposto passa per validazione Athena prima della conferma di Ray",
        funzione: "Riceve documenti del team, estrae nodi/archi/attributi, segnala contraddizioni e gap, propone aggiornamenti.",
        sa_fare: "Lettura e interpretazione documenti OWN, mappatura informazioni in formato grafo, rilevamento contraddizioni, identificazione gap informativi",
        non_fa: "Modificare il grafo autonomamente, interpretare strategicamente (registra fatti non opinioni)",
        flusso: "documento → Archivist estrae → Athena valida → Ray conferma → grafo aggiornato",
        contributo_flusso: "Riceve report strutturati di Pietro → estrae pattern universali, vocabolario target, best practices → alimenta la memoria del sistema."
      }
    },

    // ─── VISIONE ───
    {
      id: "Visione_5_Anni", type: "visione", label: "Visione 5 Anni", sub: "2026-2031",
      details: {
        principio: "Il grafo come azienda, non come documentazione",
        orizzonte: "2026-2031",
        stato: "Attiva — guida decisioni oggi, non ancora operativa come sistema completo",
        struttura_target: "Umani parlano con Athena → intervengono solo su eccezioni → agenti esecutori autonomi con confini chiari dal grafo",
        crescita: "Per sovrapattern — ciclo mensile di estrazione pattern dalle chat (API Anthropic + Qdrant)",
        ciclo: "1. Operatività manuale → 2. Documento team → 3. Archivist estrae → 4. Athena valida → 5. Ray conferma → 6. Grafo aggiornato → 7. Automazione progressiva → ripeti",
        tempistica: "Rispettare i tempi naturali — 2-6 mesi per ciclo. Non forzare l'automazione prima che il pattern sia consolidato.",
        vantaggio: "Portabilità totale via JSON. Memoria organizzativa che non dimentica. Scala senza crescita proporzionale di headcount. Chi ha il contesto più denso vince.",
        doc_sorgente: "OWN_Visione_5_Anni.md — 19 Marzo 2026"
      }
    },

    // ─── PROGETTO OWN ───
    {
      id: "OWN", type: "progetto", label: "OWN", sub: "Open Wearable Network",
      details: {
        nome_completo: "Open Wearable Network",
        claim: "Own Your Tech",
        firma: "by EAR Lab",
        missione: "Primo network europeo di wearable open-source, privacy-first",
        fase_attuale: "Pre-lancio (Fase 1 — Online)",
        stato: "Workshop team in corso, primi contenuti social in preparazione, prodotti in ricerca"
      }
    },
    {
      id: "Fase_Attuale", type: "progetto", label: "Workshop + Pre-lancio", sub: "Fase attuale",
      details: {
        priorita_pietro: "1. Community: trovare 5+ repository coerenti, primi contatti. 2. Social (direzione): definire con Muse il cosa e il perché. 3. Flussi agentici: collaborare con Ray.",
        priorita_ash: "Creare account OWN su IG/TikTok, primi 5-10 contenuti filosofici, costruire seguito",
        priorita_ray: "Testare hardware Kit Zero, sviluppare app OWN Companion, supervisione team",
        priorita_workshop: "Completare negozio Shopify test (prodotti + copy + social + prima vendita)",
        prossimo_test: "Pietro + Scout su Gadgetbridge — lunedì 24 Marzo 2026"
      }
    },

    // ─── PRODOTTI ───
    {
      id: "Colmi_R02", type: "prodotto", label: "Colmi R02", sub: "Smart Ring",
      details: {
        tipo: "Smart Ring",
        prezzo_acquisto: "~€20",
        prezzo_vendita: "€45-55",
        open: "Hackabile via BLE + Gadgetbridge",
        nota: "Entry-level Kit Zero, HR inaccurato ma SpO2 buono"
      }
    },
    {
      id: "PineTime", type: "prodotto", label: "PineTime", sub: "Smartwatch",
      details: {
        tipo: "Smartwatch",
        prezzo_acquisto: "~€30",
        prezzo_vendita: "€50-55",
        open: "Full open HW+SW, InfiniTime",
        nota: "Entry-level Kit Zero, no sleep tracking nativo, solo Android"
      }
    },
    {
      id: "Bangle_js_2", type: "prodotto", label: "Bangle.js 2", sub: "Smartwatch",
      details: {
        tipo: "Smartwatch",
        prezzo_acquisto: "~€85",
        prezzo_vendita: "€120-130",
        open: "Full open HW+SW, JavaScript, 543+ app",
        nota: "Premium Kit Zero, GPS, 4 settimane batteria"
      }
    },
    {
      id: "Brilliant_Halo", type: "prodotto", label: "Brilliant Halo", sub: "Smart Glasses",
      details: {
        tipo: "Smart Glasses",
        prezzo_acquisto: "~€280",
        prezzo_vendita: "€380-420",
        stato: "Pre-order, shipping Q1 2026",
        open: "Full open HW+SW, Lua + Zephyr",
        nota: "Flagship, lenti correttive, sinergia ottica"
      }
    },
    {
      id: "Omi", type: "prodotto", label: "Omi", sub: "AI Pendant",
      details: {
        tipo: "AI Pendant",
        prezzo_acquisto: "~€65",
        prezzo_vendita: "€95-110",
        open: "Open SW + HW dev kit",
        nota: "Cloud-first di default, configurazione local possibile"
      }
    },
    {
      id: "Meshtastic", type: "prodotto", label: "Meshtastic", sub: "LoRa Mesh",
      details: {
        tipo: "Software / Ecosistema LoRa mesh",
        stato: "Nel perimetro OWN — da sviluppare",
        filosofia: "Comunicazione decentralizzata, offline, senza server — coerente con OWN privacy-first",
        sinergia: "Community PINE64 (canale #lora), possibile catalogo hardware compatibile",
        gap_residuo: "Hardware compatibile, app, community, pricing — task per Forge",
        decisione: "Ray — 17 Marzo 2026"
      }
    },

    // ─── STRUMENTI (Software) ───
    {
      id: "Gadgetbridge", type: "strumento", label: "Gadgetbridge", sub: "App Android",
      details: {
        tipo: "Software",
        funzione: "App Android open-source che sostituisce app proprietarie wearable",
        stato: "Attivo, community Codeberg",
        nota: "Pilastro del posizionamento OWN, solo Android"
      }
    },
    {
      id: "InfiniTime", type: "strumento", label: "InfiniTime", sub: "Firmware",
      details: {
        tipo: "Firmware",
        funzione: "Firmware open-source per PineTime",
        stato: "v1.16.0 'Starfruit' — 6 Gennaio 2026, stabile",
        dato_strategico: "InfiniTime ha rimosso NRFConnect (closed source) dai companion app consigliati e raccomanda esplicitamente Gadgetbridge. Allineamento di valori con OWN confermato.",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },

    // ─── SERVIZI ───
    {
      id: "Lenti_Correttive_Halo", type: "servizio", label: "Lenti Correttive", sub: "Servizio Ottico",
      details: {
        tipo: "Servizio ottico",
        prodotto_collegato: "Brilliant Halo",
        stato: "Confermato come posizionamento — non ancora operativo",
        nota: "OWN può comunicare la disponibilità futura ma non può ancora venderlo. Mercury può usarlo come leva con linguaggio non vincolante.",
        decisione: "Ray — 17 Marzo 2026"
      }
    },

    // ─── CANALI ───
    {
      id: "LinkedIn_OWN", type: "canale", label: "LinkedIn OWN", sub: "Canale ufficiale",
      details: {
        tipo: "Canale ufficiale OWN — comunicazione filosofica e posizionamento",
        gestore: "Pietro (direzione editoriale e pubblicazione)",
        produttore_contenuti: "Ray (saggi su commissione di Pietro)",
        tono: "Filosofico, educativo, privacy-first — diverso da IG/TikTok",
        target: "Professionisti, decision maker, settore tech e wearable",
        obiettivo: "Costruire autorevolezza OWN su privacy, dati, wearable open — prima del lancio",
        stato: "Attivo da subito — fase pre-lancio",
        meccanismo: "Pietro osserva community → individua temi → commissiona saggio a Ray → pubblica su LinkedIn OWN",
        doc_sorgente: "OWN_Aggiornamento_LinkedIn_Community_v2-1.md — 20 Marzo 2026"
      }
    },

    // ─── COMMUNITY ───
    {
      id: "Gadgetbridge_C", type: "community", label: "Gadgetbridge", sub: "Matrix",
      details: {
        piattaforma: "Matrix (#gadgetbridge:matrix.org)",
        accesso: "Account Element X creato — dentro, osservando",
        tono: "Tecnico ma accessibile, community di sviluppatori e appassionati",
        strategia: "Contribuire prima (guide, traduzioni, bug report), presentarsi dopo",
        posizionamento: "OWN è il primo retailer europeo che preinstalla e supporta ufficialmente Gadgetbridge",
        contatto_principale: "Jose_Rebelo (@joserebelo:matrix.org) — contributor, risponde a tutto, punto di riferimento",
        altri_contatti: "LjL (tecnico BLE avanzato), arjan5 (esperto doc ufficiale), fedilibre (profilo privacy target), Elemento02 (bug reporter CMF Watch 2 Pro)",
        temi_osservati: "Privacy Health Connect, GB come firewall, interoperabilità dati (import da Garmin possibile non viceversa), bug attivi CMF Watch 2 Pro",
        prossimo_step: "Mercury costruisce messaggio per Jose Rebelo",
        azione_ray: "Code review repo Gadgetbridge con Claude Code per trovare issue reali da postare tramite Pietro",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "Brilliant_Labs_C", type: "community", label: "Brilliant Labs", sub: "Discord 13.194",
      details: {
        piattaforma: "Discord — 13.194 membri",
        accesso: "Account Discord personale Pietro — dentro, osservando",
        aggiornamento_critico: "Ritardo produzione (16 Marzo 2026) — problema tecnico fabbrica. Build Foxconn slittato di ~1 settimana.",
        contatto_principale: "bobak (team BL senior — risponde ogni giorno, umano e diretto)",
        altri_contatti: "chapoya BL (team, supporto tecnico), hjbaard (utente EU Olanda), Spicy_Nandos (early adopter), Darye (utente EU Spagna, studia IVA + dogane)",
        opportunita_1: "Rivenditore europeo Halo — domanda esplicita senza risposta",
        opportunita_2: "Lenti correttive — pain point reale, team BL indica ottico locale come soluzione. OWN è quella soluzione.",
        temi_nuovi: "Prezzi europei (Halo $349 → €400-550), community creativa (app custom su GitHub), caso d'uso emotivo",
        timing: "Finestra strategica ancora aperta — costruire relazione con bobak ORA prima del lancio di massa",
        prossimo_step: "Mercury costruisce messaggio per bobak (lenti correttive, linguaggio non vincolante)",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "PINE64_C", type: "community", label: "PINE64", sub: "Forum+Discord 29k",
      details: {
        piattaforma: "Forum (forum.pine64.org) + Discord",
        membri: "14.589 Discord · 29.914 forum",
        accesso: "Account PityPietro — canale #pinetime già sbloccato per scrittura",
        struttura_discord: "#pinetime, #pinetime-dev, #pinebuds, #lora (sinergia Meshtastic). InfiniTime NON ha Discord separato.",
        cliente_tipo: "may (FOX) — utente normale, ha PineTime, usa Gadgetbridge, cerca guida → profilo TARGET",
        persone_chiave: "Gary (moderatore/esperto), muesli (developer firmware), ElectrOLyte (developer watchfaces), DSCRM (PineTime morto — opportunità), mark9064 (utente regolare)",
        tono: "Casual, amichevole, paziente con nuovi — ideale per approccio OWN",
        opportunita: "Supporto italiano, setup Gadgetbridge, sinergia Meshtastic (canale #lora), thread DSCRM per primo intervento concreto",
        prossimo_step: "Mercury costruisce messaggio per PINE64 (leva: supporto italiano, credibilità DSCRM)",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "Open_Ring_C", type: "community", label: "Open Ring", sub: "GitHub 131",
      details: {
        piattaforma: "GitHub (stawiski/open-ring)",
        stelle: "131",
        ultimo_commit: "Luglio 2025",
        autori: "Mikolaj Stawiski, Joel Meredith (Australia)",
        stato: "In pausa — da monitorare mensile",
        motivo: "Firmware non rilasciato, nessuna community attiva",
        trigger: "Nuovo commit o rilascio firmware → avvisare Ray immediatamente. OWN potrebbe essere il primo punto vendita al mondo."
      }
    },
    {
      id: "Meshtastic_Discord_C", type: "community", label: "Meshtastic", sub: "Discord 47.543",
      details: {
        piattaforma: "Discord — 47.543 membri",
        stato: "Esplorata — non prioritaria per questa fase",
        coerenza_own: "MEDIA futura — filosofia allineata, pubblico diverso",
        valutazione: "Maker che costruiscono hardware da soli, non cercano un retailer. Quasi zero europei italiani. Community più silenziosa rispetto al passato.",
        sinergia_futura: "Canale #lora già presente nel Discord PINE64 — collegamento naturale quando OWN espanderà catalogo",
        raccomandazione: "Non prioritaria ora. Riaprire quando catalogo OWN si espande.",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "InfiniTime_GitHub_C", type: "community", label: "InfiniTime", sub: "GitHub 3.2k",
      details: {
        piattaforma: "GitHub (InfiniTimeOrg/InfiniTime)",
        stats: "3.200 stelle | 1.100 fork | 330k download firmware | 51 release | 157 contributors",
        release_attuale: "v1.16.0 'Starfruit' — 6 Gennaio 2026",
        licenza: "GPL-3.0",
        maintainer_chiave: "JF002 (Fondatore, ancora attivo), kieranc (ultimo commit Marzo 2026), Lup_Yuen_Lee (Rust, bootloader, Flutter companion)",
        stack: "FreeRTOS + LVGL + NimBLE + JetBrains Mono",
        companion_apps: "Gadgetbridge (Android), InfiniLink (iOS), Amazfish (SailfishOS), Siglo e WatchMate (Linux)",
        dato_strategico: "Ha rimosso NRFConnect (closed source) e raccomanda esplicitamente Gadgetbridge. Citabile come conferma indipendente allineamento OWN.",
        nota: "Community coincide con PINE64 (canali #pinetime nel Discord PINE64) — presidiare tramite PINE64",
        coerenza_own: "ALTA — firmware del PineTime che OWN vende nel Kit Zero",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "AsteroidOS_C", type: "community", label: "AsteroidOS", sub: "Matrix",
      details: {
        piattaforma: "Matrix (canale non criptato — messaggi visibili da subito)",
        stato: "Analizzata — non prioritaria",
        coerenza_own: "BASSA — hardware incompatibile con catalogo OWN",
        motivo: "Gira su smartwatch WearOS di seconda mano. OWN non vende questi device.",
        persone_chiave: "beroset (maintainer senior), PureTryOut (migrazione Qt6), moWerk (contributor + YouTube), dodoradio (build system)",
        trigger_rivalutazione: "Se AsteroidOS porta supporto a device acquistabile nuovo.",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },
    {
      id: "Reddit_C", type: "community", label: "Reddit Ecosistema", sub: "Multi-subreddit",
      details: {
        tipo: "Ecosistema multi-subreddit",
        metodo_analisi: "11 ricerche + 6 thread analizzati — 20 Marzo 2026",
        subreddit_principale: "r/Gadgetbridge — 800 visitatori/sett, post quotidiani, attivo",
        subreddit_prioritari: "r/BuyFromEU (672k vis/sett), r/privacy (907k), r/GrapheneOS (90k), r/PrivacyGuides (92k), r/pinetime, r/PINE64official",
        vuoto_piu_grande: "r/BuyFromEU: thread 'Any EU made smart watches?' (177 upvote, 100 commenti) — nessuno nomina PineTime, Bangle.js o GB",
        hook_per_muse: "'I feel weird not being able to look at the code of something that is literally tracking how my body exists' — r/privacy, 19 upvote",
        regole_ingaggio_mai: "Account OWN branded, link al sito prima che sia online, 'compra da noi', stesso messaggio su più subreddit",
        regole_ingaggio_sempre: "Pietro usa account personale, risponde come esperto, prima si è utili poi si introduce OWN",
        stato: "Analizzata — azioni attivabili solo dopo lancio sito OWN",
        doc_sorgente: "OWN_Community_Report_v2.0 — 20 Marzo 2026"
      }
    },

    // ─── FLUSSI ───
    {
      id: "Catena_Pietro_Ash", type: "flusso", label: "Catena Pietro-Ash", sub: "Flusso principale",
      details: {
        tipo: "Flusso operativo principale",
        stato: "In test — fase manuale controllata",
        descrizione: "Pietro osserva community → Scout replica e struttura → processamento multi-agente parallelo (Muse, Forge, Archivist; Mercury e Quill standby) → brief strutturati → Ash produce contenuti",
        input: "Osservazioni community — quote emotive, specifiche tecniche, pattern comportamentali",
        output: "Contenuti social calibrati su linguaggio reale della community",
        fase_successiva: "Automazione progressiva via API Discord/Reddit",
        doc_sorgente: "2026-03-24_riunione-di-gruppo.md — 24 Marzo 2026"
      }
    },
    {
      id: "Processamento_Multi_Agente", type: "flusso", label: "Multi-Agente", sub: "Elaborazione parallela",
      details: {
        tipo: "Elaborazione parallela osservazioni community",
        input: "Raw observations da Pietro/Scout",
        output: "Brief strutturati per Ash",
        modalita: "Parallela — ogni agente elabora la propria dimensione simultaneamente",
        agenti_attivi: "Muse (hook emotivi e format), Forge (validazione claims tecnici ~30s), Archivist (pattern universali e vocabolario)",
        agenti_standby: "Mercury (benchmark tono), Quill (copy conversione)",
        doc_sorgente: "2026-03-24_riunione-di-gruppo.md — 24 Marzo 2026"
      }
    },
    {
      id: "Screenshot_Analysis_Auto", type: "flusso", label: "Screenshot Auto", sub: "Automazione futura",
      details: {
        stato: "Da implementare — fase futura",
        metodo: "API Discord, API Reddit",
        obiettivo: "Riduzione intervento umano nel passaggio osservazioni → Scout",
        blocco_attuale: "Autorizzazioni e setup tecnico"
      }
    },

    // ─── TARGET & COMPETITOR ───
    {
      id: "Target_Community_OS", type: "target", label: "Community Open Source", sub: "Developer & Maintainer",
      details: {
        chi: "Sviluppatori e maintainer di progetti wearable open (Gadgetbridge, Brilliant Labs, Pine64, Open Ring)",
        perche: "Legittimazione, traffico qualificato, potenziali contributor all'app OWN",
        approccio: "'Vogliamo portare il vostro lavoro alle persone normali' — mai vendere, sempre proporre valore",
        responsabile: "Pietro (via Scout + Mercury)"
      }
    },
    {
      id: "Target_Giovani", type: "target", label: "Giovani Tech-Aware", sub: "18-35 anni",
      details: {
        chi: "18-35 anni, sensibili a privacy, attivi su TikTok/IG, attratti da self-improvement",
        perche: "Primo mercato consumer per Kit Zero",
        approccio: "Contenuti di deprogrammazione (7 tecniche), 'Own Your Tech' come identità",
        responsabile: "Ash (via Muse)"
      }
    },
    {
      id: "Competitor_SV", type: "competitor", label: "Salmoiraghi & Vigano", sub: "Competitor implicito",
      details: {
        chi: "Catena ottica EssilorLuxottica, vende Ray-Ban Meta",
        posizionamento: "Occhiali moda + smart glasses chiusi come accessorio",
        debolezza: "Non capiscono cosa sono i wearable, vendono un solo prodotto Meta, zero servizio tech post-vendita",
        nostra_posizione: "Mai nominare, mai attaccare. Esistiamo come alternativa. Il confronto parla da solo."
      }
    },

    // ─── PATTERN OPERATIVI ───
    {
      id: "Pattern_Osservazione", type: "pattern", label: "Osservazione Community", sub: "Pattern Pietro",
      details: {
        responsabile: "Pietro",
        durata_minima: "Una settimana per community",
        output: "Quote emotive, specifiche tecniche, pattern comportamentali",
        community_attive: "Gadgetbridge, Brilliant_Labs, PINE64",
        metodo: "Osservazione passiva → raccolta dati strutturati → passaggio a Scout per replica e validazione",
        doc_sorgente: "2026-03-24_riunione-di-gruppo.md — 24 Marzo 2026"
      }
    },
    {
      id: "Pattern_Timing_Autonomo", type: "pattern", label: "Timing Azione Autonoma", sub: "3 segnali convergenti",
      details: {
        tipo: "Pattern decisionale operativo",
        trigger: "3 segnali convergenti: 1. Forge: claim tecnico validato. 2. Muse: hook emotivo forte. 3. Archivist: timing coerente con pattern grafo.",
        risultato: "Pietro decide e agisce senza aspettare Ray",
        stato: "Da testare — non ancora validato in produzione",
        doc_sorgente: "2026-03-24_riunione-di-gruppo.md — 24 Marzo 2026"
      }
    },

    // ─── PATTERN SISTEMA ───
    {
      id: "Pattern_Workshop", type: "pattern", label: "Pattern Workshop", sub: "Principi operativi",
      details: {
        principio_1: "L'errore come acceleratore — il workshop è costruito perché gli errori costino zero e insegnino massimo.",
        principio_2: "Il risultato concreto come motivatore — la comprensione arriva dopo il risultato, non prima.",
        principio_3: "Autonomia progressiva come obiettivo — il team deve saper usare il sistema senza Ray presente ogni ora.",
        principio_4: "Workshop come backtest — non è parallelo a OWN, è il rodaggio del team che opererà su OWN.",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },

    // ─── STRUMENTI WORKFLOW ───
    {
      id: "Claude_Code", type: "strumento", label: "Claude Code", sub: "AI Coding",
      details: {
        tipo: "Agente AI per coding",
        funzione: "Sviluppo software assistito da AI, analisi repository, code review",
        usato_da: "Ray (primario), Pietro (workshop)",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "Shopify", type: "strumento", label: "Shopify", sub: "E-commerce",
      details: {
        tipo: "Piattaforma e-commerce",
        funzione: "Negozio test dropshipping wearable e tech gadget",
        nota: "Negozio test — non branded OWN. Obiettivo: validare team, flussi, prodotti prima del lancio vero.",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "DSers", type: "strumento", label: "DSers", sub: "Dropshipping",
      details: {
        tipo: "App integrazione dropshipping",
        funzione: "Integrazione AliExpress → Shopify per gestione ordini",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "AliExpress", type: "strumento", label: "AliExpress", sub: "Marketplace",
      details: {
        tipo: "Marketplace / fonte prodotti",
        funzione: "Ricerca e sourcing prodotti per dropshipping nel negozio test",
        nota: "Sunsky-online.com è il fornitore preferito per MOQ 1 e integrazione Shopify",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "ChatGPT", type: "strumento", label: "ChatGPT", sub: "AI",
      details: {
        tipo: "AI generativa",
        funzione: "Ricerca approfondita prodotti (deepsearch), supporto contenuti",
        usato_da: "Ash (primario)",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "Grok", type: "strumento", label: "Grok", sub: "AI Immagini",
      details: {
        tipo: "AI generativa",
        funzione: "Generazione immagini e video",
        usato_da: "Team",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "Canva", type: "strumento", label: "Canva", sub: "Design",
      details: {
        tipo: "Design visivo",
        funzione: "Creazione visual per contenuti social OWN",
        usato_da: "Ash (primario)",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "CapCut", type: "strumento", label: "CapCut", sub: "Video",
      details: {
        tipo: "Editor video",
        funzione: "Montaggio video per contenuti social (TikTok, Instagram Reels)",
        usato_da: "Ash (primario)",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },

    // ─── PRINCIPI (MANIFESTO) ───
    {
      id: "Principio_1", type: "principio", label: "Essenza — Distinzione", sub: "Codice aperto, dati locali",
      details: {
        testo: "La tech che indossi è tua. Codice aperto, dati locali, nessun server obbligatorio.",
        filtro: "'Restituisce potere al cliente, o lo toglie?'"
      }
    },
    {
      id: "Principio_2", type: "principio", label: "Armonia — Relazione", sub: "Nessun intermediario",
      details: {
        testo: "Tra te e la tua tecnologia, nessun intermediario nascosto. Rapporto diretto, trasparente, reciproco.",
        filtro: "'Ogni interazione deve lasciare la persona più autonoma di prima.'"
      }
    },
    {
      id: "Principio_3", type: "principio", label: "Risonanza — Processo", sub: "Community > Corporation",
      details: {
        testo: "La community costruisce meglio di qualsiasi corporation. Il network aperto amplifica il valore per tutti.",
        filtro: "'Se il network cresce, noi cresciamo. Se noi cresciamo ma il network no, stiamo sbagliando.'"
      }
    },
  ],

  edges: [
    // ─── Gerarchia ───
    { source: "Ray", target: "Pietro", label: "dirige" },
    { source: "Ray", target: "Ash", label: "dirige" },
    { source: "Ray", target: "Athena", label: "supervisiona" },
    { source: "Ray", target: "Forge", label: "usa diretto" },
    { source: "Ray", target: "Quill", label: "usa diretto" },
    { source: "Pietro", target: "Scout", label: "gestisce" },
    { source: "Pietro", target: "Mercury", label: "gestisce" },
    { source: "Ash", target: "Muse", label: "gestisce" },
    { source: "Athena", target: "Scout", label: "coordina" },
    { source: "Athena", target: "Mercury", label: "coordina" },
    { source: "Athena", target: "Muse", label: "coordina" },
    { source: "Athena", target: "Forge", label: "coordina" },
    { source: "Athena", target: "Quill", label: "coordina" },
    { source: "Athena", target: "Archivist", label: "supervisiona" },

    // ─── Relazioni tra persone ───
    { source: "Pietro", target: "Ash", label: "collabora con" },
    { source: "Pietro", target: "Ash", label: "dirige direzione social" },
    { source: "Pietro", target: "Ray", label: "collabora flussi agentici" },

    // ─── Flussi operativi ───
    { source: "Scout", target: "Mercury", label: "fornisce target" },
    { source: "Forge", target: "Quill", label: "fornisce analisi" },
    { source: "Forge", target: "Muse", label: "fornisce novità" },
    { source: "Muse", target: "Quill", label: "fornisce idea" },
    { source: "Archivist", target: "Athena", label: "proposta a" },
    { source: "Athena", target: "Ray", label: "conferma da" },

    // ─── Flusso Catena Pietro-Ash ───
    { source: "Pietro", target: "Catena_Pietro_Ash", label: "alimenta" },
    { source: "Scout", target: "Processamento_Multi_Agente", label: "struttura per" },
    { source: "Muse", target: "Catena_Pietro_Ash", label: "hook validator" },
    { source: "Forge", target: "Catena_Pietro_Ash", label: "validazione tecnica" },
    { source: "Archivist", target: "Catena_Pietro_Ash", label: "pattern extractor" },
    { source: "Processamento_Multi_Agente", target: "Ash", label: "produce brief per" },
    { source: "Catena_Pietro_Ash", target: "Screenshot_Analysis_Auto", label: "evolverà in" },

    // ─── Flussi cross-reparto (coordinati da Athena) ───
    { source: "Scout", target: "Athena", label: "scopre repo" },
    { source: "Athena", target: "Muse", label: "informa" },
    { source: "Forge", target: "Athena", label: "valida prodotto" },
    { source: "Athena", target: "Quill", label: "informa" },
    { source: "Mercury", target: "Athena", label: "partnership attiva" },

    // ─── Prodotti & Servizi ───
    { source: "PINE64_C", target: "Meshtastic", label: "sinergia attiva" },
    { source: "OWN", target: "Meshtastic", label: "perimetro confermato" },
    { source: "Brilliant_Halo", target: "Lenti_Correttive_Halo", label: "servizio futuro" },
    { source: "OWN", target: "Lenti_Correttive_Halo", label: "offrirà" },
    { source: "InfiniTime", target: "Gadgetbridge", label: "raccomanda ufficialmente" },

    // ─── Community → Prodotti/Strumenti ───
    { source: "InfiniTime_GitHub_C", target: "InfiniTime", label: "sviluppa" },
    { source: "Meshtastic_Discord_C", target: "Meshtastic", label: "community di" },

    // ─── LinkedIn ───
    { source: "Pietro", target: "LinkedIn_OWN", label: "gestisce editorialmente" },
    { source: "Ray", target: "LinkedIn_OWN", label: "produce contenuti per" },
    { source: "OWN", target: "LinkedIn_OWN", label: "presenza ufficiale" },

    // ─── Community analizzate ───
    { source: "Pietro", target: "Gadgetbridge_C", label: "entrato" },
    { source: "Pietro", target: "Brilliant_Labs_C", label: "entrato" },
    { source: "Pietro", target: "PINE64_C", label: "entrato" },
    { source: "Pietro", target: "Open_Ring_C", label: "monitora" },
    { source: "Pietro", target: "Meshtastic_Discord_C", label: "analizzata" },
    { source: "Pietro", target: "InfiniTime_GitHub_C", label: "analizzata" },
    { source: "Pietro", target: "AsteroidOS_C", label: "analizzata" },
    { source: "Pietro", target: "Reddit_C", label: "analizzata" },
    { source: "Brilliant_Labs_C", target: "Brilliant_Halo", label: "opportunità retailer" },

    // ─── Visione ───
    { source: "Visione_5_Anni", target: "OWN", label: "guida evoluzione" },
    { source: "Visione_5_Anni", target: "Pietro", label: "ridefinirà ruolo" },
    { source: "Visione_5_Anni", target: "Ash", label: "ridefinirà ruolo" },
    { source: "Visione_5_Anni", target: "Athena", label: "potenziamento" },
    { source: "Visione_5_Anni", target: "Archivist", label: "potenziamento" },
    { source: "Visione_5_Anni", target: "Scout", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Mercury", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Muse", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Forge", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Quill", label: "automatizzerà" },

    // ─── Principi → OWN ───
    { source: "Principio_1", target: "OWN", label: "principio guida" },
    { source: "Principio_2", target: "OWN", label: "principio guida" },
    { source: "Principio_3", target: "OWN", label: "principio guida" },
  ]
}

export const TYPE_CONFIG = {
  persona:    { color: "#4F8EF7", label: "Persona",    emoji: "👤" },
  agente:     { color: "#A855F7", label: "Agente AI",  emoji: "🤖" },
  visione:    { color: "#F59E0B", label: "Visione",    emoji: "🌟" },
  progetto:   { color: "#F97316", label: "Progetto",   emoji: "🏢" },
  prodotto:   { color: "#10B981", label: "Prodotto",   emoji: "📦" },
  servizio:   { color: "#06B6D4", label: "Servizio",   emoji: "🔧" },
  community:  { color: "#EF4444", label: "Community",  emoji: "🌐" },
  canale:     { color: "#3B82F6", label: "Canale",     emoji: "📡" },
  strumento:  { color: "#6B7280", label: "Strumento",  emoji: "⚙️" },
  flusso:     { color: "#8B5CF6", label: "Flusso",     emoji: "🔄" },
  target:     { color: "#22C55E", label: "Target",     emoji: "🎯" },
  competitor: { color: "#DC2626", label: "Competitor",  emoji: "⚔️" },
  pattern:    { color: "#D97706", label: "Pattern",    emoji: "🧩" },
  principio:  { color: "#EC4899", label: "Principio",  emoji: "💎" },
}
