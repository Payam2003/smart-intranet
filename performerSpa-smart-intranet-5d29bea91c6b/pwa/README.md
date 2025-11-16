## Gestione delle variabili d'ambiente

Questa documentazione descrive il metodo moderno e raccomandato per la gestione della configurazione delle Cloud Functions, basato su parametri e file `.env`.

[Documentazione ufficiale Firebase - Configurazione dell'ambiente](https://firebase.google.com/docs/functions/config-env)

### Come Funziona

1.  **Definizione dei Parametri nel Codice:** Le variabili d'ambiente necessarie a una funzione vengono dichiarate esplicitamente nel codice tramite `defineString("NOME_VARIABILE")`. Questo rende le dipendenze della funzione chiare e sicure.

2.  **File `.env` per Ambiente:** I valori di queste variabili vengono memorizzati in file `.env` all'interno della directory `functions`.

- **Produzione:** Si crea un file `.env.<project-id>` (es. `.env.perf-test-pwa`) che contiene i valori per l'ambiente di produzione.
- **Sviluppo Locale:** Si crea un file `.env` che contiene solo i valori che devono essere _diversi_ durante lo sviluppo locale con l'emulatore (es. `GOOGLE_REDIRECT_URI`)

3.  **Sicurezza:** Tutti i file `.env.*` **devono** essere aggiunti al file `.gitignore` per evitare di salvare accidentalmente le chiavi segrete nel repository del codice.

### Flusso di Lavoro per lo Sviluppo Locale

Quando esegui il comando `firebase emulators:start`, la CLI di Firebase:

1.  Carica prima le variabili dal file di produzione (`.env.perf-test-pwa`).
2.  Subito dopo, carica le variabili dal file di override locale (`.env`).
3.  Se una variabile esiste in entrambi i file, il valore presente in `.env` ha la precedenza.
    Questo permette di avere un file `.env` minimale che contiene solo le differenze per l'ambiente locale.

### Deployment in Produzione

Quando esegui il comando `firebase deploy --only functions`:

1.  La CLI analizza il codice, trova i parametri definiti con `defineString`.
2.  Legge i valori corrispondenti **solo** dal file `.env.<project-id>` (es. `.env.perf-test-pwa`).
3.  Il file locale `.env` viene **completamente ignorato**.
4.  I valori vengono impacchettati in modo sicuro e associati alla funzione deployata. I file `.env` non vengono mai caricati sui server.

Questo garantisce che le tue funzioni in produzione usino sempre la configurazione corretta e sicura.

### Gestione di Secret Altamente Sensibili

Per dati estremamente sensibili (es. chiavi API private di terze parti), è consigliabile usare **Cloud Secret Manager**, integrato con Firebase.

1.  Imposta un secret: `firebase functions:secrets:set NOME_SECRET`
2.  Concedi l'accesso alla tua funzione.
3.  Nel codice, definisci il parametro specificando che è un secret: `defineSecret("NOME_SECRET")`.
    Questo metodo è ancora più sicuro perché il valore del secret non è mai presente in nessun file sul tuo computer locale.
