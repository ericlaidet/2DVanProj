// apps/web/src/components/van/models/VanModelRealistic.tsx
// 🚐 Van réaliste complet avec roues, cockpit, sièges pivotants
import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { VAN_TYPES } from '../../../constants/vans';
import * as THREE from 'three';

interface VanModelRealisticProps {
  vanType: string;
}

// 🎨 Constantes de transparence
const WALL_OPACITY = 0.15;
const WINDOW_OPACITY = 0.1;
const ROOF_OPACITY = 0.3;

// 🚗 Composant Roue
const Wheel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh rotation-x={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 6]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
        <meshStandardMaterial color="#404040" roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
};

// 🪑 Composant Siège
const DriverSeat: React.FC<{ 
  position: [number, number, number];
  rotation?: number;
  isDriver?: boolean;
}> = ({ position, rotation = 0, isDriver = true }) => {
  return (
    <group position={position} rotation-y={rotation}>
      <RoundedBox args={[0.5, 0.1, 0.5]} radius={0.02} position={[0, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.15, 0.5]} radius={0.03} position={[0, 0.35, 0]} castShadow>
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.6, 0.1]} radius={0.03} position={[0, 0.6, -0.2]} castShadow>
        <meshStandardMaterial color="#4a5568" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.35, 0.15, 0.08]} radius={0.02} position={[0, 0.95, -0.18]} castShadow>
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.35, 0.4]} radius={0.015} position={[-0.29, 0.45, -0.05]} castShadow>
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.35, 0.4]} radius={0.015} position={[0.29, 0.45, -0.05]} castShadow>
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.8} />
      </mesh>
      {[0, 90, 180, 270].map((angle, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.2,
            0.02,
            Math.sin((angle * Math.PI) / 180) * 0.2
          ]}
          rotation-y={(angle * Math.PI) / 180}
        >
          <boxGeometry args={[0.3, 0.03, 0.08]} />
          <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// 🎛️ Composant Tableau de bord
const Dashboard: React.FC<{ length: number; width: number; height: number }> = ({ length, width, height }) => {
  return (
    <group position={[length / 2 - 0.15, height * 0.3, 0]}>
      <RoundedBox args={[0.15, 0.6, width * 0.8]} radius={0.02} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#1a202c" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      <mesh position={[-0.06, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.25, 0.35]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} emissive="#1e40af" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.06, 0.1, -0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} emissive="#10b981" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.06, 0.1, 0.3]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} emissive="#ef4444" emissiveIntensity={0.2} />
      </mesh>
      <group position={[-0.1, -0.15, -0.35]} rotation-y={Math.PI / 2}>
        <mesh>
          <torusGeometry args={[0.18, 0.02, 16, 32]} />
          <meshStandardMaterial color="#1a202c" roughness={0.4} metalness={0.6} />
        </mesh>
        {[-1, 0, 1].map((offset, i) => (
          <mesh key={i} rotation-z={offset * (Math.PI / 6)}>
            <boxGeometry args={[0.03, 0.2, 0.015]} />
            <meshStandardMaterial color="#2d3748" roughness={0.5} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshStandardMaterial color="#1a202c" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
      <group position={[-0.05, -0.2, 0.1]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.2, 16]} />
          <meshStandardMaterial color="#1a202c" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#1a202c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      {Array.from({ length: 12 }).map((_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        return (
          <mesh key={i} position={[-0.06, -0.15 - row * 0.06, -0.15 + col * 0.1]}>
            <boxGeometry args={[0.01, 0.04, 0.04]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#ef4444" : "#374151"} roughness={0.4} metalness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};

// 🚐 Composant principal
export const VanModelRealistic: React.FC<VanModelRealisticProps> = ({ vanType }) => {
  const van = VAN_TYPES.find(v => v.vanType === vanType);
  if (!van) return null;

  const length = van.length / 1000;
  const width = van.width / 1000;
  const height = 2.0;
  const wallThickness = 0.02;
  const floorThickness = 0.03;
  const roofThickness = 0.02;
  const cabinLength = length * 0.25;
  const cargoStart = length / 2 - cabinLength;

  return (
    <group position={[0, height / 2, 0]}>
      {/* ROUES */}
      <Wheel position={[length / 2 - 0.8, -height / 2 - 0.1, -width / 2 + 0.15]} />
      <Wheel position={[length / 2 - 0.8, -height / 2 - 0.1, width / 2 - 0.15]} />
      <Wheel position={[-length / 2 + 0.8, -height / 2 - 0.1, -width / 2 + 0.15]} />
      <Wheel position={[-length / 2 + 0.8, -height / 2 - 0.1, width / 2 - 0.15]} />

      {/* CHÂSSIS */}
      <mesh position={[0, -height / 2 - 0.05, -width / 2 + 0.2]}>
        <boxGeometry args={[length * 0.9, 0.08, 0.1]} />
        <meshStandardMaterial color="#1a202c" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.05, width / 2 - 0.2]}>
        <boxGeometry args={[length * 0.9, 0.08, 0.1]} />
        <meshStandardMaterial color="#1a202c" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* SOL */}
      <RoundedBox args={[length, floorThickness, width]} radius={0.01} position={[0, -height / 2 + floorThickness / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} metalness={0.1} />
      </RoundedBox>

      {/* MURS TRANSPARENTS */}
      <RoundedBox args={[length - cabinLength, height, wallThickness]} radius={0.01} position={[-(cabinLength / 2), 0, -width / 2 + wallThickness / 2]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} transparent opacity={WALL_OPACITY} side={THREE.DoubleSide} depthWrite={false} />
      </RoundedBox>
      <RoundedBox args={[length - cabinLength, height, wallThickness]} radius={0.01} position={[-(cabinLength / 2), 0, width / 2 - wallThickness / 2]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} transparent opacity={WALL_OPACITY} side={THREE.DoubleSide} depthWrite={false} />
      </RoundedBox>
      <RoundedBox args={[wallThickness, height, width]} radius={0.01} position={[-length / 2 + wallThickness / 2, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.1} transparent opacity={WALL_OPACITY} side={THREE.DoubleSide} depthWrite={false} />
      </RoundedBox>

      {/* PARE-BRISE */}
      <mesh position={[length / 2 - cabinLength * 0.5, height * 0.25, 0]} rotation-y={Math.PI}>
        <boxGeometry args={[0.05, height * 0.6, width * 0.85]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} roughness={0.05} metalness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* TABLEAU DE BORD */}
      <Dashboard length={length} width={width} height={height} />

      {/* SIÈGES */}
      <DriverSeat position={[length / 2 - cabinLength * 0.7, -height / 2 + floorThickness, -width / 4]} rotation={0} isDriver={true} />
      <DriverSeat position={[length / 2 - cabinLength * 0.7, -height / 2 + floorThickness, width / 4]} rotation={0} isDriver={false} />

      {/* TOIT */}
      <RoundedBox args={[length, roofThickness, width]} radius={0.01} position={[0, height / 2 - roofThickness / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.2} transparent opacity={ROOF_OPACITY} side={THREE.DoubleSide} />
      </RoundedBox>

      {/* PHARES */}
      {[-width / 3, width / 3].map((z, i) => (
        <mesh key={i} position={[length / 2 - cabinLength * 0.05, -height / 2 + 0.45, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
        </mesh>
      ))}

      {/* FEUX ARRIÈRE */}
      {[-width / 3, width / 3].map((z, i) => (
        <mesh key={i} position={[-length / 2 + 0.05, -height / 2 + 0.45, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* RÉTROVISEURS */}
      {[-width / 2 - 0.1, width / 2 + 0.1].map((z, i) => (
        <group key={i} position={[length / 2 - cabinLength * 0.5, height * 0.3, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.1, 0.05]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* CONTOURS */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
        <lineBasicMaterial color="#2d3748" linewidth={2} transparent opacity={0.6} />
      </lineSegments>
    </group>
  );
};