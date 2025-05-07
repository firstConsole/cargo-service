import axios from "axios"

// Базовый URL API
const API_URL = "http://localhost:8000/api/v1"

// Интерфейс для периода
export interface Period {
    period_id: number
    period_name: string
}

// Получение всех периодов
export const fetchPeriods = async (): Promise<Period[]> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("Не авторизован")
        }

        // Выводим токен для отладки
        console.log("Используемый токен:", token)

        // Добавляем параметр local_kw в запрос
        const response = await axios.get(`${API_URL}/periods/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                local_kw: "default",
            },
        })
        return response.data
    } catch (error: any) {
        console.error("Ошибка при получении периодов:", error)

        // Выводим детали ошибки для отладки
        if (error.response) {
            console.error("Детали ошибки:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            })
        }

        // Форматируем сообщение об ошибке
        let errorMessage = "Не удалось загрузить периоды"

        if (error.message === "Network Error") {
            errorMessage = "Ошибка сети. Сервер недоступен."
        } else if (error.response) {
            if (error.response.status === 500) {
                errorMessage = "Внутренняя ошибка сервера. Пожалуйста, обратитесь к администратору."
            } else if (error.response.status === 401) {
                errorMessage = "Ошибка авторизации. Пожалуйста, войдите в систему заново."
                // Можно добавить автоматический редирект на страницу логина
                localStorage.removeItem("token")
            } else if (error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data
                } else if (typeof error.response.data === "object") {
                    if (error.response.data.detail) {
                        errorMessage =
                            typeof error.response.data.detail === "string"
                                ? error.response.data.detail
                                : JSON.stringify(error.response.data.detail)
                    }
                }
            }
        }

        throw new Error(errorMessage)
    }
}

// Получение периода по ID
export const fetchPeriodById = async (id: number): Promise<Period> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("Не авторизован")
        }

        const response = await axios.get(`${API_URL}/periods/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                local_kw: "default", // Добавляем требуемый параметр
            },
        })
        return response.data
    } catch (error: any) {
        console.error("Ошибка при получении периода:", error)

        // Форматируем сообщение об ошибке
        let errorMessage = "Не удалось загрузить период"
        if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail
        }

        throw new Error(errorMessage)
    }
}

// Создание нового периода
export const createPeriod = async (name: string): Promise<Period> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("Не авторизован")
        }

        // Выводим токен и данные для отладки
        console.log("Используемый токен:", token)
        console.log("Отправляемые данные:", { period_name: name })

        const response = await axios.post(
            `${API_URL}/periods/`,
            { period_name: name },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    local_kw: "default", // Добавляем требуемый параметр
                },
            },
        )
        return response.data
    } catch (error: any) {
        console.error("Ошибка при создании периода:", error)

        // Выводим детали ошибки для отладки
        if (error.response) {
            console.error("Детали ошибки:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers,
            })
        }

        // Форматируем сообщение об ошибке
        let errorMessage = "Не удалось создать период"

        if (error.message === "Network Error") {
            errorMessage = "Ошибка сети. Сервер недоступен."
        } else if (error.response) {
            if (error.response.status === 500) {
                errorMessage = "Внутренняя ошибка сервера. Пожалуйста, обратитесь к администратору."
            } else if (error.response.status === 401) {
                errorMessage = "Ошибка авторизации. Пожалуйста, войдите в систему заново."
                localStorage.removeItem("token")
            } else if (error.response.status === 400) {
                errorMessage = "Период с таким названием уже существует."
            } else if (error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data
                } else if (typeof error.response.data === "object") {
                    if (error.response.data.detail) {
                        errorMessage =
                            typeof error.response.data.detail === "string"
                                ? error.response.data.detail
                                : JSON.stringify(error.response.data.detail)
                    }
                }
            }
        }

        throw new Error(errorMessage)
    }
}

// Обновление периода
export const updatePeriod = async (id: number, periodName: string): Promise<Period> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("Не авторизован")
        }

        const response = await axios.put(
            `${API_URL}/periods/${id}`,
            { period_name: periodName },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    local_kw: "default", // Добавляем требуемый параметр
                },
            },
        )
        return response.data
    } catch (error: any) {
        console.error("Ошибка при обновлении периода:", error)

        // Форматируем сообщение об ошибке
        let errorMessage = "Не удалось обновить период"
        if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail
        }

        throw new Error(errorMessage)
    }
}

// Удаление периода
export const deletePeriod = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
        const token = localStorage.getItem("token")
        if (!token) {
            throw new Error("Не авторизован")
        }

        const response = await axios.delete(`${API_URL}/periods/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                local_kw: "default", // Добавляем требуемый параметр
            },
        })
        return response.data
    } catch (error: any) {
        console.error("Ошибка при удалении периода:", error)

        // Форматируем сообщение об ошибке
        let errorMessage = "Не удалось удалить период"
        if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail
        }

        throw new Error(errorMessage)
    }
}
