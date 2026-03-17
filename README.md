# TimesTables

## Cos'è TimesTables 🇮🇹
TimesTables è un gioco didattico progettato per aiutare i bambini ad esercitarsi con le tabelline in modo divertente e interattivo. Il gioco è ottimizzato per l'uso su smartphone e funziona completamente offline: una volta caricato, non necessita di connessione internet e tutti i calcoli avvengono direttamente sul dispositivo.

## What is TimesTables 🇬🇧
TimesTables is an educational game designed to help children practice multiplication tables in a fun and interactive way. The game is optimized for smartphone use and works completely offline: once loaded, it doesn't require an internet connection and all calculations happen directly on the device.

---

### Dettagli Tecnici 🇮🇹

**Struttura del progetto:**

```
/
├── public/          # L'applicazione web vera e propria (HTML, CSS, JS, immagini e suoni)
├── dckr/            # Configurazione Docker per l'esecuzione in locale
└── docs_notes/      # Note e documentazione del progetto
```

- **`public/`** - Contiene tutti i file del gioco: HTML, CSS, JavaScript vanilla, immagini e file audio. È il contenuto servito dal web server.
- **`dckr/`** - Configurazione Docker con Dockerfile e docker-compose.yml per creare un container nginx che serve l'applicazione. Utile per l'esecuzione in locale (test, sviluppo).
- **`docs_notes/`** - Documentazione e note di sviluppo.

**Avvio con Docker:**
Dalla root del progetto:
```bash
docker compose -f dckr/docker-compose.yml up -d
```
Una volta eseguito il container il gioco sarà raggiungibile tramite `http://localhost:8080`


### Technical Details 🇬🇧

**Project structure:**

```
/
├── public/          # The web application (HTML, CSS, JS, images and sounds)
├── dckr/            # Docker configuration for local run
└── docs_notes/      # Project notes and documentation
```

- **`public/`** - Contains all game files: HTML, CSS, vanilla JavaScript, images and audio files. This is the content served by the web server.
- **`dckr/`** - Docker configuration with Dockerfile and docker-compose.yml to create an nginx container serving the application. Useful to run locally (test, development).
- **`docs_notes/`** - Development documentation and notes.

**Running with Docker:**
From the project root:
```bash
docker compose -f dckr/docker-compose.yml up -d
```
Once the container is running the game will be accessible at `http://localhost:8080`


---

## Licenza 🇮🇹

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Questo progetto è distribuito sotto licenza [GNU General Public License v3.0](LICENSE).  
Il codice è libero, aperto e tale deve restare: chiunque può usarlo, modificarlo e redistribuirlo,
a condizione che i lavori derivati restino anch'essi liberi e aperti.  
Il gioco è e rimarrà sempre gratuito, senza pubblicità e senza raccolta di dati.

## License 🇬🇧

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project is distributed under the [GNU General Public License v3.0](LICENSE).  
The code is free, open, and must remain so: anyone can use, modify, and redistribute it,
provided that derivative works are also kept free and open.  
The game is and will always remain free, ad-free, and without any data collection.
