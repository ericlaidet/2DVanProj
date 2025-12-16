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
        compact: { width: 800, height: 1850, depth: 400 },   // Lit simple 185×80cm (1 personne)
        medium: { width: 1100, height: 1900, depth: 400 },   // Lit 190×110cm (1-2 personnes)
        large: { width: 1600, height: 2000, depth: 400 },    // Grand lit 200×160cm
    },
    kitchen: {
        compact: { width: 500, height: 1000, depth: 850 },    // Cuisine compacte 100×50cm H85
        medium: { width: 550, height: 1200, depth: 900 },    // Cuisine standard 120×55cm H90
        large: { width: 600, height: 1400, depth: 900 },     // Grande cuisine 140×60cm H90
    },
    table: {
        compact: { width: 400, height: 600, depth: 700 },   // Table 60×40cm H70
        medium: { width: 500, height: 800, depth: 720 },    // Table 80×50cm H72
        large: { width: 600, height: 1000, depth: 750 },     // Table 100×60cm H75
    },
    bathroom: {
        compact: { width: 700, height: 700, depth: 1900 },   // Douche 70×70cm H190
        medium: { width: 800, height: 800, depth: 1950 },    // Douche 80×80cm H195
        large: { width: 900, height: 900, depth: 2000 },     // Douche 90×90cm H200
    },
    storage: {
        compact: { width: 350, height: 600, depth: 500 },    // Rangement Prof.30-40 H40-60
        medium: { width: 450, height: 800, depth: 700 },     // Rangement Prof.40-50 H60-80
        large: { width: 500, height: 1000, depth: 800 },      // Grand rangement Prof.50 H80
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
