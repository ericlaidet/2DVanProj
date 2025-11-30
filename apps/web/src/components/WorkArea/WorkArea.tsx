import React from "react";
import VanSelector from "../van/VanSelector";
import FurniturePalette from "../van/FurniturePalette";

const WorkArea: React.FC = () => {
  return (
    <section className="bg-gray-100 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Espace travail Van</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <VanSelector userSubscription="PRO1" />
        </div>
        <div>
          <h3 className="font-medium mb-2">Palette d’objets</h3>
          <FurniturePalette />
        </div>
      </div>

      <div className="mt-6 bg-gray-300 h-80 rounded-xl flex items-center justify-center">
        <span className="text-gray-600">Zone de dessin 2D</span>
      </div>
    </section>
  );
};

export default WorkArea;

