# FAQ et dépannage

## Le SIRET n'est pas reconnu

**Cause** : Le NDA n'est pas lié au SIRET dans le référentiel DGEFP, ou il est expiré.  
**Solution** : Vérifier sur [Mon Compte Formation - Portail OF](https://of.moncompteformation.gouv.fr).

## La recherche RNCP ne fonctionne pas

**Cause** : Le relais Cloudflare (Worker `editeur-lheo-proxy`) ne répond pas, ou la connexion Internet est coupée.  
**Solution** : Réessayer quelques instants plus tard. Si le problème persiste, vérifier dans le tableau de bord Cloudflare que le Worker est actif et que son secret `API_APPRENTISSAGE_TOKEN` est valide. Le serveur local `lancer-editeur.py` n'existe plus depuis la version 2.5.

## L'import XML échoue

**Cause fréquente** : Encodage ISO-8859-1 non respecté, ou XSD non conforme.  
**Solution** : Exporter depuis l'outil (garantit l'encodage correct).

## Les certifications VAE n'apparaissent pas

**Cause** : Le Formacode sémantique n'est pas sélectionné, ou les NSF ne correspondent à aucune certification VAE active.  
**Solution** : Vérifier le Formacode et les codes NSF générés. Utiliser le champ de recherche par mot-clé.

## Erreur EDOF 30077 : catégorisation déjà utilisée

**Cause** : Un autre OF a déjà déclaré une offre VAE avec ce même Formacode sémantique.  
**Solution** : Chaque OF ne peut avoir qu'une seule offre VAE par champ sémantique.
