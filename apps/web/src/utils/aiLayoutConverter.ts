// apps/web/src/utils/aiLayoutConverter.ts

import { FurnitureObject } from '../store/store';
import { mapAITypeToFurnitureType, getFurniturePreset, validateFurnitureDimensions } from '../constants/furniture';

/**
 * AI-generated layout item (from backend)
 */
export interface AILayoutItem {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

/**
 * Convert AI-generated layout items to FurnitureObjects
 * @param aiItems - Array of AI-generated layout items
 * @param vanLength - Van length in mm
 * @param vanWidth - Van width in mm
 * @returns Array of FurnitureObjects ready to be added to the canvas
 */
export const convertAILayoutToFurniture = (
    aiItems: AILayoutItem[],
    vanLength: number,
    vanWidth: number
): FurnitureObject[] => {
    return aiItems.map((item, index) => {
        // Map AI type to our furniture type
        const furnitureType = mapAITypeToFurnitureType(item.type);
        const preset = getFurniturePreset(furnitureType);

        // Validate dimensions
        const validation = validateFurnitureDimensions(item.width, item.height, vanLength, vanWidth);

        // Use validated dimensions or fallback to preset defaults
        const width = validation.valid ? item.width : preset.defaultWidth;
        const height = validation.valid ? item.height : preset.defaultHeight;

        // Ensure position is within bounds
        const x = Math.max(0, Math.min(item.x, vanLength - width));
        const y = Math.max(0, Math.min(item.y, vanWidth - height));

        // Create furniture object
        return {
            id: `ai-${Date.now()}-${index}`,
            name: preset.name,
            type: furnitureType,
            x,
            y,
            z: 0,  // ✅ Position au sol (niveau 0)
            width,
            height,
            color: item.color || preset.color,
        };
    });
};

/**
 * Check if two furniture objects overlap
 */
export const checkOverlap = (a: FurnitureObject, b: FurnitureObject): boolean => {
    return !(
        a.x + a.width <= b.x ||
        a.x >= b.x + b.width ||
        a.y + a.height <= b.y ||
        a.y >= b.y + b.height
    );
};

/**
 * Remove overlapping furniture items (keeps first occurrence)
 */
export const removeOverlaps = (items: FurnitureObject[]): FurnitureObject[] => {
    const result: FurnitureObject[] = [];

    for (const item of items) {
        const hasOverlap = result.some(existing => checkOverlap(item, existing));
        if (!hasOverlap) {
            result.push(item);
        }
    }

    return result;
};

/**
 * Optimize layout by adjusting positions to avoid overlaps
 * Uses a simple grid-based approach
 */
export const optimizeLayoutPositions = (
    items: FurnitureObject[],
    vanLength: number,
    vanWidth: number
): FurnitureObject[] => {
    const optimized = [...items];
    const gridSize = 100; // 100mm grid

    for (let i = 0; i < optimized.length; i++) {
        const item = optimized[i];
        let attempts = 0;
        const maxAttempts = 50;

        // Try to find a non-overlapping position
        while (attempts < maxAttempts) {
            const hasOverlap = optimized.some((other, j) =>
                i !== j && checkOverlap(item, other)
            );

            if (!hasOverlap) break;

            // Move item slightly
            item.x = Math.min(item.x + gridSize, vanLength - item.width);
            if (item.x >= vanLength - item.width) {
                item.x = 0;
                item.y = Math.min(item.y + gridSize, vanWidth - item.height);
            }

            attempts++;
        }
    }

    return optimized;
};

/**
 * Calculate layout statistics
 */
export const calculateLayoutStats = (
    items: FurnitureObject[],
    vanLength: number,
    vanWidth: number
) => {
    const totalVanArea = vanLength * vanWidth;
    const usedArea = items.reduce((sum, item) => sum + (item.width * item.height), 0);
    const usagePercentage = (usedArea / totalVanArea) * 100;

    const furnitureCount = items.reduce((acc, item) => {
        const type = item.type || 'custom';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        totalItems: items.length,
        usedArea,
        totalVanArea,
        usagePercentage: Math.round(usagePercentage * 10) / 10,
        furnitureCount,
    };
};
