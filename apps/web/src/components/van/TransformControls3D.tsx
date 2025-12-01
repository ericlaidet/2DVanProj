// apps/web/src/components/van/TransformControls3D.tsx
import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls as DreiTransformControls } from '@react-three/drei';
import { useStore } from '../../store/store';
import * as THREE from 'three';

interface TransformControls3DProps {
  furnitureId: string | null;
  mode: 'translate' | 'rotate' | 'scale';
  onTransformEnd?: () => void;
}

/**
 * Composant de contrôles de transformation 3D avancés
 * Permet de déplacer, rotation et redimensionner les meubles dans l'espace 3D
 */
export const TransformControls3D: React.FC<TransformControls3DProps> = ({
  furnitureId,
  mode,
  onTransformEnd
}) => {
  const controlsRef = useRef<any>(null);
  const { camera, gl } = useThree();
  
  const objects = useStore(s => s.objects);
  const updateObject = useStore(s => s.updateObject);
  const vanType = useStore(s => s.vanType);

  const selectedFurniture = objects.find(obj => obj.id === furnitureId);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleChange = () => {
      if (!selectedFurniture || !controls.object) return;

      const position = controls.object.position;
      const rotation = controls.object.rotation;
      const scale = controls.object.scale;

      // Conversion 3D → 2D pour le store
      const van = useStore.getState().vanType;
      // Mise à jour selon le mode
      if (mode === 'translate') {
        // Conversion position 3D vers 2D
        updateObject(furnitureId!, {
          x: (position.x + 5) * 1000, // Ajuster selon votre système de coordonnées
          y: (position.z + 2.5) * 1000,
          z: position.y * 1000
        });
      } else if (mode === 'rotate') {
        updateObject(furnitureId!, {
          rotation: {
            x: THREE.MathUtils.radToDeg(rotation.x),
            y: THREE.MathUtils.radToDeg(rotation.y),
            z: THREE.MathUtils.radToDeg(rotation.z)
          }
        });
      } else if (mode === 'scale') {
        updateObject(furnitureId!, {
          width: selectedFurniture.width * scale.x,
          height: selectedFurniture.height * scale.z,
          depth: (selectedFurniture.depth || selectedFurniture.height) * scale.y
        });
      }
    };

    const handleMouseUp = () => {
      onTransformEnd?.();
    };

    controls.addEventListener('change', handleChange);
    controls.addEventListener('mouseUp', handleMouseUp);

    return () => {
      controls.removeEventListener('change', handleChange);
      controls.removeEventListener('mouseUp', handleMouseUp);
    };
  }, [furnitureId, mode, selectedFurniture, updateObject, onTransformEnd]);

  if (!selectedFurniture || !furnitureId) return null;

  return (
    <DreiTransformControls
      ref={controlsRef}
      mode={mode}
      camera={camera}
      domElement={gl.domElement}
      showX={true}
      showY={mode === 'translate'} // Y = hauteur, actif seulement en mode translate
      showZ={true}
      space="world"
      size={0.8}
      translationSnap={0.1}
      rotationSnap={THREE.MathUtils.degToRad(15)}
      scaleSnap={0.1}
    />
  );
};
