# Banc de recursos

Directori de jocs educatius per a Infantil, Primària i Secundària. Lloc estàtic (HTML + CSS + JS pur) amb sincronització via API autoalojada (FastAPI + SQLite).

🌐 **Producció**: [recursos.edutictac.es](https://recursos.edutictac.es)

---

## Índex

- [Estructura del projecte](#estructura-del-projecte)
- [Instal·lació](#installació)
- [Gestió del catàleg](#gestió-del-catàleg)
- [Importació de continguts](#importació-de-continguts)
- [Captura d'imatges](#captura-dimatges)
- [Verificació d'enllaços](#verificació-denllaços)
- [API autoalojada](#api-autoalojada-substitució-de-firebase)
- [Deploy](#deploy)

---

## Estructura del projecte

```
├── index.html                  Pàgina principal
├── sw.js                       Service Worker (PWA)
├── data/
│   ├── games.json              Catàleg principal d'activitats
│   ├── games-home.json         Subconjunt per la càrrega inicial (generat)
│   └── archive-flash-staging.json  Entrades pendents de revisió (Archive.org)
├── assets/
│   ├── game-images/            Captures de pantalla dels jocs
│   └── flash/                  Fitxers .swf locals (NO estan en git)
├── reports/
│   └── link-report.json        Informe d'estat dels enllaços (generat)
├── scripts/
│   ├── check-links.mjs         Verificador d'enllaços
│   ├── generate-home.mjs       Genera games-home.json
│   ├── import-csv.mjs          Importa des de CSV
│   ├── import-wordpress.mjs    Importa des de WordPress
│   ├── import-archive-flash.mjs  Importa Flash educatiu d'Archive.org
│   ├── capture-game-images.mjs Captura automàtica d'imatges
│   └── deploy.sh               Script de deploy per SSH
└── styles/
    └── site.css
```

---

## Instal·lació

```bash
git clone https://github.com/sasogu/edubibliojocs.git
cd edubibliojocs
npm install
```

---

## Gestió del catàleg

El catàleg és `data/games.json`. Cada entrada té aquest format:

```json
{
  "id": "id-unic",
  "title": "Títol del joc",
  "title_ca": "Títol en català (opcional)",
  "area": "Matematicas",
  "language": "Castellano",
  "url": "https://exemple.com/joc",
  "notes": "Descripció breu",
  "notes_ca": "Descripció en català (opcional)",
  "levels": ["Primaria 1er ciclo", "Primaria 2o ciclo"],
  "image": "assets/game-images/nom-del-joc.png",
  "flash": true
}
```

**Camps obligatoris**: `id`, `title`, `url`

**Valors vàlids per `area`**: `Matematicas`, `Lengua`, `Ciencias Naturales`, `Sociales`, `Plastica`, `Musica`, `Ingles`, `Educación Física`, `Informática`, `Logica`, `General`, `Seguridad Digital`, `Tecnologia`, `Religion`, `Frances`

**Valors vàlids per `levels`**: `Infantil`, `Primaria`, `Primaria 1er ciclo`, `Primaria 2o ciclo`, `Primaria 3er ciclo`, `Secundaria`

**Valors vàlids per `language`**: `Castellano`, `Català/Valencià`, `Inglés`, `Francés`, `Aranes`

El camp `flash: true` activa el reproductor Ruffle integrat per a fitxers `.swf`.

---

## Importació de continguts

### Des de CSV

Format de les columnes: `id,title,area,level,language,url,notes`

```bash
npm run import:csv                          # llegeix data/games.csv
node scripts/import-csv.mjs ruta/arxiu.csv  # fitxer alternatiu
```

### Des de WordPress

```bash
npm run import:wp          # importació completa
npm run import:wp:merge    # fusiona amb el catàleg existent
npm run import:wp:images   # descarrega imatges de WordPress
```

### Flash educatiu d'Archive.org

Descarrega jocs Flash educatius d'Archive.org i els allotja localment (necessari perquè Archive.org està bloquejat a les xarxes escolars).

```bash
# 1. Cerca sense descarregar (per veure quants jocs hi ha)
npm run import:flash:dry

# 2. Descàrrega real (es pot aturar i reprendre)
npm run import:flash

# 3. Opcions avançades
node scripts/import-archive-flash.mjs --limit 50
node scripts/import-archive-flash.mjs --query "math elementary"

# 4. Revisa data/archive-flash-staging.json i elimina els que no vulguis

# 5. Afegeix els aprovats a games.json
npm run import:flash:apply
```

**Notes**:
- Els `.swf` es guarden a `assets/flash/` i **no estan en git** (massa pesats), però el deploy els puja al servidor via rsync.
- El script és *resumible*: guarda el progrés a `data/archive-flash-state.json`.
- Mida màxima per fitxer: 100 MB.
- Mapatge automàtic de matèries, idiomes i etapes a partir dels tags d'Archive.org.

---

## Captura d'imatges

Genera captures de pantalla automàtiques per als jocs sense imatge usant Chromium en mode headless:

```bash
npm run capture:images -- --limit 25        # fins a 25 captures
npm run capture:images -- --id nom-del-joc  # un joc concret
npm run capture:images -- --host clic.xtec.cat --limit 50
npm run capture:images -- --force           # força recaptura
npm run capture:images -- --dry-run        # simula sense escriure
```

Variables d'entorn opcionals: `CHROMIUM_BIN`, `BROWSER_BIN`

---

## Verificació d'enllaços

```bash
npm run check:links               # verifica tots els URL del catàleg
STRICT_WARNINGS=true npm run check:links  # tracta avisos com a errors
```

Genera `reports/link-report.json` amb l'estat HTTP de cada URL. La interfície mostra el resultat directament a cada targeta.

El workflow `.github/workflows/link-check.yml` executa la verificació diàriament de forma automàtica.

---

## API autoalojada (substitució de Firebase)

La app funciona en dos modes:

| Mode | Favorits | Valoracions | Sincronització |
|------|----------|-------------|----------------|
| Local (per defecte) | localStorage | localStorage | No |
| Remot | API pròpia per usuari | API pròpia compartides | Sí (tots els dispositius) |

La sincronització en el núvol ja **no usa Firebase**: es fa contra una API REST
pròpia (FastAPI + SQLite) servida a `recursos.edutictac.es/api/` (migració
2026-09-04, repositori `Edutictac/bibliojocs-api`).

- La URL de l'API es pot sobreescriure amb `window.EDUBIBLIOJOCS_API_BASE`
  (per defecte `/api`, mateix origen).
- Identitat **anònima per cookie** (sense Google).
- **Mode admin**: obre `https://recursos.edutictac.es/?admin=TOKEN` amb el
  token d'administrador. Activa els filtres "No funciona (admin)" i
  "Reportades (admin)".

### Estructura de dades (SQLite)

```
favorites(user_id, game_key)      → favorits per usuari
ratings(user_id, game_key, value) → valoració personal (1-5)
reports(user_id, game_key)        → reportes "no funciona" per usuari
rating_summary(game_key, sum, count, avg) → valoració agregada
broken_reports(game_key, count, admin_reported) → reportes agregats
submissions(id, title, url, ...)  → activitats proposades pels usuaris
```

### Funcions d'administrador

El mode admin permet veure:

- **Filtre "No funciona (admin)"**: activitats amagades (≥ 3 reports d'usuaris o marcades per l'admin).
- **Filtre "Reportades (admin)"**: activitats amb 1-2 reports, visibles però vigilades.

---

## Deploy

### Deploy ràpid (sense verificació d'enllaços)

```bash
npm run deploy:fast
```

### Deploy complet (amb verificació d'enllaços)

```bash
npm run deploy
```

### Simulació sense pujar res

```bash
npm run deploy:dry
```

### Variables de configuració del deploy

| Variable | Per defecte | Descripció |
|----------|-------------|------------|
| `DEPLOY_HOST` | `edutictac.es` | Host del servidor |
| `DEPLOY_USER` | `samgua` | Usuari SSH |
| `DEPLOY_PORT` | `2222` | Port SSH |
| `DEPLOY_PATH` | `/var/www/bibliojocs` | Ruta remota |
| `DEPLOY_SSH_KEY` | — | Clau privada SSH |
| `DRY_RUN=1` | — | Simula sense copiar |
| `SKIP_LINKS=1` | — | Omet la verificació d'enllaços |
| `SKIP_VERIFY=1` | — | Omet la verificació post-deploy |
| `FIX_PERMS=1` | `1` | Ajusta permisos (dirs 755, fitxers 644) |

### Deploy automàtic via GitHub Actions

El workflow `.github/workflows/deploy.yml` fa el deploy automàticament en fer push a `main`. Configura aquests Secrets a GitHub (Settings → Secrets → Actions):

- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`, `DEPLOY_PORT`
