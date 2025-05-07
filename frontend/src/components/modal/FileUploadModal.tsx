"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { FaFileExcel, FaUpload, FaTimes } from "react-icons/fa"
import "../../styles/components/file-upload-modal.css"

interface FileUploadModalProps {
    isOpen: boolean
    onClose: () => void
    onFileUpload: (file: File) => void
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onFileUpload }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Сброс выбранного файла при закрытии модального окна
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null)
        }
    }, [isOpen])

    // Обработчики для drag and drop
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isDragging) {
            setIsDragging(true)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Обработчик выбора файла
    const handleFileSelect = (file: File) => {
        // Проверяем, что файл имеет расширение Excel
        const validExcelTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel.sheet.macroEnabled.12",
            ".xls",
            ".xlsx",
            ".xlsm",
        ]

        const fileExtension = file.name.split(".").pop()?.toLowerCase()
        const isExcelFile =
            validExcelTypes.includes(file.type) || (fileExtension && [".xls", ".xlsx", ".xlsm"].includes(`.${fileExtension}`))

        if (isExcelFile) {
            setSelectedFile(file)
        } else {
            alert("Пожалуйста, выберите файл Excel (.xls, .xlsx или .xlsm)")
        }
    }

    // Обработчик нажатия на кнопку выбора файла
    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    // Обработчик изменения input[type="file"]
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Обработчик загрузки файла
    const handleUpload = () => {
        if (selectedFile) {
            onFileUpload(selectedFile)
            onClose()
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="file-upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Загрузка Excel файла</h3>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <div
                        className={`drop-zone ${isDragging ? "active" : ""} ${selectedFile ? "has-file" : ""}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={handleButtonClick}
                    >
                        {selectedFile ? (
                            <div className="selected-file">
                                <FaFileExcel className="file-icon excel" />
                                <div className="file-info">
                                    <span className="file-name">{selectedFile.name}</span>
                                    <span className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                                </div>
                            </div>
                        ) : (
                            <div className="drop-content">
                                <FaUpload className="upload-icon" />
                                <p>Перетащите Excel файл сюда или нажмите для выбора</p>
                                <span className="file-types">Поддерживаемые форматы: .xls, .xlsx, .xlsm</span>
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleInputChange}
                        accept=".xls,.xlsx,.xlsm,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        style={{ display: "none" }}
                    />
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="upload-button" onClick={handleUpload} disabled={!selectedFile}>
                        Загрузить
                    </button>
                </div>
            </div>
        </div>,
        modalRoot,
    )
}

export default FileUploadModal
