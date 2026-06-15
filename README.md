# 📋 Éditeur LHEO / EDOF — Format XML Mon Compte Formation

**Version 2.4.0** · Compatible EDOF 2026 · Format LHEO 2.3

> Outil standalone HTML pour créer et gérer des fiches de formation au format XML LHEO 2.3 compatibles avec la plateforme **Mon Compte Formation (EDOF V14)**.

🔗 **Accès en ligne** : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

---

## ✨ Fonctionnalités

### Types d'offres supportés
- 🎓 **Formation certifiante** (RNCP / Répertoire Spécifique)
- ✅ **Bilan de compétences** (CPF202) — avec vérification des 3 phases légales et durée max 24h
- 🔍 **Accompagnement VAE** (CPF200) — avec recherche automatique des certifications RNCP éligibles
- 🚗 **Permis de conduire** (CPF206 et variantes)

### VAE — Fonctionnalités avancées
- Sélection du domaine par **Formacode sémantique V14** (65 champs officiels Centre Inffo)
- **Recherche automatique** des certifications RNCP éligibles VAE via l'API France Compétences (Koumoul), filtrée par NSF
- **Codes NSF pré-remplis** automatiquement depuis le champ sémantique, modifiables librement
- **Filtres ROME et diplômes dynamiques** : se mettent à jour en temps réel selon les NSF sélectionnés
- Sélection multiple de certifications RNCP sans fermeture de la liste
- Pagination "Voir plus" cumulative (200 résultats par page)

### Calculs automatiques
- **Montant HT** = (prix horaire HT × heures en centre) + frais d'examen
- **Montant TTC** = Montant HT × (1 + TVA%)
- Prix horaire toujours exprimé HT

### Référentiels intégrés
- Table **Formacode V14 → NSF** officielle (alignement Centre Inffo, décembre 2024) — 0 erreur sur 65 codes
- 93 codes NSF avec correspondances Formacode (90/93 couverts pour la VAE)
- Codes ROME filtrés par domaine
- Modalités d'admission, rythmes, niveaux EQF, langues EDOF

### Autres fonctionnalités
- Import/export XML LHEO 2.3 (ISO-8859-1, compatible EDOF)
- Vérification SIRET / NDA / Qualiopi via API DGEFP
- Import des habilitations EDOF (CSV)
- Sauvegarde locale (localStorage)
- Fonctionne en local ou en ligne

---

## 🚀 Installation et utilisation

### Option 1 — En ligne (sans installation)

Ouvrir directement : [https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)

> ⚠️ La vérification SIRET et la recherche RNCP nécessitent le serveur proxy local (Option 2).

---

### Option 2 — En local avec le serveur proxy (recommandé)

**Prérequis** : Python 3.8+ installé sur votre machine

#### Étape 1 — Télécharger les fichiers

Télécharger depuis GitHub :
- `editeur-lheo-edof.html`
- `lancer-editeur.py`
- `lancer-editeur.bat`

#### Étape 2 — Débloquer les fichiers (Windows uniquement, **important**)

> ⚠️ Windows bloque par défaut les fichiers téléchargés depuis Internet. **Sans cette étape, le `.bat` ne fonctionnera pas correctement.**

Pour chaque fichier téléchargé (`editeur-lheo-edof.html`, `lancer-editeur.py`, `lancer-editeur.bat`) :

1. Clic droit sur le fichier → **Propriétés**
2. En bas de l'onglet Général, cocher **"Débloquer"**
3. Cliquer **OK**

Alternativement, vous pouvez débloquer tous les fichiers en une commande PowerShell :
```powershell
Get-ChildItem "C:\chemin\vers\vos\fichiers" | Unblock-File
```

#### Étape 3 — Lancer l'outil

Double-cliquer sur **`lancer-editeur.bat`**

L'outil s'ouvre automatiquement dans votre navigateur sur `http://localhost:8765`.

> Si le navigateur ne s'ouvre pas automatiquement, entrer manuellement `http://localhost:8765/editeur-lheo-edof.html` dans la barre d'adresse.

---

Le serveur proxy local gère :
- Recherche RNCP/RS via API France Compétences (Koumoul)
- Vérification SIRET / NDA via API DGEFP
- Récupération des fiches RNCP via API apprentissage.beta.gouv.fr

---

## 📁 Structure du projet

```
editeur-lheo-edof.html    # Fichier principal (standalone HTML/CSS/JS)
lancer-editeur.py         # Serveur proxy Python (localhost:8765)
lancer-editeur.bat        # Lanceur Windows
README.md                 # Ce fichier
docs/                     # Documentation complète
```

---

## 🔄 Changelog

### v2.4.0 (juin 2026)
- ✨ VAE : recherche automatique des certifications RNCP au chargement et au changement de domaine
- ✨ NSF dynamiques : codes NSF pré-remplis depuis le Formacode, modifiables, filtrent diplômes et ROME en temps réel
- ✨ Formacode → NSF : table corrigée depuis le fichier officiel Centre Inffo V14 (0 erreur sur 65 codes)
- ✨ NSF multi : 28 Formacodes avec plusieurs NSF secondaires (sport, sciences humaines, chimie...)
- ✨ Couverture NSF : 90/93 codes NSF avec certifications VAE actives couverts
- ✨ Pagination diplômes : 200 résultats par défaut + "Voir plus" cumulatif
- ✨ Bilan de compétences : correction objectif général + encadré règles légales (3 phases, 24h max)
- 🐛 Calcul frais : prix horaire toujours HT, TTC = HT × (1+TVA%)
- 🐛 Frais jury VAE : 3 valeurs (Oui/Non/Aucuns frais) + champ montant conditionnel

### v2.3.3 (mai 2026)
- Corrections XSD (ordre des balises, acces-handicapes au niveau action)
- Vérification Qualiopi par type d'action

### v2.3.0 (avril 2026)
- Support VAE (CPF200) avec catégorisation Formacode
- Import RNCP/RS via API France Compétences
- Calcul automatique frais pédagogiques

---

## 📋 Spécifications techniques

- **Format XML** : LHEO 2.3.3, namespace `https://www.of.moncompteformation.gouv.fr`
- **Encodage** : ISO-8859-1 (requis par EDOF)
- **XSD** : `lheo_import_fichier_xml_optimise_v5r2.xsd`
- **API EDOF** : V14 (2026)
- **Formacode** : V14 (Centre Inffo, décembre 2024)

---

## 📖 Documentation

Documentation complète disponible dans le dossier [`docs/`](docs/) :
- [Guide de démarrage rapide](docs/Guide-de-démarrage-rapide.md)
- [VAE — Validation des Acquis de l'Expérience](docs/VAE---Validation-des-Acquis-de-l'Expérience.md)
- [Bilan de compétences](docs/Bilan-de-compétences.md)
- [Format XML et export EDOF](docs/Format-XML-et-export-EDOF.md)
- [FAQ et dépannage](docs/FAQ-et-dépannage.md)

---

## 🤝 Contribution

Les corrections et suggestions sont bienvenues via les [Issues GitHub](https://github.com/ericfalcon/editeur-LHEO/issues).

---

## 📄 Licence

MIT — Libre d'utilisation, modification et distribution.

---

*Développé par Eric Falcon — Formateur, Issoire (Auvergne)*  
*Données de référence : [France Compétences](https://www.francecompetences.fr/) · [Centre Inffo](https://www.centre-inffo.fr/) · [data.gouv.fr](https://www.data.gouv.fr/)*
