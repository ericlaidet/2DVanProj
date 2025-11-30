import React, { useState } from "react";
import { useModal } from "@/components/ui/ModalProvider";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { RenameModal } from "@/components/modals/RenameModal";
import { SubscriptionModal } from "@/components/modals/SubscriptionModal";
import { VanModalSelector } from "@/components/van/VanModalSelector";
import { savePlan } from "@/api/plans";
import "./VanEditor.css";

// Pour test rapide : valeur valide pour éviter le 400
const DEFAULT_VAN = "VOLKSWAGEN_ID_BUZZ";

export default function VanEditor() {
  const { showModal } = useModal();

  const [selectedVans, setSelectedVans] = useState<string[]>([DEFAULT_VAN]);
  const [planName, setPlanName] = useState("Plan " + new Date().toLocaleDateString());

  // --- Modal Handlers ---
  const handleSelectVan = () => {
    showModal(
      <VanModalSelector
        selectedVan={selectedVans[0]}
        onSelect={(vanType) => {
          setSelectedVans([vanType]);
          console.log("Van choisi :", vanType);
        }}
      />,
      "Choisir un van"
    );
  };

  const handleSave = () => {
    showModal(
      <RenameModal
        plan={{ id: 1, name: planName }}
        onClose={async (newName) => {
          const finalName = newName?.trim() || planName;

          if (!finalName) {
            console.error("Le nom du plan ne peut pas être vide !");
            return;
          }

          if (!selectedVans.length) {
            console.error("Veuillez sélectionner au moins un van valide !");
            return;
          }

          const payload = {
            name: newName || planName
            jsonData: [], // futur contenu 2D
            vanTypes: selectedVans, // tableau avec les valeurs exactes du backend
          };

          try {
            await savePlan(payload);
            console.log(`💾 Plan "${payload.name}" sauvegardé !`);
          } catch (err) {
            console.error("Erreur lors de la sauvegarde :", err);
          }
        }}
      />,
      "Renommer / Sauvegarder"
    );
  };

  const handleDelete = () => {
    showModal(
      <ConfirmModal
        message="Voulez-vous vraiment supprimer ce plan ?"
        onConfirm={() => console.log("Plan supprimé")}
        onCancel={() => console.log("Suppression annulée")}
      />,
      "Supprimer le plan"
    );
  };

  const handleSubscription = () => {
    showModal(
      <SubscriptionModal
        message="Fonctionnalité réservée aux abonnés Pro."
        onClose={() => {}}
      />,
      "Abonnement"
    );
  };

  return (
    <div className="van-editor">
      <header className="van-editor-header">
        <h1>Plan your Van - Éditeur 2D</h1>
        <div className="user-info">
          
          <button onClick={handleSubscription} className="link">Abonnement</button>
        </div>
      </header>

      <nav className="van-editor-nav">
        <button>Plans</button>
        <button>Profil</button>
        <button>Paramètres</button>
      </nav>

      <section className="van-section prompt">
        <h2>Prompt IA</h2>
        <p>Décrivez votre aménagement idéal :</p>
        <textarea placeholder="Ex : je veux un lit transversal à l’arrière..." />
        <div className="options">
          <label><input type="checkbox" /> Cuisine</label>
          <label><input type="checkbox" /> Rangements</label>
          <button>Optimiser</button>
          <button>Générer layout</button>
        </div>
      </section>

      <section className="van-section workspace">
        <h2>Espace travail Van</h2>
        <div className="workspace-toolbar">
          <button onClick={handleSelectVan}>
            {selectedVans[0] || "Sélectionner un van"}
          </button>
          <div className="workspace-actions">
            <button onClick={handleSave}>Sauvegarder</button>
            <button onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
        <div className="workspace-area">
          <p>Zone d’édition 2D (future intégration de votre éditeur ici)</p>
        </div>
      </section>
    </div>
  );
}
