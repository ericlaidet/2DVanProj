// apps/web/src/components/van/DraggableFurniture3D.tsx
import React, { useRef, useState, useEffect } from 'react';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { convert2DTo3D, convert3DTo2D, constrainToVan, checkCollision3D } from '../../utils/coordinates3D';
import { RealisticFurnitureModel } from './models/FurnitureModels3D';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DraggableFurniture3DProps {
  furniture: {
    id: string;
    name?: string;
    type?: string;
    x: number;
    y: number;
    z?: number;
    width: number;
    height: number;
    depth?: number;
    color: string;
    rotation?: { x?: number; y?: number; z?: number };
  };
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export const DraggableFurniture3D: React.FC<DraggableFurniture3DProps> = ({
  furniture,
  selectedId,
  onSelect
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragPlane, setDragPlane] = useState<'horizontal' | 'vertical' | 'depth'>('horizontal');

  const { camera, gl } = useThree();
  const vanType = useStore(s => s.vanType);
  const updateObject = useStore(s => s.updateObject);
  const removeObject = useStore(s => s.removeObject);
  const objects = useStore(s => s.objects);

  const isSelected = selectedId === furniture.id;

  // Conversion 2D → 3D pour l'affichage
  // En 2D, x et y représentent le coin supérieur gauche
  // En 3D, on a besoin du centre du meuble
  // Donc on ajoute la moitié des dimensions avant la conversion
  const centerX = furniture.x + furniture.width / 2;
  const centerY = furniture.y + furniture.height / 2;
  const pos3D = convert2DTo3D(centerX, centerY, furniture.z || 0, vanType);
  const sizeY = (furniture.depth || furniture.height) / 1000;

  // Décalage pour centrer sur le sol
  pos3D.y = pos3D.y + sizeY / 2;

  // Rotation
  const rotX = THREE.MathUtils.degToRad(furniture.rotation?.x || 0);
  const rotY = THREE.MathUtils.degToRad(furniture.rotation?.y || 0);
  const rotZ = THREE.MathUtils.degToRad(furniture.rotation?.z || 0);

  // Gestion de la sélection
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(furniture.id);
    }
  };

  // Drag & Drop amélioré avec plan horizontal ou vertical
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    if (e.button === 0) { // Clic gauche seulement
      setIsDragging(true);
      gl.domElement.style.cursor = 'grabbing';

      // Shift = déplacement vertical (hauteur)
      // Ctrl = déplacement en profondeur
      // Sinon = déplacement horizontal (sol)
      if (e.shiftKey) {
        setDragPlane('vertical');
      } else if (e.ctrlKey) {
        setDragPlane('depth');
      } else {
        setDragPlane('horizontal');
      }

      if (onSelect) {
        onSelect(furniture.id);
      }
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      let intersectPoint = new THREE.Vector3();

      if (dragPlane === 'horizontal') {
        // Plan horizontal (Y = 0, le sol)
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        raycaster.ray.intersectPlane(plane, intersectPoint);

        if (intersectPoint) {
          // Conversion 3D → 2D pour mise à jour du store
          const pos2D = convert3DTo2D(intersectPoint.x, furniture.z || 0, intersectPoint.z, vanType);

          // Contraindre dans le van
          const constrained = constrainToVan({
            ...furniture,
            x: pos2D.x,
            y: pos2D.y,
          }, vanType);

          // Vérifier les collisions
          const hasCollision = objects.some(obj =>
            obj.id !== furniture.id && checkCollision3D(constrained, obj)
          );

          if (!hasCollision) {
            updateObject(furniture.id, { x: constrained.x, y: constrained.y });
          }
        }
      } else if (dragPlane === 'vertical') {
        // Plan vertical (pour déplacer en hauteur)
        // Plan parallèle à la caméra passant par l'objet
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        const planeNormal = cameraDir.clone().normalize();
        const plane = new THREE.Plane(planeNormal, -planeNormal.dot(pos3D));

        raycaster.ray.intersectPlane(plane, intersectPoint);

        if (intersectPoint) {
          // Mise à jour de la hauteur (Z en 2D)
          const newZ = Math.max(0, Math.min(2000, intersectPoint.y * 1000));
          updateObject(furniture.id, { z: newZ });
        }
      } else if (dragPlane === 'depth') {
        // Plan de profondeur (déplacement le long de l'axe Y en 2D / Z en 3D)
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        raycaster.ray.intersectPlane(plane, intersectPoint);
        
        if (intersectPoint) {
          // On ne change que la position en profondeur (axe Y en 2D)
          const centerPos2D = convert3DTo2D(intersectPoint.x, furniture.z || 0, intersectPoint.z, vanType);
          const cornerY = centerPos2D.y - furniture.height / 2;
          
          // Contraindre dans le van
          const constrained = constrainToVan({
            ...furniture,
            y: cornerY,
          }, vanType);
          // Vérifier les collisions
          const hasCollision = objects.some(obj =>
            obj.id !== furniture.id && checkCollision3D(constrained, obj)
          );
          if (!hasCollision) {
            updateObject(furniture.id, { y: constrained.y });
          }
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = hovered ? 'pointer' : 'default';
  };

  // Désactiver le menu contextuel (clic droit)
  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
  };



  // Curseur
  useEffect(() => {
    if (hovered) {
      gl.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
    } else {
      gl.domElement.style.cursor = 'default';
    }
  }, [hovered, isDragging, gl]);

  // Raccourcis clavier pour le meuble sélectionné
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'delete':
        case 'backspace':
          e.preventDefault();
          removeObject(furniture.id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, furniture, removeObject]);

  return (
    <group
      ref={groupRef}
      position={[pos3D.x, pos3D.y, pos3D.z]}
      rotation={[rotX, rotY, rotZ]}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onContextMenu={handleContextMenu}
    >
      <RealisticFurnitureModel furniture={furniture} />

      {/* Boîte de sélection (wireframe) */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[
            furniture.width / 1000,
            sizeY,
            furniture.height / 1000
          ]} />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}

      {/* Indicateur au sol */}
      {(hovered || isDragging || isSelected) && (
        <group position={[0, -sizeY / 2 - 0.01, 0]}>
          {/* Cercle de sélection */}
          <mesh rotation-x={-Math.PI / 2}>
            <ringGeometry args={[
              Math.max(furniture.width, furniture.height) / 2000,
              Math.max(furniture.width, furniture.height) / 2000 + 0.05,
              32
            ]} />
            <meshBasicMaterial
              color={
				  isSelected ? '#3b82f6' :
					isDragging ? '#10b981' :
					  '#6b7280'
              }
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Ombre portée */}
          <mesh rotation-x={-Math.PI / 2}>
            <planeGeometry args={[
              furniture.width / 1000 * 1.2,
              furniture.height / 1000 * 1.2
            ]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.15}
            />
          </mesh>
        </group>
      )}

      {/* Indicateur de hauteur lors du drag vertical */}
      {isDragging && dragPlane === 'vertical' && (
        <Html position={[0, sizeY / 2 + 0.3, 0]} center>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            Hauteur: {(furniture.z || 0).toFixed(0)} mm
          </div>
        </Html>
      )}

      {/* Axes de coordonnées pour le meuble sélectionné */}
      {isSelected && (
        <group>
          {/* Axe X (rouge) */}
          <arrowHelper args={[
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            0.5,
            0xff0000
          ]} />
          {/* Axe Y (vert) */}
          <arrowHelper args={[
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            0.5,
            0x00ff00
          ]} />
          {/* Axe Z (bleu) */}
          <arrowHelper args={[
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            0.5,
            0x0000ff
          ]} />
        </group>
      )}
    </group>
  );
};
