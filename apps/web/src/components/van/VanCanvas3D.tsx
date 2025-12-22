// apps/web/src/components/van/VanCanvas3D.tsx
import React, { Suspense, useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment } from '@react-three/drei';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { VanModelWireframe } from './models/VanModelWireframe';
import { DraggableFurniture3D } from './DraggableFurniture3D';
// import { ControlsPanel3D } from './ControlsPanel3D';
import { calculateVolumeUsage } from '../../utils/coordinates3D';
import { notify } from '../../utils/notify';
import * as THREE from 'three';
import './VanCanvas3D.css';

// ✨ Sol avec grille optimisé pour un van
const EnhancedFloor: React.FC = () => {
  return (
    <>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.01, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <Grid
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#cccccc"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#999999"
        fadeDistance={8}
        fadeStrength={1}
        position={[0, 0, 0]}
      />
    </>
  );
};

// ⚡ Éclairage ultra-simplifié pour performance maximale (60fps)
const EnhancedLighting: React.FC = () => {
  return (
    <>
      {/* Éclairage minimal sans ombres */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
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
export const VanCanvas3D: React.FC<{ onEdit?: (id: string) => void }> = ({ onEdit }) => {
  const objects = useStore(s => s.objects);
  const vanType = useStore(s => s.vanType);
  const addObject = useStore(s => s.addObject);
  const updateObject = useStore(s => s.updateObject);
  const removeObject = useStore(s => s.removeObject);

  /* showStats removed */
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [cameraLocked, setCameraLocked] = useState(true); // 🔒 Caméra verrouillée par défaut
  const [objectsLocked, setObjectsLocked] = useState(false); // 🧱 Objets déverrouillés par défaut (Click & Drag)
  const [showControls, setShowControls] = useState(false); // Dropdown des commandes fermé par défaut
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
          camera={{ position: [8, 6, 8], fov: 50 }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
          }}
          onClick={handleDeselectAll}
        >
          <color attach="background" args={['#e0f2fe']} />

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
          {/* <Environment preset="sunset" /> */}
          {/* Environment désactivé pour éviter l'erreur de chargement HDR - l'éclairage manuel suffit */}
          <EnhancedFloor />
          <VanModelWireframe
            vanDimensions={
              vanType
                ? {
                  width: VAN_TYPES.find(v => v.vanType === vanType)?.width || 2000,
                  height: VAN_TYPES.find(v => v.vanType === vanType)?.height || 2000,
                  length: VAN_TYPES.find(v => v.vanType === vanType)?.length || 5000
                }
                : undefined
            }
          />

          {objects.map(obj => (
            <DraggableFurniture3D
              key={obj.id}
              furniture={obj}
              selectedId={selectedFurnitureId}
              onSelect={handleSelectFurniture}
              onEdit={onEdit}
              locked={objectsLocked}
            />
          ))}


          {/* showStats check removed */}
        </Canvas>
      </Suspense>

      {/* <ControlsPanel3D
        selectedFurnitureId={selectedFurnitureId}
        transformMode={transformMode}
        onModeChange={setTransformMode}
        onDelete={handleDeleteSelected}
        onDuplicate={handleDuplicateSelected}
        onResetTransform={handleResetTransform}
      /> */}

      {/* Camera status - centered bottom */}
      <div className="camera-status-centered">
        <strong>🔒 {cameraLocked ? 'Caméra Verrouillée' : 'Caméra Libre'}</strong>
      </div>

      {/* Controls - bottom left */}
      <div className="canvas-3d-controls-bottom">
        {/* Collapsible controls */}
        <div className="controls-dropdown">
          <button
            className="controls-toggle"
            onClick={() => setShowControls(!showControls)}
            title="Afficher/masquer les commandes"
          >
            {showControls ? '▼' : '▲'} Commandes
          </button>

          {showControls && (
            <div className="controls-list">
              <p><strong>🎯 Clic sur meuble</strong> : Sélectionner</p>
              <p><strong>🖱️ Double-clic</strong> : Éditer</p>
              <p><strong>🎯 Glisser meuble</strong> : Déplacer (horizontal)</p>
              <p><strong>⬆️ Shift + Glisser</strong> : Déplacer (hauteur)</p>
              <p><strong>🎯 Ctrl + Glisser</strong> : Déplacer (profondeur)</p>
              <p><strong>⌨️ Suppr</strong> : Supprimer</p>
            </div>
          )}
        </div>

        {/* Camera block hint */}
        <div className="camera-hint">
          ⌨️ C : {cameraLocked ? 'Déverrouiller' : 'Verrouiller'} caméra
        </div>
      </div>

      {/* Toggle Verrouillage Objets (Bottom Right) */}
      <button
        className="object-lock-toggle"
        onClick={() => setObjectsLocked(!objectsLocked)}
        title={objectsLocked ? "Déverrouiller les objets" : "Verrouiller les objets (Protection déplacements)"}
      >
        {objectsLocked ? '🧱' : '🖐️'}
      </button>
    </div >
  );
};
