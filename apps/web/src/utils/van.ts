// apps/web/src/utils/van.ts

interface VanDimensions {
  length: number;
  width: number;
}

interface ScaleAndOffset {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Calcule l'échelle et l'offset pour centrer un van dans le canvas
 */
export function getVanScaleAndOffset(
  van: VanDimensions,
  canvasWidth: number,
  canvasHeight: number
): ScaleAndOffset {
  const scale = Math.min(canvasWidth / van.length, canvasHeight / van.width) * 0.9;
  const offsetX = (canvasWidth - van.length * scale) / 2;
  const offsetY = (canvasHeight - van.width * scale) / 2;

  return { scale, offsetX, offsetY };
}

/**
 * Convertit des coordonnées canvas en coordonnées van (mm)
 */
export function canvasToVanCoordinates(
  canvasX: number,
  canvasY: number,
  scale: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  return {
    x: (canvasX - offsetX) / scale,
    y: (canvasY - offsetY) / scale,
  };
}

/**
 * Convertit des coordonnées van (mm) en coordonnées canvas
 */
export function vanToCanvasCoordinates(
  vanX: number,
  vanY: number,
  scale: number,
  offsetX: number,
  offsetY: number
): { x: number; y: number } {
  return {
    x: vanX * scale + offsetX,
    y: vanY * scale + offsetY,
  };
}

/**
 * Vérifie si un objet est dans les limites du van
 */
export function isWithinVanBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  van: VanDimensions
): boolean {
  return (
    x >= 0 &&
    y >= 0 &&
    x + width <= van.length &&
    y + height <= van.width
  );
}