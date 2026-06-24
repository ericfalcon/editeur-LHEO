# 📋 Éditeur LHEO / EDOF — Format XML Mon Compte Formation

**Version 2.4.45** · Compatible EDOF 2026 · Format LHEO 2.4

> Outil standalone HTML pour créer et gérer des fiches de formation au format XML LHEO 2.4 compatibles avec la plateforme **Mon Compte Formation (EDOF V14)**.

🔗 **Accès en ligne** : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

---

## ✨ Fonctionnalités

### Types d'offres supportés
- 🎓 **Formation certifiante** (RNCP / Répertoire Spécifique)
- ✅ **Bilan de compétences** (CPF202) — champs contraints (FORMACODE 22252, NSF 315, 3 phases légales)
- 🔍 **Accompagnement VAE** (CPF200) — certifications RNCP visées, calculateur de prix, résultats attendus auto
- 🚗 **Permis de conduire** (CPF206 et variantes)

### VAE — Fonctionnalités avancées
- Sélection du domaine par **Formacode sémantique V14** (65 champs officiels Centre Inffo)
- **Recherche automatique** des certifications RNCP éligibles VAE via l'API France Compétences
- **Calculateur de prix VAE** : heures × tarif + recevabilité + frais jury + post-jury + formation obligatoire
- **Résultats attendus** générés automatiquement depuis la liste RNCP, même hors DOM
- Sélection multiple de certifications RNCP sans fermeture de la liste

### Validation et export
- **Bouton ✔ Valider** : vérification avant export avec bandeau erreurs/avertissements
- **Export XML LHEO 2.4** individuel ou global (ISO-8859-1, compatible EDOF)
- **Export PDF** : fiche individuelle ou catalogue complet via impression navigateur
- **Export CSV** : tableau récapitulatif de toutes les formations
- **Personnalisation PDF** : couleur, logo, nom organisme, pied de page — appliqués aussi à l'interface

### Référentiels intégrés
- 93 codes NSF · 230+ FORMACODE · 530+ codes ROME en listes filtrables
- Modalités d'admission, rythmes, niveaux EQF, langues EDOF
- **GFE (Groupe Formation Emploi)** : sélection par action, exporté dans le XML

### Organisation
- Auto-remplissage adresse depuis **SIRET** (API Recherche Entreprises)
- **Durée totale calculée automatiquement** (centre + entreprise)
- Import/export des habilitations EDOF (CSV)
- Import RNCP/RS via API France Compétences
- Vérification SIRET / NDA via API DGEFP
- Sauvegarde locale (localStorage) + export/import JSON
- Favicon SVG intégrée · Suivi Matomo

---

## 🚀 Installation et utilisation

### Option 1 — En ligne (sans installation)

Ouvrir directement : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

---

### Option 2 — En local avec le serveur proxy (recommandé)

**Prérequis** : Python 3.8+ installé sur votre machine

#### Étape 1 — Télécharger les fichiers

- `editeur-lheo-edof.html`
- `lancer-editeur.py`
- `lancer-editeur.bat`

#### Étape 2 — Débloquer les fichiers (Windows uniquement)

> ⚠️ Windows bloque par défaut les fichiers téléchargés. Sans cette étape, le `.bat` ne fonctionnera pas.

Pour chaque fichier : clic droit → **Propriétés** → cocher **"Débloquer"** → OK

Ou en PowerShell :
```powershell
Get-ChildItem "C:\chemin\vers\vos\fichiers" | Unblock-File
```

#### Étape 3 — Lancer l'outil

Double-cliquer sur **`lancer-editeur.bat`**

L'outil s'ouvre automatiquement sur `http://localhost:8765`.

---

## 📁 Structure du projet

```
editeur-lheo-edof.html    # Fichier principal (standalone HTML/CSS/JS)
lancer-editeur.py         # Serveur proxy Python (localhost:8765)
lancer-editeur.bat        # Lanceur Windows
README.md                 # Ce fichier
CHANGELOG.md              # Historique des versions
```

---

## 📋 Spécifications techniques

- **Format XML** : LHEO 2.4, namespace `https://www.of.moncompteformation.gouv.fr`
- **Encodage** : ISO-8859-1 (requis par EDOF)
- **API EDOF** : V14 (2026)
- **Formacode** : V14 (Centre Inffo, décembre 2024)

---

## 🤝 Contribution

Les corrections et suggestions sont bienvenues via les [Issues GitHub](https://github.com/ericfalcon/editeur-LHEO/issues).

---

## 📄 Licence

MIT — Libre d'utilisation, modification et distribution.

---

*Développé par Eric Falcon — Formateur, Issoire (Auvergne)*  
*Données de référence : [France Compétences](https://www.francecompetences.fr/) · [Centre Inffo](https://www.centre-inffo.fr/) · [data.gouv.fr](https://www.data.gouv.fr/)*
