# Índice federado de recursos (resource indexers)

Documentación técnica del índice federado de REA de `recursos.edutictac.es`.

## Estado

En desarrollo (2026-09-08). Backend operativo (esquema, providers, CLI, API).
Integración con la PWA: el frontend sigue leyendo `data/games.json`, pero ya
existe un exportador (`export-catalog`) que genera ese JSON unificado a partir
del índice (legacy + jclic + h5p + eduhoot + scorm), de modo que los nuevos
recursos aparecen sin reescribir el frontend.

---

## Arquitectura

```
fuentes externas (projects.json · hub-api.h5p.org · eduhoot API · paquetes SCORM)
        │
providers (Python, paquete app/providers/): JClic · H5P · SCORM · EduHoot
        │  normalize() → Resource (provider, external_id UNIQUE)
        ▼
Índice local (SQLite, tabla resources + sync_runs)
        │
GET /api/resources (búsqueda unificada + filtros)
        ▼
Frontend recursos.edutictac.es (consumirá la API; hoy aún lee games.json)
```

Principio: **indexar metadatos, no copiar contenido**. Solo SCORM local (subido
por el propio docente/institución) justifica almacenar el paquete; el resto
conserva enlaces al original.

## Modelo común (`Resource`)

Entidad normalizada en `resources` (SQLite). Campos: `provider`, `external_id`
(UNIQUE juntos), `title`, `title_ca`, `description`, `description_ca`, `author`,
`license`, `license_known`, `language` (JSON), `resource_type`, `format`,
`subject`, `educational_stage`, `educational_level` (JSON), `tags` (JSON),
`source_url`, `play_url`, `download_url`, `reuse_url`, `thumbnail_url`,
`metadata_json` (metadato original completo), `created_at_source`,
`updated_at_source`, `indexed_at`, `last_synced_at`, `active`.

El metadato original del proveedor **nunca se pierde**: queda en `metadata_json`.

## Providers

| name | format | fuente | pull/push |
|---|---|---|---|
| `jclic` | `jclic` | `clic.xtec.cat/projects/projects.json` | pull |
| `h5p` | `h5p` | `hub-api.h5p.org/v1/contents` | pull |
| `scorm` | `scorm` | URL de paquete `.zip` (config o `--url`) | pull/push |
| `eduhoot` | `eduhoot` | `eduhoot.edutictac.es/api/public-quizzes` | pull |

### JClic
- Fuente: `https://clic.xtec.cat/projects/projects.json` (lista de 2633 proyectos).
- Estructurado, sin scraping. Cada proyecto: `id`, `path`, `title`, `author`,
  `date`, `langCodes`, `levelCodes`, `areaCodes`, `mainFile`, `cover/coverWebp/thumbnail`.
- `play_url` = `https://clic.xtec.cat/projects/{path}/jclic.js/index.html`.
- Mapeo de códigos → taxonomía EduTicTac en `app/taxonomy.py`
  (`langCodes` ca/es/en/fr/oc; `levelCodes` INF/PRI/SEC/BTX; `areaCodes`
  soc/tec/lleng/div/mat/exp/mus/ef/vip).
- `external_id` = `id` del proyecto.

### H5P OER Hub
- Fuente: `https://hub-api.h5p.org/v1/contents` (público, sin auth).
- **Endpoint NO documentado oficialmente**: es el backend del nuevo OER Hub.
  Público y estable en la práctica, pero no es una API REST "oficial". Riesgo de
  cambio sin previo aviso. Documentar cualquier dependencia nueva.
- Paginación: `from` + `size` (**máximo `size` = 50**; `size=100` devuelve 422).
- Filtros verificados: `search`, `text`, `disciplines[]`.
- Metadatos ricos: `title`, `owner/publisher`, `license{id,version,can_be_modified,
  allows_commercial_use}`, `disciplines[]`, `level`, `age`, `icon`, `screenshots`,
  `preview_url`, `downloads`, `size`, `updated_at`.
- `/v1/contents/{id}` → 403 (requiere registro); `/v1/contents/{id}/export` → 302 (`.h5p`).
- `download_url` = `/contents/{id}/export`; `license`/`license_known` rellenos desde el item.
- **Filtro de calidad** (`_is_eligible`): se indexan los idiomas de la UE +
  catalán/valenciano, aranés, euskera y gallego (`H5P_INDEX_LANGS`); se descartan
  el resto (ruso, chino, turco, árabe...). Edad: se aceptan los recursos sin edad
  o no-adultos; se descarta el contenido claramente adulto (`_age_is_eligible`,
  mín ≥ 18).
- **Idioma abierto en el resto de proveedores** (`taxonomy.language_code`):
  JClic/SCORM conservan cualquier código ISO de 2-3 letras (eu, gl, la, ar, eo,
  zh...), no solo los de la UE; solo H5P restringe su catálogo de idiomas.

### SCORM
- No hay repositorio central. Se ingiere por URL (`sync scorm --url=...`) o desde
  un archivo de fuentes (`scorm-sources.json`).
- Descarga el `.zip` a memoria, localiza `imsmanifest.xml`, detecta 1.2/2004 y
  extrae metadatos **sin ejecutar** nada.
- `external_id` = `identifier` del manifest (fallback: URL).

### EduHoot
- Fuente: `https://eduhoot.edutictac.es/api/public-quizzes` (94 quizzes públicos).
- `play_url` (modo individual) = `https://eduhoot.edutictac.es/solo/?id={id}`.
- `external_id` = `id` numérico del quiz.
- Metadatos opcionales por quiz (añadidos en EduHoot 2026-09-08): `language`,
  `license`, `description`. El provider los lee si existen (`license_known` se
  activa cuando hay `license`; `language` se normaliza vía `eduhoot_language`).
- Limitaciones:
  - Cuando el quiz no declara `language`/`license`/`description`, quedan vacíos.
  - **Tags libres y multilingües**; se conservan y se mapean heurísticamente
    (`app/taxonomy.py`: materia, etapa, nivel).
  - **`coverImage` es determinista** desde EduHoot 2026-09-08 (primera pregunta
    con media, ya no aleatoria); aun así `thumbnail_url` no participa en la
    comparación updated/unchanged por si el esquema cambiara.
- **Filtro de ocio/cultura pop** (`_is_educational`): descarta quizzes cuyos tags
  o nombre caen en la blocklist (`EDUHOOT_NON_EDUCATIONAL_TAGS`,
  `EDUHOOT_NON_EDUCATIONAL_NAME_FRAGMENTS` en `app/taxonomy.py`), p. ej.
  Minecraft, Fortnite, Marvel, Aitana, Stranger Things, Black Mirror.

## Sincronización (CLI)

```
python -m app.cli sync jclic|h5p|scorm|eduhoot|all
python -m app.cli sync scorm --url https://.../paquete.zip
python -m app.cli stats
python -m app.cli sources
python -m app.cli export-catalog --games data/games.json --out-dir data/
```

- Upsert por `(provider, external_id)`; detecta `created`/`updated`/`unchanged`.
- La firma de "cambio" usa campos esenciales (excluye `metadata_json`,
  `thumbnail_url`, `indexed_at`, `last_synced_at`) para evitar falsos "updated"
  por contadores o imágenes volátiles.
- Los recursos que desaparecen de la fuente se marcan `active=0` (no se borran).
- Un recurso roto no detiene la sincronización; una fuente completa inaccesible
  marca el `SyncRun` como `error`.
- `SyncRun` (tabla `sync_runs`): `provider`, `started_at`, `finished_at`,
  `fetched`, `created`, `updated`, `unchanged`, `errors`, `status`, `error_log`.
- Automatización (producción): timer systemd `recursos-sync.timer` (diario 04:15)
  → `recursos-sync.service` → `scripts/sync-and-export.sh` (sync jclic/h5p/eduhoot
  + `export-catalog` + copia de `games.json`/`games-home.json` a
  `/var/www/recursos/data/`). El catálogo legacy original vive en
  `/opt/recursos-api/data/games-legacy.json` (fuente del export, no el generado).

### Exportar al frontend (`export-catalog`)

Genera `games.json` + `games-home.json` (formato actual de la PWA) a partir del
índice, para mostrar los recursos federados sin reescribir el frontend:

- Importa el catálogo curado (`data/games.json`) como provider `legacy`.
- Excluye los `legacy` de `clic.xtec.cat/projects/` (cubiertos por el provider
  `jclic` con mejores metadatos), evitando duplicados.
- Orden: `legacy` → `jclic` → `h5p` → `eduhoot` → `scorm`.
- `games-home.json` = primeros 48 con imagen (como `generate-home.mjs`).

## Verificación de enlaces

`npm run check:links` verifica `data/games.json`. Con el catálogo unificado
(~10.700 recursos) conviene acotar por fuente: `node scripts/check-links.mjs --source legacy`
(o `jclic`, `h5p`, `eduhoot`). Los recursos indexados provienen de fuentes vivas
(API), así que la verificación de enlaces es más relevante para el catálogo
curado (`legacy`).

## API

- `GET /api/resources` — búsqueda unificada. Params: `q`, `provider`, `format`,
  `subject`, `stage`, `language`, `license`, `license_known`, `limit`, `offset`.
  Devuelve `{total, offset, limit, items:[Resource...]}`.
- `GET /api/admin/sources` — estado de fuentes (requiere sesión admin).

## Seguridad SCORM

- No se extrae a disco: el ZIP se abre en memoria y solo se lee `imsmanifest.xml`.
- `defusedxml` (sin entidades XML externas / XXE).
- Límites configurables (`app/config.py`): `MAX_ZIP_SIZE` (200 MB),
  `MAX_ZIP_UNCOMPRESSED` (512 MB), `MAX_ZIP_FILES` (2000), `MAX_ZIP_DEPTH` (16).
- Rechazo de rutas maliciosas (zip slip, rutas absolutas).
- **Nunca se ejecuta** el JS/HTML del paquete durante la indexación.

## Licencias

- Se distingue `license` (texto) de `license_known` (bool): acceso público ≠ licencia libre.
- El metadato de licencia original se conserva; no se asumen derechos de
  redistribución si la licencia es desconocida.

## Cómo añadir un proveedor nuevo

1. Crear `app/providers/<nombre>.py` con una clase que herede `ResourceProvider`.
2. Implementar `discover()` (itera `Resource` normalizados) y `normalize(raw)`.
   Opcionalmente `ingest(...)` para fuentes push.
3. Registrar la clase en `app/providers/__init__.py` (`get_providers`).
4. Añadir mapeos a `app/taxonomy.py` si el proveedor trae clasificación propia.
5. Añadir tests en `tests/`.

## Dependencias externas

- `httpx` (HTTP con timeouts/retries/rate-limit/User-Agent).
- `defusedxml` (parseo XML seguro).
- Fuentes: `clic.xtec.cat`, `hub-api.h5p.org`, `eduhoot.edutictac.es`.

## Riesgos de APIs externas

- **H5P OER Hub**: endpoint no-oficial; puede cambiar. No depende de rutas no
  verificadas; `license` y paginación verificadas con peticiones reales.
- **EduHoot**: `coverImage` no determinista (aleatoria); los tags no son un
  vocabulario controlado (mapeo heurístico). Si el esquema cambia, `metadata_json`
  conserva el raw para depuración.
- **JClic**: `projects.json` no documentado como API estable; verificar
  periódicamente que la URL sigue activa.
