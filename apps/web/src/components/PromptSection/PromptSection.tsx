import React, { useState } from "react";
import Button from "../buttons/Button";

const PromptSection: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="bg-gray-100 rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-2">Prompt IA</h2>
      <p className="mb-3 text-sm text-gray-700">Décrivez votre aménagement idéal :</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: je veux un lit transversal à l’arrière, une kitchenette compact côté droit..."
        className="w-full p-3 rounded-md border border-gray-300 bg-white mb-4"
        rows={3}
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Cuisine
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Rangements
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="gray">Optimiser</Button>
        <Button variant="gray">Générer layout</Button>
      </div>
    </section>
  );
};

export default PromptSection;

