// apps/web/src/components/van/VanCanvas2D.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import './VanCanvas.css';

interface VanCanvas2DProps {
  selectedObjectId?: string | null;
  onSelectObject?: (id: string | null) => void;
}

/**
 * Rendu SVG 2D pour chaque type de meuble avec images réalistes
 */
const FurnitureSVG: React.FC<{ furniture: any }> = ({ furniture }) => {
  const type = furniture.type;
  const width = furniture.width;
  const height = furniture.height;

  // Map furniture type to image path
  const getImagePath = (furnitureType: string): string => {
    const imageMap: Record<string, string> = {
      'bed': '/furniture/bed.png',
      'kitchen': '/furniture/kitchen.png',
      'bathroom': '/furniture/bathroom.png',
      'storage': '/furniture/storage.png',
      'table': '/furniture/table.png',
      'seat': '/furniture/seat.png',
    };
    return imageMap[furnitureType] || '';
  };

  const imagePath = getImagePath(type);

  // Debug logging
  console.log('FurnitureSVG - Type:', type, 'Image Path:', imagePath, 'Furniture:', furniture);

  // If we have an image for this furniture type, use it
  if (imagePath) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background with slight border */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="8"
          fill="#ffffff"
          stroke="#e0e0e0"
          strokeWidth="2"
        />
        {/* Furniture image */}
        <image
          xlinkHref={imagePath}
          href={imagePath}
          x="2%"
          y="2%"
          width="96%"
          height="96%"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    );
  }

  // Fallback for custom or unknown furniture types
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="5%" y="5%" width="90%" height="90%" rx="8" fill={furniture.color || '#6b7280'} opacity="0.7" />
      <text x="50%" y="50%" fontSize="24" fill="#fff" textAnchor="middle" dominantBaseline="middle">
        {furniture.name || '?'}
      </text>
    </svg>
  );
};

export const VanCanvas2D: React.FC<VanCanvas2DProps> = ({
  selectedObjectId,
  onSelectObject
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const SCALE = 0.1;
  const canvasWidth = van.length * SCALE;
  const canvasHeight = van.width * SCALE;

  const handleObjectMouseDown = (e: React.MouseEvent, objectId: string) => {
    e.stopPropagation();

    const obj = objects.find(o => o.id === objectId);
    if (!obj) return;

    if (onSelectObject) {
      onSelectObject(objectId);
    }

    const objElement = e.currentTarget as HTMLElement;
    const rect = objElement.getBoundingClientRect();

    setDragStart({
      x: e.clientX,
      y: e.clientY
    });

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    setDraggingId(objectId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const obj = objects.find(o => o.id === draggingId);
    if (!obj) return;

    // Nouvelle position en pixels
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    // Conversion en mm
    const newXmm = newX / SCALE;
    const newYmm = newY / SCALE;

    // Contraintes
    const maxX = van.length - obj.width;
    const maxY = van.width - obj.height;
    const clampedX = Math.max(0, Math.min(newXmm, maxX));
    const clampedY = Math.max(0, Math.min(newYmm, maxY));

    // Vérification collision
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

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onSelectObject) {
      onSelectObject(null);
    }
  };

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

  return (
    <div className="van-canvas-container" key={`canvas-${objects.length}-${objects.map(o => o.id).join('-')}`}>
      <div
        ref={canvasRef}
        className="van-canvas"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          position: 'relative',
          border: '2px solid #cbd5e1',
          borderRadius: '8px',
          background: '#f8fafc'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Meubles avec SVG */}
        {objects.map((obj) => {
          const isSelected = selectedObjectId === obj.id;
          const isDragging = draggingId === obj.id;

          return (
            <div
              key={obj.id}
              className={`canvas-object-2d ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
              style={{
                position: 'absolute',
                left: `${obj.x * SCALE}px`,
                top: `${obj.y * SCALE}px`,
                width: `${obj.width * SCALE}px`,
                height: `${obj.height * SCALE}px`,
                transform: `rotate(${obj.rotation?.y || 0}deg)`,
                transformOrigin: 'center',
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isSelected ? 1000 : isDragging ? 999 : 1,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                border: isSelected ? '3px solid #3b82f6' : '2px solid rgba(0,0,0,0.1)',
                borderRadius: '8px',
                boxShadow: isSelected ? '0 0 20px rgba(59, 130, 246, 0.5)' : isDragging ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              onDoubleClick={(e) => handleDoubleClick(e, obj.id)}
            >
              <FurnitureSVG furniture={obj} />

              {/* Label */}
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: isSelected ? '#3b82f6' : 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}>
                {obj.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
