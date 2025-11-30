// apps/web/src/constants/furniture.ts

/**
 * Furniture type definitions for AI-generated layouts
 */
export type FurnitureType = 'bed' | 'kitchen' | 'storage' | 'bathroom' | 'table' | 'seat' | 'custom';

/**
 * Furniture preset with default dimensions and styling
 */
export interface FurniturePreset {
  type: FurnitureType;
  name: string;
  defaultWidth: number;  // in mm
  defaultHeight: number; // in mm
  color: string;
  icon: string;
  description: string;
}

/**
 * Predefined furniture presets for van layouts
 * All dimensions are in millimeters
 */
export const FURNITURE_PRESETS: Record<FurnitureType, FurniturePreset> = {
  bed: {
    type: 'bed',
    name: 'Lit',
    defaultWidth: 1900,
    defaultHeight: 1400,
    color: '#3b82f6', // blue
    icon: '🛏️',
    description: 'Lit pour dormir (1900x1400mm par défaut)'
  },
  kitchen: {
    type: 'kitchen',
    name: 'Cuisine',
    defaultWidth: 1200,
    defaultHeight: 600,
    color: '#10b981', // green
    icon: '🍳',
    description: 'Kitchenette avec évier et plaques (1200x600mm)'
  },
  storage: {
    type: 'storage',
    name: 'Rangement',
    defaultWidth: 800,
    defaultHeight: 400,
    color: '#f59e0b', // orange
    icon: '📦',
    description: 'Espace de rangement / placard (800x400mm)'
  },
  bathroom: {
    type: 'bathroom',
    name: 'Salle de bain',
    defaultWidth: 800,
    defaultHeight: 800,
    color: '#8b5cf6', // purple
    icon: '🚿',
    description: 'Salle de bain avec douche (800x800mm)'
  },
  table: {
    type: 'table',
    name: 'Table',
    defaultWidth: 800,
    defaultHeight: 600,
    color: '#ef4444', // red
    icon: '🪑',
    description: 'Table à manger ou de travail (800x600mm)'
  },
  seat: {
    type: 'seat',
    name: 'Siège',
    defaultWidth: 500,
    defaultHeight: 500,
    color: '#ec4899', // pink
    icon: '💺',
    description: 'Siège ou banquette (500x500mm)'
  },
  custom: {
    type: 'custom',
    name: 'Personnalisé',
    defaultWidth: 500,
    defaultHeight: 500,
    color: '#6b7280', // gray
    icon: '📐',
    description: 'Objet personnalisé'
  }
};

/**
 * Get furniture preset by type
 */
export const getFurniturePreset = (type: FurnitureType): FurniturePreset => {
  return FURNITURE_PRESETS[type] || FURNITURE_PRESETS.custom;
};

/**
 * Get furniture name with icon
 */
export const getFurnitureName = (type: FurnitureType): string => {
  const preset = getFurniturePreset(type);
  return `${preset.icon} ${preset.name}`;
};

/**
 * Map AI type to furniture type (with fallback)
 */
export const mapAITypeToFurnitureType = (aiType: string): FurnitureType => {
  const normalized = aiType.toLowerCase().trim();
  
  // Direct matches
  if (normalized === 'bed') return 'bed';
  if (normalized === 'kitchen') return 'kitchen';
  if (normalized === 'storage') return 'storage';
  if (normalized === 'bathroom') return 'bathroom';
  if (normalized === 'table') return 'table';
  if (normalized === 'seat') return 'seat';
  
  // Aliases
  if (normalized.includes('lit') || normalized.includes('sleep')) return 'bed';
  if (normalized.includes('cuisine') || normalized.includes('cook')) return 'kitchen';
  if (normalized.includes('rangement') || normalized.includes('placard') || normalized.includes('cabinet')) return 'storage';
  if (normalized.includes('douche') || normalized.includes('shower') || normalized.includes('wc')) return 'bathroom';
  if (normalized.includes('table')) return 'table';
  if (normalized.includes('siège') || normalized.includes('banquette') || normalized.includes('seat')) return 'seat';
  
  return 'custom';
};

/**
 * Validate furniture dimensions against van bounds
 */
export const validateFurnitureDimensions = (
  width: number,
  height: number,
  vanLength: number,
  vanWidth: number
): { valid: boolean; error?: string } => {
  if (width <= 0 || height <= 0) {
    return { valid: false, error: 'Les dimensions doivent être positives' };
  }
  
  if (width > vanLength) {
    return { valid: false, error: `La largeur (${width}mm) dépasse la longueur du van (${vanLength}mm)` };
  }
  
  if (height > vanWidth) {
    return { valid: false, error: `La hauteur (${height}mm) dépasse la largeur du van (${vanWidth}mm)` };
  }
  
  return { valid: true };
};
