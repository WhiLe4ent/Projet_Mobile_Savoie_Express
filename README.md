# Savoie Express

Savoie Express est une application mobile de gestion des utilisateurs, intégrant une authentification Firebase. Ce projet est en développement et inclut actuellement des fonctionnalités de connexion et déconnexion.

## Configuration du projet
1.  (Si vous voulez avoir des mails sinon go Installation)
```bash 
   cd api
``` 
```bash 
   npm i
``` 
Copier-coller le contenu du fichier .env.example et créer un fichier .env  <br>
Remplir ce fichier avec les bons données.  <br>

**IMPORTANT !** Dans EMAIL_PASS c'est pas le mdp de votre addresse mail gmail.  <br>
Voici le lien d'explication:  
https://support.google.com/accounts/answer/185833?hl=en  <br>
Cliquer sur : "Create and manage your app passwords"  <br>

**IMPORTANT !** Si vous voulez avoir les mails enlever les commentaires dans app/screens/Deliveries/DeliveryDetails.tsx ligne 94
(La ligne est commentée pour pouvoir faire fonctionner l'application même si vous n'avez pas pris le temps de setup votre addresse IP et de demarrer le serveurs expresse)

2. 
```bash 
   nano ../app/settings/Variables.tsx
```  
Dans le fichier app/settings/Variables.tsx  <br>
Mettre à jour avec votre addresse IP la variable API_URL.


## Installation et lancement du projet

Pour installer les dépendances, exécutez la commande 
```bash 
    npm i
```

 Ensuite, lancez le projet avec la commande 
 ```bash 
    npx expo start
 ``` 
Si vous allez tester sur emulateur, d'abord executer:
  ```bash 
    npm run android
 ``` 

Cela démarrera l'application et vous pourrez accéder à la page de connexion pour tester l'authentification.

Dans un autre terminal:
 ```bash 
    cd api
 ``` 

Demarrage du server pour l'envoi d'emails
 ```bash 
    npm start
 ``` 

## Technologies utilisées

- **React Native** : Pour le développement de l'application mobile.
- **Firebase** : Pour la gestion de l'authentification des utilisateurs.


