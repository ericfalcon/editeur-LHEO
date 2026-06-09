# Éditeur LHEO / EDOF

Outil de saisie et de génération de fichiers XML pour l'import de catalogues de formations sur **Mon Compte Formation (EDOF)**.

Conforme aux spécifications **LHEO V14 (28/04/2026)**.

## Utilisation en ligne (recommandé)

Ouvrir directement dans le navigateur :

👉 **https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html**

Aucune installation requise. L'import automatique depuis France Compétences fonctionne directement.

## Utilisation locale (fichier téléchargé)

Si vous téléchargez le fichier HTML pour l'utiliser hors ligne :

1. Télécharger `editeur-lheo-edof.html`
2. Ouvrir le fichier dans Chrome
3. Cliquer sur **"Générer lancer-editeur.bat + .py"** dans le bandeau jaune
4. Placer les fichiers `.bat` et `.py` dans le même dossier que le HTML
5. Faire un clic droit sur chaque fichier → Propriétés → cocher **Débloquer** → OK
6. Double-cliquer sur `lancer-editeur.bat`

Le navigateur s'ouvre automatiquement sur `http://localhost:8765/editeur-lheo-edof.html`.

> **Pré-requis :** Python 3.x installé ([python.org](https://www.python.org/downloads/)) avec "Add to PATH" coché à l'installation.

## Fonctionnalités

- Saisie des formations, actions et sessions au format EDOF
- Export XML conforme au XSD LHEO optimisé v5r2
- Compatibilité **EDOF 2026 / V14** :
  - Champ `categorisation-offre` obligatoire pour les offres VAE (CPF200)
  - Champ `resume-contenu` (Points forts)
  - Gestion des `blocs-competences` RNCP (obligatoire depuis le 11/06/2026)
- **Import automatique depuis France Compétences** : intitulé, niveau, Formacode, NSF, ROME et blocs de compétences en un clic à partir du numéro RNCP
- Gestion des dispositifs spécifiques CPF (VAE, Bilan de compétences, Permis de conduire)
- Sauvegarde et restauration des fiches entre sessions

## Conformité

| Spécification | Version |
|---|---|
| LHEO EDOF | V14 (20260428) |
| XSD | lheo_import_fichier_xml_optimise_v5r2 |
| Namespace | `https://www.of.moncompteformation.gouv.fr` |
| Encodage | ISO-8859-1 |

## Limitations connues

- Le logiciel ne vérifie pas l'éligibilité CPF de la certification (contrôle effectué par EDOF à l'import)
- Un seul fichier HTML autonome, sans base de données serveur — les données sont stockées dans le `localStorage` du navigateur
- La clé API apprentissage.beta.gouv.fr est incluse dans le code source : à remplacer par la vôtre pour un usage en production

## Licence

MIT — libre d'utilisation, de modification et de redistribution.
