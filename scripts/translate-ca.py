#!/usr/bin/env python3
"""
Genera title_ca i notes_ca (traducció al català/valencià) per a les activitats
del catàleg que tenen títol/descripció en castellà i no tenen encara versió catalana.

Motor: API de DeepSeek (deepseek-chat). La clau es llig de DEEPSEEK_API_KEY
o de ~/.config/headroom/deepseek.env.

Alcance: es tradueixen les entrades en Castellano i les etiquetades Català/Valencià
que tenen el text real en castellà. S'exclouen Inglés/Francés/Aranés.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

GAMES_PATH = "data/games.json"
MODEL = "deepseek-chat"
BATCH_SIZE = 15
API_URL = "https://api.deepseek.com/chat/completions"

SKIP_LANGS = {"Ingles", "Inglés", "Frances", "Francés", "Aranes"}

CA_MARKERS = ['à', 'è', 'ï', 'ò', 'ç', 'l·l', 'ny', 'tx', 'tge', 'són',
              'és ', 'també', 'amb ', 'per a ', 'els ', 'les ', 'activitats',
              'educació', 'aprenentatge', 'jocs', 'música', 'pantalla', 'ratolí',
              'teclat', 'ordinador', 'dibuix', 'descarreg', 'xarxa', 'nivells',
              'mitjà', 'aula', 'dites', 'imatge', 'paraules']
ES_MARKERS = ['ción', 'sión', 'ñ', 'ch', 'llar', 'juego', 'juega', 'jugar',
              'juegos', 'aprend', 'trabaj', ' para ', ' con ', ' y ',
              'actividad', 'actividades', 'ejercicio', 'ejercicios', 'primaria',
              'secundaria', 'niño', 'niños', ' el ', ' la ', ' los ', ' las ',
              ' del ', 'herramienta', 'mejorar', 'puedes', 'desarrollar',
              'recursos', 'aprende', 'divertido', 'jugar ']


def looks_spanish(text):
    if not text:
        return False
    t = text.lower()
    has_ca = any(m in t for m in CA_MARKERS)
    has_es = any(m in t for m in ES_MARKERS)
    if has_ca:
        return False
    return has_es


def game_langs(game):
    raw = game.get('language')
    vals = raw if isinstance(raw, list) else [raw]
    return {str(v).strip() for v in vals if v}


def need_title(game):
    if (game.get('title_ca') or '').strip():
        return False
    title = (game.get('title') or '').strip()
    if not title:
        return False
    langs = game_langs(game)
    if langs and langs <= SKIP_LANGS:
        return False
    if 'Castellano' in langs:
        return True
    return looks_spanish(title)


def need_notes(game):
    if (game.get('notes_ca') or '').strip():
        return False
    notes = (game.get('notes') or '').strip()
    if not notes:
        return False
    langs = game_langs(game)
    if langs and langs <= SKIP_LANGS:
        return False
    if 'Castellano' in langs:
        return True
    return looks_spanish(notes)


def load_key():
    k = os.environ.get('DEEPSEEK_API_KEY')
    if k:
        return k
    env = os.path.expanduser('~/.config/headroom/deepseek.env')
    if os.path.exists(env):
        for line in open(env, encoding='utf-8'):
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                key, val = line.split('=', 1)
                if key in ('DEEPSEEK_API_KEY', 'api_key', 'API_KEY'):
                    return val.strip()
    sys.exit("Error: cal DEEPSEEK_API_KEY o ~/.config/headroom/deepseek.env")


def translate_batch(api_key, items):
    payload = {
        "model": MODEL,
        "max_tokens": 2048,
        "temperature": 0.2,
        "messages": [{
            "role": "user",
            "content": (
                "Tradueix al català/valencià aquests títols i descripcions "
                "d'activitats educatives escolars.\n"
                "Retorna ÚNICAMENT un array JSON, en el mateix ordre, amb el format:\n"
                "[{\"i\": 0, \"title_ca\": \"...\", \"notes_ca\": \"...\"}]\n"
                "Regles:\n"
                "- Si el text ja està en català, mantén-lo (normalitza lleugerament si cal).\n"
                "- Si \"notes\" és buit o absent, posa notes_ca com a cadena buida.\n"
                "- Registre natural, proper al valencià/català estàndard.\n\n"
                "Input:\n" + json.dumps(items, ensure_ascii=False)
            ),
        }],
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        API_URL, data=data, method='POST',
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + api_key,
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = json.loads(resp.read().decode('utf-8'))
    text = body['choices'][0]['message']['content'].strip()
    start = text.find('[')
    end = text.rfind(']') + 1
    if start == -1 or end == 0:
        raise ValueError('JSON no trobat en la resposta: ' + text[:200])
    return json.loads(text[start:end])


def main():
    api_key = load_key()
    games = json.load(open(GAMES_PATH, encoding='utf-8'))

    to_do = []
    for i, g in enumerate(games):
        if need_title(g) or need_notes(g):
            to_do.append((i, g))

    print(f"Activitats a traduir: {len(to_do)}")
    if not to_do:
        print("Res a fer.")
        return

    done = 0
    for start_idx in range(0, len(to_do), BATCH_SIZE):
        batch = to_do[start_idx:start_idx + BATCH_SIZE]
        items = []
        for j, (_, g) in enumerate(batch):
            item = {"i": j, "title": g.get('title', '')}
            if (g.get('notes') or '').strip():
                item["notes"] = g['notes']
            items.append(item)

        for attempt in range(3):
            try:
                results = translate_batch(api_key, items)
                break
            except Exception as e:
                print(f"  Error lot {start_idx // BATCH_SIZE + 1} (intent {attempt + 1}): {e}")
                results = None
                time.sleep(3)
        if results is None:
            print(f"  Lot {start_idx // BATCH_SIZE + 1} descartat, continua…")
            continue

        for res in results:
            j = res.get('i')
            if j is None:
                continue
            idx = batch[j][0]
            g = games[idx]
            if 'title_ca' in res and res['title_ca']:
                g['title_ca'] = res['title_ca']
            if 'notes_ca' in res:
                g['notes_ca'] = res.get('notes_ca') or ''
            done += 1

        # Guardat incremental per si es talla
        with open(GAMES_PATH, 'w', encoding='utf-8') as f:
            json.dump(games, f, ensure_ascii=False, indent=1)
        print(f"  Lot {start_idx // BATCH_SIZE + 1} OK ({len(batch)} items)")
        time.sleep(0.3)

    print(f"Traduccions aplicades: {done}")


if __name__ == '__main__':
    main()
