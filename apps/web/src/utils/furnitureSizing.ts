// apps/web/src/utils/furnitureSizing.ts

import { VAN_TYPES } from '../constants/vans';

/**
 * Van size categories based on length
 */
export type VanCategory = 'compact' | 'medium' | 'large';

/**
 * Furniture dimensions by type and van category
 * All dimensions in millimeters
 */
interface FurnitureDimensions {
    width: number;
    height: number;
    depth: number;
}

type FurnitureSizes = {
    [key: string]: {
        compact: FurnitureDimensions;
        medium: FurnitureDimensions;
        large: FurnitureDimensions;
    };
};

/**
 * Adaptive furniture sizes based on van category
 * Dimensions are realistic for van conversions
 */
const ADAPTIVE_SIZES: FurnitureSizes = {
    bed: {
        compact: { width: 900, height: 1800, depth: 400 },   // Lit simple
        medium: { width: 1200, height: 1900, depth: 400 },   // Lit double petit
        large: { width: 1400, height: 2000, depth: 400 },    // Lit double
    },
    kitchen: {
        compact: { width: 900, height: 450, depth: 600 },    // Kitchenette compacte
        medium: { width: 1000, height: 500, depth: 600 },    // Cuisine standard
        large: { width: 1200, height: 600, depth: 600 },     // Grande cuisine
    },
    table: {
        compact: { width: 600, height: 1500, depth: 600 },   // Table carrée
        medium: { width: 700, height: 1500, depth: 600 },    // Table ronde
        large: { width: 800, height: 1600, depth: 600 },     // Grande table
    },
    bathroom: {
        compact: { width: 700, height: 700, depth: 2000 },   // Douche compacte
        medium: { width: 800, height: 800, depth: 2000 },    // Douche standard
        large: { width: 900, height: 900, depth: 2000 },     // Grande douche
    },
    storage: {
        compact: { width: 500, height: 350, depth: 400 },    // Rangement compact
        medium: { width: 600, height: 400, depth: 400 },     // Rangement standard
        large: { width: 700, height: 450, depth: 400 },      // Grand rangement
    },
    seat: {
        compact: { width: 400, height: 400, depth: 500 },    // Siège compact
        medium: { width: 500, height: 500, depth: 500 },     // Siège standard
        large: { width: 600, height: 600, depth: 500 },      // Grand siège
    },
    custom: {
        compact: { width: 500, height: 500, depth: 500 },    // Objet personnalisé
        medium: { width: 600, height: 600, depth: 600 },
        large: { width: 700, height: 700, depth: 700 },
    },
};

/**
 * Determine van category based on length
 */
export const getVanCategory = (vanLength: number): VanCategory => {
    if (vanLength < 5000) return 'compact';
    if (vanLength < 6000) return 'medium';
    return 'large';
};

/**
 * Get adaptive furniture dimensions based on van type
 */
export const getAdaptiveFurnitureSize = (
    furnitureType: string,
    vanType: string
): FurnitureDimensions => {
    const van = VAN_TYPES.find(v => v.vanType === vanType);
    if (!van) {
        console.warn('Van not found, using compact sizes');
        return ADAPTIVE_SIZES[furnitureType]?.compact || ADAPTIVE_SIZES.custom.compact;
    }

    const category = getVanCategory(van.length);
    const sizes = ADAPTIVE_SIZES[furnitureType] || ADAPTIVE_SIZES.custom;

    console.log(`📏 Furniture sizing: ${furnitureType} for ${category} van (${van.length}mm)`, sizes[category]);

    return sizes[category];
};
