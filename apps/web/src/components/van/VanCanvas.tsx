// apps/web/src/components/van/VanCanvas.tsx
import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Group, Text, Image as KonvaImage } from 'react-konva';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import './VanCanvas.css';

type Obj = {
  id: string;
  name?: string; // ✅ ajout du nom
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

// ✅ FurnitureRect now works in van-space coordinates only
// The parent Group handles all scaling and offsetting
const FurnitureRect: React.FC<{ obj: Obj }> = ({ obj }) => {
  const objects = useStore((s) => s.objects);
  const updateObject = useStore((s) => s.updateObject);
  const removeObject = useStore((s) => s.removeObject);
  const vanType = useStore.getState().vanType;
  const van = VAN_TYPES.find((v) => v.vanType === vanType) ?? { length: 4000, width: 2000 };

  const [isHovered, setIsHovered] = React.useState(false);

  // ✅ Check if two objects overlap (in van-space coordinates)
  const isOverlapping = (a: any, b: any) =>
    !(
      a.x + a.width <= b.x ||
      a.x >= b.x + b.width ||
      a.y + a.height <= b.y ||
      a.y >= b.y + b.height
    );

  // ✅ Handle drag - all coordinates are in van-space (mm)
  const handleDragMove = (e: any) => {
    const vanX = e.target.x();
    const vanY = e.target.y();

    const constrainedX = Math.max(0, Math.min(vanX, van.length - obj.width));
    const constrainedY = Math.max(0, Math.min(vanY, van.width - obj.height));

    const newRect = { ...obj, x: constrainedX, y: constrainedY };
    const hasOverlap = objects.some((o) => o.id !== obj.id && isOverlapping(newRect, o));

    if (hasOverlap) {
      e.target.x(obj.x);
      e.target.y(obj.y);
    } else {
      updateObject(obj.id, { x: constrainedX, y: constrainedY });
    }
  };

  // ✅ Handle right-click context menu
  const handleContextMenu = (e: any) => {
    e.evt.preventDefault();

    const options = [
      { label: '✏️ Renommer', action: 'rename' },
      { label: '🗑️ Supprimer', action: 'delete' }
    ];

    const choice = window.confirm(
      `${obj.name || 'Meuble'}\n\nQue voulez-vous faire?\n\n` +
      `Cliquez OK pour RENOMMER\n` +
      `Cliquez Annuler pour SUPPRIMER`
    );

    if (choice) {
      // Rename
      const newName = window.prompt('Nouveau nom:', obj.name || '');
      if (newName !== null && newName.trim() !== '') {
        updateObject(obj.id, { name: newName.trim() });
      }
    } else {
      // Delete
      const confirmDelete = window.confirm(
        `Êtes-vous sûr de vouloir supprimer "${obj.name || 'ce meuble'}"?`
      );
      if (confirmDelete) {
        removeObject(obj.id);
      }
    }
  };

  return (
    <Group
      x={obj.x}
      y={obj.y}
      draggable
      onDragMove={handleDragMove}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ Rectangle positioned at 0,0 relative to Group */}
      <Rect
        x={0}
        y={0}
        width={obj.width}
        height={obj.height}
        fill={obj.color}
        cornerRadius={4}
        stroke={isHovered ? '#1f2937' : 'transparent'}
        strokeWidth={isHovered ? 3 : 0}
        opacity={isHovered ? 0.9 : 1}
      />
      {/* ✅ Text positioned at 0,0 relative to Group - stays centered in rect */}
      {obj.name && (
        <Text
          text={obj.name}
          x={0}
          y={0}
          width={obj.width}
          height={obj.height}
          fontSize={14}
          fontStyle="bold"
          fill="#111827"
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      )}
      {/* ✅ Hover hint */}
      {isHovered && (
        <Text
          text="Clic droit pour options"
          x={0}
          y={obj.height + 5}
          fontSize={10}
          fill="#6b7280"
          align="center"
          width={obj.width}
          listening={false}
        />
      )}
    </Group>
  );
};

// ✅ Composant principal du canvas
export const VanCanvas: React.FC = () => {
  const objects = useStore((s) => s.objects);
  const vanType = useStore((s) => s.vanType);
  const selectedPlan = useStore((s) => s.selectedPlan); // ✅ si ton store contient le plan sélectionné
  const canvasWidth = 900;
  const canvasHeight = 300;

  const van = VAN_TYPES.find((v) => v.vanType === vanType) ?? { length: 4000, width: 2000 };

  // ✅ updated for SVG overlay (Vite safe)
  const [svgImage, setSvgImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!vanType) {
      setSvgImage(null);
      return;
    }

    const svgPath = new URL(`../../assets/vans/${vanType}.svg`, import.meta.url).href;
    const img = new Image();
    img.onload = () => setSvgImage(img);
    img.onerror = () => {
      console.warn(`⚠️ SVG for ${vanType} not found or failed to load`);
      setSvgImage(null);
    };
    img.src = svgPath;
  }, [vanType]);

  // ✅ When a saved plan is loaded, reload SVG even if vanType didn't change
  useEffect(() => {
    if (!selectedPlan) return;
    const currentVanType = useStore.getState().vanType;
    if (!currentVanType) return;

    const svgPath = new URL(`../../assets/vans/${currentVanType}.svg`, import.meta.url).href;
    const img = new Image();
    img.onload = () => setSvgImage(img);
    img.onerror = () => {
      console.warn(`⚠️ SVG for ${currentVanType} not found or failed to load`);
      setSvgImage(null);
    };
    img.src = svgPath;
  }, [selectedPlan]); // ✅ triggered when a plan is loaded

  // scale basé sur la longueur ET largeur, on privilégie le remplissage
  const scaleX = canvasWidth / van.length;
  const scaleY = canvasHeight / van.width;
  const scale = Math.min(scaleX, scaleY) * 0.95;
  const offsetX = (canvasWidth - van.length * scale) / 2;
  const offsetY = (canvasHeight - van.width * scale) / 2;

  return (
    <div className="van-canvas">
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {/* fond du canvas */}
          <Rect x={0} y={0} width={canvasWidth} height={canvasHeight} fill="#f9fafb" />
          <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
            {/* van */}
            <Rect
              x={0}
              y={0}
              width={van.length}
              height={van.width}
              fill="#ddd"
              cornerRadius={8}
              stroke="#9ca3af"
              strokeWidth={2}
            />

            {/* ✅ added SVG overlay */}
            {svgImage && (
              <KonvaImage
                image={svgImage}
                x={0}
                y={0}
                width={van.length}
                height={van.width}
                opacity={0.75}
                listening={false}
              />
            )}

            {/* objets - NO NEED to pass scale/offset props */}
            {objects.map((o) => (
              <FurnitureRect key={o.id} obj={o} />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

/*
✅ Key Changes for SVG + Saved Plans
------------------------------------
- Added `selectedPlan` from store dependency
- Added useEffect that reloads SVG when a saved plan is selected
- Keeps fallback if file is missing
- Keeps original layout, comments, and scaling logic

*/
