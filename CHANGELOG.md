# Changelog — Éditeur LHEO / EDOF

Toutes les modifications notables sont documentées ici.  
Format : `[version] — date — description`

---

## [2.4.45] — 2026-06-24
- 🐛 PDF — marges `@page` 12mm haut/bas sur toutes les pages (catalogue et fiches)

## [2.4.44] — 2026-06-24
- 🐛 PDF catalogue — marges haute et basse de la page de garde

## [2.4.43] — 2026-06-24
- ✨ Thème — logo affiché dans la sidebar à côté du titre
- ✨ Thème — couleur primaire de l'interface mise à jour dynamiquement

## [2.4.42] — 2026-06-24
- 🎨 PDF catalogue — page de garde : bandeau coloré en haut seulement, sommaire sur fond blanc

## [2.4.41] — 2026-06-24
- 🐛 PDF — sections vides masquées (Durée, Services annexes, Coordonnées, Lieu)
- 🐛 PDF — modalités d'admission et rythme : chaque code sur sa propre ligne
- 🐛 PDF — pied de page fiche individuelle corrigé (N° fiche au lieu de "Catalogue")
- 🐛 PDF — page blanche finale supprimée

## [2.4.40] — 2026-06-24
- 🎨 PDF — titres Session même couleur que Action (légèrement plus clair)

## [2.4.39] — 2026-06-24
- ✨ PDF — ordre exact des champs conforme à l'éditeur (formation, action, session)
- ✨ PDF — champs conditionnels respectés selon type d'offre (VAE, bilan, certif)
- 🐛 PDF — saut de page corrigé, page blanche supprimée
- 🐛 PDF — labels lisibles pour modalités admission, rythme, périmètre, niveaux

## [2.4.38] — 2026-06-24
- 🐛 Bouton paramètres ⚙️ coupé — déplacé sur la ligne Export PDF/CSV

## [2.4.37] — 2026-06-24
- 🐛 PDF — `<br>` affiché en texte pour certifications visées → corrigé
- 🐛 PDF — `undefined` dans blocs de compétences → filtré
- ✨ PDF — fiche individuelle : en-tête grand format distinct du catalogue
- ✨ PDF — catalogue : page de garde avec sommaire, fiches sans page de garde

## [2.4.36] — 2026-06-24
- 🐛 Export PDF blanc — remplacé `document.write` par Blob URL + `onload` avant `print()`

## [2.4.35] — 2026-06-24
- ✨ Personnalisation PDF — couleur principale, logo, nom organisme, texte pied de page
- ✨ Persisté en localStorage (`lheo_pdf_theme`) · Boutons Enregistrer / Réinitialiser

## [2.4.34] — 2026-06-24
- ✨ Export PDF via HTML + `window.print()` (remplace jsPDF)
- ✨ Barre latérale réorganisée (2 lignes : Import/Export XML, PDF/CSV + ⚙️)
- 🐛 Inputs `<input type="file">` tous masqués (`display:none`)

## [2.4.33] — 2026-06-24
- 🐛 SyntaxError — retours à la ligne littéraux dans `exportPDF`, JS validé Node

## [2.4.32] — 2026-06-24
- 🐛 Toutes apostrophes non échappées dans `exportPDF` corrigées

## [2.4.31] — 2026-06-24
- 🐛 SyntaxError apostrophe GFE M — "Support à l'entreprise"

## [2.4.30] — 2026-06-24
- 🐛 SyntaxError apostrophe GFE B — "Arts et façonnage d'ouvrages d'art"

## [2.4.29] — 2026-06-24
- ✨ Export PDF complet — tous champs formation/action/session via jsPDF (remplacé en 2.4.34)

## [2.4.28] — 2026-06-24
- ✨ Export PDF catalogue et fiche individuelle (boutons 📄 PDF dans barre et en-tête fiche)

## [2.4.27] — 2026-06-24
- ✨ Champ GFE (Groupe Formation Emploi) dans chaque action
- ✨ GFE exporté dans XML (`<extra info="code-gfe">`) et lu à l'import

## [2.4.26] — 2026-06-24
- 🐛 Calculateur VAE — calcul automatique au chargement de la fiche (sans attendre une saisie)

## [2.4.25] — 2026-06-24
- 🐛 Bouton ✔ Valider — hover `btn-warn` visible (orange foncé au survol)

## [2.4.24] — 2026-06-24
- 🐛 Affichage champ frais jury — `onchange` robuste avec IIFE pour éviter ambiguïté de `this`

## [2.4.23] — 2026-06-24
- 🐛 VAE — `resultats-attendus` généré depuis `vaeRncpList` même quand la fiche est hors DOM

## [2.4.22] — 2026-06-24
- 🐛 Validation résultats attendus VAE — vérifie `vaeRncpList` au lieu du texte libre

## [2.4.21] — 2026-06-24
- ✨ Points forts — textarea redimensionnable en hauteur + compteur 255 car. en temps réel

## [2.4.20] — 2026-06-24
- 🐛 Calculateur VAE — suppression doublon frais jury, utilise champ `fraisJury` existant

## [2.4.19] — 2026-06-24
- ✨ Calculateur VAE — heures × tarif horaire inclus dans le total, détail affiché

## [2.4.18] — 2026-06-24
- 🐛 Calculateur VAE — réinjection correcte dans `buildAction`

## [2.4.17] — 2026-06-24
- 🐛 Fix calculateur VAE — `isVaeA` remplacé par `f.typeOffre === 'vae'`

## [2.4.16] — 2026-06-24
- ✨ Calculateur prix VAE (recevabilité, jury, post-jury, formation obligatoire)

## [2.4.15] — 2026-06-24
- 🐛 Bilan — FORMACODE 22252 et NSF 315 écrits dans le XML exporté

## [2.4.14] — 2026-06-24
- 🐛 Bilan — suppression faux positif validation FORMACODE/NSF

## [2.4.13] — 2026-06-24
- 🐛 Bilan — niveaux entrée/sortie fixés à 0, parcours fixé à I

## [2.4.12] — 2026-06-24
- ✨ Bilan de compétences — champs contraints (FORMACODE 22252, NSF 315, ROME masqué)

## [2.4.11] — 2026-06-24
- 🐛 Fix adresse SIRET — suppression CP et ville de la ligne adresse

## [2.4.10] — 2026-06-24
- 🐛 Fix adresse SIRET — `siege.adresse` au lieu de `numero_voie + libelle_voie`

## [2.4.9] — 2026-06-24
- 🐛 Fix pré-remplissage adresse SIRET — sélecteurs `data-ai` / `data-f`

## [2.4.8] — 2026-06-24
- ✨ Durée totale calculée automatiquement (centre + entreprise), champ readonly

## [2.4.7] — 2026-06-24
- ✨ Pré-remplissage adresse depuis SIRET via API Recherche Entreprises

## [2.4.6] — 2026-06-24
- 🐛 Fix import XML namespace — `querySelector` code-RS/RNCP/objectif

## [2.4.5] — 2026-06-24
- 🐛 Fix `checkHabStatusHtml is not defined`

## [2.4.4] — 2026-06-24
- ✨ Favicon SVG LHEO bleu (`#1a56db`) intégrée en base64

## [2.4.3] — 2026-06-24
- 🎨 Harmonisation titres — "Editeur LHEO / EDOF", "Format XML LHEO 2.4"

## [2.4.2] — 2026-06-24
- 🐛 Fix référence FORMACODE V13 → V14 dans export XML

## [2.4.1] — 2026-06-24
- ✨ Bouton ✔ Valider avec bandeau erreurs bloquantes / avertissements / succès
- ✨ Export avec confirmation si avertissements non bloquants
- 🐛 Fix bouton Fermer aperçu MCF
- 🐛 Fix SyntaxError locale ligne 5563

## [2.4.0] — juin 2026
- ✨ VAE : recherche automatique des certifications RNCP au chargement et au changement de domaine
- ✨ NSF dynamiques : codes NSF pré-remplis depuis le Formacode, modifiables
- ✨ Formacode → NSF : table corrigée Centre Inffo V14 (0 erreur sur 65 codes)
- ✨ Bilan de compétences : objectif général + encadré règles légales (3 phases, 24h max)
- 🐛 Calcul frais : prix horaire toujours HT, TTC = HT × (1+TVA%)
- 🐛 Frais jury VAE : 3 valeurs (Oui/Non/Aucuns frais) + champ montant conditionnel

## [2.3.3] — mai 2026
- Corrections XSD (ordre des balises, `acces-handicapes` au niveau action)
- Vérification Qualiopi par type d'action

## [2.3.0] — avril 2026
- Support VAE (CPF200) avec catégorisation Formacode
- Import RNCP/RS via API France Compétences
- Calcul automatique frais pédagogiques

---

*Développé par Eric Falcon — Formateur, Issoire (Auvergne)*
