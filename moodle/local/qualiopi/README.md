# Qualiopi — plugin Moodle local (ébauche)

Plugin `local_qualiopi` pour suivre les **7 critères** du référentiel national qualité Qualiopi depuis Moodle.

**Statut : version 0.1.0 (alpha).** Le squelette est en place ; le suivi des 32 indicateurs n'est pas encore implémenté.

## Contenu

| Fichier | Rôle |
|---|---|
| `version.php` | Métadonnées du plugin (Moodle 4.5 minimum) |
| `settings.php` | Entrée dans Administration du site › Rapports › Qualiopi |
| `index.php` | Tableau de bord : une carte par critère |
| `classes/criteria.php` | Liste des 7 critères |
| `db/access.php` | Capacité `local/qualiopi:view` (manager par défaut) |
| `lang/fr/local_qualiopi.php` | Chaînes en français |
| `styles.css` | Thème épure, couleurs reprises de l'éditeur LHEO |

## Installation

Copier le dossier `local/qualiopi` dans le répertoire `local/` de Moodle, puis lancer la mise à jour de la base (Administration du site › Notifications).

## Prochaines étapes

1. Vérifier les intitulés des critères contre le référentiel officiel.
2. Modéliser les indicateurs (32) et leur statut, dans une table dédiée ou via la configuration du plugin.
3. Rattacher les preuves (cours, documents, enquêtes de satisfaction) à chaque indicateur.
4. Ajouter un export de l'état d'avancement.
