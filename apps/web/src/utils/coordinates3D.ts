// apps/web/src/utils/coordinates3D.ts

import { VAN_TYPES } from '../constants/vans';
import { FurnitureObject } from '../store/store';

/**
 * Convertit les coordonnées 2D (mm) en coordonnées 3D (mètres)
 * Origine 2D : Coin avant-gauche du van
 * Origine 3D : Centre du van
 */
export const convert2DTo3D = (
  x: number,      // Position X en mm (2D)
  y: number,      // Position Y en mm (2D)
  z: number = 0,  // Position Z en mm (hauteur)
  vanType: string
): { x: number; y: number; z: number } => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return { x: 0, y: 0, z: 0 };

  // Conversion mm → mètres et recentrage
  const posX = (x / 1000) - (van.length / 2000);
  const posY = z / 1000; // Y = hauteur en 3D
  const posZ = (y / 1000) - (van.width / 2000);

  return { x: posX, y: posY, z: posZ };
};

/**
 * Convertit les coordonnées 3D (mètres) en coordonnées 2D (mm)
 * Inverse de convert2DTo3D
 */
export const convert3DTo2D = (
  x: number,  // Position X en mètres (3D, centré)
  y: number,  // Position Y en mètres (hauteur)
  z: number,  // Position Z en mètres (3D, centré)
  vanType: string
): { x: number; y: number; z: number } => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return { x: 0, y: 0, z: 0 };

  // Conversion mètres → mm et décentrage
  const posX = (x + van.length / 2000) * 1000;
  const posY = (z + van.width / 2000) * 1000;
  const posZ = y * 1000;

  return { x: posX, y: posY, z: posZ };
};

/**
 * Convertit les dimensions 2D (mm) en dimensions 3D (mètres)
 */
export const convertDimensions2DTo3D = (
  width: number,   // Largeur en mm (2D)
  height: number,  // Hauteur en mm (2D)
  depth?: number   // Profondeur en mm (optionnel)
): { x: number; y: number; z: number } => {
  return {
    x: width / 1000,
    y: (depth || height) / 1000,
    z: height / 1000,
  };
};

/**
 * Contraint un objet dans les limites du van
 */
export const constrainToVan = (
  furniture: FurnitureObject,
  vanType: string
): FurnitureObject => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return furniture;

  const constrained = { ...furniture };
  
  // Contraindre X (longueur)
  constrained.x = Math.max(0, Math.min(constrained.x, van.length - furniture.width));
  
  // Contraindre Y (largeur)
  constrained.y = Math.max(0, Math.min(constrained.y, van.width - furniture.height));
  
  // Contraindre Z (hauteur) - hauteur max 2000mm
  constrained.z = Math.max(0, Math.min(constrained.z || 0, 2000 - (furniture.depth || furniture.height)));

  return constrained;
};

/**
 * Détecte les collisions 3D entre deux objets
 */
export const checkCollision3D = (
  obj1: FurnitureObject,
  obj2: FurnitureObject
): boolean => {
  const depth1 = obj1.depth || obj1.height;
  const depth2 = obj2.depth || obj2.height;
  const z1 = obj1.z || 0;
  const z2 = obj2.z || 0;

  // Collision sur X (longueur)
  const collisionX = !(
    obj1.x + obj1.width <= obj2.x ||
    obj1.x >= obj2.x + obj2.width
  );

  // Collision sur Y (largeur)
  const collisionY = !(
    obj1.y + obj1.height <= obj2.y ||
    obj1.y >= obj2.y + obj2.height
  );

  // Collision sur Z (hauteur)
  const collisionZ = !(
    z1 + depth1 <= z2 ||
    z1 >= z2 + depth2
  );

  return collisionX && collisionY && collisionZ;
};

/**
 * Snap à la grille (pour alignement)
 */
export const snapToGrid = (
  value: number,
  gridSize: number = 100
): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Calcule le volume occupé en m³
 */
export const calculateVolume = (furniture: FurnitureObject): number => {
  const width = furniture.width / 1000;
  const height = furniture.height / 1000;
  const depth = (furniture.depth || furniture.height) / 1000;
  return width * height * depth;
};

/**
 * Calcule le volume total occupé dans le van
 */
export const calculateTotalVolume = (
  objects: FurnitureObject[]
): number => {
  return objects.reduce((total, obj) => total + calculateVolume(obj), 0);
};

/**
 * Calcule le pourcentage d'occupation volumique
 */
export const calculateVolumeUsage = (
  objects: FurnitureObject[],
  vanType: string
): number => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return 0;

  const vanVolume = (van.length / 1000) * (van.width / 1000) * 2.0; // 2m de hauteur
  const usedVolume = calculateTotalVolume(objects);

  return (usedVolume / vanVolume) * 100;
};
