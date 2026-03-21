# Note sulla configurazione Docker

## Perché Docker?

La presenza di questa configurazione Docker consente a chiunque scarichi il repository di eseguire e testare il gioco **in pochi secondi**, senza installare nulla di speciale sul proprio computer (solo Docker). Il gioco gira localmente, nessun dato va su internet, nessun deploy necessario.

---

## Che tipo di container viene usato?

Il container è basato sull'immagine ufficiale **`nginx:alpine`**, disponibile gratuitamente su Docker Hub.

- **nginx** è uno dei server HTTP più diffusi al mondo, leggero e affidabile.
- **alpine** indica che è basato su Alpine Linux, una distribuzione minimalista (~5MB di base). Il risultato è un'immagine finale di circa 60MB, adatta anche a macchine con poco spazio su disco.
- Non viene costruita nessuna immagine custom: si usa `nginx:alpine` direttamente dal registry.

---

## Gestione dell'immagine: download e riutilizzo

Al **primo avvio**, Docker scarica automaticamente l'immagine `nginx:alpine` da Docker Hub e la salva in locale nella cache delle immagini Docker.

Tutti i **run successivi** riutilizzano l'immagine già scaricata: non serve connessione internet e il container parte in meno di un secondo.

L'immagine rimane disponibile finché non viene esplicitamente rimossa con `docker rmi nginx:alpine`. Per verificare le immagini scaricate:

```bash
docker images
```

---

## Come vengono serviti i file del gioco?

La cartella `public/` del progetto viene **montata direttamente** nella posizione:

```
/usr/share/nginx/html
```

Questa è la directory radice da cui nginx serve i file statici per default. Il mount è configurato in sola lettura (`:ro`), il che significa che il container non può modificare i sorgenti.

**Vantaggio chiave:** qualsiasi modifica ai file in `public/` (HTML, CSS, JS, immagini, audio) è **immediatamente disponibile** sul server HTTP, senza dover riavviare il container. Basta ricaricare la pagina nel browser.

---

## Comandi

Tutti i comandi vanno eseguiti dalla **root del progetto**.

**Avvio del container** (in background):
```bash
docker compose -f dckr/docker-compose.yml up -d
```

Una volta avviato, il gioco è raggiungibile su: **http://localhost:8080**

**Stop e rimozione del container**:
```bash
docker compose -f dckr/docker-compose.yml down
```

Il comando `down` ferma e rimuove il container, ma **non** rimuove l'immagine scaricata. Al prossimo `up -d` il container riparte istantaneamente usando l'immagine già in cache.

> **Nota:** il container **non** si avvia automaticamente al boot del sistema, dopo un blackout o a seguito di un riavvio imprevisto. Resta attivo solo per la sessione di lavoro corrente e deve essere rilanciato manualmente quando serve.

---

## Riepilogo configurazione

| Parametro        | Valore                          |
|------------------|---------------------------------|
| Immagine         | `nginx:alpine`                  |
| Nome container   | `timestables-web`               |
| Porta host       | `8080`                          |
| Porta container  | `80`                            |
| Volume montato   | `./public` → `/usr/share/nginx/html` (read-only) |
| Restart policy   | `no` (avvio solo su comando esplicito) |
