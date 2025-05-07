"use client"

import type React from "react"
import { useState } from "react"
import Header from "../../components/header/Header"
import ControlPanel from "../../components/cargo/ControlPanel"
import CargoTable from "../../components/cargo/CargoTable"
import "../../styles/pages/cargo-page.css"

const CargoPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="cargo-page">
            <Header />
            <ControlPanel onSearch={handleSearch} />
            <CargoTable searchQuery={searchQuery} />
        </div>
    )
}

export default CargoPage
