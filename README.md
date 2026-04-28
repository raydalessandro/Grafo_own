# Grafo_own

**Visualizzazione interattiva di un'organizzazione AI-native come grafo.**

Non è un organigramma. Non è un diagramma di processo. È il tentativo di rispondere a una domanda concreta che si pone chi orchestra agenti: *come faccio a tenere insieme persone, ruoli, pattern operativi, agenti AI, flussi di lavoro e relazioni umano↔AI in un'unica struttura navigabile, leggibile sia dagli umani sia dagli agenti?*

La risposta che dà questo repo: **un grafo force-directed in cui ogni entità — umana, artificiale o concettuale — è un nodo con attributi ricchi, e le relazioni sono archi tipizzati**.

## Perché questo pattern ha valore

Un'azienda AI-native non si mappa bene con gli strumenti tradizionali. L'organigramma assume gerarchia stabile e ruoli ben separati; non sa rappresentare un agente AI che lavora dentro un flusso umano. Il diagramma di processo è troppo lineare: gli agenti partecipano a più flussi contemporaneamente. Il documento di team building (Notion, Confluence) è troppo testuale: si legge, non si naviga.

Il grafo risolve tutti e tre i problemi:

- **Persone, agenti, prodotti, flussi sono nodi dello stesso tipo strutturale.** Un agente AI ha lo stesso peso ontologico di una persona. Cambia il `type` del nodo, non il modo in cui esiste nel sistema.
- **I pattern operativi diventano dati strutturati, non aneddoti.** Per ogni persona puoi dichiarare `pattern_operativo`, `pattern_apprendimento`, `relazione_ai`, `leadership`, `contributo_sistema`. Sono campi machine-readable che un agente può leggere quando deve interagire con quella persona.
- **Le relazioni sono archi tipizzati**, non frasi in un wiki. "Pietro decide il cosa, Ash decide il come" diventa un arco con un tipo, non una nota in un documento che nessuno aggiorna.

## Cosa lo rende navigabile (la parte tecnica vale poco senza questo)

L'app è React + D3 force-directed graph. Quello che conta non è il rendering — è che il grafo sia **filtrabile, cercabile, espandibile on-click**. Quando guardi il nodo di una persona vedi tutto: ruolo, competenze, pattern, relazione con AI, decisioni di cui è responsabile, lingue parlate, fase attuale. Quando guardi un nodo agente vedi cosa fa, da chi viene attivato, dove si inserisce nei flussi.

Il grafo non è statico: è un **documento vivo** che descrive come funziona davvero l'organizzazione, e si aggiorna man mano che il sistema cresce.

## Stato di questo repo

Questo è una **versione semplificata**, derivata da un sistema più completo applicato a un progetto reale. È pubblicata come *dimostrazione del pattern*, non come prodotto finito. Mostra:

- Lo schema dati (`src/data.js` con nodi e archi tipizzati)
- Il rendering interattivo (filtri, search, dettaglio nodo)
- La testabilità (Playwright + stress test)

Per un'applicazione del pattern a un caso reale, il modello viene esteso con più tipi di nodo, più tipi di arco, e regole di consistenza specifiche al dominio.

## Stack

React 18 · D3 v7 (force simulation) · Vite · Playwright

## Run locale

```bash
npm install
npm run dev
```

## Licenza

MIT
