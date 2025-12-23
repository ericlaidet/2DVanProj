import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserGuide.css';

const UserGuide: React.FC = () => {
    const navigate = useNavigate();
    const contentRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="help-center-page">
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Retour au planning
            </button>

            <div className="help-center-layout">
                {/* Sidebar Navigation */}
                <aside className="help-sidebar">
                    <div className="sidebar-sticky">
                        <h3>Sommaire</h3>
                        <nav className="toc-nav">
                            <button onClick={() => scrollToSection('intro')}>1. Introduction</button>
                            <button onClick={() => scrollToSection('getting-started')}>2. Prise en Main</button>
                            <button onClick={() => scrollToSection('2d-mode')}>3. Mode Aménagement 2D</button>
                            <button onClick={() => scrollToSection('3d-mode')}>4. Visualisation 3D</button>
                            <button onClick={() => scrollToSection('export')}>5. Export PDF & Quotas</button>
                            <button onClick={() => scrollToSection('save-load')}>6. Sauvegarde & Gestion</button>
                            <button onClick={() => scrollToSection('shortcuts')}>7. Raccourcis Clavier</button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="help-content" ref={contentRef}>
                    <section id="intro" className="help-section">
                        <h1>🚐 Manuel d'Utilisation 2DVanProj</h1>
                        <p className="lead-text">
                            Bienvenue dans votre outil professionnel de conception d'aménagement.
                            Ce guide vous aidera à maîtriser toutes les fonctionnalités pour créer le plan de vos rêves.
                        </p>
                        <div className="info-card">
                            <strong>Note :</strong> L'application est optimisée pour une utilisation sur ordinateur avec souris pour une précision maximale.
                        </div>
                    </section>

                    <section id="getting-started" className="help-section">
                        <h2>1. Prise en Main</h2>
                        <p>
                            Tout commence par le choix de votre véhicule. Dans le menu de gauche, sélectionnez votre modèle parmi
                            plus de 20 configurations prédéfinies (Sprinter, Ducato, Master...).
                        </p>
                        <div className="feature-illustration">
                            <img src="/assets/guide/2d_workspace.png" alt="Interface 2D" />
                            <p className="caption">L'interface s'adapte automatiquement aux dimensions réelles du véhicule choisi.</p>
                        </div>
                    </section>

                    <section id="2d-mode" className="help-section">
                        <h2>2. Mode Aménagement 2D</h2>
                        <p>C'est votre espace de travail principal pour le positionnement précis du mobilier.</p>

                        <div className="workflow-grid">
                            <div className="workflow-item">
                                <h4>➕ Ajouter</h4>
                                <p>Utilisez la palette d'objets pour créer des éléments personnalisés (Lits, Cuisine, Rangements).</p>
                            </div>
                            <div className="workflow-item">
                                <h4>🖱️ Positionner</h4>
                                <p>Cliquez et glissez pour déplacer. Les collisions sont gérées automatiquement pour éviter les chevauchements.</p>
                            </div>
                            <div className="workflow-item">
                                <h4>🔄 Pivoter</h4>
                                <p>Faites un <strong>double-clic</strong> sur un objet pour le faire tourner de 90° instantanément.</p>
                            </div>
                            <div className="workflow-item">
                                <h4>⚙️ Éditer</h4>
                                <p>Utilisez <strong>Shift + Clic</strong> pour ouvrir la fenêtre de modification des dimensions et couleurs.</p>
                            </div>
                        </div>
                    </section>

                    <section id="3d-mode" className="help-section">
                        <h2>3. Visualisation 3D</h2>
                        <p>Validez les volumes et l'ergonomie de votre projet en temps réel.</p>
                        <div className="feature-illustration">
                            <img src="/assets/guide/3d_view.png" alt="Vue 3D" />
                        </div>
                        <div className="controls-box">
                            <h4>Contrôles Caméra</h4>
                            <ul>
                                <li><strong>Rotation :</strong> Clic gauche + glisser</li>
                                <li><strong>Panoramique :</strong> Clic droit + glisser</li>
                                <li><strong>Zoom :</strong> Molette</li>
                                <li><strong>Touche C :</strong> Verrouiller/Déverrouiller la rotation</li>
                            </ul>
                        </div>
                    </section>

                    <section id="ai-mode" className="help-section ai-highlight">
                        <h2>🧠 Assistant IA (PRO)</h2>
                        <div className="ai-content-flex">
                            <div className="ai-text">
                                <p>Gagnez du temps en laissant l'IA générer des propositions d'aménagement selon vos besoins.</p>
                                <p>Décrivez simplement votre souhait (ex: "Un lit peigne à l'arrière et une cuisine côté conducteur") et l'IA s'occupe du reste.</p>
                            </div>
                            <div className="ai-image-small">
                                <img src="/assets/guide/ai_generation.png" alt="IA Assistant" />
                            </div>
                        </div>
                    </section>

                    <section id="export" className="help-section">
                        <h2>4. Export PDF & Quotas</h2>
                        <p>Générez un dossier de conception complet incluant vos plans 2D, visuels 3D et la liste du mobilier.</p>
                        <div className="export-hint">
                            <img src="/assets/guide/export_pdf.png" alt="PDF Export" className="export-icon" />
                            <div>
                                <h4>Où trouver l'export ?</h4>
                                <p>Le bouton est situé juste au-dessus du canvas principal. Votre quota restant (ex: 1/3) est affiché juste à côté.</p>
                            </div>
                        </div>
                    </section>

                    <section id="shortcuts" className="help-section">
                        <h2>5. Raccourcis Clavier</h2>
                        <div className="shortcuts-table-container">
                            <table className="modern-table">
                                <thead>
                                    <tr>
                                        <th>Raccourci</th>
                                        <th>Contexte</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><kbd>Double-Clic</kbd></td>
                                        <td>Meuble (2D/3D)</td>
                                        <td>Pivoter (2D) ou Éditer (3D)</td>
                                    </tr>
                                    <tr>
                                        <td><kbd>Shift + Clic</kbd></td>
                                        <td>Meuble (2D)</td>
                                        <td>Ouvrir le menu d'édition</td>
                                    </tr>
                                    <tr>
                                        <td><kbd>Clic Droit</kbd></td>
                                        <td>Meuble (2D)</td>
                                        <td>Supprimer l'objet</td>
                                    </tr>
                                    <tr>
                                        <td><kbd>Touche C</kbd></td>
                                        <td>Vue 3D</td>
                                        <td>Verrouiller la caméra</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default UserGuide;
