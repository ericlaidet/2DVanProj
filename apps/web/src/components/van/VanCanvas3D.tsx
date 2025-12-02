// apps/web/src/components/van/VanCanvas3D.tsx
import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, Stats } from '@react-three/drei';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { VanModelRealistic } from './models/VanModelRealistic';
import { DraggableFurniture3D } from './DraggableFurniture3D';
import { ControlsPanel3D } from './ControlsPanel3D';
import { calculateVolumeUsage } from '../../utils/coordinates3D';
import { notify } from '../../utils/notify';
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
      <ambientLight intensity={0.5} />
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
      <pointLight position={[-8, 8, -8]} intensity={0.4} color="#ffffcc" />
      <pointLight position={[8, 8, 8]} intensity={0.4} color="#ccffff" />
      <hemisphereLight args={['#87CEEB', '#8b7355', 0.3]} />
    </>
  );
};

// ✨ Statistiques 3D
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
  const addObject = useStore(s => s.addObject);
  const updateObject = useStore(s => s.updateObject);
  const removeObject = useStore(s => s.removeObject);
  
  const [showStats, setShowStats] = useState(false);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [cameraLocked, setCameraLocked] = useState(true); // 🔒 Caméra verrouillée par défaut
  const orbitControlsRef = useRef<any>(null);

  // Gestion de la sélection
  const handleSelectFurniture = useCallback((id: string) => {
    setSelectedFurnitureId(id);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedFurnitureId(null);
  }, []);

  // Actions sur le meuble sélectionné
  const handleDeleteSelected = useCallback(() => {
    if (!selectedFurnitureId) return;
    const furniture = objects.find(obj => obj.id === selectedFurnitureId);
    removeObject(selectedFurnitureId);
    setSelectedFurnitureId(null);
    notify.success('Meuble supprimé');
  }, [selectedFurnitureId, objects, removeObject]);

  const handleDuplicateSelected = useCallback(() => {
    if (!selectedFurnitureId) return;
    const furniture = objects.find(obj => obj.id === selectedFurnitureId);
    if (!furniture) return;

    const newFurniture = {
      ...furniture,
      id: `${furniture.type}-${Date.now()}`,
      x: furniture.x + 100,
      y: furniture.y + 100,
      name: `${furniture.name} (copie)`
    };

    addObject(newFurniture);
    setSelectedFurnitureId(newFurniture.id);
    notify.success('Meuble dupliqué');
  }, [selectedFurnitureId, objects, addObject]);

  const handleResetTransform = useCallback(() => {
    if (!selectedFurnitureId) return;
    updateObject(selectedFurnitureId, {
      z: 0,
      rotation: { x: 0, y: 0, z: 0 }
    });
    notify.success('Position réinitialisée');
  }, [selectedFurnitureId, updateObject]);

  // Raccourci clavier pour verrouiller/déverrouiller la caméra
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          setCameraLocked(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          onClick={handleDeselectAll}
        >
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#87CEEB', 15, 50]} />
          
          <PerspectiveCamera makeDefault position={[8, 6, 8]} />
          <OrbitControls
            ref={orbitControlsRef}
            enabled={!cameraLocked} // 🔒 Désactivé quand verrouillé
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 6}
            enablePan
            panSpeed={0.5}
          />

          <EnhancedLighting />
          <Environment preset="sunset" />
          <EnhancedFloor />
          <VanModelRealistic vanType={vanType} />

          {objects.map(obj => (
            <DraggableFurniture3D 
              key={obj.id} 
              furniture={obj}
              selectedId={selectedFurnitureId}
              onSelect={handleSelectFurniture}
            />
          ))}

          {showStats && <Stats />}
        </Canvas>
      </Suspense>

      <ControlsPanel3D
        selectedFurnitureId={selectedFurnitureId}
        transformMode={transformMode}
        onModeChange={setTransformMode}
        onDelete={handleDeleteSelected}
        onDuplicate={handleDuplicateSelected}
        onResetTransform={handleResetTransform}
      />

      <Stats3DOverlay />

      <div className="canvas-3d-overlay">
        <div className="controls-hint">
          <p><strong>🔒 {cameraLocked ? 'Caméra Verrouillée' : 'Caméra Libre'}</strong></p>
          <p><strong>⌨️ C</strong> : {cameraLocked ? 'Déverrouiller' : 'Verrouiller'} caméra</p>
          <p><strong>🎯 Clic sur meuble</strong> : Sélectionner</p>
          <p><strong>🎯 Glisser meuble</strong> : Déplacer (horizontal)</p>
          <p><strong>⬆️ Shift + Glisser</strong> : Déplacer (hauteur)</p>
          <p><strong>🔄 Clic droit sur meuble</strong> : Rotation</p>
          <p><strong>⌨️ Flèches</strong> : Déplacer sélection</p>
          <p><strong>⌨️ Page Up/Down</strong> : Hauteur</p>
          <p><strong>⌨️ R</strong> : Rotation 90°</p>
          <p><strong>⌨️ Suppr</strong> : Supprimer</p>
        </div>
      </div>

      <button 
        className="stats-toggle"
        onClick={() => setShowStats(!showStats)}
        title="Afficher/masquer les stats FPS"
      >
        📊
      </button>

      <button 
        className="camera-lock-toggle"
        onClick={() => setCameraLocked(!cameraLocked)}
        title={cameraLocked ? "Déverrouiller la caméra (C)" : "Verrouiller la caméra (C)"}
      >
        {cameraLocked ? '🔒' : '🔓'}
      </button>
    </div>
  );
};
