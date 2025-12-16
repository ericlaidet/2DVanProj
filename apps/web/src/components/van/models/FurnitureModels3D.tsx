// apps/web/src/components/van/models/FurnitureModels3D.tsx
import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { useStore } from '../../../store/store';
import { FURNITURE_PRESETS } from '../../../constants/furniture';
import * as THREE from 'three';

interface FurnitureProps {
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
  onDrag?: (id: string, position: { x: number; y: number; z: number }) => void;
  onRotate?: (id: string, rotation: { y: number }) => void;
}

// 🛏️ Modèle de lit réaliste
const BedModel: React.FC<FurnitureProps> = ({ furniture, onDrag }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 400) / 1000;

  return (
    <group ref={meshRef}>
      {/* Matelas - base au sol (y=0) */}
      <RoundedBox
        args={[sizeX, sizeY * 0.3, sizeZ]}
        radius={0.02}
        smoothness={4}
        position={[0, (sizeY * 0.3) / 2, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#6b9bd1' : '#5a8ac7'}
          roughness={0.8}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Oreiller 1 */}
      <RoundedBox
        args={[sizeX * 0.3, sizeY * 0.15, sizeZ * 0.2]}
        radius={0.01}
        position={[-sizeX * 0.25, (sizeY * 0.3) + (sizeY * 0.15) / 2, sizeZ * 0.35]}
      >
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </RoundedBox>

      {/* Oreiller 2 */}
      <RoundedBox
        args={[sizeX * 0.3, sizeY * 0.15, sizeZ * 0.2]}
        radius={0.01}
        position={[sizeX * 0.25, (sizeY * 0.3) + (sizeY * 0.15) / 2, sizeZ * 0.35]}
      >
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </RoundedBox>

      {/* Couverture */}
      <RoundedBox
        args={[sizeX * 0.9, sizeY * 0.05, sizeZ * 0.7]}
        radius={0.01}
        position={[0, (sizeY * 0.3) + (sizeY * 0.05) / 2, -sizeZ * 0.1]}
      >
        <meshStandardMaterial color={furniture.color} roughness={0.7} />
      </RoundedBox>
    </group>
  );
};

// 🍳 Modèle de cuisine réaliste
const KitchenModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 600) / 1000;

  return (
    <group>
      {/* Meuble bas */}
      <RoundedBox
        args={[sizeX, sizeY * 0.8, sizeZ]}
        radius={0.01}
        position={[0, (sizeY * 0.8) / 2, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#15b38a' : '#10b981'}
          roughness={0.3}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Plan de travail */}
      <RoundedBox
        args={[sizeX, sizeY * 0.05, sizeZ]}
        radius={0.005}
        position={[0, sizeY * 0.42, 0]}
        castShadow
      >
        <meshStandardMaterial
          color="#8b7355"
          roughness={0.2}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Évier */}
      <mesh position={[-sizeX * 0.25, sizeY * 0.47, 0]} castShadow>
        <cylinderGeometry args={[sizeZ * 0.15, sizeZ * 0.15, sizeY * 0.05, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Plaque de cuisson (2 feux) */}
      <group position={[sizeX * 0.2, sizeY * 0.47, 0]}>
        <mesh position={[-sizeZ * 0.1, 0, 0]}>
          <cylinderGeometry args={[sizeZ * 0.08, sizeZ * 0.08, sizeY * 0.01, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[sizeZ * 0.1, 0, 0]}>
          <cylinderGeometry args={[sizeZ * 0.08, sizeZ * 0.08, sizeY * 0.01, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Poignées */}
      <RoundedBox
        args={[sizeX * 0.15, sizeY * 0.02, sizeZ * 0.02]}
        radius={0.005}
        position={[sizeX * 0.3, sizeY * 0.2, sizeZ * 0.52]}
      >
        <meshStandardMaterial color="#808080" metalness={0.9} roughness={0.1} />
      </RoundedBox>
    </group>
  );
};

// 🚿 Modèle de salle de bain réaliste
const BathroomModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 800) / 1000;

  return (
    <group>
      {/* Bac de douche - base au sol (y=0) */}
      <RoundedBox
        args={[sizeX, sizeY * 0.05, sizeZ]}
        radius={0.01}
        position={[0, (sizeY * 0.05) / 2, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#9b6fd6' : '#8b5cf6'}
          roughness={0.2}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Parois de douche (transparentes) - au-dessus du bac */}
      <mesh position={[0, sizeY * 0.05 + (sizeY * 0.8) / 2, 0]} castShadow>
        <boxGeometry args={[sizeX, sizeY * 0.8, sizeZ]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Pommeau de douche */}
      <mesh position={[sizeX * 0.3, sizeY * 0.05 + sizeY * 0.75, sizeZ * 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Contour */}
      <lineSegments position={[0, sizeY * 0.05 + (sizeY * 0.8) / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(sizeX, sizeY * 0.8, sizeZ)]} />
        <lineBasicMaterial color={hovered ? '#ffffff' : '#666666'} linewidth={2} />
      </lineSegments>
    </group>
  );
};

// 📦 Modèle de rangement réaliste
const StorageModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 400) / 1000;

  return (
    <group>
      {/* Corps du meuble */}
      <RoundedBox
        args={[sizeX, sizeY, sizeZ]}
        radius={0.01}
        position={[0, sizeY / 2, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#ffa726' : '#f59e0b'}
          roughness={0.4}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Portes (3 compartiments) */}
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          {/* Séparateur */}
          <mesh position={[-sizeX * 0.33 + i * (sizeX * 0.33), 0, sizeZ * 0.51]}>
            <boxGeometry args={[0.01, sizeY * 0.9, 0.01]} />
            <meshStandardMaterial color="#6b5430" />
          </mesh>

          {/* Poignée */}
          <RoundedBox
            args={[sizeX * 0.05, sizeY * 0.02, sizeZ * 0.02]}
            radius={0.005}
            position={[-sizeX * 0.2 + i * (sizeX * 0.33), 0, sizeZ * 0.53]}
          >
            <meshStandardMaterial color="#808080" metalness={0.9} roughness={0.1} />
          </RoundedBox>
        </React.Fragment>
      ))}
    </group>
  );
};

// 🪑 Modèle de table réaliste
const TableModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 600) / 1000;

  return (
    <group>
      {/* Plateau principal */}
      <RoundedBox
        args={[sizeX, sizeY * 0.05, sizeZ]}
        radius={0.01}
        position={[0, sizeY * 0.7, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#d4a574' : '#c19a6b'}
          roughness={0.3}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Veinage du bois sur le plateau */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`vein-${i}`}
          position={[-sizeX * 0.3 + i * sizeX * 0.3, sizeY * 0.725, 0]}
          rotation-x={-Math.PI / 2}
          receiveShadow
        >
          <planeGeometry args={[sizeX * 0.15, sizeZ * 0.9]} />
          <meshStandardMaterial
            color="#a67c52"
            roughness={0.4}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Bordure du plateau */}
      <mesh position={[0, sizeY * 0.73, 0]} castShadow>
        <boxGeometry args={[sizeX + 0.02, sizeY * 0.02, sizeZ + 0.02]} />
        <meshStandardMaterial color="#8b4513" roughness={0.5} />
      </mesh>

      {/* Pieds (4) avec détails */}
      {[
        [-sizeX * 0.42, -sizeZ * 0.42],
        [sizeX * 0.42, -sizeZ * 0.42],
        [-sizeX * 0.42, sizeZ * 0.42],
        [sizeX * 0.42, sizeZ * 0.42],
      ].map(([x, z], i) => (
        <group key={i} position={[x, sizeY * 0.35, z]}>
          {/* Pied principal */}
          <RoundedBox
            args={[sizeX * 0.06, sizeY * 0.7, sizeZ * 0.06]}
            radius={0.008}
            castShadow
          >
            <meshStandardMaterial color="#8b4513" roughness={0.6} />
          </RoundedBox>

          {/* Embout métallique en bas */}
          <mesh position={[0, -sizeY * 0.35, 0]}>
            <cylinderGeometry args={[sizeX * 0.035, sizeX * 0.035, sizeY * 0.02, 16]} />
            <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Renfort en haut */}
          <mesh position={[0, sizeY * 0.35, 0]}>
            <cylinderGeometry args={[sizeX * 0.045, sizeX * 0.035, sizeY * 0.04, 16]} />
            <meshStandardMaterial color="#6b4423" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Traverse sous le plateau (renfort) */}
      <mesh position={[0, sizeY * 0.5, 0]} castShadow>
        <boxGeometry args={[sizeX * 0.8, sizeY * 0.04, sizeZ * 0.04]} />
        <meshStandardMaterial color="#6b4423" roughness={0.6} />
      </mesh>
      <mesh position={[0, sizeY * 0.5, 0]} castShadow rotation-y={Math.PI / 2}>
        <boxGeometry args={[sizeZ * 0.8, sizeY * 0.04, sizeX * 0.04]} />
        <meshStandardMaterial color="#6b4423" roughness={0.6} />
      </mesh>

      {/* Décoration : set de table (napperon) */}
      {hovered && (
        <mesh position={[0, sizeY * 0.735, 0]} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[sizeX * 0.6, sizeZ * 0.4]} />
          <meshStandardMaterial
            color="#f0e8d8"
            roughness={0.9}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
};

// 💺 Modèle de siège réaliste
const SeatModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || 500) / 1000;

  return (
    <group>
      {/* Assise */}
      <RoundedBox
        args={[sizeX, sizeY * 0.15, sizeZ]}
        radius={0.02}
        position={[0, sizeY * 0.45, 0]}
        castShadow
        receiveShadow
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#f56ba9' : '#ec4899'}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Dossier */}
      <RoundedBox
        args={[sizeX, sizeY * 0.6, sizeZ * 0.1]}
        radius={0.02}
        position={[0, sizeY * 0.75, -sizeZ * 0.45]}
        castShadow
      >
        <meshStandardMaterial color={furniture.color} roughness={0.8} />
      </RoundedBox>

      {/* Pieds */}
      {[
        [-sizeX * 0.4, -sizeZ * 0.4],
        [sizeX * 0.4, -sizeZ * 0.4],
        [-sizeX * 0.4, sizeZ * 0.4],
        [sizeX * 0.4, sizeZ * 0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, sizeY * 0.2, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, sizeY * 0.4, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// 📦 Modèle générique (cube arrondi) pour types non spécifiques
const GenericModel: React.FC<FurnitureProps> = ({ furniture }) => {
  const [hovered, setHovered] = useState(false);

  const sizeX = furniture.width / 1000;
  const sizeZ = furniture.height / 1000;
  const sizeY = (furniture.depth || furniture.height) / 1000;

  return (
    <RoundedBox
      args={[sizeX, sizeY, sizeZ]}
      radius={0.02}
      smoothness={4}
      position={[0, sizeY / 2, 0]}
      castShadow
      receiveShadow
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={furniture.color}
        emissive={hovered ? furniture.color : '#000000'}
        emissiveIntensity={hovered ? 0.2 : 0}
        roughness={0.5}
        metalness={0.1}
      />
    </RoundedBox>
  );
};

// 🎨 Composant principal qui choisit le bon modèle
export const RealisticFurnitureModel: React.FC<FurnitureProps> = (props) => {
  const { furniture } = props;

  // Sélection du modèle selon le type
  let ModelComponent: React.FC<FurnitureProps>;

  switch (furniture.type) {
    case 'bed':
      ModelComponent = BedModel;
      break;
    case 'kitchen':
      ModelComponent = KitchenModel;
      break;
    case 'bathroom':
      ModelComponent = BathroomModel;
      break;
    case 'storage':
      ModelComponent = StorageModel;
      break;
    case 'table':
      ModelComponent = TableModel;
      break;
    case 'seat':
      ModelComponent = SeatModel;
      break;
    default:
      ModelComponent = GenericModel;
  }

  // Récupérer le preset pour l'icône
  const preset = furniture.type ? FURNITURE_PRESETS[furniture.type as keyof typeof FURNITURE_PRESETS] : null;
  const icon = preset?.icon || '📦';

  const sizeY = (furniture.depth || furniture.height) / 1000;

  return (
    <group>
      <ModelComponent {...props} />

      {/* Nom du meuble au-dessus */}
      {furniture.name && (
        <Text
          position={[0, sizeY + 0.15, 0]}
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
