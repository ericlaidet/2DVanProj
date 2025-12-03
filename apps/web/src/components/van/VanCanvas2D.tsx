// apps/web/src/components/van/VanCanvas2D.tsx
// 🎨 VERSION FINALE avec images PNG réalistes
import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { FURNITURE_PRESETS } from '../../constants/furniture';
import './VanCanvas2D.css';

interface VanCanvas2DProps {
  selectedObjectId?: string | null;
  onSelectObject?: (id: string | null) => void;
}

/**
 * ✅ IMAGES RÉALISTES - Mapping des fichiers PNG
 */
const FURNITURE_IMAGES: Record<string, string> = {
  'bed': '/furniture/bed.png',
  'kitchen': '/furniture/kitchen.png',
  'bathroom': '/furniture/bathroom.png',
  'storage': '/furniture/storage.png',
  'table': '/furniture/table.png',
  'seat': '/furniture/seat.png',
};

/**
 * 🎨 Composant de meuble avec image PNG réaliste
 */
const RealisticFurniture2D: React.FC<{
  furniture: any;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  scale: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}> = ({
  furniture,
  isSelected,
  isHovered,
  isDragging,
  scale,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  onContextMenu,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = FURNITURE_IMAGES[furniture.type] || '';
  const preset = FURNITURE_PRESETS[furniture.type as keyof typeof FURNITURE_PRESETS];
  
  const widthPx = furniture.width * scale;
  const heightPx = furniture.height * scale;
  const rotation = furniture.rotation?.y || 0;

  // 🔍 Debug : Log le chargement de l'image
  useEffect(() => {
    console.log('🖼️ [RealisticFurniture2D] Type:', furniture.type, 'URL:', imageUrl, 'Loaded:', imageLoaded, 'Error:', imageError);
  }, [furniture.type, imageUrl, imageLoaded, imageError]);

  // Style du conteneur principal
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${furniture.x * scale}px`,
    top: `${furniture.y * scale}px`,
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isSelected ? 1000 : isDragging ? 999 : 1,
    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Ombre portée dynamique
  const getShadowStyle = (): string => {
    if (isDragging) {
      return '0 20px 40px rgba(0, 0, 0, 0.35), 0 10px 20px rgba(0, 0, 0, 0.2)';
    }
    if (isSelected) {
      return '0 8px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)';
    }
    if (isHovered) {
      return '0 12px 24px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15)';
    }
    return '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)';
  };

  // Bordure de sélection
  const getBorderStyle = (): string => {
    if (isSelected) return '4px solid #3b82f6';
    if (isHovered) return '3px solid rgba(59, 130, 246, 0.5)';
    return '2px solid rgba(0, 0, 0, 0.1)';
  };

  return (
    <div
      style={containerStyle}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className="realistic-furniture-2d"
    >
      {/* Carte du meuble avec effet de profondeur */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: imageLoaded && !imageError ? '#ffffff' : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          borderRadius: '12px',
          border: getBorderStyle(),
          boxShadow: getShadowStyle(),
          overflow: 'hidden',
          transform: isDragging ? 'scale(1.05)' : isHovered ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
        }}
      >
        {/* Effet de brillance en survol */}
        {(isHovered || isSelected) && imageLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        {/* Image du meuble PNG */}
        {imageUrl ? (
          <>
            {/* Loader pendant le chargement */}
            {!imageLoaded && !imageError && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '32px',
                  height: '32px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  zIndex: 5,
                }}
              />
            )}
            
            {/* Image réaliste */}
            {!imageError && (
              <img
                src={imageUrl}
                alt={furniture.name}
                onLoad={() => {
                  console.log('✅ Image chargée avec succès:', imageUrl);
                  setImageLoaded(true);
                }}
                onError={(e) => {
                  console.error('❌ Erreur de chargement:', imageUrl);
                  setImageError(true);
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '6%',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  display: 'block',
                }}
                draggable={false}
              />
            )}

            {/* Fallback en cas d'erreur */}
            {imageError && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: furniture.color || '#6b7280',
                  opacity: 0.9,
                  fontSize: `${Math.min(widthPx, heightPx) * 0.2}px`,
                  color: 'white',
                  fontWeight: 'bold',
                  gap: '8px',
                }}
              >
                <div>{preset?.icon || '📦'}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>Image non disponible</div>
              </div>
            )}
          </>
        ) : (
          // Fallback si pas d'image configurée
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: furniture.color || '#6b7280',
              opacity: 0.8,
              fontSize: `${Math.min(widthPx, heightPx) * 0.15}px`,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {preset?.icon || '📦'}
          </div>
        )}

        {/* Étiquette du meuble */}
        <div
          style={{
            position: 'absolute',
            bottom: isSelected || isHovered ? '-32px' : '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isSelected ? '#3b82f6' : 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
            zIndex: 1001,
            backdropFilter: 'blur(8px)',
            userSelect: 'none',
          }}
        >
          {preset?.icon} {furniture.name || preset?.name || 'Meuble'}
        </div>

        {/* Indicateur de hauteur (z) */}
        {furniture.z && furniture.z > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              right: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
              zIndex: 1001,
              userSelect: 'none',
            }}
          >
            ↑ {furniture.z}mm
          </div>
        )}

        {/* Dimensions en survol */}
        {isHovered && !isSelected && (
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              zIndex: 1001,
              backdropFilter: 'blur(8px)',
              userSelect: 'none',
            }}
          >
            {furniture.width} × {furniture.height} mm
          </div>
        )}

        {/* Indicateur de sélection animé */}
        {isSelected && (
          <>
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: -8,
                right: -8,
                bottom: -8,
                border: '3px dashed #3b82f6',
                borderRadius: '16px',
                pointerEvents: 'none',
                animation: 'dash 30s linear infinite',
              }}
            />

            {/* Poignées de redimensionnement */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
              const [vertical, horizontal] = pos.split('-');
              return (
                <div
                  key={pos}
                  className="resize-handle-realistic"
                  style={{
                    position: 'absolute',
                    [vertical]: -6,
                    [horizontal]: -6,
                    width: 12,
                    height: 12,
                    background: '#3b82f6',
                    border: '2px solid white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                    cursor:
                      pos === 'top-left' || pos === 'bottom-right'
                        ? 'nwse-resize'
                        : 'nesw-resize',
                    zIndex: 1002,
                    transition: 'transform 0.2s ease',
                  }}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * 🎨 Canvas 2D principal
 */
export const VanCanvas2D: React.FC<VanCanvas2DProps> = ({
  selectedObjectId,
  onSelectObject,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const vanType = useStore((s) => s.vanType);
  const objects = useStore((s) => s.objects);
  const updateObject = useStore((s) => s.updateObject);
  const removeObject = useStore((s) => s.removeObject);

  const van = VAN_TYPES.find((v) => v.vanType === vanType);

  // 🔍 Debug
  useEffect(() => {
    console.log('🎨 [VanCanvas2D] Objects:', objects.length, 'Van:', vanType);
    objects.forEach(obj => {
      console.log('  - Meuble:', obj.type, obj.name, 'Image:', FURNITURE_IMAGES[obj.type]);
    });
  }, [objects, vanType]);

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

    const obj = objects.find((o) => o.id === objectId);
    if (!obj) return;

    if (onSelectObject) {
      onSelectObject(objectId);
    }

    const objElement = e.currentTarget as HTMLElement;
    const rect = objElement.getBoundingClientRect();

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDraggingId(objectId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const obj = objects.find((o) => o.id === draggingId);
    if (!obj) return;

    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    const newXmm = newX / SCALE;
    const newYmm = newY / SCALE;

    const maxX = van.length - obj.width;
    const maxY = van.width - obj.height;
    const clampedX = Math.max(0, Math.min(newXmm, maxX));
    const clampedY = Math.max(0, Math.min(newYmm, maxY));

    const hasCollision = objects.some((other) => {
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
    const obj = objects.find((o) => o.id === objectId);
    if (!obj) return;

    const currentRotation = obj.rotation?.y || 0;
    const newRotation = (currentRotation + 90) % 360;
    updateObject(objectId, {
      rotation: { ...obj.rotation, y: newRotation },
    });
  };

  const handleContextMenu = (e: React.MouseEvent, objectId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const obj = objects.find((o) => o.id === objectId);
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

  return (
    <div className="van-canvas-container" style={{ position: 'relative' }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes dash {
            to { stroke-dashoffset: -1000; }
          }
          .resize-handle-realistic:hover {
            transform: scale(1.3) !important;
            background: #2563eb !important;
          }
          .realistic-furniture-2d {
            will-change: transform;
          }
        `}
      </style>
      <div
        ref={canvasRef}
        className="van-canvas"
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          position: 'relative',
          border: '2px solid #cbd5e1',
          borderRadius: '12px',
          background: 'linear-gradient(to bottom, #ffffff, #f9fafb)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Grille de fond */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: `${100 * SCALE}px ${100 * SCALE}px`,
            pointerEvents: 'none',
          }}
        />

        {/* Meubles avec images réalistes */}
        {objects.map((obj) => (
          <RealisticFurniture2D
            key={obj.id}
            furniture={obj}
            isSelected={selectedObjectId === obj.id}
            isHovered={hoveredId === obj.id}
            isDragging={draggingId === obj.id}
            scale={SCALE}
            onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
            onMouseEnter={() => setHoveredId(obj.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectObject) onSelectObject(obj.id);
            }}
            onDoubleClick={(e) => handleDoubleClick(e, obj.id)}
            onContextMenu={(e) => handleContextMenu(e, obj.id)}
          />
        ))}
      </div>

      {/* Aide visuelle */}
      <div style={{
        marginTop: '12px',
        padding: '12px 16px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#1f2937',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div><strong>🖱️ Clic:</strong> Sélectionner</div>
        <div><strong>🖱️ Glisser:</strong> Déplacer</div>
        <div><strong>🖱️ Double-clic:</strong> Rotation 90°</div>
        <div><strong>🖱️ Clic droit:</strong> Supprimer</div>
      </div>
    </div>
  );
};
