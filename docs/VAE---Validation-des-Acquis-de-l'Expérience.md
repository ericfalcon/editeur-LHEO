# VAE — Validation des Acquis de l'Expérience

## Spécificités EDOF

- Code CPF : **CPF200** (fixe)
- Certifiante : **Oui**
- Catégorisation obligatoire : **Formacode sémantique V14** (65 champs)

## Formacode sémantique

Le champ sémantique est un code à 3 chiffres qui définit le domaine de l'accompagnement.  
Exemple : `154 - Activité physique et sportive`

Il détermine automatiquement :
- Les **codes NSF** correspondants (ex: 411 Pratiques sportives + 335 Animation sportive)
- Les **certifications RNCP éligibles** affichées pour la sélection
- Les **familles ROME** filtrées

## Recherche de certifications RNCP

La liste des certifications éligibles VAE s'affiche automatiquement à l'ouverture de la fiche.  
Elle est filtrée sur :
- `SI_JURY_VAE = true` (éligible au jury VAE)
- `ACTIF = true` (certification active)
- Les codes NSF du domaine sélectionné

Source : **API France Compétences via Koumoul** (opendata.koumoul.com)

## Frais de jury

Trois options :
- **Oui** : l'OF paye les frais de jury → saisir le montant TTC
- **Non** : frais à charge du candidat
- **Aucuns frais d'examen attendus** : le certificateur ne demande pas de frais

## Résultats attendus

Générés automatiquement selon les certifications RNCP sélectionnées.
