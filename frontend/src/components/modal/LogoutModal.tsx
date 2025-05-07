import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/components/logout-modal.css';

interface ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
}

const LogoutModal: React.FC<ModalProps> = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    // Проверяем, существует ли modal-root и доступен ли document
    const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

    if (!modalRoot) {
        console.error('Modal root element not found. Ensure <div id="modal-root"> exists in index.html.');
        return null;
    }

    return ReactDOM.createPortal(
        <div className="logout-modal" onClick={(e) => e.target === e.currentTarget && onCancel()}>
            <div className="logout-modal-content">
                <p>{message}</p>
                <div className="logout-modal-buttons">
                    <button id="confirm-button" onClick={onConfirm}>
                        Да
                    </button>
                    <button id="cancel-button" onClick={onCancel}>
                        Нет
                    </button>
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default LogoutModal;