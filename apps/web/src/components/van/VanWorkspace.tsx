// ----------------------------------------------------------------------------
// 6. VAN WORKSPACE - Canvas with Drag & Drop (VanWorkspace.tsx)
// ----------------------------------------------------------------------------
import React, { useState, useRef } from 'react';
import { VAN_TYPES } from '@/constants/vans';
import './VanWorkspace.css';

interface WorkspaceObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Props {
  selectedVanType: string;
  objects: WorkspaceObject[];
  onObjectsChange: (objects: WorkspaceObject[]) => void;
}

const VanWorkspace: React.FC<Props> = ({ selectedVanType, objects, onObjectsChange }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef<HTMLDivElement>(null);

  const vanInfo = VAN_TYPES.find(v => v.vanType === selectedVanType);
  if (!vanInfo) return <div>Sélectionnez un van</div>;

  // Convert mm to pixels (scale factor)
  const SCALE = 0.1; // 1mm = 0.1px
  const workspaceWidth = vanInfo.length * SCALE;
  const workspaceHeight = vanInfo.width * SCALE;

  const handleMouseDown = (e: React.MouseEvent, objId: string) => {
    e.preventDefault();
    const obj = objects.find(o => o.id === objId);
    if (!obj) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDraggingId(objId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !workspaceRef.current) return;

    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    const newX = e.clientX - workspaceRect.left - dragOffset.x;
    const newY = e.clientY - workspaceRect.top - dragOffset.y;

    const obj = objects.find(o => o.id === draggingId);
    if (!obj) return;

    // Boundary check
    const maxX = workspaceWidth - obj.width * SCALE;
    const maxY = workspaceHeight - obj.height * SCALE;
    const clampedX = Math.max(0, Math.min(newX, maxX));
    const clampedY = Math.max(0, Math.min(newY, maxY));

    // Collision detection
    const hasCollision = objects.some(other => {
      if (other.id === draggingId) return false;
      
      const otherX = other.x;
      const otherY = other.y;
      const otherWidth = other.width * SCALE;
      const otherHeight = other.height * SCALE;
      const objWidth = obj.width * SCALE;
      const objHeight = obj.height * SCALE;

      return !(
        clampedX + objWidth < otherX ||
        clampedX > otherX + otherWidth ||
        clampedY + objHeight < otherY ||
        clampedY > otherY + otherHeight
      );
    });

    if (!hasCollision) {
      onObjectsChange(
        objects.map(o => 
          o.id === draggingId 
            ? { ...o, x: clampedX, y: clampedY }
            : o
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div 
      ref={workspaceRef}
      className="van-workspace"
      style={{
        width: `${workspaceWidth}px`,
        height: `${workspaceHeight}px`,
        backgroundImage: `url(/assets/vans/${selectedVanType}.svg)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-van-type={selectedVanType}
      data-dimensions={`${vanInfo.length}x${vanInfo.width}`}
    >
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`workspace-object ${draggingId === obj.id ? 'dragging' : ''}`}
          data-name={obj.name}
          data-dimensions={`${obj.width}x${obj.height}`}
          style={{
            left: `${obj.x}px`,
            top: `${obj.y}px`,
            width: `${obj.width * SCALE}px`,
            height: `${obj.height * SCALE}px`,
            backgroundColor: obj.color,
            cursor: 'move'
          }}
          onMouseDown={(e) => handleMouseDown(e, obj.id)}
        >
          <span className="object-label">{obj.name}</span>
        </div>
      ))}
    </div>
  );
};

export default VanWorkspace;
