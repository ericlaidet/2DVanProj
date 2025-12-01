// apps/web/src/components/van/VanCanvas3D.tsx (Phase 2)
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, Stats } from '@react-three/drei';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { VanModelRealistic } from './models/VanModelRealistic';
import { DraggableFurniture3D } from './DraggableFurniture3D';
import { calculateVolumeUsage } from '../../utils/coordinates3D';
import * as THREE from 'three';
import './VanCanvas3D.css';

// ✨ Sol avec grille amélioré
const EnhancedFloor: React.FC = () => {
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <Grid 
        args={[30, 30]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#999999" 
        sectionSize={2.5} 
        sectionThickness={1} 
        sectionColor="#666666"
        fadeDistance={20}
        fadeStrength={1}
        position={[0, 0, 0]}
      />
    </>
  );
};

// ✨ Éclairage amélioré
const EnhancedLighting: React.FC = () => {
  return (
    <>
      {/* Lumière ambiante */}
      <ambientLight intensity={0.5} />
      
      {/* Lumière directionnelle principale (soleil) */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />
      
      {/* Lumières d'appoint */}
      <pointLight position={[-8, 8, -8]} intensity={0.4} color="#ffffcc" />
      <pointLight position={[8, 8, 8]} intensity={0.4} color="#ccf fff" />
      
      {/* Lumière de remplissage */}
      <hemisphereLight
        args={['#87CEEB', '#8b7355', 0.3]}
      />
    </>
  );
};

// ✨ Chargement avec Suspense
const LoadingFallback: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
};

// ✨ Statistiques 3D (overlay)
const Stats3DOverlay: React.FC = () => {
  const objects = useStore(s => s.objects);
  const vanType = useStore(s => s.vanType);

  const volumeUsage = calculateVolumeUsage(objects, vanType);

  return (
    <div className="stats-3d-overlay">
      <div className="stat-item">
        <span className="stat-label">Meubles:</span>
        <span className="stat-value">{objects.length}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Volume occupé:</span>
        <span className="stat-value">{volumeUsage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

// ✨ Composant principal VanCanvas3D
export const VanCanvas3D: React.FC = () => {
  const objects = useStore(s => s.objects);
  const vanType = useStore(s => s.vanType);
  const [showStats, setShowStats] = React.useState(false);

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
      <Suspense fallback={
        <div className="canvas-3d-loading">
          <div className="canvas-3d-loading-spinner" />
          <p>Chargement de la vue 3D...</p>
        </div>
      }>
        <Canvas 
          shadows 
          camera={{ position: [8, 6, 8], fov: 50 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          {/* Couleur de fond (ciel) */}
          <color attach="background" args={['#87CEEB']} />
          
          {/* Brouillard pour la profondeur */}
          <fog attach="fog" args={['#87CEEB', 15, 50]} />
          
          {/* Caméra et contrôles */}
          <PerspectiveCamera makeDefault position={[8, 6, 8]} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            enablePan
            panSpeed={0.5}
          />

          {/* Éclairage amélioré */}
          <EnhancedLighting />

          {/* Environnement (réflexions) */}
          <Environment preset="sunset" />

          {/* Sol avec grille */}
          <EnhancedFloor />

          {/* Van 3D réaliste */}
          <VanModelRealistic vanType={vanType} />

          {/* Meubles 3D avec drag & drop */}
          {objects.map(obj => (
            <DraggableFurniture3D key={obj.id} furniture={obj} />
          ))}

          {/* Stats FPS (dev) */}
          {showStats && <Stats />}
        </Canvas>
      </Suspense>

      {/* Overlay avec statistiques */}
      <Stats3DOverlay />

      {/* Overlay d'instructions */}
      <div className="canvas-3d-overlay">
        <div className="controls-hint">
          <p><strong>🖱️ Clic gauche + glisser</strong> : Rotation caméra</p>
          <p><strong>🖱️ Clic droit + glisser</strong> : Déplacer caméra</p>
          <p><strong>🖱️ Molette</strong> : Zoom</p>
          <p><strong>🎯 Clic gauche sur meuble</strong> : Déplacer</p>
          <p><strong>🔄 Clic droit sur meuble</strong> : Rotation</p>
          <p><strong>🗑️ Double-clic</strong> : Rotation 90°</p>
          <p><strong>❌ Clic droit (maintenir)</strong> : Supprimer</p>
        </div>
      </div>

      {/* Toggle FPS Stats */}
      <button 
        className="stats-toggle"
        onClick={() => setShowStats(!showStats)}
        title="Afficher/masquer les stats FPS"
      >
        📊
      </button>
    </div>
  );
};
