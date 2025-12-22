import React from "react";
import VanSelector from "../van/VanSelector";
import FurniturePalette from "../van/FurniturePalette";
import "./WorkArea.css";

const WorkArea: React.FC = () => {
  return (
    <section className="section-card workarea-container">
      <h2 className="section-title">Espace travail Van</h2>
      <div className="grid-cols-2">
        <div className="workarea-left-col">
          <VanSelector userSubscription="PRO1" />
        </div>
        <div className="workarea-right-col">
          <h3 className="workarea-palette-title">Palette d’objets</h3>
          <FurniturePalette />
        </div>
      </div>

      <div className="workarea-canvas-placeholder">
        <span className="placeholder-text">Zone de dessin 2D</span>
      </div>
    </section>
  );
};

export default WorkArea;

