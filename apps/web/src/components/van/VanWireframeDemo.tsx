// apps/web/src/components/van/VanWireframeDemo.tsx
// 🎨 Démo du modèle wireframe du van
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { VanModelWireframe } from './models/VanModelWireframe';

export const VanWireframeDemo: React.FC = () => {
    const [wireframeColor, setWireframeColor] = useState('#00ffff');
    const [showMesh, setShowMesh] = useState(false);
    const [meshOpacity, setMeshOpacity] = useState(0.1);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            {/* Canvas 3D */}
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={50} />
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={3}
                    maxDistance={20}
                    target={[0, 1, 0]}
                />

                {/* Lumières */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, 5, -5]} intensity={0.5} color="#4a90e2" />

                {/* Grille au sol */}
                <Grid
                    args={[20, 20]}
                    cellSize={0.5}
                    cellColor="#6e6e6e"
                    sectionColor="#9d4edd"
                    fadeDistance={30}
                    fadeStrength={1}
                    position={[0, -0.01, 0]}
                />

                {/* Van en wireframe */}
                <VanModelWireframe
                    wireframeColor={wireframeColor}
                    showMesh={showMesh}
                    meshOpacity={meshOpacity}
                />

                {/* Sol invisible pour recevoir les ombres */}
                <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <shadowMaterial opacity={0.3} />
                </mesh>
            </Canvas>

            {/* Panneau de contrôle */}
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '20px',
                    borderRadius: '10px',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                    minWidth: '250px',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
                    🔲 Wireframe Controls
                </h3>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                        Couleur du wireframe
                    </label>
                    <input
                        type="color"
                        value={wireframeColor}
                        onChange={(e) => setWireframeColor(e.target.value)}
                        style={{ width: '100%', height: '40px', cursor: 'pointer' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showMesh}
                            onChange={(e) => setShowMesh(e.target.checked)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px' }}>Afficher le maillage</span>
                    </label>
                </div>

                {showMesh && (
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                            Opacité du maillage: {meshOpacity.toFixed(2)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={meshOpacity}
                            onChange={(e) => setMeshOpacity(parseFloat(e.target.value))}
                            style={{ width: '100%', cursor: 'pointer' }}
                        />
                    </div>
                )}

                <div style={{
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '12px',
                    color: '#aaa'
                }}>
                    <p style={{ margin: '0 0 5px 0' }}>
                        🖱️ <strong>Souris:</strong> Rotation
                    </p>
                    <p style={{ margin: '0 0 5px 0' }}>
                        🔄 <strong>Scroll:</strong> Zoom
                    </p>
                    <p style={{ margin: 0 }}>
                        📦 <strong>Modèle:</strong> Mercedes-Benz Sprinter
                    </p>
                </div>
            </div>

            {/* Crédit */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    color: '#aaa',
                    fontSize: '11px',
                    maxWidth: '600px',
                }}
            >
                Model: <a href="https://sketchfab.com/3d-models/mercedes-benz-sprinter-152f62800be34652af0545487129ca2e" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>Mercedes-Benz Sprinter</a> by <a href="https://sketchfab.com/savelliy07" target="_blank" rel="noopener noreferrer" style={{ color: '#00ffff' }}>Savelliy 07</a> (CC-BY-4.0)
            </div>
        </div>
    );
};
