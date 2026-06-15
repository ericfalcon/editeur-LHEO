# Guide de démarrage rapide

## Option 1 — En ligne (sans installation)

Ouvrir directement : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

> ⚠️ La vérification SIRET et la recherche RNCP nécessitent le serveur proxy local.

---

## Option 2 — En local avec le serveur proxy (recommandé)

**Prérequis** : Python 3.8+ installé

### Étape 1 — Télécharger les fichiers

Télécharger depuis GitHub :
- `editeur-lheo-edof.html`
- `lancer-editeur.py`
- `lancer-editeur.bat`

### Étape 2 — Débloquer les fichiers (Windows, **obligatoire**)

> Windows bloque par sécurité les fichiers téléchargés depuis Internet.  
> Sans cette étape, le `.bat` peut refuser de s'exécuter ou le `.py` être bloqué.

**Pour chaque fichier** (`editeur-lheo-edof.html`, `lancer-editeur.py`, `lancer-editeur.bat`) :

1. **Clic droit** sur le fichier → **Propriétés**
2. En bas de l'onglet **Général**, cocher **"Débloquer"**
3. Cliquer **OK**

![Débloquer un fichier Windows](https://i.imgur.com/debloquer-exemple.png)

Ou en une seule commande **PowerShell** (dans le dossier contenant les fichiers) :

```powershell
Get-ChildItem . | Unblock-File
```

### Étape 3 — Lancer l'outil

Double-cliquer sur **`lancer-editeur.bat`**

Le serveur démarre et le navigateur s'ouvre automatiquement sur `http://localhost:8765`.

> Si le navigateur ne s'ouvre pas, entrer manuellement :  
> `http://localhost:8765/editeur-lheo-edof.html`

---

## Créer votre première fiche

1. Cliquer **+ Nouvelle fiche**
2. Renseigner le **SIRET** de votre organisme (vérification automatique NDA/Qualiopi)
3. Choisir le **type d'offre** : formation certifiante, VAE, bilan de compétences, permis
4. Remplir les sections **Certification**, **Description**, **Actions**, **Sessions**
5. Cliquer **Exporter tout** pour générer le fichier XML prêt à importer dans EDOF
