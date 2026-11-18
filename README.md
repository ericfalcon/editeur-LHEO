# 📋 Éditeur LHEO / EDOF — Format XML Mon Compte Formation

**Version 2.9.0** · Compatible EDOF 2026 · Format LHEO 2.4

> Outil standalone HTML pour créer et gérer des fiches de formation au format XML LHEO 2.4 compatibles avec la plateforme **Mon Compte Formation (EDOF V14)**.

🔗 **Accès en ligne** : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

📖 **Mode d'emploi** : [guide.html](https://ericfalcon.github.io/editeur-LHEO/guide.html) (utilisateur, accessible aussi depuis l'éditeur) · [Wiki technique](https://github.com/ericfalcon/editeur-LHEO/wiki) (référentiels, format XML, FAQ)

📥 **Téléchargement** : [dernière version (v2.9.0)](https://github.com/ericfalcon/editeur-LHEO/releases/latest) · [toutes les versions](https://github.com/ericfalcon/editeur-LHEO/releases)

---

## ✨ Fonctionnalités

### Types d'offres supportés
- 🎓 **Formation certifiante** (RNCP / Répertoire Spécifique)
- ✅ **Bilan de compétences** (CPF202) — champs contraints (FORMACODE 22252, NSF 315, 3 phases légales)
- 🔍 **Accompagnement VAE** (CPF200) — certifications RNCP visées, calculateur de prix, résultats attendus auto
- 🚗 **Permis de conduire** (13 catégories officielles : B, C, D, A1, A2, B1, BE, C1, C1E, CE, D1, D1E, DE)

### VAE — Fonctionnalités avancées
- Sélection du domaine par **Formacode sémantique V14** (65 champs officiels Centre Inffo)
- **Recherche automatique** des certifications RNCP éligibles VAE via l'API France Compétences
- **Calculateur de prix VAE** : heures × tarif + recevabilité + frais jury + post-jury + formation obligatoire
- **Résultats attendus** générés automatiquement depuis la liste RNCP, même hors DOM
- Sélection multiple de certifications RNCP sans fermeture de la liste

### Validation et export
- **Bouton ✔ Valider** : vérification avant export avec bandeau erreurs/avertissements
- **Export XML LHEO 2.4** individuel ou global — encodage ISO-8859-1 réel et ordre des balises strictement conforme au schéma EDOF V14 (évite les rejets d'import)
- **Export PDF** : fiche individuelle ou catalogue complet via impression navigateur
- **Export CSV** : tableau récapitulatif de toutes les formations
- **Personnalisation PDF** : couleur, logo, nom organisme, SIRET (repris automatiquement dans les nouvelles fiches), pied de page — appliqués aussi à l'interface

### Référentiels intégrés
- 93 codes NSF · 230+ FORMACODE · 530+ codes ROME en listes filtrables
- Modalités d'admission, rythmes, niveaux EQF, langues EDOF
- **GFE (Groupe Formation Emploi)** : sélection par action, exporté dans le XML

### Organisation
- Auto-remplissage adresse depuis **SIRET** (API Recherche Entreprises)
- **Pré-remplissage intelligent** : nouvelle fiche / action / session reprennent organisme, contact, lieu et modalités déjà saisis, avec numérotation automatique (`FORM-008`, `FORM-008-A1`, `FORM-008-A1-S1`)
- **Code postal → ville, département, région** et géolocalisation GPS automatique du lieu de formation
- **Durée totale calculée automatiquement** (centre + entreprise)
- Import/export des habilitations EDOF (CSV)
- Import RNCP/RS via API France Compétences — codes, niveau, blocs **et textes** (objectif, contenu, résultats attendus, points forts, prérequis) rédigés depuis la fiche officielle, sans écraser les textes déjà saisis
- Vérification SIRET / NDA via API DGEFP
- Sauvegarde locale (localStorage) + export/import JSON
- Favicon SVG intégrée · Suivi Matomo

---

## 🚀 Installation et utilisation

Aucune installation requise. Ouvrir directement :

[https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

Toutes les fonctionnalités (vérification SIRET, import RNCP/RS, recherche de certifications VAE) fonctionnent directement dans le navigateur, sans serveur local — l'outil s'appuie sur un relais [Cloudflare Worker](https://workers.cloudflare.com/) permanent pour contourner les restrictions CORS des API publiques (France Compétences, Koumoul).

### Utilisation sur votre ordinateur

Chaque [release](https://github.com/ericfalcon/editeur-LHEO/releases/latest) propose un fichier `editeur-lheo-vX.Y.Z.zip` : dézippez-le, puis double-cliquez sur `editeur-lheo-edof.html`. Aucun logiciel à installer.

- Une connexion Internet reste nécessaire pour la vérification SIRET, les imports RNCP / RS et la recherche VAE. La saisie et l'export XML fonctionnent hors ligne.
- Les fiches sont enregistrées dans le navigateur, séparément pour la version en ligne et la version locale : utilisez « Sauvegarder fiches » / « Restaurer fiches » pour passer de l'une à l'autre.
- La version locale ne se met pas à jour seule : téléchargez les nouvelles releases.

> ℹ️ Avant la version 2.5 (juillet 2026), l'outil nécessitait un serveur Python local (`lancer-editeur.py`). Ce n'est plus le cas.

---

## 📁 Structure du projet

```
editeur-lheo-edof.html    # Fichier principal (standalone HTML/CSS/JS)
guide.html                 # Mode d'emploi utilisateur, accessible depuis l'éditeur
README.md                 # Ce fichier
CHANGELOG.md              # Historique des versions
release/LISEZMOI.txt      # Notice incluse dans le zip des releases
.github/workflows/        # Création automatique des releases (tag vX.Y.Z)
```

Documentation technique complémentaire (référentiels, structure XML détaillée, FAQ) : [Wiki du projet](https://github.com/ericfalcon/editeur-LHEO/wiki).

---

## 📋 Spécifications techniques

- **Format XML** : LHEO, namespace `https://www.of.moncompteformation.gouv.fr`
- **Encodage** : ISO-8859-1 réel (déclaré *et* effectif — requis par EDOF)
- **CDC EDOF** : V15 (09/07/2026)
- **Formacode** : V14 (Centre Inffo, décembre 2024)
- **Conformité validée** avec le XSD officiel (`lheo_import_fichier_xml_optimise_v5r2.xsd`) et par import réel réussi sur la plateforme EDOF

---

## 🤝 Contribution

Les corrections et suggestions sont bienvenues via les [Issues GitHub](https://github.com/ericfalcon/editeur-LHEO/issues).

---

## 📄 Licence

MIT — Libre d'utilisation, modification et distribution.

---

*Développé par Eric Falcon — Formateur, Issoire (Auvergne)*  
*Données de référence : [France Compétences](https://www.francecompetences.fr/) · [Centre Inffo](https://www.centre-inffo.fr/) · [data.gouv.fr](https://www.data.gouv.fr/)*
