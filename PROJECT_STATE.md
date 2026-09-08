# Estado del Proyecto: Recursos EduTicTac

Fecha: 2026-09-08

## Repositorios

- Frontend: `/home/daizan/github/web/recursos`
- API: `/home/daizan/github/web/recursos-api`
- Producción frontend: `/var/www/recursos`
- Producción API: `/opt/recursos-api`
- Servicio API: `recursos-api.service` en `127.0.0.1:8004`, publicado bajo `https://recursos.edutictac.es/api/`

## Estado Actual

- Login con Authentik funciona en producción.
- El endpoint `/api/auth/me` funciona y devuelve estado de sesión.
- El usuario registrado por Authentik quedó configurado como admin mediante `OIDC_ADMIN_SUBS` en `/etc/recursos-api.env`.
- El token admin por URL quedó eliminado:
  - Ya no existe `/api/admin/login`.
  - Ya no se acepta `?admin=TOKEN` en frontend.
- Cookies corregidas:
  - `Secure`
  - `HttpOnly`
  - `SameSite=Lax`
- El frontend tiene botón admin `×` para ocultar actividades.
- Ocultar una actividad llama a `POST /api/admin/resources/hide` y marca `broken_reports.admin_reported=1`.
- Ocultar no borra físicamente del JSON ni de la fuente original; solo la saca del listado público normal.

## Últimos Commits Relevantes

API (`recursos-api`):

- `c8f5871 Add admin resource hide endpoint`
- `d2d5fad Allow OIDC admins by subject`
- `bf8aba1 Use verified id token for OIDC login`
- `a5054b7 Fix Authlib userinfo request`
- `978d96b Fix Authentik OAuth callback`

Frontend (`recursos`):

- `3086d6b Add admin hide action to resource cards`
- `9e08378 Remove admin token URL login`

## Validaciones Ejecutadas

- API: `pytest` -> 23 tests OK.
- API: `python3 -m py_compile main.py app/*.py app/providers/*.py` OK.
- Frontend: `node --check` en módulos tocados OK.
- `git diff --check` OK en ambos repos.
- Producción:
  - `/api/health` OK.
  - `/api/auth/login` redirige a Authentik.
  - `/api/admin/resources/hide` responde `403` sin sesión admin, esperado.
  - Frontend publicado contiene la acción admin y service worker `recursos-v1.5.2`.

## Pendiente Conocido

- En `/home/daizan/github/web/recursos` quedan cambios locales sin commit en:
  - `data/games-home.json`
  - `data/games.json`
- Esos cambios no se han tocado ni incluido en los commits de autenticación/admin.

