# Format XML et export EDOF

## Caractéristiques

- **Schéma** : LHEO 2.3.3
- **Namespace** : `https://www.of.moncompteformation.gouv.fr`
- **Encodage** : ISO-8859-1 (obligatoire pour EDOF)
- **XSD** : `lheo_import_fichier_xml_optimise_v5r2.xsd`

## Structure

```
<lheo>
  <offres>
    <formation numero="..." datecrea="..." datemaj="...">
      <intitule-formation>...</intitule-formation>
      <certification>
        <code-RNCP>RNCP12345</code-RNCP>
      </certification>
      <action numero="...">
        <session numero="...">
          ...
        </session>
      </action>
    </formation>
  </offres>
</lheo>
```

## Export

Cliquer **Exporter tout** pour générer le fichier XML.  
Le fichier peut ensuite être importé directement dans EDOF (Mon Compte Formation).

## Contrôles EDOF

L'outil vérifie automatiquement :
- SIRET valide avec NDA actif (API DGEFP)
- Qualiopi pour le type d'action concerné
- Codes RNCP/RS actifs
- Catégorisation VAE obligatoire (CPF200)
