# 💬 Assistant réglementaire — chatbot gratuit pour passionanimation.fr

Un chatbot qui répond aux questions de réglementation des visiteurs **en citant les textes déjà publiés sur le site**.

- **0 €** : pas d'IA payante, pas de serveur, pas de clé d'API, pas d'abonnement.
- **Rien à saisir** : il lit tout seul les pages du site (via le plan du site / sitemap ou WordPress) et les **PDF** qui y sont liés.
- **Fiable** : il n'invente rien. Il affiche le passage exact trouvé, mots-clés surlignés, avec un lien vers la page (ou la page du PDF).
- **Toujours à jour** : quand vous modifiez un texte, le chatbot le prend en compte (cache de 24 h par visiteur).
- **Calculatrices** : il repère les calculatrices / simulateurs du site et les propose quand la question s'y prête (« combien d'animateurs pour 30 enfants ? » → calculatrice d'encadrement). Un bouton « 🧮 Calculatrices » les liste toutes.
- Respecte la vie privée : aucune question n'est envoyée à un service extérieur.

> Ce n'est pas une IA « conversationnelle » de type ChatGPT. Il ne rédige pas de réponse : c'est un moteur de recherche intelligent sur vos textes (synonymes, pluriels, « six » = « 6 »…), présenté sous forme de chat. Si aucun texte ne correspond, il le dit et propose de vous contacter.

## Installation (5 minutes)

Collez ces lignes juste avant `</body>` sur toutes les pages du site.

```html
<script>
  window.PAChatbotConfig = {
    title: 'Assistant réglementation',
    contactUrl: '/contact/',          // lien affiché quand il ne trouve pas
    color: '#1f6feb',                 // couleur de votre charte
    suggestions: [
      "Quel est le taux d'encadrement en accueil de loisirs ?",
      "Comment se passe le BAFA ?",
      "Quelles règles pour la baignade ?"
    ]
  };
</script>
<script src="https://ericfalcon.github.io/editeur-LHEO/chatbot/chatbot.js" defer></script>
```

**Avec WordPress** : extension gratuite *WPCode* (ou *Insert Headers and Footers*) → « Pied de page » → coller le code → enregistrer.
**Avec Wix / Jimdo / autre** : « Code personnalisé » / « Ajouter du code au pied de page ».

Vous pouvez aussi copier `chatbot.js` sur votre propre hébergement et changer l'adresse `src`.

## Options

| Option | Rôle | Défaut |
|---|---|---|
| `title`, `subtitle`, `welcome` | Textes de l'en-tête et du message d'accueil | — |
| `color` | Couleur principale | `#1f6feb` |
| `position` | `'right'` ou `'left'` | `'right'` |
| `contactUrl`, `contactLabel` | Lien de contact proposé si pas de réponse | — |
| `suggestions` | Questions proposées au démarrage | 3 exemples |
| `exclude` | Pages à ignorer (morceaux d'adresse), ex. `['/boutique', '/blog/']` | `[]` |
| `urls` | Liste fixe de pages à lire (sinon : automatique) | auto |
| `pdf` | Lire aussi les PDF liés depuis les pages | `true` |
| `maxPages`, `maxPdfs` | Limites de lecture | 150 / 30 |
| `tools` | Calculatrices ajoutées à la main (voir ci-dessous) | `[]` |
| `autoTools` | Détecter automatiquement les calculatrices | `true` |
| `synonymsExtra` | Vos propres synonymes, ex. `[['cvl', 'colonie de vacances']]` | — |
| `indexUrl` | Index pré-calculé (voir ci-dessous) | — |
| `cacheHours` | Durée du cache chez le visiteur | 24 |

## Calculatrices

Le chatbot considère comme calculatrice toute page du site dont **le titre ou l'adresse contient « calcul », « simulateur » ou « estimation »**, ou qui contient des **champs de saisie numériques**. Il les propose :

- quand on les demande (« calculatrice », « quels outils ? », bouton « 🧮 Calculatrices » de l'en-tête, suggestion « Voir les calculatrices ») ;
- quand une question correspond au sujet d'une calculatrice et ressemble à un calcul (« combien… », un nombre, « prix », « coût »…). La calculatrice s'affiche alors au-dessus des extraits de textes.

Si une calculatrice n'est pas détectée (par exemple un outil intégré dans une autre page), ou pour mieux la décrire, déclarez-la :

```js
tools: [
  { title: "Calculatrice du taux d'encadrement", url: '/calculatrice-encadrement/',
    description: "Nombre d'animateurs nécessaires selon l'âge et le nombre d'enfants",
    keywords: 'encadrement animateurs enfants effectif quota' }
]
```

## Comment ça marche

1. Le visiteur ouvre la bulle : le script lit les pages du site (WordPress, sinon `sitemap.xml`, sinon en suivant les liens), enlève menus et pieds de page, découpe les textes en passages par titre, et lit les PDF.
2. Ce travail est mémorisé dans le navigateur du visiteur (24 h) : les questions suivantes sont instantanées.
3. Chaque question est comparée à tous les passages (algorithme BM25 + synonymes du domaine : ACM, BAFA/BAFD, SDJES, baignade, encadrement…). Les 1 à 3 meilleurs passages sont affichés.

## Option : index pré-calculé (si le site est gros)

Si le site a beaucoup de pages ou de PDF, la toute première ouverture peut prendre quelques secondes. Pour l'éviter, on peut générer l'index à l'avance :

```bash
cd chatbot
npm install
node build-index.mjs https://passionanimation.fr index.json
```

Déposez `index.json` sur le site (ou ici à côté de `chatbot.js`) et ajoutez `indexUrl: 'https://…/index.json'` à la configuration. Relancez la commande quand vous publiez de nouveaux textes.

## Limites à connaître

- Les PDF **scannés** (images sans texte) ne sont pas lisibles.
- Il répond par extraits : une question très vague (« c'est quoi les règles ? ») donne des résultats approximatifs. Les suggestions et le lien de contact aident le visiteur.
- La lecture des PDF dans le navigateur charge la bibliothèque gratuite pdf.js depuis cdnjs.cloudflare.com (mettez `pdf: false` pour la désactiver).
