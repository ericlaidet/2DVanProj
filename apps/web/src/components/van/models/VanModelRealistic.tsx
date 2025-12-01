// apps/web/src/components/van/models/VanModelRealistic.tsx
import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { VAN_TYPES } from '../../../constants/vans';
import * as THREE from 'three';

interface VanModelRealisticProps {
  vanType: string;
}

export const VanModelRealistic: React.FC<VanModelRealisticProps> = ({ vanType }) => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return null;

  // Conversion mm → mètres
  const length = van.length / 1000;
  const width = van.width / 1000;
  const height = 2.0; // Hauteur standard

  const wallThickness = 0.02;
  const floorThickness = 0.03;
  const roofThickness = 0.02;

  return (
    <group position={[0, height / 2, 0]}>
      {/* ==================== SOL ==================== */}
      <RoundedBox
        args={[length, floorThickness, width]}
        radius={0.01}
        position={[0, -height / 2 + floorThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#4a4a4a"
          roughness={0.9}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Texture du sol (planches de bois) */}
      <group position={[0, -height / 2 + floorThickness + 0.001, 0]}>
        {Array.from({ length: Math.floor(length / 0.15) }).map((_, i) => (
          <mesh
            key={i}
            position={[i * 0.15 - length / 2 + 0.075, 0, 0]}
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

      {/* ==================== MURS ==================== */}
      
      {/* Mur gauche */}
      <RoundedBox
        args={[length, height, wallThickness]}
        radius={0.01}
        position={[0, 0, -width / 2 + wallThickness / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.7}
          metalness={0.0}
        />
      </RoundedBox>

      {/* Mur droit */}
      <RoundedBox
        args={[length, height, wallThickness]}
        radius={0.01}
        position={[0, 0, width / 2 - wallThickness / 2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f5f5f5"
          roughness={0.7}
          metalness={0.0}
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
          roughness={0.7}
        />
      </RoundedBox>

      {/* ==================== FENÊTRES ==================== */}
      
      {/* Fenêtre gauche 1 */}
      <mesh 
        position={[length * 0.2, height * 0.2, -width / 2 + 0.005]}
        castShadow
      >
        <boxGeometry args={[0.6, 0.4, 0.01]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Cadre fenêtre gauche 1 */}
      <lineSegments position={[length * 0.2, height * 0.2, -width / 2 + 0.01]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.6, 0.4, 0.01)]} />
        <lineBasicMaterial color="#333333" linewidth={3} />
      </lineSegments>

      {/* Fenêtre droite 1 */}
      <mesh 
        position={[length * 0.2, height * 0.2, width / 2 - 0.005]}
        castShadow
      >
        <boxGeometry args={[0.6, 0.4, 0.01]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Cadre fenêtre droite 1 */}
      <lineSegments position={[length * 0.2, height * 0.2, width / 2 - 0.01]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.6, 0.4, 0.01)]} />
        <lineBasicMaterial color="#333333" linewidth={3} />
      </lineSegments>

      {/* Fenêtre arrière */}
      <mesh 
        position={[-length / 2 + 0.005, height * 0.3, 0]}
        castShadow
      >
        <boxGeometry args={[0.01, 0.5, 0.8]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Cadre fenêtre arrière */}
      <lineSegments position={[-length / 2 + 0.01, height * 0.3, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.01, 0.5, 0.8)]} />
        <lineBasicMaterial color="#333333" linewidth={3} />
      </lineSegments>

      {/* ==================== PORTE LATÉRALE ==================== */}
      
      {/* Porte coulissante */}
      <RoundedBox
        args={[1.2, height * 0.9, wallThickness * 1.5]}
        radius={0.01}
        position={[-length * 0.2, 0, width / 2 - 0.02]}
        castShadow
      >
        <meshStandardMaterial 
          color="#d0d0d0"
          roughness={0.4}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Vitre de porte */}
      <mesh position={[-length * 0.2, height * 0.2, width / 2 - 0.01]}>
        <boxGeometry args={[0.5, 0.6, 0.01]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Poignée de porte */}
      <mesh position={[-length * 0.2 + 0.5, height * 0.1, width / 2 - 0.01]}>
        <cylinderGeometry args={[0.02, 0.02, 0.1, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

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
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Lanterneau (skylight) */}
      <mesh position={[length * 0.1, height / 2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.4}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Cadre lanterneau */}
      <lineSegments position={[length * 0.1, height / 2 + 0.025, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.01, 0.6)]} />
        <lineBasicMaterial color="#333333" linewidth={2} />
      </lineSegments>

      {/* ==================== DÉTAILS EXTÉRIEURS ==================== */}
      
      {/* Rétroviseurs */}
      {[-width / 2 - 0.1, width / 2 + 0.1].map((z, i) => (
        <group key={i} position={[length / 2 - 0.5, height * 0.3, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.1, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, i === 0 ? -0.05 : 0.05]}>
            <boxGeometry args={[0.02, 0.02, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        </group>
      ))}

      {/* Bande latérale décorative */}
      <mesh position={[0, height * 0.4, width / 2 + 0.001]} castShadow>
        <boxGeometry args={[length * 0.8, 0.05, 0.001]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ==================== CONTOURS STRUCTURELS ==================== */}
      
      {/* Contour principal du van */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
        <lineBasicMaterial color="#1a1a1a" linewidth={2} />
      </lineSegments>

      {/* Grille de ventilation (arrière) */}
      <group position={[-length / 2 + 0.02, -height * 0.3, 0]}>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[0, i * 0.03 - 0.15, 0]}>
            <boxGeometry args={[0.005, 0.01, 0.3]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        ))}
      </group>
    </group>
  );
};
