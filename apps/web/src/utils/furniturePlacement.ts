// apps/web/src/utils/furniturePlacement.ts

import { VAN_TYPES } from '../constants/vans';
import { FurnitureObject } from '../store/store';

/**
 * Check 2D collision between two rectangular objects
 */
export const checkCollision2D = (
    obj1: { x: number; y: number; width: number; height: number },
    obj2: { x: number; y: number; width: number; height: number }
): boolean => {
    return !(
        obj1.x + obj1.width <= obj2.x ||
        obj1.x >= obj2.x + obj2.width ||
        obj1.y + obj1.height <= obj2.y ||
        obj1.y >= obj2.y + obj2.height
    );
};

/**
 * Find an available position for new furniture without collisions
 * Uses a grid-based search starting from the front-left area
 */
export const findAvailablePosition = (
    furnitureWidth: number,
    furnitureHeight: number,
    existingFurniture: FurnitureObject[],
    vanType: string
): { x: number; y: number } => {
    const van = VAN_TYPES.find(v => v.vanType === vanType);
    if (!van) {
        console.log('❌ Van not found:', vanType);
        return { x: 0, y: 0 };
    }

    console.log('🚐 Van dimensions:', { length: van.length, width: van.width });
    console.log('📦 Furniture size:', { width: furnitureWidth, height: furnitureHeight });
    console.log('🪑 Existing furniture count:', existingFurniture.length);

    // ✅ PREMIER MEUBLE : Au centre du van
    if (existingFurniture.length === 0) {
        const centerX = (van.length - furnitureWidth) / 2;
        const centerY = (van.width - furnitureHeight) / 2;
        console.log('✅ First furniture - centered at:', { x: centerX, y: centerY });
        return { x: centerX, y: centerY };
    }

    // ✅ MEUBLES SUIVANTS : Chercher une position adjacente aux meubles existants
    const gap = 50; // Petit espace entre les meubles (50mm)
    const searchRadius = 100; // Distance de recherche autour des meubles existants

    // Pour chaque meuble existant, essayer de placer le nouveau meuble autour
    for (const existing of existingFurniture) {
        // Essayer 4 positions : droite, bas, gauche, haut
        const positions = [
            { x: existing.x + existing.width + gap, y: existing.y }, // À droite
            { x: existing.x, y: existing.y + existing.height + gap }, // En bas
            { x: existing.x - furnitureWidth - gap, y: existing.y }, // À gauche
            { x: existing.x, y: existing.y - furnitureHeight - gap }, // En haut
        ];

        for (const pos of positions) {
            // Vérifier que la position est dans les limites du van
            if (
                pos.x >= 0 &&
                pos.y >= 0 &&
                pos.x + furnitureWidth <= van.length &&
                pos.y + furnitureHeight <= van.width
            ) {
                // Vérifier qu'il n'y a pas de collision avec d'autres meubles
                const hasCollision = existingFurniture.some(obj =>
                    checkCollision2D(
                        { x: pos.x, y: pos.y, width: furnitureWidth, height: furnitureHeight },
                        { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
                    )
                );

                if (!hasCollision) {
                    console.log('✅ Found adjacent position:', pos);
                    return pos;
                }
            }
        }
    }

    // ⚠️ FALLBACK : Si aucune position adjacente n'est trouvée, chercher n'importe où
    const padding = 200;
    const gridSize = 100;
    let x = van.length / 4;
    let y = van.width / 4;

    while (y + furnitureHeight <= van.width - padding) {
        while (x + furnitureWidth <= van.length - padding) {
            const hasCollision = existingFurniture.some(obj =>
                checkCollision2D(
                    { x, y, width: furnitureWidth, height: furnitureHeight },
                    { x: obj.x, y: obj.y, width: obj.width, height: obj.height }
                )
            );

            if (!hasCollision) {
                console.log('⚠️ Using fallback grid position:', { x, y });
                return { x, y };
            }

            x += gridSize;
        }
        x = van.length / 4;
        y += gridSize;
    }

    // Dernier recours : centre du van
    const centerPos = {
        x: (van.length - furnitureWidth) / 2,
        y: (van.width - furnitureHeight) / 2
    };
    console.log('🆘 Last resort - center position:', centerPos);
    return centerPos;
};
