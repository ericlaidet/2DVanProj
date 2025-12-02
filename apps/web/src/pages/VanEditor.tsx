// apps/web/src/pages/VanEditor.tsx
import React, { useState } from "react";
import { useModal } from "@/components/ui/ModalProvider";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { RenameModal } from "@/components/modals/RenameModal";
import { SubscriptionModal } from "@/components/modals/SubscriptionModal";
import { VanModalSelector } from "@/components/van/VanModalSelector";
import VanWorkspace from "@/components/van/VanWorkspace"; // ✅ AJOUT
import { FurniturePalette } from "@/components/van/FurniturePalette"; // ✅ AJOUT
import { useStore } from "@/store/store"; // ✅ AJOUT
import { savePlan } from "@/api/plans";
import "./VanEditor.css";

export default function VanEditor() {
  const { showModal } = useModal();
  
  // ✅ Utiliser le store au lieu du state local
  const vanType = useStore(s => s.vanType);
  const setVanType = useStore(s => s.setVanType);
  const objects = useStore(s => s.objects);

  const [planName, setPlanName] = useState("Plan " + new Date().toLocaleDateString());

  // --- Modal Handlers ---
  const handleSelectVan = () => {
    showModal(
      <VanModalSelector
        selectedVan={vanType}
        onSelect={(selectedVanType) => {
          setVanType(selectedVanType); // ✅ Mettre à jour le store
          console.log("Van choisi :", selectedVanType);
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

          if (!vanType) {
            console.error("Veuillez sélectionner un van valide !");
            return;
          }

          const payload = {
            name: finalName,
            jsonData: objects, // ✅ Sauvegarder les objets du store
            vanTypes: [vanType],
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
        <h1>Plan your Van - Éditeur 2D/3D</h1>
        <div className="user-info">
          <button onClick={handleSubscription} className="link">Abonnement</button>
        </div>
      </header>

      <nav className="van-editor-nav">
        <button>Plans</button>
        <button>Profil</button>
        <button>Paramètres</button>
      </nav>

      {/* ✅ Section IA (optionnel, garde si tu veux) */}
      {/* 
      <section className="van-section prompt">
        <h2>Prompt IA</h2>
        <p>Décrivez votre aménagement idéal :</p>
        <textarea placeholder="Ex : je veux un lit transversal à l'arrière..." />
        <div className="options">
          <label><input type="checkbox" /> Cuisine</label>
          <label><input type="checkbox" /> Rangements</label>
          <button>Optimiser</button>
          <button>Générer layout</button>
        </div>
      </section>
      */}

      {/* ✅ WORKSPACE PRINCIPAL */}
      <section className="van-section workspace">
        <div className="workspace-toolbar">
          <button onClick={handleSelectVan}>
            {vanType || "Sélectionner un van"}
          </button>
          <div className="workspace-actions">
            <button onClick={handleSave}>Sauvegarder</button>
            <button onClick={handleDelete}>Supprimer</button>
          </div>
        </div>
        
        {/* ✅ INTÉGRATION DU WORKSPACE + PALETTE */}
        <div className="workspace-layout">
          {/* Palette de meubles à gauche */}
          <aside className="furniture-palette-sidebar">
            <FurniturePalette />
          </aside>
          
          {/* Espace de travail principal */}
          <main className="workspace-main">
            <VanWorkspace />
          </main>
        </div>
      </section>
    </div>
  );
}
