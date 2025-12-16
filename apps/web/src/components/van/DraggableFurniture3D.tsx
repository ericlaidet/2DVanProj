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
  onEdit?: (id: string) => void;
}

export const DraggableFurniture3D: React.FC<DraggableFurniture3DProps> = ({
  furniture,
  selectedId,
  onSelect,
  onEdit
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragPlane, setDragPlane] = useState<'horizontal' | 'vertical' | 'depth'>('horizontal');
  const [dragOffset3D, setDragOffset3D] = useState<THREE.Vector3 | null>(null);

  const { camera, gl } = useThree();

  const vanType = useStore(s => s.vanType);
  const updateObject = useStore(s => s.updateObject);
  const removeObject = useStore(s => s.removeObject);

  const isSelected = selectedId === furniture.id;

  // Conversion 2D → 3D pour l'affichage
  // En 2D, x et y représentent le coin supérieur gauche
  // En 3D,on a besoin du centre du meuble
  // Donc on ajoute la moitié des dimensions avant la conversion
  const centerX = furniture.x + furniture.width / 2;
  const centerY = furniture.y + furniture.height / 2;
  const pos3D = convert2DTo3D(centerX, centerY, furniture.z || 0, vanType);
  const sizeY = (furniture.depth || furniture.height) / 1000;

  // ⚠️ IMPORTANT : Le plancher du van (texture bois) est à y = 0.031m, pas à y = 0
  const VAN_FLOOR_HEIGHT = 0.031; // matches VanModelRealistic floor texture position

  // ✅ CORRECTION: Les modèles 3D ont leur BASE à y=0 localement (pas centrés en Y)
  // Donc on ne doit PAS ajouter sizeY/2, juste la hauteur du plancher + pos3D.y
  pos3D.y = VAN_FLOOR_HEIGHT + pos3D.y;

  // Rotation
  const rotX = THREE.MathUtils.degToRad(furniture.rotation?.x || 0);
  const rotY = THREE.MathUtils.degToRad(furniture.rotation?.y || 0);
  const rotZ = THREE.MathUtils.degToRad(furniture.rotation?.z || 0);

  // State pour gérer le double-clic manuel
  const [lastClickTime, setLastClickTime] = useState(0);

  // Gestion du clic et double-clic manuel (plus fiable en 3D)
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300; // ms

    if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
      // C'est un double-clic !
      if (onEdit) {
        onEdit(furniture.id);
      }
      setLastClickTime(0); // Reset
    } else {
      // C'est un simple clic
      setLastClickTime(now);
      if (onSelect) {
        onSelect(furniture.id);
      }
    }
  };

  // Drag & Drop amélioré avec plan horizontal ou vertical
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Si on commence un drag, on reset le timer de double clic pour éviter des faux positifs
    if (Date.now() - lastClickTime > 300) {
      // On ne fait rien de spécial, mais on pourrait reset le timer ici si besoin
    }

    e.stopPropagation();

    if (e.button === 0) { // Clic gauche seulement
      setIsDragging(true);
      gl.domElement.style.cursor = 'grabbing';

      // 1. Déterminer le plan de drag
      let plane: 'horizontal' | 'vertical' | 'depth' = 'horizontal';
      if (e.shiftKey) plane = 'vertical';
      else if (e.ctrlKey) plane = 'depth';
      setDragPlane(plane);

      // 2. Initialiser le Raycaster à la position du clic
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      // 3. Calculer l'offset entre le point cliqué et le centre du meuble
      // Cela évite que le meuble "saute" pour centrer sur la souris
      const intersectPoint = new THREE.Vector3();
      const dragPlaneObj = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Plan sol par défaut

      raycaster.ray.intersectPlane(dragPlaneObj, intersectPoint);

      if (intersectPoint) {
        // Offset = Position Actuelle (Centre en 3D) - Point Cliqué
        // Note: pos3D est déjà calculé plus haut comme le centre 3D
        const currentPos = new THREE.Vector3(pos3D.x, pos3D.y, pos3D.z);
        setDragOffset3D(currentPos.sub(intersectPoint));
      }

      if (onSelect) {
        onSelect(furniture.id);
      }
    }
  };

  // ✅ Raycaster persistant
  const raycasterRef = useRef(new THREE.Raycaster());

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;

    const raycaster = raycasterRef.current;
    const mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, camera);

    let intersectPoint = new THREE.Vector3();

    if (dragPlane === 'horizontal' || dragPlane === 'depth') {
      // Plan horizontal (Y = 0, le sol)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint && dragOffset3D) {
        // Appliquer l'offset pour obtenir la nouvelle position du CENTRE
        const newCenter3D = intersectPoint.add(dragOffset3D);

        // Convertir le centre 3D en coordonnées 2D (mm)
        const centerPos2D = convert3DTo2D(newCenter3D.x, furniture.z || 0, newCenter3D.z, vanType);

        // Convertir CENTRE -> COIN SUPÉRIEUR GAUCHE (x, y sont top-left)
        // C'est ici que se situait le bug "glissement"
        const topLeftX = centerPos2D.x - furniture.width / 2;
        const topLeftY = centerPos2D.y - furniture.height / 2;

        const constrained = constrainToVan({
          ...furniture,
          x: topLeftX,
          y: topLeftY,
        }, vanType);

        if (dragPlane === 'horizontal') {
          updateObject(furniture.id, { x: constrained.x, y: constrained.y });
        } else {
          // Depth mode (Ctrl) : on ne change que Y (profondeur dans le van = Z en 3D)
          updateObject(furniture.id, { y: constrained.y });
        }
      }
    } else if (dragPlane === 'vertical') {
      // ... Logique verticale inchangée pour le moment ...
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      const planeNormal = cameraDir.clone().normalize();
      const plane = new THREE.Plane(planeNormal, -planeNormal.dot(pos3D)); // Plan face caméra

      raycaster.ray.intersectPlane(plane, intersectPoint);

      if (intersectPoint) {
        // Pour la hauteur, on peut garder la logique absolue ou ajouter un offset si besoin
        // Ici on garde l'absolu simple pour l'instant
        const newZ = Math.max(0, Math.min(2000, intersectPoint.y * 1000));
        updateObject(furniture.id, { z: newZ });
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
