// ----------------------------------------------------------------------------
// 15. MODAL COMPONENTS - Subscription (modals/SubscriptionModal.tsx)
// ----------------------------------------------------------------------------
interface SubscriptionProps {
  message: string;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionProps> = ({ message, onClose }) => {
  return (
    <div className="subscription-modal">
      <p>{message}</p>
      <p>Passez à un abonnement Pro pour débloquer cette fonctionnalité.</p>
      <div className="modal-actions">
        <button onClick={onClose} className="cancel">
          Fermer
        </button>
        <button 
          onClick={() => {
            onClose();
            // Navigate to plans page
            window.location.hash = '#plans';
          }} 
          className="confirm"
        >
          Voir les abonnements
        </button>
      </div>
    </div>
  );
};
