// apps/web/src/components/van/models/VanModelRealistic.tsx
// 🚐 Version complète : Van réaliste avec roues, cockpit, pare-brise, sièges
import React from 'react';
import { RoundedBox, Cylinder, Sphere } from '@react-three/drei';
import { VAN_TYPES } from '../../../constants/vans';
import * as THREE from 'three';

interface VanModelRealisticProps {
  vanType: string;
}

// 🎨 Composant Roue réaliste
const Wheel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Pneu extérieur (noir) */}
      <Cylinder args={[0.35, 0.35, 0.25, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.9}
          metalness={0.1}
        />
      </Cylinder>
      
      {/* Jante (gris métallique) */}
      <Cylinder args={[0.25, 0.25, 0.26, 32]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color="#808080" 
          roughness={0.3}
          metalness={0.8}
        />
      </Cylinder>
      
      {/* Centre de roue (logo/capuchon) */}
      <Cylinder args={[0.08, 0.08, 0.27, 16]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.2}
          metalness={0.9}
        />
      </Cylinder>
      
      {/* Rayons de jante (5 rayons) */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[0, Math.cos(angle) * 0.15, Math.sin(angle) * 0.15]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <boxGeometry args={[0.26, 0.03, 0.1]} />
            <meshStandardMaterial color="#606060" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

// 🪑 Composant Siège (conducteur/passager)
const VanSeat: React.FC<{ 
  position: [number, number, number]; 
  rotation?: number;
  color?: string;
}> = ({ position, rotation = 0, color = '#2d3748' }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base du siège */}
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </RoundedBox>
      
      {/* Assise */}
      <RoundedBox args={[0.5, 0.15, 0.5]} radius={0.03} position={[0, 0.125, 0]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </RoundedBox>
      
      {/* Dossier */}
      <RoundedBox args={[0.5, 0.6, 0.1]} radius={0.03} position={[0, 0.4, -0.2]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </RoundedBox>
      
      {/* Appui-tête */}
      <RoundedBox args={[0.3, 0.2, 0.1]} radius={0.02} position={[0, 0.75, -0.15]}>
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </RoundedBox>
      
      {/* Accoudoirs */}
      <RoundedBox args={[0.08, 0.35, 0.4]} radius={0.02} position={[-0.25, 0.25, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.35, 0.4]} radius={0.02} position={[0.25, 0.25, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </RoundedBox>
      
      {/* Pied central (support) */}
      <Cylinder args={[0.05, 0.05, 0.1, 16]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
};

// 🎮 Volant
const SteeringWheel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position} rotation={[Math.PI / 6, 0, 0]}>
      {/* Cercle du volant */}
      <mesh>
        <torusGeometry args={[0.2, 0.025, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Centre du volant */}
      <Cylinder args={[0.08, 0.08, 0.02, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Branches du volant (3) */}
      {[0, 120, 240].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.cos(rad) * 0.1, Math.sin(rad) * 0.1, 0]}
            rotation={[0, 0, rad]}
          >
            <boxGeometry args={[0.15, 0.03, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      })}
      
      {/* Colonne de direction */}
      <Cylinder args={[0.02, 0.02, 0.3, 16]} position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.3} />
      </Cylinder>
    </group>
  );
};

// 📊 Tableau de bord
const Dashboard: React.FC<{ 
  position: [number, number, number]; 
  width: number;
}> = ({ position, width }) => {
  return (
    <group position={position}>
      {/* Tableau de bord principal */}
      <RoundedBox args={[width, 0.3, 0.15]} radius={0.02}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </RoundedBox>
      
      {/* Écran central (GPS/Radio) */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
        <meshStandardMaterial 
          color="#0a192f" 
          emissive="#1e3a8a"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Compteurs (gauche) */}
      <mesh position={[-width * 0.25, 0, 0.08]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial 
          color="#0a192f"
          emissive="#dc2626"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Compteurs (droite) */}
      <mesh position={[width * 0.25, 0, 0.08]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial 
          color="#0a192f"
          emissive="#10b981"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Boutons de contrôle (rangée) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[(i - 3.5) * 0.08, -0.1, 0.08]}>
          <boxGeometry args={[0.05, 0.05, 0.01]} />
          <meshStandardMaterial 
            color="#2d3748"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};

// 🚐 Composant principal du Van
export const VanModelRealistic: React.FC<VanModelRealisticProps> = ({ vanType }) => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return null;

  // Conversion mm → mètres
  const length = van.length / 1000;
  const width = van.width / 1000;
  const height = 2.0;

  const wallThickness = 0.02;
  const floorThickness = 0.05; // Plus épais pour inclure le châssis
  const roofThickness = 0.02;

  // Opacités
  const WALL_OPACITY = 0.15;
  const WINDOW_OPACITY = 0.08;

  // Dimensions cockpit
  const cockpitLength = Math.min(2.5, length * 0.4);
  const cargoLength = length - cockpitLength;

  return (
    <group position={[0, height / 2 + 0.4, 0]}>
      
      {/* ==================== CHÂSSIS ET ROUES ==================== */}
      
      {/* Châssis (visible sous le van) */}
      <RoundedBox
        args={[length * 0.9, 0.08, width * 0.6]}
        radius={0.01}
        position={[0, -height / 2 - 0.35, 0]}
      >
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} metalness={0.5} />
      </RoundedBox>
      
      {/* Roues (4 roues) */}
      <Wheel position={[length * 0.35, -height / 2 - 0.35, -width / 2 - 0.1]} />
      <Wheel position={[length * 0.35, -height / 2 - 0.35, width / 2 + 0.1]} />
      <Wheel position={[-length * 0.35, -height / 2 - 0.35, -width / 2 - 0.1]} />
      <Wheel position={[-length * 0.35, -height / 2 - 0.35, width / 2 + 0.1]} />
      
      {/* Garde-boue */}
      {[
        [length * 0.35, -width / 2 - 0.1],
        [length * 0.35, width / 2 + 0.1],
        [-length * 0.35, -width / 2 - 0.1],
        [-length * 0.35, width / 2 + 0.1],
      ].map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, -height / 2 - 0.35, z]}
          rotation={[0, 0, 0]}
        >
          <cylinderGeometry args={[0.4, 0.4, 0.15, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.5} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ==================== SOL / PLANCHER ==================== */}
      
      <RoundedBox
        args={[length, floorThickness, width]}
        radius={0.01}
        position={[0, -height / 2 + floorThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} metalness={0.1} />
      </RoundedBox>

      {/* Texture plancher bois (zone cargo uniquement) */}
      <group position={[-cargoLength / 2, -height / 2 + floorThickness + 0.001, 0]}>
        {Array.from({ length: Math.floor(cargoLength / 0.15) }).map((_, i) => (
          <mesh
            key={i}
            position={[i * 0.15, 0, 0]}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <planeGeometry args={[0.14, width]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8b7355" : "#a0826d"}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* ==================== COCKPIT (cabine avant) ==================== */}
      
      {/* Séparation cockpit (cloison) */}
      <RoundedBox
        args={[wallThickness * 2, height * 0.8, width]}
        radius={0.01}
        position={[length / 2 - cockpitLength, height * 0.05, 0]}
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.5}
          metalness={0.1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      
      {/* Tableau de bord */}
      <Dashboard 
        position={[length / 2 - 0.3, height * 0.1, width / 2 - wallThickness - 0.1]} 
        width={width * 0.8}
      />
      
      {/* Volant (côté gauche pour conduite à gauche) */}
      <SteeringWheel position={[length / 2 - 0.5, height * 0.1, width / 2 - 0.5]} />
      
      {/* Sièges conducteur et passager */}
      <VanSeat 
        position={[length / 2 - 0.8, -height / 2 + floorThickness + 0.05, width / 2 - 0.5]} 
        rotation={0}
        color="#2d3748"
      />
      <VanSeat 
        position={[length / 2 - 0.8, -height / 2 + floorThickness + 0.05, -width / 2 + 0.5]} 
        rotation={0}
        color="#374151"
      />
      
      {/* Pare-brise avant (grand et incliné) */}
      <mesh 
        position={[length / 2 - 0.15, height * 0.2, 0]}
        rotation={[Math.PI / 8, 0, 0]}
      >
        <boxGeometry args={[0.05, height * 0.6, width * 0.9]} />
        <meshStandardMaterial 
          color="#87CEEB"
          transparent
          opacity={WINDOW_OPACITY}
          roughness={0.05}
          metalness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Cadre pare-brise */}
      <lineSegments position={[length / 2 - 0.15, height * 0.2, 0]} rotation={[Math.PI / 8, 0, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.05, height * 0.6, width * 0.9)]} />
        <lineBasicMaterial color="#1a1a1a" linewidth={3} />
      </lineSegments>
      
      {/* Capot moteur (avant du van) */}
      <RoundedBox
        args={[0.8, 0.15, width * 0.9]}
        radius={0.03}
        position={[length / 2 + 0.3, -height * 0.35, 0]}
      >
        <meshStandardMaterial color="#e5e7eb" roughness={0.4} metalness={0.6} />
      </RoundedBox>
      
      {/* Logo/Calandre avant */}
      <mesh position={[length / 2 + 0.7, -height * 0.35, 0]}>
        <boxGeometry args={[0.02, 0.2, width * 0.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Phares avant (2) */}
      {[-width * 0.3, width * 0.3].map((z, i) => (
        <mesh key={i} position={[length / 2 + 0.65, -height * 0.35, z]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffeb3b"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* ==================== ZONE CARGO (murs transparents) ==================== */}
      
      {/* Mur gauche */}
      <RoundedBox
        args={[cargoLength, height, wallThickness]}
        radius={0.01}
        position={[-cargoLength / 2, 0, -width / 2 + wallThickness / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={WALL_OPACITY}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Mur droit */}
      <RoundedBox
        args={[cargoLength, height, wallThickness]}
        radius={0.01}
        position={[-cargoLength / 2, 0, width / 2 - wallThickness / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={WALL_OPACITY}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Mur arrière */}
      <RoundedBox
        args={[wallThickness, height, width]}
        radius={0.01}
        position={[-length / 2 + wallThickness / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={WALL_OPACITY}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </RoundedBox>

      {/* Contours du van */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
        <lineBasicMaterial color="#2d3748" linewidth={2} transparent opacity={0.6} />
      </lineSegments>

      {/* ==================== FENÊTRES LATÉRALES ==================== */}
      
      {/* Fenêtres cargo gauche */}
      {[0.2, 0.5].map((ratio, i) => (
        <React.Fragment key={`left-${i}`}>
          <mesh position={[-cargoLength * ratio, height * 0.2, -width / 2 + 0.005]}>
            <boxGeometry args={[0.6, 0.4, 0.01]} />
            <meshStandardMaterial 
              color="#87CEEB"
              transparent
              opacity={WINDOW_OPACITY}
              roughness={0.1}
              metalness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments position={[-cargoLength * ratio, height * 0.2, -width / 2 + 0.01]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.6, 0.4, 0.01)]} />
            <lineBasicMaterial color="#333333" linewidth={2} />
          </lineSegments>
        </React.Fragment>
      ))}
      
      {/* Fenêtres cargo droite */}
      {[0.2, 0.5].map((ratio, i) => (
        <React.Fragment key={`right-${i}`}>
          <mesh position={[-cargoLength * ratio, height * 0.2, width / 2 - 0.005]}>
            <boxGeometry args={[0.6, 0.4, 0.01]} />
            <meshStandardMaterial 
              color="#87CEEB"
              transparent
              opacity={WINDOW_OPACITY}
              roughness={0.1}
              metalness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments position={[-cargoLength * ratio, height * 0.2, width / 2 - 0.01]}>
            <edgesGeometry args={[new THREE.BoxGeometry(0.6, 0.4, 0.01)]} />
            <lineBasicMaterial color="#333333" linewidth={2} />
          </lineSegments>
        </React.Fragment>
      ))}

      {/* ==================== PORTES ==================== */}
      
      {/* Porte coulissante latérale */}
      <RoundedBox
        args={[1.2, height * 0.9, wallThickness * 1.5]}
        radius={0.01}
        position={[-cargoLength * 0.7, 0, width / 2 - 0.02]}
        castShadow
      >
        <meshStandardMaterial 
          color="#d0d0d0"
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={WALL_OPACITY * 1.8}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      
      {/* Vitre porte latérale */}
      <mesh position={[-cargoLength * 0.7, height * 0.2, width / 2 - 0.01]}>
        <boxGeometry args={[0.5, 0.6, 0.01]} />
        <meshStandardMaterial 
          color="#87CEEB"
          transparent
          opacity={WINDOW_OPACITY}
          roughness={0.1}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Poignée porte */}
      <mesh position={[-cargoLength * 0.7 + 0.5, 0, width / 2 - 0.01]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Portes arrière (double porte) */}
      {[-width * 0.25, width * 0.25].map((z, i) => (
        <RoundedBox
          key={i}
          args={[wallThickness * 1.5, height * 0.9, width * 0.45]}
          radius={0.01}
          position={[-length / 2 + 0.02, 0, z]}
          castShadow
        >
          <meshStandardMaterial 
            color="#d0d0d0"
            roughness={0.4}
            metalness={0.3}
            transparent
            opacity={WALL_OPACITY * 1.8}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      ))}

      {/* ==================== TOIT ==================== */}
      
      <RoundedBox
        args={[length, roofThickness, width]}
        radius={0.01}
        position={[0, height / 2 - roofThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Lanterneau */}
      <mesh position={[-cargoLength * 0.3, height / 2, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial 
          color="#87CEEB"
          transparent
          opacity={WINDOW_OPACITY}
          roughness={0.1}
          metalness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ==================== DÉTAILS EXTÉRIEURS ==================== */}
      
      {/* Rétroviseurs */}
      {[-width / 2 - 0.15, width / 2 + 0.15].map((z, i) => (
        <group key={i} position={[length / 2 - cockpitLength + 0.2, height * 0.25, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.1, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, i === 0 ? -0.08 : 0.08]}>
            <boxGeometry args={[0.02, 0.02, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}

      {/* Bande décorative */}
      <mesh position={[0, height * 0.3, width / 2 + 0.001]}>
        <boxGeometry args={[length * 0.8, 0.05, 0.001]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Feux arrière (4 feux) */}
      {[
        [-length / 2 + 0.05, -width * 0.4],
        [-length / 2 + 0.05, width * 0.4],
        [-length / 2 + 0.05, -width * 0.35],
        [-length / 2 + 0.05, width * 0.35],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -height * 0.3, z]}>
          <boxGeometry args={[0.02, 0.15, 0.1]} />
          <meshStandardMaterial 
            color={i < 2 ? "#dc2626" : "#fbbf24"}
            emissive={i < 2 ? "#dc2626" : "#fbbf24"}
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

    </group>
  );
};
