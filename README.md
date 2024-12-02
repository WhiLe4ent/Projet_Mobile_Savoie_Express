# Savoie Express

Savoie Express est une application mobile de gestion des utilisateurs, intégrant une authentification Firebase. Ce projet est en développement et inclut actuellement des fonctionnalités de connexion et déconnexion.

## Fonctionnalités actuelles

- **Page de connexion** : Permet aux utilisateurs de se connecter via Firebase.
- **Authentification Firebase** : L'authentification est opérationnelle et redirige les utilisateurs après la connexion.
- **Déconnexion** : Les utilisateurs peuvent se déconnecter de l'application.

## Fonctionnalités à venir

- **Attribution des rôles** : Lors de la création d'un compte, un rôle (par exemple, vendeur ou client) sera attribué à chaque utilisateur.
- **Navigation en fonction du rôle** : Une logique de navigation sera ajoutée pour rediriger les utilisateurs vers une page spécifique selon leur rôle (ex. : page des vendeurs, page des clients).

## Installation et lancement du projet

Pour installer les dépendances, exécutez la commande 
```bash 
    npm install
```

 Ensuite, lancez le projet avec la commande 
 ```bash 
    npx expo start
 ``` 
Cela démarrera l'application et vous pourrez accéder à la page de connexion pour tester l'authentification.

Dans un autre terminal:
 ```bash 
    cd api
 ``` 
Copier-coller le contenu du fichier .env.example et créer un fichier .env
Remplir ce fichier avec les bons données.

*IMPORTANT !* Dans EMAIL_PASS c'est pas le mdp de votre email.
Voici le lien d'explication:
https://support.google.com/accounts/answer/185833?hl=en
Cliquer sur : "Create and manage your app passwords"

Demarrage du server pour l'envoi d'emails
 ```bash 
    npm start
 ``` 


## Technologies utilisées

- **React Native** : Pour le développement de l'application mobile.
- **Firebase** : Pour la gestion de l'authentification des utilisateurs.


