# Poubelles Intelligentes

## Description

**Poubelles Intelligentes** est une application web conçue pour gérer et surveiller des poubelles intelligentes. L'application fournit des statistiques en temps réel, un tableau de bord pour les administrateurs et un système de connexion sécurisé.

## Fonctionnalités

- **Système de connexion** : Authentification sécurisée pour les administrateurs.
- **Tableau de bord** : Affiche une liste des poubelles avec leurs statuts.
- **Statistiques** : Statistiques en temps réel sur le nombre de poubelles, leurs niveaux de remplissage, etc.
- **Rafraîchissement automatique** : Les données sont mises à jour toutes les 5 secondes sans recharger la page.
- **Design réactif** : Optimisé pour différents appareils et tailles d'écran.

## Installation

1. Clonez le dépôt :
   ```bash
   git clone <url-du-dépôt>
   ```
2. Accédez au répertoire du projet :
   ```bash
   cd poubelles-intelligentes
   ```
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Lancez le serveur de développement :
   ```bash
   npm start
   ```

## Structure du projet

```
src/
├── components/
│   └── Navbar.jsx       # Barre de navigation pour l'application
├── pages/
│   ├── Login.jsx        # Page de connexion pour les administrateurs
│   ├── Poubelles.jsx    # Page affichant la liste des poubelles
│   ├── Ramassage.jsx    # Page pour gérer le ramassage des poubelles
│   ├── Statistiques.jsx # Page affichant les statistiques en temps réel
├── App.jsx              # Composant principal de l'application
├── index.css            # Styles globaux
└── index.js             # Point d'entrée de l'application React
```

## Documentation

### `src\App.jsx`

- **Objectif** : Composant principal de l'application qui configure le routage et la mise en page.
- **Caractéristiques principales** :
  - Inclut une `Navbar` pour la navigation.
  - Protège les routes avec un wrapper `ProtectedRoute` pour garantir que seules les personnes authentifiées peuvent accéder au tableau de bord.

### `src\components\Navbar.jsx`

- **Objectif** : Fournit des liens de navigation pour l'application.
- **Caractéristiques principales** :
  - Met en surbrillance l'élément de menu actif.
  - Inclut un bouton de déconnexion pour supprimer le jeton d'authentification.

### `src\pages\Login.jsx`

- **Objectif** : Page de connexion pour les administrateurs.
- **Caractéristiques principales** :
  - Valide les identifiants (`admin@example.com` / `password`).
  - Stocke un jeton d'authentification dans `localStorage` après une connexion réussie.
  - Design propre et professionnel.

### `src\pages\Poubelles.jsx`

- **Objectif** : Affiche une liste des poubelles avec leurs statuts.
- **Caractéristiques principales** :
  - Récupère les données de l'API toutes les 5 secondes.
  - Utilise des animations pour les effets de survol et les transitions fluides.

### `src\pages\Statistiques.jsx`

- **Objectif** : Affiche des statistiques en temps réel sur les poubelles.
- **Caractéristiques principales** :
  - Récupère et calcule les statistiques (par exemple, nombre total de poubelles, poubelles pleines, poubelles vides) toutes les 5 secondes.
  - Mise en page propre et facile à lire.

## Points de terminaison de l'API

L'application interagit avec les points de terminaison suivants :

- **GET `/api/poubelles`** : Récupère la liste des poubelles et leurs statuts.

## Variables d'environnement

Pour configurer l'application, créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

```
REACT_APP_API_URL=http://localhost:3000
```

## Déploiement

1. Construisez le projet :
   ```bash
   npm run build
   ```
2. Déployez le dossier `build` sur votre fournisseur d'hébergement.

## Licence

Ce projet est sous licence MIT.

## Auteur

Identité de l'auteur inconnue.
