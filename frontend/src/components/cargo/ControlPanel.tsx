"use client"

// ControlPanel.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { FaSearch, FaPlus, FaUser, FaTruck, FaChartBar, FaCar } from "react-icons/fa"
import CreatePeriodModal from "../modal/CreatePeriodModal"
import { fetchPeriods, createPeriod, type Period } from "../../services/periodService"
import "../../styles/components/control-panel.css"

// Добавляем импорт нового компонента в начале файла
import FileUploadModal from "../modal/FileUploadModal"

interface ControlPanelProps {
    onSearch?: (query: string) => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
    const [periods, setPeriods] = useState<Period[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [modalError, setModalError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Добавляем состояние для управления модальным окном после объявления других состояний
    const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false)

    // Загрузка периодов при монтировании компонента
    useEffect(() => {
        void loadPeriods()
    }, [])

    // Функция загрузки периодов
    const loadPeriods = async () => {
        try {
            setIsLoading(true)
            setLoadError(null)

            // Проверяем наличие токена
            const token = localStorage.getItem("token")
            if (!token) {
                setLoadError("Токен авторизации отсутствует. Пожалуйста, войдите в систему.")
                return
            }

            const data = await fetchPeriods()
            setPeriods(data)
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка"
            console.error("Ошибка при загрузке периодов:", errorMessage)
            setLoadError(errorMessage || "Не удалось загрузить периоды. Проверьте соединение с сервером.")
        } finally {
            setIsLoading(false)
        }
    }

    // Обработчик создания периода
    const handleCreatePeriod = async (periodYear: string) => {
        try {
            setIsSubmitting(true)
            setModalError(null)

            // Проверяем наличие токена
            const token = localStorage.getItem("token")
            if (!token) {
                setModalError("Необходима авторизация. Пожалуйста, войдите в систему.")
                return
            }

            const newPeriod = await createPeriod(periodYear)
            setPeriods((prevPeriods) => [...prevPeriods, newPeriod])
            setSelectedPeriod(newPeriod.period_name)
            setIsCreateModalOpen(false)
        } catch (err: Error | unknown) {
            const errorMessage = err instanceof Error ? err.message : "Неизвестная ошибка"
            console.error("Ошибка при создании периода:", errorMessage)
            setModalError(errorMessage || "Не удалось создать период")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Добавляем обработчик загрузки файла
    const handleFileUpload = (file: File) => {
        console.log("Файл выбран:", file.name)
        // Здесь будет логика обработки файла, которую мы добавим позже
    }

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchQuery)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const colorFormats = [
        { color: "#FF5252", label: "Срочно" },
        { color: "#FFD740", label: "Важно" },
        { color: "#69F0AE", label: "Выполнено" },
        { color: "#40C4FF", label: "В процессе" },
    ]

    return (
        <>
            <div className="control-panel">
                <div className="control-panel-left">
                    {/* Изменяем кнопку "Добавить" в разделе control-panel-left, чтобы она открывала модальное окно */}
                    <div className="control-group">
                        <div className="control-header">Добавить</div>
                        <button className="control-button" onClick={() => setIsFileUploadModalOpen(true)}>
                            <FaPlus /> Добавить
                        </button>
                    </div>

                    <div className="control-divider"></div>

                    <div className="control-group">
                        <div className="control-header">Период</div>
                        <div className="period-controls">
                            <select
                                className="period-select"
                                value={selectedPeriod || ""}
                                onChange={(e) => setSelectedPeriod(e.target.value || null)}
                                disabled={isLoading || !!loadError}
                            >
                                {periods.map((period) => (
                                    <option key={period.period_id} value={period.period_name}>
                                        {period.period_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="control-button small"
                                onClick={() => setIsCreateModalOpen(true)}
                                disabled={!!loadError}
                            >
                                Создать
                            </button>
                            {loadError && (
                                <button className="control-button small" onClick={loadPeriods} title="Повторить загрузку">
                                    Повторить
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="control-divider"></div>

                    <div className="control-group">
                        <div className="control-header">Формат</div>
                        <div className="color-formats">
                            {colorFormats.map((format, index) => (
                                <div key={index} className="color-format-item">
                                    <div className="color-square" style={{ backgroundColor: format.color }} title={format.label}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="control-divider"></div>

                    <div className="control-group">
                        <div className="control-header">Отгрузка</div>
                        <div className="button-group">
                            <button className="control-button small">Создать</button>
                            <button className="control-button small">Отгрузить</button>
                        </div>
                    </div>

                    <div className="control-divider"></div>

                    <div className="control-group">
                        <div className="control-header">Приёмка</div>
                        <div className="button-group">
                            <button className="control-button small">Создать</button>
                            <button className="control-button small">Принять</button>
                        </div>
                    </div>
                </div>

                <div className="control-panel-center">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                </div>

                <div className="control-panel-right">
                    <button className="action-button">
                        <FaUser />
                        <span>Клиенты</span>
                    </button>
                    <button className="action-button">
                        <FaTruck />
                        <span>Водители</span>
                    </button>
                    <button className="action-button">
                        <FaChartBar />
                        <span>Статистика</span>
                    </button>
                    <button className="action-button">
                        <FaCar />
                        <span>Машины</span>
                    </button>
                </div>
            </div>

            {/* Модальное окно создания периода */}
            <CreatePeriodModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false)
                    setModalError(null) // Сбрасываем ошибку при закрытии
                }}
                onSubmit={handleCreatePeriod}
                isSubmitting={isSubmitting}
                error={modalError}
            />

            {/* Добавляем модальное окно в конец компонента, перед закрывающим тегом <> */}
            {/* Модальное окно загрузки файла */}
            <FileUploadModal
                isOpen={isFileUploadModalOpen}
                onClose={() => setIsFileUploadModalOpen(false)}
                onFileUpload={handleFileUpload}
            />
        </>
    )
}

export default ControlPanel
