# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "Connexion" [level=2] [ref=e4]
    - generic [ref=e5]:
      - textbox "Email" [ref=e6]
      - textbox "Mot de passe" [ref=e7]
      - button "Se connecter" [ref=e8] [cursor=pointer]
    - paragraph [ref=e9]:
      - text: Pas encore de compte ?
      - button "Créer un compte" [ref=e10] [cursor=pointer]
  - generic:
    - status [ref=e16]: Unauthorized
    - status [ref=e22]: Unauthorized
    - status [ref=e28]: Unauthorized
    - status [ref=e34]: Unauthorized
    - status [ref=e40]: Unauthorized
    - status [ref=e46]: Unauthorized
    - status [ref=e52]: Token expiré ou révoqué
    - status [ref=e58]: Connexion réussie
```