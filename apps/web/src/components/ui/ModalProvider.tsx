import React, { createContext, useContext, useState } from "react";
import Modal from "./ModalBase";

interface ModalContextProps {
  showModal: (content: React.ReactNode, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>();

  const showModal = (content: React.ReactNode, title?: string) => {
    setContent(content);
    setTitle(title);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} title={title}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
};
