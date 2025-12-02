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
 * Rendu SVG 2D pour chaque type de meuble
 */
const FurnitureSVG: React.FC<{ furniture: any }> = ({ furniture }) => {
  const type = furniture.type;
  const color = furniture.color;
  const width = furniture.width;
  const height = furniture.height;

  switch (type) {
    case 'bed':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Matelas */}
          <rect x="5%" y="10%" width="90%" height="80%" rx="20" fill={color} opacity="0.9"/>
          {/* Oreillers */}
          <rect x="10%" y="15%" width="35%" height="25%" rx="10" fill="#f0f0f0" opacity="0.8"/>
          <rect x="55%" y="15%" width="35%" height="25%" rx="10" fill="#f0f0f0" opacity="0.8"/>
          {/* Couverture */}
          <rect x="15%" y="50%" width="70%" height="40%" rx="5" fill={color} opacity="0.6"/>
          <text x="50%" y="95%" fontSize="14" fill="#333" textAnchor="middle">🛏️</text>
        </svg>
      );

    case 'kitchen':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Meuble */}
          <rect x="5%" y="5%" width="90%" height="90%" rx="8" fill={color}/>
          {/* Plan de travail */}
          <rect x="5%" y="5%" width="90%" height="15%" rx="4" fill="#8b7355"/>
          {/* Évier */}
          <circle cx="30%" cy="35%" r="12%" fill="#c0c0c0"/>
          {/* Plaques */}
          <circle cx="65%" cy="35%" r="8%" fill="#1a1a1a"/>
          <circle cx="80%" cy="35%" r="8%" fill="#1a1a1a"/>
          {/* Portes */}
          <rect x="8%" y="55%" width="40%" height="38%" rx="4" fill={color} stroke="#666" strokeWidth="2"/>
          <rect x="52%" y="55%" width="40%" height="38%" rx="4" fill={color} stroke="#666" strokeWidth="2"/>
          <text x="50%" y="95%" fontSize="16" fill="#fff" textAnchor="middle">🍳</text>
        </svg>
      );

    case 'bathroom':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Bac de douche */}
          <rect x="5%" y="5%" width="90%" height="90%" rx="10" fill={color} opacity="0.8"/>
          {/* Parois */}
          <rect x="8%" y="8%" width="84%" height="84%" rx="8" fill="none" stroke="#fff" strokeWidth="4" opacity="0.3"/>
          {/* Pommeau */}
          <circle cx="80%" cy="20%" r="6%" fill="#c0c0c0"/>
          <line x1="80%" y1="26%" x2="80%" y2="40%" stroke="#c0c0c0" strokeWidth="2"/>
          <text x="50%" y="95%" fontSize="16" fill="#fff" textAnchor="middle">🚿</text>
        </svg>
      );

    case 'storage':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Corps */}
          <rect x="5%" y="5%" width="90%" height="90%" rx="8" fill={color}/>
          {/* Compartiments */}
          <line x1="35%" y1="5%" x2="35%" y2="95%" stroke="#6b5430" strokeWidth="3"/>
          <line x1="65%" y1="5%" x2="65%" y2="95%" stroke="#6b5430" strokeWidth="3"/>
          {/* Poignées */}
          <rect x="15%" y="48%" width="10%" height="4%" rx="2" fill="#808080"/>
          <rect x="45%" y="48%" width="10%" height="4%" rx="2" fill="#808080"/>
          <rect x="75%" y="48%" width="10%" height="4%" rx="2" fill="#808080"/>
          <text x="50%" y="95%" fontSize="16" fill="#fff" textAnchor="middle">📦</text>
        </svg>
      );

    case 'table':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Plateau */}
          <rect x="5%" y="15%" width="90%" height="70%" rx="8" fill="#c19a6b"/>
          <rect x="5%" y="15%" width="90%" height="10%" rx="4" fill="#8b4513" opacity="0.3"/>
          {/* Pieds */}
          <rect x="10%" y="85%" width="5%" height="10%" fill="#8b4513"/>
          <rect x="85%" y="85%" width="5%" height="10%" fill="#8b4513"/>
          <rect x="10%" y="5%" width="5%" height="10%" fill="#8b4513"/>
          <rect x="85%" y="5%" width="5%" height="10%" fill="#8b4513"/>
          <text x="50%" y="55%" fontSize="16" fill="#fff" textAnchor="middle">🪑</text>
        </svg>
      );

    case 'seat':
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Dossier */}
          <rect x="5%" y="5%" width="10%" height="90%" rx="8" fill={color}/>
          {/* Assise */}
          <rect x="15%" y="40%" width="80%" height="55%" rx="8" fill={color}/>
          {/* Capitonnage */}
          <circle cx="35%" cy="55%" r="3%" fill="#2a2a2a"/>
          <circle cx="55%" cy="55%" r="3%" fill="#2a2a2a"/>
          <circle cx="75%" cy="55%" r="3%" fill="#2a2a2a"/>
          <circle cx="35%" cy="75%" r="3%" fill="#2a2a2a"/>
          <circle cx="55%" cy="75%" r="3%" fill="#2a2a2a"/>
          <circle cx="75%" cy="75%" r="3%" fill="#2a2a2a"/>
          <text x="55%" y="95%" fontSize="14" fill="#fff" textAnchor="middle">💺</text>
        </svg>
      );

    default:
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect x="5%" y="5%" width="90%" height="90%" rx="8" fill={color}/>
          <text x="50%" y="55%" fontSize="16" fill="#fff" textAnchor="middle">📦</text>
        </svg>
      );
  }
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
