// CreatePeriodModal.tsx
import type React from "react"
import { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "../../styles/components/create-period-modal.css"

interface CreatePeriodModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (periodName: string) => void
    isSubmitting: boolean
    error: string | null
}

const CreatePeriodModal: React.FC<CreatePeriodModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, error }) => {
    const [periodYear, setPeriodYear] = useState<string>("")
    const [isValid, setIsValid] = useState<boolean>(false)

    // Проверка валидности ввода
    useEffect(() => {
        // Проверяем, что введено ровно 4 цифры
        setIsValid(/^\d{4}$/.test(periodYear))
    }, [periodYear])

    // Обработчик изменения ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Разрешаем только цифры
        const value = e.target.value.replace(/\D/g, "")
        // Ограничиваем длину до 4 символов
        setPeriodYear(value.slice(0, 4))
    }

    // Обработчик отправки формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isValid && !isSubmitting) {
            onSubmit(periodYear)
        }
    }

    if (!isOpen) return null

    // Проверяем, существует ли modal-root и доступен ли document
    const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") : null

    if (!modalRoot) {
        console.error('Modal root element not found. Ensure <div id="modal-root"> exists in index.html.')
        return null
    }

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Создать новый период</h3>
                    <button className="modal-close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="periodYear">Год периода:</label>
                            <input
                                type="text"
                                id="periodYear"
                                value={periodYear}
                                onChange={handleInputChange}
                                placeholder="Введите год (например, 2025)"
                                className="form-control"
                                autoFocus
                            />
                            <small className="form-text">Введите 4 цифры года</small>
                        </div>

                        {error && (
                            <div className="modal-error">
                                <p>{error}</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="modal-button cancel" onClick={onClose} disabled={isSubmitting}>
                            Отмена
                        </button>
                        <button type="submit" className="modal-button submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? "Создание..." : "Создать"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        modalRoot,
    )
}

export default CreatePeriodModal
