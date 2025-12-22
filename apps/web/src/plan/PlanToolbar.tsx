import React from "react";
import Button from "../buttons/Button";

interface PlanToolbarProps {
  onAdd?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

const PlanToolbar: React.FC<PlanToolbarProps> = ({ onAdd, onDelete, onExport }) => {
  return (
    <div className="flex-row flex-wrap gap-2 mb-4">
      {onAdd && <Button variant="green" onClick={onAdd}>Ajouter</Button>}
      {onDelete && <Button variant="red" onClick={onDelete}>Supprimer</Button>}
      {onExport && <Button variant="blue" onClick={onExport}>Exporter</Button>}
    </div>
  );
};

export default PlanToolbar;

