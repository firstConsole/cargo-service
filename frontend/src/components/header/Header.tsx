// Header.tsx
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { FaSuitcase, FaCashRegister, FaMoneyBillWave, FaExchangeAlt, FaCalendarAlt, FaUserCircle } from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom"
import LogoutModal from "../modal/LogoutModal"
import "../../styles/components/header.css"

const tabs = [
    { key: "cargo", icon: <FaSuitcase />, label: "Багаж" },
    { key: "kassa", icon: <FaCashRegister />, label: "Касса" },
    { key: "payments", icon: <FaMoneyBillWave />, label: "Платежи" },
    { key: "transitions", icon: <FaExchangeAlt />, label: "Переводы" },
    { key: "calendar", icon: <FaCalendarAlt />, label: "Календарь" },
]

const Header: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname
        if (path.includes("/kassa")) return "kassa"
        if (path.includes("/payments")) return "payments"
        if (path.includes("/transitions")) return "transitions"
        if (path.includes("/calendar")) return "calendar"
        return "cargo" // default tab
    }

    const [activeTab, setActiveTab] = useState(getActiveTab())

    // Update active tab when location changes
    useEffect(() => {
        setActiveTab(getActiveTab())
    }, [location])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        // Добавляем/удаляем класс для блюра фона
        if (isModalOpen) {
            document.body.classList.add("modal-open")
        } else {
            document.body.classList.remove("modal-open")
        }
    }, [isModalOpen])

    const handleLogout = () => {
        setIsModalOpen(true)
    }

    const confirmLogout = () => {
        localStorage.removeItem("token")
        window.location.href = "/login"
        setIsModalOpen(false)
    }

    const cancelLogout = () => {
        setIsModalOpen(false)
    }

    // Handle tab click with navigation
    const handleTabClick = (tabKey: string) => {
        setActiveTab(tabKey)

        // Navigate to the appropriate route
        switch (tabKey) {
            case "cargo":
                navigate("/")
                break
            case "kassa":
                navigate("/kassa")
                break
            case "payments":
                navigate("/payments")
                break
            case "transitions":
                navigate("/transitions")
                break
            case "calendar":
                navigate("/calendar")
                break
            default:
                navigate("/")
        }
    }

    return (
        <>
            <header className="glass-header">
                <div className="tabs-wrapper">
                    <div className="tabs">
                        {tabs.map((tab) => (
                            <div
                                key={tab.key}
                                className={`tab-container ${activeTab === tab.key ? "active" : ""}`}
                                onClick={() => handleTabClick(tab.key)}
                            >
                                <div className="tab-icon">{tab.icon}</div>
                                <div className="tab-label">{tab.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="profile-section" ref={menuRef}>
                    <FaUserCircle className="profile-icon" onClick={() => setMenuOpen(!menuOpen)} />
                    {menuOpen && (
                        <div className="profile-menu">
                            <div className="menu-item">Профиль</div>
                            <div className="menu-item">Настройки</div>
                            <div className="menu-item" onClick={handleLogout}>
                                Выход
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <LogoutModal
                isOpen={isModalOpen}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
                message="Вы уверены, что хотите выйти?"
            />
        </>
    )
}

export default Header