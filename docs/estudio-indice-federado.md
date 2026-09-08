# recursos.edutictac.es → Índice federado de REA (estudio de viabilidad)

Fecha: 2026-09-08 · Estado: pendiente de decisión

## Veredicto

SÍ es viable. Los tres formatos (JClic, H5P, SCORM) tienen fuentes de metadatos
estructurados reales (verificadas abajo). No existe software libre que haga
exactamente esto (índice federado multi-formato con ejecución y tracking unificado,
autocargado y privado por diseño). El proyecto llena un hueco real.

---

## 1. Auditoría del proyecto actual

| Pregunta | Respuesta |
|---|---|
| Arquitectura/framework | SPA estática sin framework (HTML+CSS+JS puro, ES modules) + PWA. Backend: FastAPI + SQLite (`recursos-api`, Python). |
| Modelo de recurso | Array plano `data/games.json` (1988 juegos). Campos ad-hoc: id,title,title_ca,area,language,url,notes,notes_ca,levels[],image,imageSource,flash,source,sourceColor,sourceUrl,fetchedAt. |
| Base de datos | SQLite solo para favoritos/valoraciones/reportes/propuestas. El catálogo NO está en BD: es JSON estático servido por nginx. |
| Buscador | Filtrado en cliente (`scripts/filters.js`), fuzzy-match. Filtros: texto, nivel, idioma, área, favoritos, propuestas, rotos/admin, rating. |
| Categorías/tags | `area` (1 valor), `levels` (array), `language`. Sin tags libres, formato ni proveedor. |
| Incorporación de recursos | Scripts one-shot (Node/Python) que reescriben games.json: CSV, WordPress, edu365, Archive.org Flash, JClic. |
| JClic actual | Simplemente enlazados: 1317 → clic.xtec.cat/projects/.../jclic.js/index.html, 331 → jclic.edutictac.es/play.html. URLs de play, sin metadatos JClic reales. |
| ¿Indexador JClic? | `import-jclic.py` es one-shot: lee JSON local (JaumeBalmes2017.../online-activities.json). No consulta fuente viva. |
| Cron/workers/CLI | No hay. Solo GitHub Actions: link-check.yml (diario) y deploy.yml (push). |
| Reutilizable | Backend FastAPI (sesión anónima, rate-limit, admin-token), check-links.mjs, captura de imágenes headless, mapeos área/idioma/nivel. |

---

## 2. Fuentes verificadas (peticiones reales)

### JClic — fuente oficial estructurada (sin scraping)
`https://clic.xtec.cat/projects/projects.json` → 200, lista de 2633 proyectos:
```json
{"id":2633,"path":"criptacoloniaguell","title":"...","author":"Pedro Pérez Floro...",
 "date":"30/07/19","langCodes":["ca"],"levelCodes":["PRI"],"areaCodes":["soc","tec"],
 "mainFile":"jclic.js/criptacoloniaguell.jclic","cover":"cover.jpg","thumbnail":"thumb.jpg"}
```
- play_url = `https://clic.xtec.cat/projects/{path}/jclic.js/index.html`
- cover/thumbnail en `https://clic.xtec.cat/projects/{path}/cover.jpg`
- Servicio de búsqueda: `https://clic.xtec.cat/db/repo-search/` (POST: language/subject/level/text/prj)
- Requiere mapear langCodes/levelCodes (PRI/INF/SEC)/areaCodes (soc/tec/...) → taxonomía propia.

### H5P OER Hub — API pública real
Base: `https://hub-api.h5p.org/v1/` (NO `api.h5p.org`).
- `/v1/contents` → 200 JSON público: `{total:7280, items:[], filterCounts:[]}`.
  - Paginación: `from` + `size` (verificado: size=20 → 20 items; from=20 avanza).
  - Filtros: `search`, `text`, `disciplines[]` (disciplines[]=mathematics → 100).
  - Campos por item: title, owner, contentType, icon, summary, description, language,
    publisher{...}, license{id,version,can_be_modified,allows_commercial_use},
    disciplines[], level, age, size, preview_url, screenshots[], downloads, updated_at.
- `/v1/metadata` → taxonomía disciplines (parent + translation) y más.
- `/v1/contents/{id}` → 403 (requiere registro). `/v1/contents/{id}/export` → 302 (.h5p).
- CAVEAT: es el backend del nuevo OER Hub, no API REST oficialmente documentada.
  Público y estable en la práctica, pero tratar como endpoint no-oficial y documentarlo.

### SCORM — no hay hub central
Formato que aparece en repositorios, no proveedor único. Pieza clave = parser de
`imsmanifest.xml` (detección 1.2/2004, metadatos LOM), seguro (defusedxml, límites,
zip-slip, XXE). Fuentes potenciales: Procomún/INTEF (herencia Agrega, OAI-PMH/LOM-ES)
y repositorios OER con paquetes públicos. Proveedor de ingesta por URL, sin scraper central.

---

## 3. Alternativas de software libre (por qué no encajan)

- Procomún (INTEF) / Agrega: repositorio nacional español de REA (LOM-ES/OAI-PMH).
  Es UN repositorio, no un índice federado multi-formato con ejecución. Agrega cerrado.
- OER Commons: API de repositorio anglosajona, servicio no totalmente libre, sin ejecución JClic/SCORM local.
- European Schoolnet LRE: agregador de metadatos, no ejecuta JClic/SCORM.
- Moodle / Open edX / Xerte: LMS o herramientas de autoría, no índices federados.

Ninguna cubre: descubrimiento unificado + JClic + H5P + SCORM + tracking pseudónimo
+ autocargado + privacidad por diseño.

---

## 4. Arquitectura propuesta

```
fuentes externas (projects.json · hub-api.h5p.org · paquetes SCORM)
        │
providers (Python): JClicProvider · H5POERHubProvider · SCORMProvider (por URL)
        │  normalize() → Resource (provider, external_id UNIQUE)
        ▼
Índice local (SQLite, en recursos-api): resources + sync_runs
        │
GET /api/resources (búsqueda unificada + filtros)
        ▼
Frontend recursos.edutictac.es (estático, consume la API)
```

Puntos clave:
1. Índice local en SQLite (extender recursos-api). games.json actual = provider "legacy/curated" (no perder los 1988 juegos).
2. Providers en Python, reutilizando import-jclic.py y mapeos. Abstracción ResourceProvider (discover/fetch/normalize/sync). CLI: `python -m recursos sync jclic|h5p|scorm|all`.
3. Modelo Resource con metadata_json (conservar metadato original) y (provider, external_id) UNIQUE.
4. SyncRun (provider, started/finished, fetched/created/updated/unchanged/errors, status).
5. SCORM: parser seguro de imsmanifest.xml, sin ejecutar nada, temporales borrados.
6. Licencias: license + license_known + license_metadata_json (acceso público ≠ libre).
7. Tracking futuro: solo interfaz ActivityTrackingAdapter, desacoplada de formatos.

---

## 5. Plan por fases

- FASE 1 Auditoría — HECHO.
- FASE 2 Investigación — HECHO (JClic y H5P verificadas; SCORM = parser + fuentes).
- FASE 3 Diseño — modelo Resource + SyncRun + contrato ResourceProvider + mapeo taxonomía.
- FASE 4 Núcleo — esquema SQLite, abstracción provider, CLI sync, normalización, stats.
- FASE 5 Primer provider — JClic (más estable).
- FASE 6 Segundo — H5P OER Hub (público, sin auth, metadatos ricos).
- FASE 7 Tercero — SCORM (ingesta por URL + parser imsmanifest seguro).
- FASE 8 Buscador — /api/resources + filtros + integración frontend.
- FASE 9 Administración — sección "Fuentes" (reutiliza admin-token).
- FASE 10 Tests + docs/resource-indexers.md (caveat H5P no-oficial).

---

## 6. Decisiones abiertas (pros/contras)

### 6.1 ¿Dónde vive el índice?
**A) SQLite en backend**
+ Búsqueda/filtros por API; escala; panel de fuentes gratis; encaja con stack actual; transaccional.
− PWA pierde modo 100% estático (salvo fallback JSON); dependencia runtime del backend; migración games.json; versionar esquema.

**B) JSON estático generado por CLI**
+ Cero cambios de infra; funciona offline sin backend; deploy idéntico al actual.
− JSON crece y todos lo descargan; búsqueda/filtros 100% cliente; dos fuentes de verdad (catálogo JSON vs resto SQLite); panel "Fuentes" sin apoyo; deduplicación frágil.

Recomendación: A (SQLite) con fallback JSON para modo offline.

### 6.2 Primer provider JClic
**A) Reindexar desde projects.json (sustituir 1542)**
+ Metadatos reales/completos; fuente canónica (enlaces se autocorrigen); proveedor jclic único; elimina deuda.
− Riesgo de perder curaciones (title_ca/notes_ca/imágenes); entran ~1000 actividades nuevas de golpe; hay que mapear códigos JClic.

**B) Coexistir y deduplicar después**
+ Menos riesgo inmediato; comparable antes de retirar.
− Duplicados; dos vías de verdad más tiempo; aplaza la limpieza.

Recomendación: A, conservando los 331 de jclic.edutictac.es como provider propio
(no duplicado) y migrando title_ca/notes_ca e imágenes que valgan la pena.

### 6.3 Por dónde empezar
**A) Núcleo + JClic primero (FASE 4+5)**
+ Valor tangible rápido; valida ResourceProvider sobre fuente estable; ajustes baratos.
− Decisiones pueden fijarse en código antes de quedar documentadas/revisables.

**B) docs/resource-indexers.md completo primero**
+ Documenta caveats antes de codificar; contrato congelado y revisable; sirve a Commons.
− Tiempo sin código; detalles solo se descubren implementando (doc inicial especulativa).

Recomendación: híbrido — docs/resource-indexers.md mínimo + FASE 4+5 (JClic) a continuación.
