# MathsGame-ReactNative

## Description du projet

Ce projet est un jeu de mathématiques simple développé avec **React Native**. L'objectif est de résoudre des additions générées aléatoirement dans un temps limité (15 secondes par question). Le joueur peut choisir entre deux niveaux de difficulté :
- **Facile** : Additions de deux nombres (max 50).
- **Difficile** : Additions de trois nombres (max 100).

Le jeu inclut un clavier numérique personnalisé pour entrer les réponses, un timer, et un système de score. Le but est d'obtenir le meilleur score possible avant la fin du temps imparti pour chaque question.

## Consignes du projet

- Créer une application mobile avec React Native.
- Implémenter un jeu de calcul mental avec des niveaux de difficulté.
- Ajouter une interface utilisateur claire avec un timer et un suivi du score.
- Permettre à l'utilisateur d'entrer des réponses via un clavier numérique intégré.

## Prérequis

Avant de lancer le projet, assure-toi d'avoir installé :
- [Node.js](https://nodejs.org/) (version recommandée : LTS)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- Un émulateur Android/iOS ou un appareil physique configuré pour le développement React Native
- [React Native CLI](https://reactnative.dev/docs/environment-setup) ou [Expo CLI](https://docs.expo.dev/get-started/installation/) (selon ta configuration)

## Comment lancer le projet

1. **Cloner le repository**  
   Clone ce repository sur ton ordinateur :
   ```bash
   git clone https://github.com/SudoAldebaran/MathsGame-ReactNative.git
   cd MathsGame-ReactNative
   ```

2. **Installer les dépendances**  
   Depuis le dossier du projet, exécute :
   ```bash
   npm install
   ```
   ou, si tu utilises Yarn :
   ```bash
   yarn install
   ```

3. **Lancer l’application**  
   - Pour Android :
     ```bash
     npx react-native run-android
     ```
     Assure-toi qu’un émulateur est en cours d’exécution ou qu’un appareil est connecté via USB avec le mode développeur activé.
   - Pour iOS :
     ```bash
     npx react-native run-ios
     ```
     (Nécessite un Mac avec Xcode installé.)

   Si tu utilises Expo :
   ```bash
   expo start
   ```
   Puis, scanne le QR code avec l’application Expo Go sur ton appareil.

4. **Jouer**  
   - Clique sur "New Game" depuis l’écran d’accueil.
   - Choisis une difficulté ("Easy" ou "Hard").
   - Résous les additions en utilisant le clavier numérique avant la fin du temps.

## Structure du projet

- `App.js` : Fichier principal contenant la logique et les composants de l’application.
- `styles` : Styles définis avec `StyleSheet` pour l’interface utilisateur.

## Dépendances principales

- `react` et `react-native` : Framework de base pour l’application.
- `@react-navigation/native` (optionnel, si tu ajoutes une navigation).