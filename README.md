# Éditeur LHEO / EDOF

Outil de saisie et génération de fichiers XML pour l'import de catalogues de formations sur **Mon Compte Formation (EDOF)**.

Conforme aux spécifications **EDOF V14 (28/04/2026)** — ISO-8859-1, namespace EDOF, structure complète formation/action/session.

## Utilisation en ligne (recommandé)

👉 **[https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html](https://ericfalcon.github.io/editeur-LHEO/editeur-lheo-edof.html)**

Aucune installation requise. Ouvrir dans n'importe quel navigateur.

## Fonctionnalités

- **4 types d'offre** : Formation certifiante (RNCP/RS), Bilan de compétences (CPF202), Permis de conduire, Accompagnement VAE (CPF200)
- **Conformité EDOF V14** : encodage ISO-8859-1, namespace officiel, datemaj/datecrea automatiques, extras obligatoires (frais-pedagogiques, codes-rythme-formation, codes-modalites-admission, contact-information, resume-contenu)
- **Catégorisation VAE** : 65 champs sémantiques Formacode V14 officiels (obligatoire pour CPF200)
- **Listes complètes** : 2636 codes FORMACODE V13, 93 codes NSF, 459 codes ROME
- **Import automatique RNCP** : récupération des données depuis l'API France Compétences
- **Blocs de compétences** RNCP avec code-bloc
- **Gestion catalogue** : plusieurs fiches, import/export XML, localStorage

## Utilisation locale (sans internet)

Télécharger `editeur-lheo-edof.html` et l'ouvrir dans votre navigateur.

> **Note** : l'import automatique RNCP nécessite une connexion internet ou le serveur proxy local.

## Conformité

| Critère | Statut |
|---------|--------|
| Encodage ISO-8859-1 | ✅ |
| Namespace `https://www.of.moncompteformation.gouv.fr` | ✅ |
| Attributs datemaj/datecrea | ✅ |
| Structure formation/action/session | ✅ |
| extras info="action" obligatoires | ✅ |
| extras info="formation" + resume-contenu | ✅ |
| organisme-formation-responsable au niveau formation | ✅ |
| categorisation-offre CPF200 (VAE) | ✅ |
| acces-handicapes obligatoire | ✅ |
| langue-formation | ✅ |
| nombre-heures-centre/entreprise | ✅ |

## Licence

MIT — libre d'utilisation, de modification et de redistribution.
