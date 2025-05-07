// src/App.tsx
import type React from "react"
import { Routes, Route } from "react-router-dom"
import CargoPage from "./pages/cargo/CargoPage"
import KassaPage from "./pages/kassa/KassaPage"
import PaymentsPage from "./pages/payments/PaymentsPage"
import TransitionsPage from "./pages/transitions/TransitionsPage"
import CalendarPage from "./pages/calendar/CalendarPage"
import LoginPage from "./pages/auth/LoginPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import "./styles/pages/common-page.css"

const App: React.FC = () => {
    return (
        <Routes>
            {/* Защищенные маршруты */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <CargoPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/kassa"
                element={
                    <ProtectedRoute>
                        <KassaPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payments"
                element={
                    <ProtectedRoute>
                        <PaymentsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transitions"
                element={
                    <ProtectedRoute>
                        <TransitionsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/calendar"
                element={
                    <ProtectedRoute>
                        <CalendarPage />
                    </ProtectedRoute>
                }
            />

            {/* Страница входа */}
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    )
}

export default App
