#!/usr/bin/env python3
# Serveur local permanent pour Editeur LHEO EDOF
# Compatible Python 3.9+
# Placez ce fichier dans le meme dossier que editeur-lheo-edof.html

import os, sys, glob, http.server, socketserver, urllib.request, json, threading, webbrowser, ssl

PORT = 8765
DIR = os.path.dirname(os.path.abspath(__file__))

# Lire le token depuis ce fichier ou depuis le HTML
API_TOKEN = ""
try:
    for f in glob.glob(os.path.join(DIR, "editeur*.html")):
        with open(f, encoding='utf-8', errors='ignore') as fh:
            content = fh.read(50000)
        import re
        m = re.search(r"API_APPRENTISSAGE_TOKEN='([^']+)'", content)
        if m:
            API_TOKEN = m.group(1)
            break
except Exception:
    pass

def find_html():
    files = glob.glob(os.path.join(DIR, "editeur-lheo-edof*.html"))
    if not files:
        files = glob.glob(os.path.join(DIR, "editeur*.html"))
    return os.path.basename(max(files, key=os.path.getmtime)) if files else None

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=DIR, **kw)

    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]  # ignorer query string

        if path in ('/', ''):
            html = find_html()
            if html:
                self.send_response(302)
                self.send_header('Location', '/' + html)
                self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'Aucun fichier editeur-lheo-edof.html trouve')
            return

        if path == '/ping':
            body = json.dumps({'ok': True, 'file': find_html()}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(body)
            return

        if path.startswith('/proxy/apprentissage/'):
            rncp = ''
            if 'identifiant.rncp=' in self.path:
                rncp = self.path.split('identifiant.rncp=')[-1].split('&')[0]
            token = self.headers.get('X-App-Token', '') or API_TOKEN
            url = 'https://api.apprentissage.beta.gouv.fr/api/certification/v1?identifiant.rncp=' + rncp
            req = urllib.request.Request(url, headers={
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            })
            try:
                with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
                    data = r.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                body = json.dumps({'error': str(e)}).encode()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(body)
            return

        if path.startswith('/proxy/koumoul/'):
            # Proxy vers l'API Koumoul RNCP (France Compétences)
            qs = self.path[len('/proxy/koumoul/'):].lstrip('?')
            koumoul_url = 'https://opendata.koumoul.com/data-fair/api/v1/datasets/competences-rncp/lines?' + qs
            req = urllib.request.Request(koumoul_url, headers={'Accept': 'application/json', 'User-Agent': 'EditeurLHEO/1.0'})
            try:
                with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
                    data = r.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                body = json.dumps({'error': str(e)}).encode()
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(body)
            return

        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-App-Token')
        self.end_headers()

    def log_message(self, fmt, *args):
        pass  # silencieux

html_file = find_html() or 'editeur-lheo-edof.html'
print('Editeur LHEO disponible sur : http://localhost:{}/{}'.format(PORT, html_file))
print('Appuyez sur Ctrl+C pour arreter.')
print('Pour mettre a jour : remplacez le .html et rechargez (F5).')

def open_when_ready():
    import time
    for _ in range(30):
        try:
            urllib.request.urlopen('http://localhost:{}/ping'.format(PORT), timeout=0.5)
            webbrowser.open('http://localhost:{}/{}'.format(PORT, html_file))
            return
        except Exception:
            time.sleep(0.3)
    webbrowser.open('http://localhost:{}/{}'.format(PORT, html_file))

threading.Thread(target=open_when_ready, daemon=True).start()

try:
    server = socketserver.TCPServer(('', PORT), Handler)
    server.serve_forever()
except KeyboardInterrupt:
    print('Serveur arrete.')
except OSError as e:
    if '10048' in str(e) or 'Address already in use' in str(e):
        html_file = find_html() or 'editeur-lheo-edof.html'
        print('Port {} deja utilise - ouverture navigateur...'.format(PORT))
        webbrowser.open('http://localhost:{}/{}'.format(PORT, html_file))
    else:
        raise
