// apps/web/src/components/van/VanCanvas3D.tsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { FURNITURE_PRESETS } from '../../constants/furniture';
import * as THREE from 'three';
import './VanCanvas3D.css';

// ✨ Composant Van 3D (boîte simple pour l'instant)
const VanModel: React.FC<{ vanType: string }> = ({ vanType }) => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return null;

  // Conversion mm → mètres pour Three.js
  const length = van.length / 1000;
  const width = van.width / 1000;
  const height = 2.0; // Hauteur standard d'un van en mètres

  return (
    <group position={[0, height / 2, 0]}>
      {/* Sol du van */}
      <mesh position={[0, -height / 2 + 0.01, 0]} receiveShadow>
        <boxGeometry args={[length, 0.02, width]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* Murs du van */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Contours du van */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
        <lineBasicMaterial color="#333333" linewidth={2} />
      </lineSegments>

      {/* Texte indicatif */}
      <Text
        position={[0, height / 2 + 0.2, 0]}
        fontSize={0.15}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {van.displayName}
      </Text>
      <Text
        position={[0, height / 2 + 0.05, 0]}
        fontSize={0.08}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {van.length}mm × {van.width}mm × {Math.round(height * 1000)}mm
      </Text>
    </group>
  );
};

// ✨ Composant Meuble 3D
interface FurnitureModel3DProps {
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
}

const FurnitureModel3D: React.FC<FurnitureModel3DProps> = ({ furniture }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  const updateObject = useStore(s => s.updateObject);

  // Conversion mm → mètres
  const van = VAN_TYPES.find(v => v.vanType === useStore.getState().vanType);
  if (!van) return null;

  const posX = (furniture.x / 1000) - (van.length / 2000);
  const posZ = (furniture.y / 1000) - (van.width / 2000);
  const posY = (furniture.z || 0) / 1000;

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || furniture.height) / 1000;

  // Rotation
  const rotX = THREE.MathUtils.degToRad(furniture.rotation?.x || 0);
  const rotY = THREE.MathUtils.degToRad(furniture.rotation?.y || 0);
  const rotZ = THREE.MathUtils.degToRad(furniture.rotation?.z || 0);

  // Récupérer l'icône depuis FURNITURE_PRESETS
  const preset = furniture.type ? FURNITURE_PRESETS[furniture.type as keyof typeof FURNITURE_PRESETS] : null;
  const icon = preset?.icon || '📦';

  // Animation de hover
  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = posY + sizeY / 2 + Math.sin(Date.now() * 0.003) * 0.02;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    console.log('Clicked:', furniture.name || furniture.id);
  };

  return (
    <group position={[posX, posY + sizeY / 2, posZ]} rotation={[rotX, rotY, rotZ]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[sizeX, sizeY, sizeZ]} />
        <meshStandardMaterial 
          color={furniture.color} 
          emissive={hovered ? furniture.color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Contour */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sizeX, sizeY, sizeZ)]} />
        <lineBasicMaterial color={hovered ? '#ffffff' : '#000000'} linewidth={hovered ? 3 : 1} />
      </lineSegments>

      {/* Nom du meuble */}
      {furniture.name && (
        <Text
          position={[0, sizeY / 2 + 0.1, 0]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {icon} {furniture.name}
        </Text>
      )}
    </group>
  );
};

// ✨ Sol avec grille
const Floor: React.FC = () => {
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid 
        args={[20, 20]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#666666" 
        sectionSize={1} 
        sectionThickness={1} 
        sectionColor="#333333"
        fadeDistance={15}
        fadeStrength={1}
        position={[0, 0, 0]}
      />
    </>
  );
};

// ✨ Lumières
const Lighting: React.FC = () => {
  return (
    <>
      {/* Lumière ambiante */}
      <ambientLight intensity={0.4} />
      
      {/* Lumière directionnelle (soleil) */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Lumière d'appoint */}
      <pointLight position={[-5, 5, -5]} intensity={0.3} />
    </>
  );
};

// ✨ Composant principal VanCanvas3D
export const VanCanvas3D: React.FC = () => {
  const objects = useStore(s => s.objects);
  const vanType = useStore(s => s.vanType);

  if (!vanType) {
    return (
      <div className="van-canvas-3d empty">
        <div className="empty-message">
          <div className="empty-icon">🚐</div>
          <p>Sélectionnez un van pour voir la vue 3D</p>
        </div>
      </div>
    );
  }

  return (
    <div className="van-canvas-3d">
      <Canvas shadows camera={{ position: [8, 6, 8], fov: 50 }}>
        {/* Couleur de fond */}
        <color attach="background" args={['#87CEEB']} />
        
        {/* Fog pour la profondeur */}
        <fog attach="fog" args={['#87CEEB', 10, 50]} />
        
        {/* Caméra et contrôles */}
        <PerspectiveCamera makeDefault position={[8, 6, 8]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.1}
        />

        {/* Lumières */}
        <Lighting />

        {/* Sol avec grille */}
        <Floor />

        {/* Van 3D */}
        <VanModel vanType={vanType} />

        {/* Meubles 3D */}
        {objects.map(obj => (
          <FurnitureModel3D key={obj.id} furniture={obj} />
        ))}
      </Canvas>

      {/* Overlay d'instructions */}
      <div className="canvas-3d-overlay">
        <div className="controls-hint">
          <p>🖱️ <strong>Clic gauche + glisser</strong> : Rotation</p>
          <p>🖱️ <strong>Clic droit + glisser</strong> : Déplacer</p>
          <p>🖱️ <strong>Molette</strong> : Zoom</p>
        </div>
      </div>
    </div>
  );
};
