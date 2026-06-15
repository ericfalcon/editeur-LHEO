# FAQ et dépannage

## Le SIRET n'est pas reconnu

**Cause** : Le NDA n'est pas lié au SIRET dans le référentiel DGEFP, ou il est expiré.  
**Solution** : Vérifier sur [Mon Compte Formation - Portail OF](https://of.moncompteformation.gouv.fr).

## La recherche RNCP ne fonctionne pas

**Cause** : Le serveur proxy local n'est pas démarré.  
**Solution** : Lancer `lancer-editeur.py` et utiliser `http://localhost:8765`.

## L'import XML échoue

**Cause fréquente** : Encodage ISO-8859-1 non respecté, ou XSD non conforme.  
**Solution** : Exporter depuis l'outil (garantit l'encodage correct).

## Les certifications VAE n'apparaissent pas

**Cause** : Le Formacode sémantique n'est pas sélectionné, ou les NSF ne correspondent à aucune certification VAE active.  
**Solution** : Vérifier le Formacode et les codes NSF générés. Utiliser le champ de recherche par mot-clé.

## Erreur EDOF 30077 : catégorisation déjà utilisée

**Cause** : Un autre OF a déjà déclaré une offre VAE avec ce même Formacode sémantique.  
**Solution** : Chaque OF ne peut avoir qu'une seule offre VAE par champ sémantique.
