import React, { useState } from "react";
import Button from "../buttons/Button";
import "./PromptSection.css";

const PromptSection: React.FC = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="section-card prompt-section">
      <h2 className="section-title">Prompt IA</h2>
      <p className="prompt-help-text">Décrivez votre aménagement idéal :</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: je veux un lit transversal à l’arrière, une kitchenette compact côté droit..."
        className="prompt-textarea w-full mb-4"
        rows={3}
      />

      <div className="flex-row flex-wrap gap-4 mb-4">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Cuisine
        </label>
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          Rangements
        </label>
      </div>

      <div className="flex-row gap-4">
        <Button variant="gray">Optimiser</Button>
        <Button variant="gray">Générer layout</Button>
      </div>
    </section>
  );
};

export default PromptSection;

