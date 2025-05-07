// LoginPage.tsx
import type React from "react"
import { useState } from "react"
import { FaUser, FaLock } from "react-icons/fa"
import axios from "axios"
import "../../styles/pages/login-page.css"

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        if (!login || !password) {
            setError("Пожалуйста, введите логин и пароль")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post("http://localhost:8000/auth/login", {
                login,
                password,
            })

            if (response.data && response.data.access_token) {
                localStorage.setItem("token", response.data.access_token)
                window.location.href = "/"
            } else {
                setError("Неверный ответ от сервера")
            }
        } catch (err) {
            console.error("Ошибка авторизации: ", err)
            setError("Ошибка авторизации. Пожалуйста, проверьте логин и пароль.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleLogin()
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Cargo Service</h1>
                    <p>Пожалуйста, войдите в систему</p>
                </div>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="input-icon">
                            <FaUser />
                        </div>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-icon">
                            <FaLock />
                        </div>
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="remember-forgot">
                        <a href="#" className="forgot-password">
                            Забыли пароль?
                        </a>
                    </div>

                    <button type="submit" className={`login-button ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : "Войти"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage