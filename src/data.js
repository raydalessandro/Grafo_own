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
      id: "Pietro", type: "persona", label: "Pietro", sub: "Community & Vendite",
      details: {
        ruolo: "Agente Commerciale & Community Manager Internazionale",
        competenze: "Comunicazione diretta, vendita, inglese fluente, energia, velocità d'azione",
        pattern_operativo: "Va avanti senza aspettare validazione. Tende a saltare spec. Ha bisogno di vincoli tecnici esterni. Veloce nell'esecuzione, meno nella riflessione preliminare.",
        pattern_apprendimento: "Impara per esposizione diretta e risultato concreto. La comprensione arriva dopo l'errore reale. Chiede la cosa successiva prima di metabolizzare quella attuale.",
        relazione_ai: "'Tool veloce' → in transizione verso 'collaboratore'. Dopo Workshop 2 ha parlato da solo con l'AI per un'ora. Ha colto il potenziale autonomamente.",
        leadership: "Direttore della direzione creativa, non esecutore. Va posizionato come direttore sui social — decide il cosa e il perché.",
        doc_sorgente: "OWN_Report_Pattern_Team_Workshop_1_2.md — 19 Marzo 2026"
      }
    },
    {
      id: "Ash", type: "persona", label: "Ash", sub: "Contenuti & Social",
      details: {
        ruolo: "Social Media Manager & Content Creator",
        competenze: "Creatività visiva, Canva, CapCut, sensibilità estetica, impegno nel miglioramento",
        pattern_operativo: "Si ferma in momenti intermedi — non resistenza, è perdita del filo del prossimo passo. Si riattiva con segnale leggero. Autonomia in crescita progressiva.",
        pattern_apprendimento: "Più lento a partire ma applica con coerenza. Apprende per deduzione dal confronto. Ha capito il meccanismo del progetto Claude facendo l'errore.",
        relazione_ai: "In fase di costruzione della fiducia nel sistema. Si avvicina al frame 'ho un team a disposizione'.",
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
        supervisiona: "Archivist — valida ogni proposta prima che arrivi a Ray"
      }
    },
    {
      id: "Scout", type: "agente", label: "Scout", sub: "Ricercatore",
      details: {
        ruolo: "Ricercatore Repository & Community",
        funzione: "Trova repository GitHub/Codeberg coerenti con OWN. Analizza community, identifica maintainer.",
        sa_fare: "Ricerca web, analisi repository (stelle, commit, linguaggio, attività), mappatura community",
        non_fa: "Contattare le community (Mercury), analisi tecnica profonda del codice (Forge)"
      }
    },
    {
      id: "Mercury", type: "agente", label: "Mercury", sub: "Outreach",
      details: {
        ruolo: "Drafting Messaggi & Outreach",
        funzione: "Scrive bozze di messaggi per contattare community, developer, maintainer. Adatta il tono al contesto.",
        sa_fare: "Copywriting EN, etiquette community open-source, adattamento tono (Discord / email / GitHub issue)",
        principio: "Mai vendere. Sempre proporre valore: 'Vogliamo portare il vostro lavoro alle persone normali'"
      }
    },
    {
      id: "Muse", type: "agente", label: "Muse", sub: "Contenuti Social",
      details: {
        ruolo: "Ideatrice Contenuti & Copywriter Social",
        funzione: "Genera idee per contenuti social, scrive copy per IG/TikTok, applica le 7 tecniche di deprogrammazione.",
        sa_fare: "Ideazione creativa, copywriting IT, format social (reel, carousel, post, story), 7 tecniche psyop, tono OWN",
        regola_doro: "Il protagonista è sempre il follower, mai OWN. OWN è lo strumento che il protagonista trova lungo il percorso."
      }
    },
    {
      id: "Forge", type: "agente", label: "Forge", sub: "Analista Tecnico",
      details: {
        ruolo: "Analista Tecnico Prodotti",
        funzione: "Ricerca e analisi tecnica prodotti wearable, valutazione compatibilità, confronti, schede prodotto.",
        sa_fare: "Analisi hardware, firmware, BLE, sicurezza, open-source licensing, confronti, pricing",
        non_fa: "Scrivere copy di vendita (Quill), decisioni su catalogo (Ray)"
      }
    },
    {
      id: "Quill", type: "agente", label: "Quill", sub: "Copywriter",
      details: {
        ruolo: "Copywriter Prodotti & Schede",
        funzione: "Scrive descrizioni prodotto per e-commerce, caption social specifiche per prodotti, schede comparative.",
        sa_fare: "Copywriting prodotto IT/EN, tono OWN, struttura beneficio-prima-feature-dopo, SEO base",
        principio: "Apri con il problema, non con il prodotto. Beneficio prima, feature dopo."
      }
    },
    {
      id: "Archivist", type: "agente", label: "Archivist", sub: "Custode Grafo",
      details: {
        ruolo: "Custode e Aggiornatore del Grafo OWN",
        supervisione: "Athena — ogni aggiornamento proposto passa per validazione Athena prima della conferma di Ray",
        funzione: "Riceve documenti del team, estrae nodi/archi/attributi, segnala contraddizioni e gap, propone aggiornamenti.",
        flusso: "documento → Archivist estrae → Athena valida → Ray conferma → grafo aggiornato",
        non_fa: "Modificare il grafo autonomamente, interpretare strategicamente (registra fatti non opinioni)"
      }
    },

    // ─── VISIONE ───
    {
      id: "Visione_5_Anni", type: "visione", label: "Visione 5 Anni", sub: "2026–2031",
      details: {
        principio: "Il grafo come azienda, non come documentazione",
        orizzonte: "2026–2031",
        stato: "Attiva — guida decisioni oggi, non ancora operativa come sistema completo",
        struttura_target: "Umani parlano con Athena → intervengono solo su eccezioni → agenti esecutori autonomi con confini chiari dal grafo",
        crescita: "Per sovrapattern — ciclo mensile di estrazione pattern dalle chat (API Anthropic + Qdrant)",
        ciclo: "1. Operatività manuale → 2. Documento team → 3. Archivist estrae → 4. Athena valida → 5. Ray conferma → 6. Grafo aggiornato → 7. Automazione progressiva → ripeti",
        vantaggio: "Portabilità totale via JSON. Memoria organizzativa che non dimentica. Scala senza crescita proporzionale di headcount.",
        doc_sorgente: "Conversazione Ray-Athena-AI esterna — 19 Marzo 2026"
      }
    },

    // ─── PRODOTTI ───
    {
      id: "Colmi_R02", type: "prodotto", label: "Colmi R02", sub: "Smart Ring",
      details: {
        tipo: "Smart Ring",
        prezzo_acquisto: "~€20",
        prezzo_vendita: "€45–55",
        open: "Hackabile via BLE + Gadgetbridge",
        nota: "Entry-level Kit Zero, HR inaccurato ma SpO2 buono"
      }
    },
    {
      id: "PineTime", type: "prodotto", label: "PineTime", sub: "Smartwatch",
      details: {
        tipo: "Smartwatch",
        prezzo_acquisto: "~€30",
        prezzo_vendita: "€50–55",
        open: "Full open HW+SW, InfiniTime",
        nota: "Entry-level Kit Zero, no sleep tracking nativo, solo Android"
      }
    },
    {
      id: "Bangle_js_2", type: "prodotto", label: "Bangle.js 2", sub: "Smartwatch",
      details: {
        tipo: "Smartwatch",
        prezzo_acquisto: "~€85",
        prezzo_vendita: "€120–130",
        open: "Full open HW+SW, JavaScript, 543+ app",
        nota: "Premium Kit Zero, GPS, 4 settimane batteria"
      }
    },
    {
      id: "Brilliant_Halo", type: "prodotto", label: "Brilliant Halo", sub: "Smart Glasses",
      details: {
        tipo: "Smart Glasses",
        prezzo_acquisto: "~€280",
        prezzo_vendita: "€380–420",
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
        prezzo_vendita: "€95–110",
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

    // ─── COMMUNITY ───
    {
      id: "Gadgetbridge_C", type: "community", label: "Gadgetbridge", sub: "Matrix",
      details: {
        piattaforma: "Matrix (#gadgetbridge:matrix.org)",
        accesso: "Account Element X creato — dentro, osservando",
        tono: "Tecnico ma accessibile, community di sviluppatori e appassionati",
        strategia: "Contribuire prima (guide, traduzioni, bug report), presentarsi dopo",
        posizionamento: "OWN è il primo retailer europeo che preinstalla e supporta ufficialmente Gadgetbridge",
        prossimo_step: "Mercury costruisce messaggio di presentazione (Settimana 2)"
      }
    },
    {
      id: "Brilliant_Labs_C", type: "community", label: "Brilliant Labs", sub: "Discord 13.194",
      details: {
        piattaforma: "Discord — 13.194 membri",
        accesso: "Account Discord personale Pietro — dentro, osservando",
        contatto_principale: "bobak (membro team BL)",
        altri_contatti: "chapoya BL (team), Spicy_Nandos (early adopter), hjbaard (utente europeo Olanda)",
        opportunità_1: "Rivenditore europeo Halo — domanda esplicita senza risposta",
        opportunità_2: "Lenti correttive — pain point reale, team BL indica ottico locale come soluzione. OWN è quella soluzione.",
        timing: "Halo non ancora uscito in massa — finestra strategica aperta ora"
      }
    },
    {
      id: "PINE64_C", type: "community", label: "PINE64", sub: "Forum+Discord 29k",
      details: {
        piattaforma: "Forum (forum.pine64.org) + Discord",
        membri: "14.594 Discord · 29.914 forum",
        accesso: "Account PityPietro — canale #pinetime già sbloccato per scrittura",
        cliente_tipo: "may (FOX) — utente normale, ha PineTime, usa Gadgetbridge, cerca guida → profilo TARGET",
        persone_chiave: "Gary (esperto), muesli (developer firmware), ElectrOLyte (developer watchfaces)",
        opportunità: "Supporto italiano, setup Gadgetbridge, sinergia Meshtastic (canale #lora)"
      }
    },
    {
      id: "Open_Ring_C", type: "community", label: "Open Ring", sub: "GitHub ★131",
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

    // ─── STRUMENTI WORKFLOW ───
    {
      id: "Claude_Code", type: "strumento", label: "Claude Code", sub: "AI Coding",
      details: {
        tipo: "Agente AI per coding",
        funzione: "Sviluppo software assistito da AI, analisi repository, code review",
        usato_da: "Ray (primario), Pietro (workshop)"
      }
    },
    {
      id: "Shopify", type: "strumento", label: "Shopify", sub: "E-commerce",
      details: {
        tipo: "Piattaforma e-commerce",
        funzione: "Negozio test dropshipping wearable e tech gadget",
        nota: "Negozio test — non branded OWN. Obiettivo: validare team, flussi, prodotti prima del lancio vero."
      }
    },
    {
      id: "DSers", type: "strumento", label: "DSers", sub: "Dropshipping",
      details: {
        tipo: "App integrazione dropshipping",
        funzione: "Integrazione AliExpress → Shopify per gestione ordini"
      }
    },
    {
      id: "AliExpress", type: "strumento", label: "AliExpress", sub: "Marketplace",
      details: {
        tipo: "Marketplace / fonte prodotti",
        funzione: "Ricerca e sourcing prodotti per dropshipping nel negozio test",
        nota: "Sunsky-online.com è il fornitore preferito per MOQ 1 e integrazione Shopify"
      }
    },
    {
      id: "ChatGPT", type: "strumento", label: "ChatGPT", sub: "AI",
      details: {
        tipo: "AI generativa",
        funzione: "Ricerca approfondita prodotti (deepsearch), supporto contenuti",
        usato_da: "Ash (primario)"
      }
    },
    {
      id: "Grok", type: "strumento", label: "Grok", sub: "AI Immagini",
      details: {
        tipo: "AI generativa",
        funzione: "Generazione immagini e video",
        usato_da: "Team"
      }
    },
    {
      id: "Canva", type: "strumento", label: "Canva", sub: "Design",
      details: {
        tipo: "Design visivo",
        funzione: "Creazione visual per contenuti social OWN",
        usato_da: "Ash (primario)"
      }
    },
    {
      id: "CapCut", type: "strumento", label: "CapCut", sub: "Video",
      details: {
        tipo: "Editor video",
        funzione: "Montaggio video per contenuti social (TikTok, Instagram Reels)",
        usato_da: "Ash (primario)"
      }
    },
  ],

  edges: [
    // Gerarchia
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
    // Flussi operativi
    { source: "Scout", target: "Mercury", label: "fornisce target" },
    { source: "Forge", target: "Quill", label: "fornisce analisi" },
    { source: "Forge", target: "Muse", label: "fornisce novità" },
    { source: "Muse", target: "Quill", label: "fornisce idea" },
    { source: "Archivist", target: "Athena", label: "proposta a" },
    // Prodotti & Servizi
    { source: "PINE64_C", target: "Meshtastic", label: "sinergia" },
    { source: "Brilliant_Halo", target: "Lenti_Correttive_Halo", label: "servizio futuro" },
    // Visione
    { source: "Visione_5_Anni", target: "Ray", label: "guidata da" },
    { source: "Visione_5_Anni", target: "Pietro", label: "ridefinirà ruolo" },
    { source: "Visione_5_Anni", target: "Ash", label: "ridefinirà ruolo" },
    { source: "Visione_5_Anni", target: "Athena", label: "potenziamento" },
    { source: "Visione_5_Anni", target: "Archivist", label: "potenziamento" },
    { source: "Visione_5_Anni", target: "Scout", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Mercury", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Muse", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Forge", label: "automatizzerà" },
    { source: "Visione_5_Anni", target: "Quill", label: "automatizzerà" },
    // Community
    { source: "Pietro", target: "Gadgetbridge_C", label: "entrato" },
    { source: "Pietro", target: "Brilliant_Labs_C", label: "entrato" },
    { source: "Pietro", target: "PINE64_C", label: "entrato" },
    { source: "Pietro", target: "Open_Ring_C", label: "monitora" },
    { source: "Brilliant_Labs_C", target: "Brilliant_Halo", label: "opportunità retailer" },
  ]
}

export const TYPE_CONFIG = {
  persona:   { color: "#4F8EF7", label: "Persona",   emoji: "👤" },
  agente:    { color: "#A855F7", label: "Agente AI", emoji: "🤖" },
  visione:   { color: "#F59E0B", label: "Visione",   emoji: "🌟" },
  prodotto:  { color: "#10B981", label: "Prodotto",  emoji: "📦" },
  servizio:  { color: "#06B6D4", label: "Servizio",  emoji: "🔧" },
  community: { color: "#EF4444", label: "Community", emoji: "🌐" },
  strumento: { color: "#6B7280", label: "Strumento", emoji: "⚙️" },
}
