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
    scale = 0.01,
    vanDimensions,
}) => {
    const groupRef = useRef<THREE.Group>(null);

    // Charger le modèle GLB Mercedes-Benz Sprinter
    const { scene } = useGLTF('/assets/Van3DConfig/mercedes-benz_sprinter.glb');

    useEffect(() => {
        if (!groupRef.current || !scene) return;

        // Cloner la scène pour ne pas modifier l'original
        const clonedScene = scene.clone();

        // 📏 Calcul de l'échelle dynamique basé sur la BoundingBox réelle du modèle
        // D'abord, on réinitialise l'échelle pour mesurer les dimensions brutes
        clonedScene.scale.set(1, 1, 1);

        // Calculer la boîte englobante (Bounding Box)
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Appliquer l'échelle
        if (vanDimensions && size.x > 0 && size.y > 0 && size.z > 0) {
            // Conversion mm -> mètres (le monde 3D est en mètres)
            // Note: GLB width (X) = Van Width, Height (Y) = Van Height, Length (Z) = Van Length
            // Vérifier l'orientation du modèle : Souvent Z est la longueur (avant/arrière)

            const targetWidthInMeters = vanDimensions.width / 1000;
            const targetHeightInMeters = vanDimensions.height / 1000;
            const targetLengthInMeters = vanDimensions.length / 1000;

            const scaleX = targetWidthInMeters / size.x;
            const scaleY = targetHeightInMeters / size.y;
            const scaleZ = targetLengthInMeters / size.z;

            clonedScene.scale.set(scaleX, scaleY, scaleZ);
        } else {
            // Fallback si pas de dimensions : on utilise le scale prop par défaut
            clonedScene.scale.setScalar(scale);
        }

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
    }, [scene, wireframeColor, lineWidth, showMesh, meshOpacity, vanDimensions, scale]);

    return (
        <group ref={groupRef} rotation-y={Math.PI / 2}>
            {/* Le modèle sera ajouté dynamiquement via useEffect */}
        </group>
    );
};

// Précharger le modèle GLB
useGLTF.preload('/assets/Van3DConfig/mercedes-benz_sprinter.glb');
