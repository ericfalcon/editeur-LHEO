/*!
 * Assistant réglementaire — chatbot gratuit pour site web
 * Aucune IA payante, aucun serveur, aucune clé d'API.
 * Il lit les pages (et les PDF) du site, puis répond en citant
 * les passages les plus pertinents avec un lien vers la source.
 * Licence MIT.
 */
(function (G) {
  'use strict';
  var VERSION = '1.0.0';

  /* =====================================================================
   * 1. Traitement du texte (français)
   * ===================================================================== */
  var STOP = new Set(('a au aux avec ce ces cet cette dans de des du elle elles en et eux il ils je ' +
    'la le les leur leurs lui ma mais me meme mes moi mon ne nos notre nous on ou par pas pour qu que ' +
    'qui quoi sa se ses son sur ta te tes toi ton tu un une vos votre vous c d j l m n s t y ete etre ' +
    'avoir est sont suis es ai as avons avez ont etait faut peut peuvent peux doit doivent dois quel ' +
    'quelle quels quelles comment combien pourquoi quand donc car si plus tout tous toute toutes faire ' +
    'fait fais cela ca ceci celui celle bonjour bonsoir salut merci svp stp alors aussi bien tres etc ' +
    'entre chez vers ni oui hello coucou voudrais veux souhaite savoir connaitre dire info infos ' +
    'information informations question existe-t-il ya').split(' '));

  function fold(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  }

  // Racinisation française légère : suffisante pour rapprocher
  // « animateur / animation / animer » ou « encadrement / encadrer ».
  var SUFFIXES = ['issement', 'atrice', 'ateur', 'ation', 'ement', 'trice', 'ment', 'ance', 'ence',
    'ante', 'rice', 'euse', 'ant', 'ite', 'ive', 'ion', 'eur', 'eux', 'ee', 'er', 'ez', 'if', 'e'];
  function stem(w) {
    if (w.length <= 3 || /\d/.test(w)) return w;
    if (/aux$/.test(w)) w = w.slice(0, -3) + 'al';
    else if (!/eux$/.test(w) && /[sx]$/.test(w) && w.length > 4) w = w.slice(0, -1);
    for (var i = 0; i < SUFFIXES.length; i++) {
      var s = SUFFIXES[i];
      if (w.length - s.length >= 4 && w.slice(-s.length) === s) return w.slice(0, -s.length);
    }
    return w;
  }
  function words(s) {
    return fold(s).replace(/['’`]/g, ' ').split(/[^a-z0-9]+/);
  }
  var NUM = { deux: '2', trois: '3', quatre: '4', cinq: '5', six: '6', sept: '7', huit: '8', neuf: '9', dix: '10',
    onze: '11', douze: '12', treize: '13', quatorze: '14', quinze: '15', seize: '16', vingt: '20', trente: '30' };
  function tokens(s) {
    var out = [], ws = words(s);
    for (var i = 0; i < ws.length; i++) {
      var w = NUM[ws[i]] || ws[i];
      if (!w || STOP.has(w) || (w.length < 2 && !/\d/.test(w))) continue;
      out.push(stem(w));
    }
    return out;
  }

  /* Synonymes : chaque groupe = expressions équivalentes. À adapter au site. */
  var DEFAULT_SYNONYMS = [
    ['acm', 'accueil collectif de mineurs', 'accueil de loisirs', 'centre de loisirs', 'alsh', 'colonie', 'colo', 'sejour de vacances', 'periscolaire'],
    ['taux d encadrement', 'encadrement', 'nombre d animateurs', 'ratio', 'quota'],
    ['bafa', 'brevet d aptitude aux fonctions d animateur', 'animateur'],
    ['bafd', 'brevet d aptitude aux fonctions de directeur', 'directeur', 'direction'],
    ['sdjes', 'ddcs', 'ddcspp', 'jeunesse et sports', 'drajes', 'administration'],
    ['psc1', 'premiers secours', 'secourisme', 'sst'],
    ['assistant sanitaire', 'sante', 'infirmerie', 'medicament', 'traitement', 'pai'],
    ['baignade', 'piscine', 'natation', 'surveillant de baignade', 'bnssa', 'test d aisance aquatique'],
    ['declaration', 'teleprocedure', 'tam', 'fiche initiale', 'fiche complementaire'],
    ['mini camp', 'camp', 'hebergement', 'nuitee', 'bivouac', 'tente'],
    ['moins de 6 ans', 'maternelle', 'petite enfance'],
    ['stagiaire', 'stage pratique', 'session'],
    ['salaire', 'remuneration', 'paye', 'cee', 'contrat d engagement educatif'],
    ['honorabilite', 'casier judiciaire', 'fijais', 'controle']
  ];
  function compileSynonyms(groups) {
    return (groups || []).map(function (g) {
      return g.map(function (p) { return tokens(p); }).filter(function (t) { return t.length; });
    });
  }

  /* =====================================================================
   * 2. Extraction du texte d'une page HTML
   * ===================================================================== */
  var SKIP = /^(SCRIPT|STYLE|NOSCRIPT|NAV|HEADER|FOOTER|ASIDE|FORM|IFRAME|SVG|BUTTON|SELECT|TEXTAREA|TEMPLATE|CANVAS|VIDEO|AUDIO|OBJECT|INPUT|LABEL)$/;
  var BLOCK = /^(P|DIV|SECTION|ARTICLE|MAIN|UL|OL|LI|DL|DT|DD|TABLE|THEAD|TBODY|TFOOT|TR|BLOCKQUOTE|PRE|FIGURE|FIGCAPTION|ADDRESS|DETAILS|SUMMARY|HR|BR|CAPTION|CENTER)$/;
  var NOISE = ['[role=navigation]', '[role=banner]', '[role=contentinfo]', '.menu', '.nav', '.navbar',
    '.sidebar', '.widget-area', '.breadcrumb', '.breadcrumbs', '#comments', '.comments-area', '.cookie',
    '#cookie-notice', '.cookie-notice', '.sharedaddy', '.social', '.screen-reader-text', '#pacb-root'];
  var MAIN = ['main', '[role=main]', '.entry-content', '.post-content', '.page-content', 'article', '#content', '.content'];

  function clean(t) {
    return t.replace(/\[\/?[a-z_][a-z0-9_-]*[^\]]*\]/gi, ' ') // shortcodes WordPress non rendus
      .replace(/\s+/g, ' ').replace(/(\s*\|)+\s*$/, '').trim();
  }

  function extractBlocks(root) {
    var out = [], buf = '';
    function flush() { var t = clean(buf); buf = ''; if (t.length > 1) out.push({ x: t }); }
    function walk(n) {
      if (n.nodeType === 3) { buf += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      var tag = String(n.tagName).toUpperCase();
      if (SKIP.test(tag)) return;
      if (/^H[1-6]$/.test(tag)) {
        flush();
        var t = clean(n.textContent || '');
        var idEl = n.getAttribute('id') ? n : (n.querySelector && n.querySelector('[id]'));
        if (t) out.push({ h: +tag.charAt(1), x: t, id: idEl ? idEl.getAttribute('id') : '' });
        return;
      }
      var block = BLOCK.test(tag);
      if (block) flush();
      for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
      if (tag === 'TD' || tag === 'TH') buf += ' | ';
      if (block) flush();
    }
    walk(root); flush();
    return out;
  }

  function pageFromHTML(html, url, parseHTML, isFragment) {
    var doc = parseHTML(html);
    var links = [];
    var anchors = doc.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      try {
        links.push({ u: new URL(anchors[i].getAttribute('href'), url).href.split('#')[0],
          t: clean(anchors[i].textContent || '') });
      } catch (e) { /* lien invalide */ }
    }
    var title = '';
    if (!isFragment) {
      var h1 = doc.querySelector('h1');
      title = clean((h1 && h1.textContent) || doc.title || '');
      NOISE.forEach(function (sel) {
        try { var els = doc.querySelectorAll(sel); for (var j = 0; j < els.length; j++) els[j].remove(); } catch (e) { /* sélecteur non supporté */ }
      });
    }
    var root = null;
    if (!isFragment) for (var k = 0; k < MAIN.length && !root; k++) root = doc.querySelector(MAIN[k]);
    root = root || doc.body || doc.documentElement;
    var nInputs = root.querySelectorAll ? root.querySelectorAll('input[type=number],input[type=range]').length : 0;
    return { u: url, t: title, blocks: extractBlocks(root), links: links, inputs: nInputs };
  }

  /* =====================================================================
   * 3. Découpage en passages
   * ===================================================================== */
  var MAX_CHUNK = 900;
  function splitLong(text) {
    if (text.length <= MAX_CHUNK) return [text];
    var parts = text.split(/(?<=[.!?;])\s+/), out = [], cur = '';
    parts.forEach(function (p) {
      if (cur && cur.length + p.length > MAX_CHUNK * 0.7) { out.push(cur); cur = ''; }
      cur += (cur ? ' ' : '') + p;
    });
    if (cur) out.push(cur);
    return out;
  }

  function chunkPage(page) {
    var chunks = [], path = [], anchor = '', cur = null;
    function start() { cur = { u: page.u, a: anchor, t: page.t, h: path.filter(Boolean).join(' › '), x: '' }; }
    function end() { if (cur && cur.x.length >= 25) chunks.push(cur); cur = null; }
    page.blocks.forEach(function (b) {
      if (b.h) {
        end();
        path = path.slice(0, b.h - 1);
        if (!(b.h === 1 && fold(b.x) === fold(page.t))) path[b.h - 1] = b.x;
        anchor = b.id ? b.id : '';
        return;
      }
      splitLong(b.x).forEach(function (piece) {
        if (!cur) start();
        if (cur.x.length + piece.length > MAX_CHUNK && cur.x.length > 150) { end(); start(); }
        cur.x += (cur.x ? '\n' : '') + piece;
      });
    });
    end();
    return chunks;
  }

  function pdfChunks(url, title, pages) {
    var chunks = [];
    pages.forEach(function (p) {
      var text = p.text.replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
      splitLong(text.replace(/\n/g, ' ')).forEach(function (x) {
        if (x.length >= 25) chunks.push({ u: url, a: 'page=' + p.n, t: title, h: 'Page ' + p.n, x: x });
      });
    });
    return chunks;
  }

  /* =====================================================================
   * 4. Lecture du site (navigateur ou Node)
   * ===================================================================== */
  var SKIP_URL = /\.(jpe?g|png|gif|webp|svg|ico|zip|rar|7z|docx?|xlsx?|pptx?|odt|ods|mp4|mp3|wav|avi|mov|css|js|json|xml|txt)(\?|$)|\/(wp-admin|wp-login|wp-json|feed|tag|category|author|cart|panier|checkout|my-account|mon-compte)(\/|$)|\/page\/\d+\/?$|[?&](replytocom|share|s)=/i;

  function sameSite(u, origin) {
    try {
      var a = new URL(u), b = new URL(origin);
      return a.hostname.replace(/^www\./, '') === b.hostname.replace(/^www\./, '');
    } catch (e) { return false; }
  }
  function decodeXml(s) {
    return s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
  }
  function locs(xml) {
    var out = [], re = /<loc>([\s\S]*?)<\/loc>/gi, m;
    while ((m = re.exec(xml))) out.push(decodeXml(m[1]));
    return out;
  }

  async function pool(items, n, fn) {
    var i = 0;
    async function worker() { while (i < items.length) { var k = i++; await fn(items[k], k); } }
    var ws = []; for (var w = 0; w < Math.min(n, items.length); w++) ws.push(worker());
    await Promise.all(ws);
  }

  async function readSitemaps(o) {
    var cands = [];
    var robots = await o.fetchText(o.origin + '/robots.txt');
    if (robots && robots.text) {
      robots.text.split(/\r?\n/).forEach(function (l) { var m = /^\s*sitemap:\s*(\S+)/i.exec(l); if (m) cands.push(m[1]); });
    }
    ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml'].forEach(function (p) { cands.push(o.origin + p); });
    var seen = new Set(), urls = [];
    async function read(u, depth) {
      if (seen.has(u) || depth > 2) return;
      seen.add(u);
      var r = await o.fetchText(u);
      if (!r || !r.text || !/<(urlset|sitemapindex)/i.test(r.text)) return;
      if (/<sitemapindex/i.test(r.text)) {
        var subs = locs(r.text).filter(function (s) { return !/(author|users|taxonom|category|tag|image|video|product_cat)/i.test(s); });
        for (var i = 0; i < subs.length; i++) await read(subs[i], depth + 1);
      } else {
        locs(r.text).forEach(function (x) { urls.push(x); });
      }
    }
    for (var i = 0; i < cands.length && !urls.length; i++) await read(cands[i], 0);
    return urls;
  }

  async function readWordPress(o) {
    var pages = [];
    for (var type of ['pages', 'posts']) {
      for (var p = 1; p <= 10; p++) {
        var r = await o.fetchText(o.origin + '/wp-json/wp/v2/' + type + '?per_page=100&page=' + p + '&_fields=link,title,content');
        if (!r || !r.ok) break;
        var arr; try { arr = JSON.parse(r.text); } catch (e) { break; }
        if (!Array.isArray(arr) || !arr.length) break;
        arr.forEach(function (it) {
          if (!it || !it.content || !it.link) return;
          var pg = pageFromHTML(it.content.rendered || '', it.link, o.parseHTML, true);
          pg.t = clean(pageFromHTML('<p>' + ((it.title && it.title.rendered) || '') + '</p>', it.link, o.parseHTML, true)
            .blocks.map(function (b) { return b.x; }).join(' '));
          pages.push(pg);
        });
        if (arr.length < 100) break;
      }
    }
    var total = pages.reduce(function (n, pg) { return n + pg.blocks.reduce(function (m, b) { return m + b.x.length; }, 0); }, 0);
    return total > 1500 ? pages : null; // contenu trop maigre (page builder…) → lecture HTML
  }

  /**
   * Construit l'index de passages du site.
   * o = { origin, fetchText(url) -> {ok,text}|null, parseHTML(html) -> Document,
   *       source: 'auto'|'wordpress'|'html', urls, exclude:[RegExp|string], maxPages, maxPdfs,
   *       extractPdf(url) -> [{n,text}] | null, onProgress(msg) }
   */
  async function buildIndex(o) {
    var progress = o.onProgress || function () {};
    var exclude = (o.exclude || []).map(function (e) { return e instanceof RegExp ? e : new RegExp(e, 'i'); });
    var keep = function (u) { return sameSite(u, o.origin) && !SKIP_URL.test(u) && !/\.pdf(\?|$)/i.test(u) && !exclude.some(function (re) { return re.test(u); }); };
    var maxPages = o.maxPages || 150;
    var pages = null, pdfs = new Map();

    if (!o.urls && o.source !== 'html') {
      progress('Lecture des contenus du site…');
      pages = await readWordPress(o);
    }
    if (!pages) {
      var list = o.urls ? o.urls.map(function (u) { return new URL(u, o.origin).href; }) : null;
      if (!list) { progress('Lecture du plan du site…'); list = await readSitemaps(o); }
      var crawlLinks = !list.length;
      if (crawlLinks) list = [o.origin + '/'];
      list = Array.from(new Set(list.filter(keep))).slice(0, maxPages);
      pages = [];
      var seen = new Set(list), done = 0, queue = list.slice();
      while (queue.length && pages.length < maxPages) {
        var batch = queue.splice(0, 6);
        await pool(batch, 4, async function (u) {
          var r = await o.fetchText(u);
          done++;
          progress('Lecture des pages… ' + done + '/' + Math.max(done, seen.size));
          if (!r || !r.ok || !r.text || !/<html|<body|<p/i.test(r.text)) return;
          var pg = pageFromHTML(r.text, u, o.parseHTML, false);
          pages.push(pg);
          if (crawlLinks) pg.links.forEach(function (l) {
            if (keep(l.u) && !seen.has(l.u) && seen.size < maxPages) { seen.add(l.u); queue.push(l.u); }
          });
        });
      }
    }

    // Suppression des blocs répétés sur la plupart des pages (menus, bandeaux…)
    if (pages.length >= 4) {
      var freq = new Map();
      pages.forEach(function (pg) {
        new Set(pg.blocks.filter(function (b) { return !b.h; }).map(function (b) { return b.x; }))
          .forEach(function (x) { freq.set(x, (freq.get(x) || 0) + 1); });
      });
      var lim = Math.max(3, pages.length * 0.5);
      pages.forEach(function (pg) { pg.blocks = pg.blocks.filter(function (b) { return b.h || (freq.get(b.x) || 0) < lim; }); });
    }

    var chunks = [];
    pages.forEach(function (pg) {
      if (!pg.t) pg.t = decodeURIComponent(new URL(pg.u).pathname.replace(/\/$/, '').split('/').pop() || 'Accueil').replace(/[-_]/g, ' ');
      chunks = chunks.concat(chunkPage(pg));
      pg.links.forEach(function (l) {
        if (/\.pdf(\?|$)/i.test(l.u) && sameSite(l.u, o.origin) && !pdfs.has(l.u)) pdfs.set(l.u, l.t);
      });
    });

    if (o.extractPdf && pdfs.size) {
      var list2 = Array.from(pdfs.keys()).slice(0, o.maxPdfs == null ? 30 : o.maxPdfs), n = 0;
      await pool(list2, 2, async function (u) {
        try {
          var pp = await o.extractPdf(u);
          n++; progress('Lecture des documents PDF… ' + n + '/' + list2.length);
          if (pp) {
            var t = pdfs.get(u) || decodeURIComponent(u.split('/').pop().replace(/\.pdf.*$/i, '')).replace(/[-_]/g, ' ');
            chunks = chunks.concat(pdfChunks(u, t, pp));
          }
        } catch (e) { /* PDF illisible : ignoré */ }
      });
    }
    var tools = pages.filter(isToolPage).map(function (pg) {
      var first = pg.blocks.filter(function (b) { return !b.h && b.x.length > 30; })[0];
      return { u: pg.u, t: pg.t, d: first ? first.x.slice(0, 140).replace(/\s+\S*$/, '') + (first.x.length > 140 ? '…' : '') : '' };
    });
    return { v: 2, site: o.origin, built: new Date().toISOString(), pages: pages.length, pdfs: pdfs.size, chunks: chunks, tools: tools };
  }

  /* Calculatrices : page dont le titre ou l'adresse parle de calcul/simulation,
     ou qui contient des champs numériques. */
  var TOOL_WORDS = /calcul|simulat|estimat|calculette/;
  function isToolPage(pg) {
    var path = ''; try { path = new URL(pg.u).pathname; } catch (e) { /* */ }
    return TOOL_WORDS.test(fold(pg.t + ' ' + path)) || pg.inputs > 0;
  }
  var GENERIC = new Set(tokens('calcul calculer calculatrice calculatrices calculette calculateur simulateur ' +
    'simulation simuler estimation estimer outil outils page site'));
  var CALC_INTENT = /\b(combien|montant|cout|coute|couter|prix|tarif|nombre|total)\b/;

  /* =====================================================================
   * 5. Moteur de recherche (BM25 + synonymes + bonus d'expression)
   * ===================================================================== */
  function Engine(chunks, synonyms) {
    var self = this;
    this.chunks = chunks;
    this.syn = compileSynonyms(synonyms || DEFAULT_SYNONYMS);
    this.df = new Map();
    var total = 0;
    this.docs = chunks.map(function (c) {
      var tf = new Map(), len = 0, xt = tokens(c.x), bi = new Set();
      function add(arr, w) { arr.forEach(function (t) { tf.set(t, (tf.get(t) || 0) + w); len += w; }); }
      add(xt, 1); add(tokens(c.h), 2); add(tokens(c.t), 1.5);
      for (var i = 0; i + 1 < xt.length; i++) bi.add(xt[i] + ' ' + xt[i + 1]);
      tf.forEach(function (v, t) { self.df.set(t, (self.df.get(t) || 0) + 1); });
      total += len;
      return { tf: tf, len: len, bi: bi };
    });
    this.N = chunks.length;
    this.avg = total / Math.max(1, this.N);
  }
  Engine.prototype.idf = function (t) {
    var df = this.df.get(t) || 0;
    return Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
  };
  Engine.prototype.search = function (q, k) {
    var seq = tokens(q), orig = Array.from(new Set(seq));
    if (!orig.length) return { terms: [], results: [] };
    var qset = new Set(orig), terms = new Map();
    orig.forEach(function (t) { terms.set(t, { w: 1, src: [t] }); });
    this.syn.forEach(function (g) {
      var hit = g.filter(function (p) { return p.every(function (t) { return qset.has(t); }); });
      if (!hit.length) return;
      var src = Array.from(new Set([].concat.apply([], hit)));
      g.forEach(function (p) {
        p.forEach(function (t) { if (!terms.has(t)) terms.set(t, { w: 0.6, src: src }); });
      });
    });
    var k1 = 1.2, b = 0.75, self = this, res = [];
    this.docs.forEach(function (d, i) {
      var score = 0, ok = new Set();
      terms.forEach(function (info, t) {
        var f = d.tf.get(t);
        if (!f) return;
        score += info.w * self.idf(t) * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / self.avg));
        info.src.forEach(function (s) { ok.add(s); });
      });
      if (!score) return;
      for (var j = 0; j + 1 < seq.length; j++) {
        if (d.bi.has(seq[j] + ' ' + seq[j + 1])) score += 0.5 * (self.idf(seq[j]) + self.idf(seq[j + 1]));
      }
      var cov = ok.size / orig.length;
      res.push({ i: i, score: score * (0.3 + 0.7 * cov), cov: cov });
    });
    res.sort(function (x, y) { return y.score - x.score; });
    var minCov = orig.length <= 2 ? 0.5 : 0.4;
    res = res.filter(function (r) { return r.cov >= minCov; });
    var top = res.length ? res[0].score : 0, out = [], keys = new Set();
    for (var r = 0; r < res.length && out.length < (k || 3); r++) {
      if (res[r].score < top * 0.45) break;
      var c = this.chunks[res[r].i], key = c.u + '#' + c.a + '|' + c.x.slice(0, 60);
      if (keys.has(key)) continue;
      keys.add(key);
      out.push({ chunk: c, score: res[r].score, cov: res[r].cov });
    }
    return { terms: Array.from(terms.keys()), results: out };
  };

  Engine.prototype.setTools = function (tools) {
    var seen = new Set();
    this.tools = (tools || []).filter(function (t) {
      var k = t.u.replace(/[?#].*$/, '').replace(/\/$/, '');
      if (!t.u || seen.has(k)) return false;
      seen.add(k); return true;
    }).map(function (t) {
      return { tool: t, tk: new Set(tokens(t.t + ' ' + (t.d || '') + ' ' + (t.k || '')).filter(function (x) { return !GENERIC.has(x); })) };
    });
    return this;
  };
  /* -> { all: true } si on demande « les calculatrices », sinon les 2 plus pertinentes */
  Engine.prototype.matchTools = function (q, expanded) {
    var tools = this.tools || [];
    if (!tools.length) return { all: false, list: [] };
    var qt = tokens(q), f = fold(q);
    var named = qt.some(function (t) { return GENERIC.has(t); });
    var specific = qt.filter(function (t) { return !GENERIC.has(t); });
    if (named && !specific.length) return { all: true, list: tools.map(function (x) { return x.tool; }) };
    var intent = named || /\d/.test(q) || CALC_INTENT.test(f);
    var own = new Set(specific);
    var terms = new Set((expanded || specific).filter(function (t) { return !GENERIC.has(t); }));
    var res = [];
    tools.forEach(function (x) {
      // mot de la question = 1 point, synonyme = 0,5 point
      var n = 0; terms.forEach(function (t) { if (x.tk.has(t)) n += own.has(t) ? 1 : 0.5; });
      if (n >= 1 && (intent || n >= 2)) res.push({ tool: x.tool, n: n });
    });
    res.sort(function (a, b) { return b.n - a.n; });
    res = res.filter(function (r) { return r.n >= res[0].n * 0.75; });
    if (named && !res.length) return { all: true, list: tools.map(function (x) { return x.tool; }) };
    return { all: false, list: res.slice(0, 2).map(function (r) { return r.tool; }) };
  };

  /* Meilleur extrait (≈ 450 caractères) autour des mots recherchés */
  function excerpt(text, termSet, size) {
    size = size || 450;
    var sents = [], ends = [];
    text.split('\n').forEach(function (line) {
      var parts = line.split(/(?<=[.!?;])\s+/).filter(Boolean);
      parts.forEach(function (p, i) { sents.push(p); ends.push(i === parts.length - 1); });
    });
    if (!sents.length) return text;
    var best = 0, bestScore = -1;
    sents.forEach(function (s, i) {
      var seen = new Set();
      tokens(s).forEach(function (t) { if (termSet.has(t)) seen.add(t); });
      if (seen.size > bestScore) { bestScore = seen.size; best = i; }
    });
    var lo = best, hi = best, len = sents[best].length;
    while (len < size && (lo > 0 || hi < sents.length - 1)) {
      if (hi < sents.length - 1) { hi++; len += sents[hi].length; }
      if (len < size && lo > 0) { lo--; len += sents[lo].length; }
    }
    var out = '';
    for (var j = lo; j <= hi; j++) out += sents[j] + (j < hi ? (ends[j] ? '\n' : ' ') : '');
    if (out.length > size * 1.6) out = out.slice(0, size * 1.6).replace(/\s+\S*$/, '') + ' …';
    return (lo > 0 ? '… ' : '') + out + (hi < sents.length - 1 && !/…$/.test(out) ? ' …' : '');
  }

  var core = { VERSION: VERSION, fold: fold, stem: stem, tokens: tokens, extractBlocks: extractBlocks,
    pageFromHTML: pageFromHTML, isToolPage: isToolPage, chunkPage: chunkPage, pdfChunks: pdfChunks, buildIndex: buildIndex,
    Engine: Engine, excerpt: excerpt, DEFAULT_SYNONYMS: DEFAULT_SYNONYMS };
  G.PAChatbotCore = core;

  /* =====================================================================
   * 6. Widget (navigateur uniquement)
   * ===================================================================== */
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var script = document.currentScript;
  var ds = (script && script.dataset) || {};
  var cfg = Object.assign({
    title: 'Assistant réglementation',
    subtitle: 'Réponses tirées des textes du site',
    welcome: 'Bonjour 👋 Je réponds à vos questions de réglementation en m\'appuyant sur les textes publiés sur ce site. Posez votre question !',
    color: '#1f6feb',
    position: 'right',
    contactUrl: '',
    contactLabel: 'nous contacter',
    indexUrl: '',
    source: 'auto',
    urls: null,
    exclude: [],
    maxPages: 150,
    maxPdfs: 30,
    pdf: true,
    cacheHours: 24,
    suggestions: ['Quel est le taux d\'encadrement en accueil de loisirs ?', 'Comment se passe le BAFA ?', 'Quelles règles pour la baignade ?'],
    synonyms: null,
    tools: [],          // calculatrices ajoutées à la main : [{ title, url, keywords }]
    autoTools: true,    // détecter automatiquement les calculatrices du site
    disclaimer: 'Réponses extraites automatiquement des pages du site : vérifiez toujours le texte source.'
  }, G.PAChatbotConfig || {});
  ['title', 'subtitle', 'welcome', 'color', 'position', 'contactUrl', 'contactLabel', 'indexUrl', 'source'].forEach(function (k) {
    if (ds[k]) cfg[k] = ds[k];
  });
  var synonyms = (cfg.synonyms || DEFAULT_SYNONYMS).concat(cfg.synonymsExtra || []);

  var CACHE_KEY = 'pacb-index-v2:' + location.host;
  var engine = null, loading = null;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]; });
  }
  function highlight(text, termSet) {
    var out = '', last = 0, re = /[\p{L}\p{N}]+/gu, m;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index));
      var w = fold(m[0]); w = NUM[w] || w;
      out += (!STOP.has(w) && (w.length > 1 || /\d/.test(w)) && termSet.has(stem(w))) ? '<mark>' + esc(m[0]) + '</mark>' : esc(m[0]);
      last = m.index + m[0].length;
    }
    return out + esc(text.slice(last));
  }

  function browserFetch(u) {
    return fetch(u, { credentials: 'same-origin', redirect: 'follow' })
      .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, text: t }; }); })
      .catch(function () { return null; });
  }
  var pdfjsPromise = null;
  function loadPdfJs() {
    if (G.pdfjsLib) return Promise.resolve(G.pdfjsLib);
    if (pdfjsPromise) return pdfjsPromise;
    var base = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
    pdfjsPromise = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = base + 'pdf.min.js';
      s.onload = function () { G.pdfjsLib.GlobalWorkerOptions.workerSrc = base + 'pdf.worker.min.js'; res(G.pdfjsLib); };
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return pdfjsPromise;
  }
  async function browserPdf(u) {
    var lib = await loadPdfJs();
    var doc = await lib.getDocument({ url: u }).promise, pages = [];
    for (var n = 1; n <= Math.min(doc.numPages, 200); n++) {
      var tc = await (await doc.getPage(n)).getTextContent();
      pages.push({ n: n, text: tc.items.map(function (it) { return it.str + (it.hasEOL ? '\n' : ' '); }).join('') });
    }
    return pages;
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var idx = JSON.parse(raw);
      if (Date.now() - new Date(idx.built).getTime() > cfg.cacheHours * 3600e3) return null;
      return idx;
    } catch (e) { return null; }
  }
  function writeCache(idx) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(idx)); } catch (e) { /* quota : tant pis */ }
  }

  function ensureIndex(onProgress) {
    if (engine) return Promise.resolve(engine);
    if (loading) return loading;
    loading = (async function () {
      var idx = null;
      if (cfg.indexUrl) {
        try { var r = await fetch(cfg.indexUrl, { cache: 'no-cache' }); if (r.ok) idx = await r.json(); } catch (e) { idx = null; }
      }
      if (!idx) idx = readCache();
      if (!idx) {
        var parser = new DOMParser();
        idx = await buildIndex({
          origin: location.origin,
          fetchText: browserFetch,
          parseHTML: function (h) { return parser.parseFromString(h, 'text/html'); },
          source: cfg.source, urls: cfg.urls, exclude: cfg.exclude,
          maxPages: cfg.maxPages, maxPdfs: cfg.maxPdfs,
          extractPdf: cfg.pdf ? browserPdf : null,
          onProgress: onProgress
        });
        if (idx.chunks.length) writeCache(idx);
      }
      engine = new Engine(idx.chunks, synonyms);
      engine.meta = idx;
      engine.setTools((cfg.tools || []).map(function (t) {
        return { u: new URL(t.url, location.href).href, t: t.title, d: t.description || '', k: t.keywords || '' };
      }).concat(cfg.autoTools ? (idx.tools || []) : []));
      return engine;
    })();
    loading.catch(function () { loading = null; });
    return loading;
  }

  function linkFor(c) {
    if (c.a && /^page=/.test(c.a)) return c.u + '#' + c.a;
    if (c.a) return c.u + '#' + encodeURIComponent(c.a);
    var lastH = c.h ? c.h.split(' › ').pop() : '';
    var frag = lastH || c.x.split(/\s+/).slice(0, 6).join(' ');
    return c.u + '#:~:text=' + encodeURIComponent(frag).replace(/-/g, '%2D');
  }

  /* ---------- Interface ---------- */
  var CSS = '' +
    '#pacb-root{--c:' + cfg.color + ';position:fixed;bottom:20px;' + (cfg.position === 'left' ? 'left' : 'right') + ':20px;z-index:2147483000;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d2433}' +
    '#pacb-root *{box-sizing:border-box}' +
    '#pacb-btn{width:60px;height:60px;border-radius:50%;border:0;background:var(--c);color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;transition:transform .15s}' +
    '#pacb-btn:hover{transform:scale(1.06)}#pacb-btn svg{width:28px;height:28px}' +
    '#pacb-panel{position:absolute;bottom:76px;' + (cfg.position === 'left' ? 'left' : 'right') + ':0;width:400px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 110px);background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.25);display:none;flex-direction:column;overflow:hidden}' +
    '#pacb-root.open #pacb-panel{display:flex}' +
    '#pacb-head{background:var(--c);color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}' +
    '#pacb-head>div{min-width:0}#pacb-head b{display:block;font-size:15.5px}#pacb-head small{display:block;opacity:.85;font-size:12.5px;line-height:1.3}' +
    '#pacb-tools{margin-left:auto;background:rgba(255,255,255,.18);border:0;color:#fff;border-radius:8px;padding:4px 8px;font:inherit;font-size:12.5px;cursor:pointer;white-space:nowrap;flex-shrink:0}' +
    '#pacb-tools:hover{background:rgba(255,255,255,.3)}#pacb-tools[hidden]{display:none}#pacb-tools:not([hidden])+#pacb-close{margin-left:0}' +
    '.pacb-tool{display:block;margin-top:8px;padding:9px 11px;border:1px solid var(--c);border-radius:10px;background:#fff;color:inherit;text-decoration:none;white-space:normal}' +
    '.pacb-tool:hover{background:#f3f7ff}.pacb-tool b{color:var(--c);display:block}.pacb-tool span{display:block;font-size:13px;color:#5b6576;margin-top:2px}' +
    '.pacb-tool i{font-style:normal;font-size:13px;font-weight:600;color:var(--c);display:block;margin-top:4px}' +
    '#pacb-close{margin-left:auto;background:transparent;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 6px}' +
    '#pacb-msgs{flex:1;overflow-y:auto;padding:14px;background:#f5f7fa;display:flex;flex-direction:column;gap:10px}' +
    '.pacb-m{max-width:92%;padding:9px 12px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word}' +
    '.pacb-bot{background:#fff;border:1px solid #e3e8ef;align-self:flex-start;border-bottom-left-radius:4px}' +
    '.pacb-me{background:var(--c);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '.pacb-card{margin-top:8px;padding:8px 10px;border-left:3px solid var(--c);background:#f8fafc;border-radius:6px;white-space:pre-line;font-size:14px}' +
    '.pacb-card mark{background:#fff3a3;color:inherit;padding:0 1px;border-radius:2px}' +
    '.pacb-src{display:block;margin-top:6px;font-size:12.5px;color:var(--c);text-decoration:none;font-weight:600}' +
    '.pacb-src:hover{text-decoration:underline}' +
    '.pacb-muted{color:#5b6576;font-size:12.5px}' +
    '#pacb-sugg{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 8px;background:#f5f7fa}' +
    '#pacb-sugg button{border:1px solid var(--c);color:var(--c);background:#fff;border-radius:999px;padding:5px 10px;font-size:13px;cursor:pointer;text-align:left}' +
    '#pacb-form{display:flex;gap:8px;padding:10px;border-top:1px solid #e3e8ef;background:#fff}' +
    '#pacb-in{flex:1;border:1px solid #cfd6e0;border-radius:10px;padding:9px 11px;font:inherit;outline:none;min-width:0}' +
    '#pacb-in:focus{border-color:var(--c)}' +
    '#pacb-send{border:0;background:var(--c);color:#fff;border-radius:10px;padding:0 14px;cursor:pointer;font:inherit;font-weight:600}' +
    '#pacb-foot{font-size:11.5px;color:#6b7482;padding:0 12px 8px;background:#fff;text-align:center}' +
    '.pacb-dots span{display:inline-block;width:6px;height:6px;margin:0 2px;border-radius:50%;background:#9aa4b2;animation:pacb 1s infinite}' +
    '.pacb-dots span:nth-child(2){animation-delay:.15s}.pacb-dots span:nth-child(3){animation-delay:.3s}' +
    '@keyframes pacb{0%,80%,100%{opacity:.3}40%{opacity:1}}' +
    '@media (max-width:480px){#pacb-root{bottom:12px;' + (cfg.position === 'left' ? 'left' : 'right') + ':12px}#pacb-panel{position:fixed;inset:8px;width:auto;max-width:none;height:auto;max-height:none}#pacb-root.open #pacb-btn{display:none}}';

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>';

  function mount() {
    if (document.getElementById('pacb-root')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var root = document.createElement('div');
    root.id = 'pacb-root';
    root.innerHTML =
      '<div id="pacb-panel" role="dialog" aria-label="' + esc(cfg.title) + '">' +
        '<div id="pacb-head"><div><b>' + esc(cfg.title) + '</b><small>' + esc(cfg.subtitle) + '</small></div>' +
        '<button id="pacb-tools" type="button" hidden>🧮 Calculatrices</button>' +
        '<button id="pacb-close" aria-label="Fermer">×</button></div>' +
        '<div id="pacb-msgs" aria-live="polite"></div>' +
        '<div id="pacb-sugg"></div>' +
        '<form id="pacb-form"><input id="pacb-in" type="text" autocomplete="off" placeholder="Votre question…" aria-label="Votre question" maxlength="300"><button id="pacb-send" type="submit">Envoyer</button></form>' +
        '<div id="pacb-foot">' + esc(cfg.disclaimer) + '</div>' +
      '</div>' +
      '<button id="pacb-btn" aria-label="Ouvrir l\'assistant réglementation" aria-expanded="false">' + ICON + '</button>';
    document.body.appendChild(root);

    var msgs = root.querySelector('#pacb-msgs'), input = root.querySelector('#pacb-in'),
      btn = root.querySelector('#pacb-btn'), sugg = root.querySelector('#pacb-sugg'), started = false, asked = false, status = null;

    function add(html, who) {
      var d = document.createElement('div');
      d.className = 'pacb-m ' + (who === 'me' ? 'pacb-me' : 'pacb-bot');
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    }
    function contactHtml() {
      return cfg.contactUrl ? ' <a class="pacb-src" style="display:inline" href="' + esc(cfg.contactUrl) + '">' + esc(cfg.contactLabel) + '</a>' : '';
    }
    function setStatus(msg) {
      if (!status) status = add('<span class="pacb-muted"></span>', 'bot');
      status.firstChild.textContent = '⏳ ' + msg;
    }

    function open() {
      root.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      if (!started) {
        started = true;
        add(esc(cfg.welcome), 'bot');
        (cfg.suggestions || []).forEach(function (s) {
          var b = document.createElement('button'); b.type = 'button'; b.textContent = s;
          b.onclick = function () { ask(s); };
          sugg.appendChild(b);
        });
        ensureIndex(setStatus).then(function (eng) {
          if (status) { status.remove(); status = null; }
          if (eng.tools.length) {
            root.querySelector('#pacb-tools').hidden = false;
            if (!asked) {
              var b = document.createElement('button'); b.type = 'button'; b.textContent = '🧮 Voir les calculatrices';
              b.onclick = function () { ask('Quelles calculatrices proposez-vous ?'); };
              sugg.appendChild(b);
            }
          }
        }).catch(function () {
          if (status) { status.firstChild.textContent = 'Impossible de lire les textes du site pour le moment.'; }
        });
      }
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() { root.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }

    function toolsHtml(list) {
      return list.map(function (t) {
        return '<a class="pacb-tool" href="' + esc(t.u) + '"><b>🧮 ' + esc(t.t) + '</b>' +
          (t.d ? '<span>' + esc(t.d) + '</span>' : '') + '<i>Ouvrir la calculatrice ›</i></a>';
      }).join('');
    }

    async function ask(q) {
      q = q.trim(); if (!q) return;
      asked = true;
      sugg.innerHTML = '';
      add(esc(q), 'me');
      input.value = '';
      var wait = add('<span class="pacb-dots"><span></span><span></span><span></span></span>', 'bot');
      var f = fold(q).trim();
      if (!tokens(q).length) {
        wait.innerHTML = /merci/.test(f) ? 'Avec plaisir ! N\'hésitez pas si vous avez une autre question.'
          : /^(bonjour|bonsoir|salut|hello|coucou)/.test(f) ? 'Bonjour ! Quelle est votre question sur la réglementation ?'
            : 'Pouvez-vous préciser votre question avec quelques mots-clés ? (ex. « taux d\'encadrement », « BAFA »)';
        return;
      }
      try {
        var eng = await ensureIndex(setStatus);
        if (status) { status.remove(); status = null; }
        var r = eng.search(q, 3), termSet = new Set(r.terms), mt = eng.matchTools(q, r.terms);
        if (mt.all) {
          wait.innerHTML = 'Voici les calculatrices disponibles sur le site :' + toolsHtml(mt.list);
          msgs.scrollTop = msgs.scrollHeight;
          return;
        }
        var tHtml = mt.list.length ? '<div>' + (mt.list.length > 1 ? 'Ces calculatrices peuvent vous aider :' : 'Cette calculatrice peut vous aider :') + toolsHtml(mt.list) + '</div>' : '';
        if (!r.results.length && tHtml) {
          wait.innerHTML = tHtml;
          msgs.scrollTop = msgs.scrollHeight;
          return;
        }
        if (!r.results.length) {
          wait.innerHTML = 'Je n\'ai pas trouvé de réponse dans les textes du site. Essayez de reformuler avec d\'autres mots-clés' +
            (cfg.contactUrl ? ', ou' + contactHtml() : '') + '.';
          return;
        }
        var html = tHtml + (tHtml ? '<div style="margin-top:12px">' : '<div>') +
          (r.results.length > 1 ? 'Voici ce que disent nos textes :' : 'Voici ce que dit notre texte :') + '</div>';
        r.results.forEach(function (res) {
          var c = res.chunk, label = c.t + (c.h ? ' › ' + c.h : '');
          html += '<div class="pacb-card">' + highlight(excerpt(c.x, termSet), termSet) +
            '<a class="pacb-src" href="' + esc(linkFor(c)) + '"' + (/\.pdf/i.test(c.u) ? ' target="_blank" rel="noopener"' : '') + '>📄 ' + esc(label) + '</a></div>';
        });
        if (cfg.contactUrl) html += '<div class="pacb-muted" style="margin-top:8px">Pas la réponse attendue ? Reformulez ou' + contactHtml() + '.</div>';
        wait.innerHTML = html;
        msgs.scrollTop = msgs.scrollHeight;
      } catch (e) {
        wait.innerHTML = 'Désolé, les textes du site n\'ont pas pu être chargés. Réessayez dans un instant.';
      }
    }

    btn.onclick = function () { root.classList.contains('open') ? close() : open(); };
    root.querySelector('#pacb-close').onclick = close;
    root.querySelector('#pacb-tools').onclick = function () { ask('Quelles calculatrices proposez-vous ?'); };
    root.querySelector('#pacb-form').onsubmit = function (e) { e.preventDefault(); ask(input.value); };
    root.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  G.PAChatbot = {
    version: VERSION,
    config: cfg,
    open: function () { mount(); document.getElementById('pacb-btn').click(); },
    refresh: function () { try { localStorage.removeItem(CACHE_KEY); } catch (e) { /* */ } engine = null; loading = null; },
    search: function (q) { return ensureIndex().then(function (e) { return e.search(q, 3); }); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})(typeof globalThis !== 'undefined' ? globalThis : this);
