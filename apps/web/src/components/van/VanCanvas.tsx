// apps/web/src/components/van/VanCanvas.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { FURNITURE_PRESETS } from '../../constants/furniture';
import './VanCanvas2D.css';

interface VanCanvasProps {
  selectedObjectId?: string | null;
  onSelectObject?: (id: string | null) => void;
}

/**
 * Canvas 2D pour l'aménagement du van
 * Version mise à jour avec support de la sélection synchronisée avec la vue 3D
 */
export const VanCanvas: React.FC<VanCanvasProps> = ({
  selectedObjectId,
  onSelectObject
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const vanType = useStore(s => s.vanType);
  const objects = useStore(s => s.objects);
  const updateObject = useStore(s => s.updateObject);
  const removeObject = useStore(s => s.removeObject);

  const van = VAN_TYPES.find(v => v.vanType === vanType);

  if (!van) {
    return (
      <div className="van-canvas empty">
        <p>Sélectionnez un type de van</p>
      </div>
    );
  }

  // Échelle : 1mm = 0.1px
  const SCALE = 0.1;
  const canvasWidth = van.length * SCALE;
  const canvasHeight = van.width * SCALE;

  // Gestion du clic sur un meuble
  const handleObjectClick = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    if (onSelectObject) {
      onSelectObject(objectId);
    }
  };

  // Gestion du clic sur le canvas (désélection)
  const handleCanvasClick = () => {
    if (onSelectObject && !draggingId) {
      onSelectObject(null);
    }
  };

  // Début du drag
  const handleMouseDown = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();

    const obj = objects.find(o => o.id === objectId);
    if (!obj) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingId(objectId);

    if (onSelectObject) {
      onSelectObject(objectId);
    }
  };

  // Mouvement pendant le drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    const obj = objects.find(o => o.id === draggingId);
    if (!obj) return;

    // Conversion pixel → mm
    const newXmm = newX / SCALE;
    const newYmm = newY / SCALE;

    // Contraintes dans les limites du van
    const maxX = van.length - obj.width;
    const maxY = van.width - obj.height;
    const clampedX = Math.max(0, Math.min(newXmm, maxX));
    const clampedY = Math.max(0, Math.min(newYmm, maxY));

    // Vérification de collision
    const hasCollision = objects.some(other => {
      if (other.id === draggingId) return false;

      return !(
        clampedX + obj.width <= other.x ||
        clampedX >= other.x + other.width ||
        clampedY + obj.height <= other.y ||
        clampedY >= other.y + other.height
      );
    });

    if (!hasCollision) {
      updateObject(draggingId, { x: clampedX, y: clampedY });
    }
  };

  // Fin du drag
  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Double-clic pour rotation
  const handleDoubleClick = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();
    const obj = objects.find(o => o.id === objectId);
    if (!obj) return;

    const currentRotation = obj.rotation?.y || 0;
    const newRotation = (currentRotation + 90) % 360;
    updateObject(objectId, {
      rotation: { ...obj.rotation, y: newRotation }
    });
  };

  // Context menu (suppression)
  const handleContextMenu = (e: React.MouseEvent, objectId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const obj = objects.find(o => o.id === objectId);
    const confirmDelete = window.confirm(
      `Supprimer "${obj?.name || 'ce meuble'}" ?`
    );

    if (confirmDelete) {
      removeObject(objectId);
      if (onSelectObject) {
        onSelectObject(null);
      }
    }
  };

  // Raccourcis clavier pour l'objet sélectionné
  useEffect(() => {
    if (!selectedObjectId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const obj = objects.find(o => o.id === selectedObjectId);
      if (!obj) return;

      const step = e.shiftKey ? 10 : 100; // Shift = mouvement fin

      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          removeObject(selectedObjectId);
          if (onSelectObject) onSelectObject(null);
          break;
        case 'arrowup':
          e.preventDefault();
          updateObject(selectedObjectId, { y: Math.max(0, obj.y - step) });
          break;
        case 'arrowdown':
          e.preventDefault();
          updateObject(selectedObjectId, {
            y: Math.min(van.width - obj.height, obj.y + step)
          });
          break;
        case 'arrowleft':
          e.preventDefault();
          updateObject(selectedObjectId, { x: Math.max(0, obj.x - step) });
          break;
        case 'arrowright':
          e.preventDefault();
          updateObject(selectedObjectId, {
            x: Math.min(van.length - obj.width, obj.x + step)
          });
          break;
        case 'r':
          e.preventDefault();
          const currentRot = obj.rotation?.y || 0;
          updateObject(selectedObjectId, {
            rotation: { ...obj.rotation, y: (currentRot + 90) % 360 }
          });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObjectId, objects, van, updateObject, removeObject, onSelectObject]);

  return (
    <div className="van-canvas-container">
      <div
        ref={canvasRef}
        className="van-canvas"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          backgroundImage: `url(/assets/vans/${vanType}.svg)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Grille de fond */}
        <div className="canvas-grid" style={{
          backgroundSize: `${100 * SCALE}px ${100 * SCALE}px`
        }} />

        {/* Meubles */}
        {objects.map((obj) => {
          const preset = FURNITURE_PRESETS[obj.type as keyof typeof FURNITURE_PRESETS];
          const isSelected = selectedObjectId === obj.id;
          const isHovered = hoveredId === obj.id;
          const isDragging = draggingId === obj.id;

          return (
            <div
              key={obj.id}
              className={`canvas-object ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isDragging ? 'dragging' : ''}`}
              style={{
                left: `${obj.x * SCALE}px`,
                top: `${obj.y * SCALE}px`,
                width: `${obj.width * SCALE}px`,
                height: `${obj.height * SCALE}px`,
                backgroundColor: obj.color,
                transform: `rotate(${obj.rotation?.y || 0}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isSelected ? 1000 : isDragging ? 999 : 1
              }}
              onClick={(e) => handleObjectClick(e, obj.id)}
              onMouseDown={(e) => handleMouseDown(e, obj.id)}
              onDoubleClick={(e) => handleDoubleClick(e, obj.id)}
              onContextMenu={(e) => handleContextMenu(e, obj.id)}
              onMouseEnter={() => setHoveredId(obj.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Label du meuble */}
              <div className="object-label">
                <span className="object-icon">{preset?.icon || '📦'}</span>
                <span className="object-name">{obj.name}</span>
              </div>

              {/* Dimensions */}
              {(isSelected || isHovered) && (
                <div className="object-dimensions">
                  {obj.width} × {obj.height} mm
                </div>
              )}

              {/* Indicateur de hauteur (z) */}
              {obj.z && obj.z > 0 && (
                <div className="object-height-indicator">
                  ↑ {obj.z}mm
                </div>
              )}

              {/* Bordure de sélection */}
              {isSelected && (
                <div className="selection-border" />
              )}

              {/* Poignées de redimensionnement (future fonctionnalité) */}
              {isSelected && (
                <>
                  <div className="resize-handle top-left" />
                  <div className="resize-handle top-right" />
                  <div className="resize-handle bottom-left" />
                  <div className="resize-handle bottom-right" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Légende des raccourcis */}
      <div className="canvas-controls-hint">
        <p><strong>🖱️ Clic</strong>: Sélectionner</p>
        <p><strong>🖱️ Glisser</strong>: Déplacer</p>
        <p><strong>🖱️ Double-clic</strong>: Rotation 90°</p>
        <p><strong>⌨️ Flèches</strong>: Déplacer (100mm)</p>
        <p><strong>⌨️ Shift + Flèches</strong>: Déplacer fin (10mm)</p>
        <p><strong>⌨️ R</strong>: Rotation 90°</p>
        <p><strong>⌨️ Suppr</strong>: Supprimer</p>
      </div>
    </div>
  );
};
