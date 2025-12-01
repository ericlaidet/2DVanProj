// apps/web/src/utils/viewSyncManager.ts

/**
 * Gestionnaire de synchronisation entre les vues 2D et 3D
 * Assure que les modifications dans une vue sont immédiatement reflétées dans l'autre
 */

import { FurnitureObject } from '../store/store';
import { convert2DTo3D, convert3DTo2D } from './coordinates3D';

export interface ViewState {
  mode: '2D' | '3D';
  selectedId: string | null;
  isDragging: boolean;
  isRotating: boolean;
}

/**
 * Convertit un objet du store pour l'affichage 2D
 */
export const prepareFor2DView = (
  furniture: FurnitureObject,
  vanType: string
): {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
} => {
  return {
    x: furniture.x,
    y: furniture.y,
    width: furniture.width,
    height: furniture.height,
    rotation: furniture.rotation?.y || 0 // Rotation dans le plan horizontal
  };
};

/**
 * Convertit un objet du store pour l'affichage 3D
 */
export const prepareFor3DView = (
  furniture: FurnitureObject,
  vanType: string
): {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
} => {
  // Conversion des coordonnées 2D vers 3D
  const pos3D = convert2DTo3D(
    furniture.x,
    furniture.y,
    furniture.z || 0,
    vanType
  );

  // Ajustement de la hauteur pour poser sur le sol
  const depth = furniture.depth || furniture.height;
  pos3D.y = pos3D.y + (depth / 1000) / 2;

  return {
    position: pos3D,
    rotation: {
      x: furniture.rotation?.x || 0,
      y: furniture.rotation?.y || 0,
      z: furniture.rotation?.z || 0
    },
    scale: {
      x: furniture.width / 1000,
      y: (furniture.depth || furniture.height) / 1000,
      z: furniture.height / 1000
    }
  };
};

/**
 * Synchronise une modification 3D vers le store (et donc vers la vue 2D)
 */
export const sync3DToStore = (
  furnitureId: string,
  position3D: { x: number; y: number; z: number },
  rotation3D: { x: number; y: number; z: number },
  vanType: string
): Partial<FurnitureObject> => {
  // Conversion 3D vers 2D
  const pos2D = convert3DTo2D(position3D.x, position3D.y, position3D.z, vanType);

  return {
    x: pos2D.x,
    y: pos2D.y,
    z: pos2D.z,
    rotation: {
      x: rotation3D.x,
      y: rotation3D.y,
      z: rotation3D.z
    }
  };
};

/**
 * Synchronise une modification 2D vers le store (et donc vers la vue 3D)
 */
export const sync2DToStore = (
  furnitureId: string,
  position2D: { x: number; y: number },
  rotation2D: number
): Partial<FurnitureObject> => {
  return {
    x: position2D.x,
    y: position2D.y,
    rotation: {
      y: rotation2D // La rotation 2D correspond à l'axe Y en 3D
    }
  };
};

/**
 * Vérifie si deux états de vue sont synchronisés
 */
export const areViewsSynced = (
  furniture2D: Partial<FurnitureObject>,
  furniture3D: Partial<FurnitureObject>,
  tolerance: number = 0.1 // Tolérance en mm
): boolean => {
  if (!furniture2D || !furniture3D) return false;

  const posMatch = 
    Math.abs((furniture2D.x || 0) - (furniture3D.x || 0)) < tolerance &&
    Math.abs((furniture2D.y || 0) - (furniture3D.y || 0)) < tolerance &&
    Math.abs((furniture2D.z || 0) - (furniture3D.z || 0)) < tolerance;

  const rotMatch =
    Math.abs((furniture2D.rotation?.y || 0) - (furniture3D.rotation?.y || 0)) < 1; // 1 degré

  return posMatch && rotMatch;
};

/**
 * Calcule le delta entre deux positions (utile pour le snap)
 */
export const calculateDelta = (
  oldPos: { x: number; y: number; z?: number },
  newPos: { x: number; y: number; z?: number }
): { dx: number; dy: number; dz: number } => {
  return {
    dx: newPos.x - oldPos.x,
    dy: newPos.y - oldPos.y,
    dz: (newPos.z || 0) - (oldPos.z || 0)
  };
};

/**
 * Applique un snap à la grille sur une position
 */
export const applyGridSnap = (
  position: { x: number; y: number; z?: number },
  gridSize: number = 100
): { x: number; y: number; z: number } => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
    z: Math.round((position.z || 0) / gridSize) * gridSize
  };
};

/**
 * Interpolation linéaire pour animations fluides
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Interpolation pour vecteur 3D
 */
export const lerpVector3 = (
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  t: number
): { x: number; y: number; z: number } => {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    z: lerp(start.z, end.z, t)
  };
};

/**
 * Animation de transition entre deux positions
 */
export class ViewTransition {
  private startPos: { x: number; y: number; z: number };
  private endPos: { x: number; y: number; z: number };
  private duration: number;
  private elapsed: number = 0;
  private isActive: boolean = false;

  constructor(
    start: { x: number; y: number; z: number },
    end: { x: number; y: number; z: number },
    duration: number = 300 // ms
  ) {
    this.startPos = start;
    this.endPos = end;
    this.duration = duration;
    this.isActive = true;
  }

  update(deltaTime: number): { x: number; y: number; z: number } | null {
    if (!this.isActive) return null;

    this.elapsed += deltaTime;
    const t = Math.min(this.elapsed / this.duration, 1);
    
    // Easing function (ease-out)
    const eased = 1 - Math.pow(1 - t, 3);

    if (t >= 1) {
      this.isActive = false;
      return this.endPos;
    }

    return lerpVector3(this.startPos, this.endPos, eased);
  }

  isFinished(): boolean {
    return !this.isActive;
  }
}

/**
 * Gestionnaire d'événements de synchronisation
 */
export class SyncEventManager {
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Retourne une fonction de désabonnement
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  clear(): void {
    this.listeners.clear();
  }
}

// Instance globale du gestionnaire d'événements
export const syncEvents = new SyncEventManager();

/**
 * Événements disponibles :
 * - 'furniture:moved' - Un meuble a été déplacé
 * - 'furniture:rotated' - Un meuble a été tourné
 * - 'furniture:resized' - Un meuble a été redimensionné
 * - 'furniture:selected' - Un meuble a été sélectionné
 * - 'furniture:deselected' - Un meuble a été désélectionné
 * - 'view:changed' - La vue active a changé (2D/3D)
 */

/**
 * Helper pour logger les changements de synchronisation (debug)
 */
export const logSyncChange = (
  furnitureId: string,
  changeType: string,
  oldValue: any,
  newValue: any
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ViewSync] ${changeType} for ${furnitureId}:`, {
      old: oldValue,
      new: newValue
    });
  }
};

/**
 * Valide qu'une position est dans les limites du van
 */
export const isPositionValid = (
  position: { x: number; y: number; z?: number },
  vanLength: number,
  vanWidth: number,
  maxHeight: number = 2000
): boolean => {
  return (
    position.x >= 0 && position.x <= vanLength &&
    position.y >= 0 && position.y <= vanWidth &&
    (position.z || 0) >= 0 && (position.z || 0) <= maxHeight
  );
};
