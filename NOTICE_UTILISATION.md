# 🚐 2DVanProj - Manuel d'Utilisation

Bienvenue dans le manuel d'utilisation de **2DVanProj**, votre outil professionnel de conception et d'aménagement de véhicules de loisirs.

Ce document est destiné à vous accompagner dans la prise en main de l'interface et la réalisation de plans précis pour vos projets d'aménagement.

---

## 📑 Table des Matières

1.  **[Introduction](#1-introduction)**
2.  **[Prise en Main](#2-prise-en-main)**
3.  **[Mode Aménagement 2D](#3-mode-aménagement-2d)**
    *   L'Espace de Travail
    *   Gestion du Mobilier
    *   Navigation et Repères
4.  **[Visualisation 3D](#4-visualisation-3d)**
    *   Navigation dans la Vue 3D
    *   Outils de Verrouillage (Caméra & Objets)
5.  **[Sauvegarde et Gestion](#5-sauvegarde-et-gestion)**
6.  **[Raccourcis Clavier](#6-raccourcis-clavier)**

---

## 1. Introduction

**2DVanProj** est une solution web permettant de prototyper l'aménagement intérieur de fourgons aménagés. L'outil combine une vue schématique en plan (2D) pour un positionnement précis et une visualisation tridimensionnelle (3D) temps réel pour apprécier les volumes.

> **Note :** L'application est optimisée pour une utilisation sur ordinateur (souris recommandée pour la navigation 3D).

---

## 2. Prise en Main

### Choix du Véhicule
Au démarrage, la première étape consiste à sélectionner le modèle de véhicule correspondant à votre projet via le menu déroulant "Sélectionner un modèle".

> **📸 Capture d'écran suggérée :** *Le menu déroulant ouvert montrant la liste des véhicules (Sprinter, Ducato, Kangoo, etc.).*

Le gabarit du véhicule s'adapte automatiquement en 2D et en 3D.
*   **Dimensions :** Les cotes intérieures (longueur, largeur utile) sont chargées automatiquement.
*   **Visualisation :** Le modèle 3D (squelette filaire) s'ajuste aux proportions exactes du véhicule choisi.

---

## 3. Mode Aménagement 2D

C'est ici que se fait la conception principale. La vue est orientée en **Paysage** pour maximiser la lisibilité.

### L'Espace de Travail
La grille représente le plancher du véhicule.
*   **Axe Horizontal (X) :** Longueur du véhicule.
*   **Axe Vertical (Y) :** Largeur du véhicule.
*   **Repères Visuels :** Des mentions **"ARRIÈRE"** (à gauche) et **"AVANT"** (à droite) sont affichées en filigrane pour éviter toute confusion d'orientation.

> **📸 Capture d'écran suggérée :** *Vue d'ensemble de la grille 2D vide avec les labels "Arrière" et "Avant" visibles.*

### Gestion du Mobilier

#### Ajouter un Élément
Utilisez la barre d'outils (souvent située en bas ou sur le côté selon votre configuration) pour ajouter des types de meubles génériques :
*   Lits / Couchages
*   Cuisine
*   Rangements
*   Sanitaires

Chaque nouvel objet apparaît par défaut au centre de la zone de travail.

#### Positionner et Manipuler
*   **Déplacement :** Cliquez et maintenez le bouton gauche de la souris sur un meuble pour le faire glisser. Le système empêche les objets de sortir du cadre du véhicule ("collision murs").
*   **Rotation :** Effectuez un **double-clic** sur un meuble pour le faire pivoter de 90° dans le sens horaire.
*   **Suppression :** Faites un **clic-droit** sur un objet pour afficher le menu contextuel et choisir "Supprimer".

> **📸 Capture d'écran suggérée :** *Un aménagement en cours avec plusieurs meubles positionnés sur la grille.*

#### Édition des Propriétés
Pour modifier les dimensions précises (largeur, profondeur, hauteur, élévation) ou la couleur d'un meuble :
1.  Maintenez la touche **`Shift`** (Majuscule) enfoncée.
2.  Cliquez sur le meuble cible.
3.  Une fenêtre modale s'ouvre pour saisir les valeurs numériques.

---

## 4. Visualisation 3D

La vue 3D permet de valider l'ergonomie et l'esthétique du projet. Elle se met à jour en temps réel lors des modifications 2D.

### Navigation
La navigation se fait à la souris :
*   **Rotation (Orbite) :** Clic gauche maintenu + glisser.
*   **Panoramique (Déplacement latéral) :** Clic droit maintenu + glisser.
*   **Zoom :** Molette de la souris.

> **📸 Capture d'écran suggérée :** *Vue 3D montrant le squelette filaire du van et les volumes des meubles.*

### Outils de Verrouillage

L'interface 3D dispose de deux boutons importants pour faciliter le travail :

#### 1. Verrouillage de la Caméra (🔒 Icône Cadenas Jaune)
*   **Activé :** La caméra est figée. Vous ne pouvez plus tourner autour du modèle. Utile pour travailler sur un détail sans que la vue ne bouge.
*   **Désactivé :** Navigation libre.
*   *Raccourci : Touche `C`*

#### 2. Verrouillage des Objets (🧱 Icône Mur/Brique)
*   **Activé (Recommandé pour la visite) :** Les meubles sont verrouillés. Vous ne pouvez pas les déplacer par inadvertance en essayant de tourner la caméra.
    *   *Note :* Vous pouvez toujours sélectionner un objet par un clic simple puis le déplacer si nécessaire, mais le "cliquer-glisser" direct est désactivé.
*   **Désactivé (Icône Main 🖐️) :** Vous pouvez attraper et déplacer les meubles directement en 3D.

> **📸 Capture d'écran suggérée :** *Gros plan sur les boutons de contrôle en haut à droite (Verrouillage Objets) et en bas à gauche (Verrouillage Caméra).*

---

## 5. Sauvegarde et Gestion

### Sauvegarder un Plan
Cliquez sur le bouton "Sauvegarder" dans la barre d'actions.
*   Si vous êtes connecté, le plan est enregistré dans votre bibliothèque personnelle.
*   Vous pouvez nommer vos plans pour les retrouver et gérer plusieurs versions (ex: "Sprinter V1", "Sprinter V2").

---

## 6. Raccourcis Clavier

| Raccourci | Contexte | Action |
| :--- | :--- | :--- |
| **Double-Clic** | Meuble (2D) | Pivoter de 90° |
| **Clic-Droit** | Meuble (2D) | Supprimer le meuble |
| **Shift + Clic** | Meuble (2D) | Ouvrir le menu d'édition (Dimensions/Couleur) |
| **Touche `C`** | Vue 3D | Verrouiller / Déverrouiller la rotation caméra |

---
*Fin du document.*

