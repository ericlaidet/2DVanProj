// apps/web/src/components/van/models/VanModelWireframe.tsx
// 🔲 Van en mode wireframe utilisant le modèle Mercedes-Benz Sprinter GLB
import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface VanModelWireframeProps {
    /** Couleur du wireframe (par défaut: cyan électrique) */
    wireframeColor?: string;
    /** Épaisseur des lignes du wireframe (par défaut: 2) */
    lineWidth?: number;
    /** Afficher le maillage solide en transparence derrière (par défaut: false) */
    showMesh?: boolean;
    /** Opacité du maillage si affiché (par défaut: 0.1) */
    meshOpacity?: number;
    /** Échelle du modèle pour l'adapter au canvas (par défaut: 0.01) */
    scale?: number;
    /** Dimensions du van en mm pour scaling adaptatif [largeur, hauteur, longueur] */
    vanDimensions?: { width: number; height: number; length: number };
}

export const VanModelWireframe: React.FC<VanModelWireframeProps> = ({
    wireframeColor = '#00ffff',
    lineWidth = 2,
    showMesh = false,
    meshOpacity = 0.1,
    scale = 0.01, // 🚀 Augmenté de 0.003 à 0.01 pour meilleure visibilité
    vanDimensions,
}) => {
    const groupRef = useRef<THREE.Group>(null);

    // Charger le modèle GLB Mercedes-Benz Sprinter
    const { scene } = useGLTF('/assets/Van3DConfig/mercedes-benz_sprinter.glb');

    // 📐 Calculer le scale adaptatif basé sur les dimensions du van
    // Le Sprinter de base mesure environ: L=5900mm, W=1993mm, H=1940mm (intérieur)
    const BASE_SPRINTER_DIMENSIONS = { length: 5900, width: 1993, height: 1940 };

    const calculateAdaptiveScale = (): [number, number, number] => {
        if (!vanDimensions) {
            // Scale uniforme si pas de dimensions spécifiées
            return [scale, scale, scale];
        }

        // Calculer les ratios pour étirer sur chaque axe
        const scaleX = (vanDimensions.width / BASE_SPRINTER_DIMENSIONS.width) * scale;
        const scaleY = (vanDimensions.height / BASE_SPRINTER_DIMENSIONS.height) * scale;
        const scaleZ = (vanDimensions.length / BASE_SPRINTER_DIMENSIONS.length) * scale;

        return [scaleX, scaleY, scaleZ];
    };

    const adaptiveScale = calculateAdaptiveScale();

    useEffect(() => {
        if (!groupRef.current || !scene) return;

        // Cloner la scène pour ne pas modifier l'original
        const clonedScene = scene.clone();

        // Parcourir tous les meshes et appliquer le matériau wireframe
        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Créer les edges geometry pour un meilleur rendu wireframe
                const edges = new THREE.EdgesGeometry(child.geometry, 15); // 15 degrés threshold
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: wireframeColor,
                    linewidth: lineWidth,
                    transparent: true,
                    opacity: 0.9,
                });

                const wireframe = new THREE.LineSegments(edges, lineMaterial);
                wireframe.position.copy(child.position);
                wireframe.rotation.copy(child.rotation);
                wireframe.scale.copy(child.scale);

                // Ajouter le wireframe au parent du mesh
                if (child.parent) {
                    child.parent.add(wireframe);
                }

                // Si showMesh est activé, rendre le mesh transparent
                if (showMesh) {
                    const material = child.material as THREE.Material;
                    if (material) {
                        const transparentMaterial = material.clone();
                        transparentMaterial.transparent = true;
                        transparentMaterial.opacity = meshOpacity;
                        transparentMaterial.depthWrite = false;
                        child.material = transparentMaterial;
                    }
                } else {
                    // Sinon, cacher le mesh complètement
                    child.visible = false;
                }
            }
        });

        // Nettoyer le groupe et ajouter la scène clonée
        while (groupRef.current.children.length > 0) {
            groupRef.current.remove(groupRef.current.children[0]);
        }
        groupRef.current.add(clonedScene);

        return () => {
            // Cleanup
            clonedScene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        };
    }, [scene, wireframeColor, lineWidth, showMesh, meshOpacity]);

    return (
        <group ref={groupRef} scale={adaptiveScale} rotation-y={Math.PI}>
            {/* Le modèle sera ajouté dynamiquement via useEffect */}
        </group>
    );
};

// Précharger le modèle GLB
useGLTF.preload('/assets/Van3DConfig/mercedes-benz_sprinter.glb');
