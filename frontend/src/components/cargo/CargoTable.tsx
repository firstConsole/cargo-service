"use client"

// CargoTable.tsx
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { HotTable, type HotTableClass } from "@handsontable/react"
import type { HotTableProps } from "@handsontable/react"
import { registerAllModules } from "handsontable/registry"
import type Handsontable from "handsontable"
import "handsontable/dist/handsontable.full.min.css"
import "../../styles/components/cargo-table.css"

// Регистрируем все модули Handsontable
registerAllModules()

// Типы данных для грузов с новыми полями
interface CargoItem {
    batchNumber: string
    status: string
    clientCode: string
    departureFromChinaDate: string
    placesCount: number
    weight: number
    boxesCount: number
    cubicTariff: number
    unitsCount: number
    productName: string
    productPrice: number
    insurancePercent: number
    volume: number
    freightTariff: number
    insurance: number
    packaging: number
    total: number
    notes: string
    paymentMethod: string
    paidUSD: number
    paidRUB: number
    paymentDate: string
    driver: string
    placesSent: number
    shipmentDate: string
    recipient: string
    phone: string
    city: string
    country: string
    transportCompany: string
}

// Настройки для статусов
const statusClasses: Record<string, string> = {
    "В пути": "status-in-transit",
    "Доставлен": "status-delivered",
    "Ожидает отправки": "status-pending",
    "Отменен": "status-cancelled",
    "Оформляется": "status-processing",
}

// Опции для выпадающих списков
const statusOptions = ["Оформляется", "Ожидает отправки", "В пути", "Доставлен", "Отменен"]
const paymentMethodOptions = ["Наличные", "Безналичный расчет", "Карта", "Электронный платеж", "Криптовалюта"]
const driverOptions = ["Иванов И.И.", "Петров П.П.", "Сидоров С.С.", "Николаев Н.Н.", "Морозов М.М."]

interface CargoTableProps {
    searchQuery?: string
}

const CargoTable: React.FC<CargoTableProps> = ({ searchQuery = "" }) => {
    const hotTableRef = useRef<HotTableClass>(null)
    const [data, setData] = useState<CargoItem[]>([])
    const [filteredData, setFilteredData] = useState<CargoItem[]>([])

    // Применяем поиск при изменении searchQuery
    useEffect(() => {
        if (!data.length) {
            return
        }

        if (!searchQuery) {
            setFilteredData(data)
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = data.filter((item) => {
            // Проверяем все текстовые поля на совпадение с поисковым запросом
            return (
                (item.batchNumber && item.batchNumber.toLowerCase().includes(query)) ||
                (item.status && item.status.toLowerCase().includes(query)) ||
                (item.clientCode && item.clientCode.toLowerCase().includes(query)) ||
                (item.productName && item.productName.toLowerCase().includes(query)) ||
                (item.notes && item.notes.toLowerCase().includes(query)) ||
                (item.driver && item.driver.toLowerCase().includes(query)) ||
                (item.recipient && item.recipient.toLowerCase().includes(query)) ||
                (item.city && item.city.toLowerCase().includes(query)) ||
                (item.country && item.country.toLowerCase().includes(query)) ||
                (item.transportCompany && item.transportCompany.toLowerCase().includes(query))
            )
        })

        setFilteredData(filtered)
    }, [searchQuery, data])

    // Функция рендеринга для статуса
    const statusRenderer = (
        _instance: Handsontable,
        td: HTMLTableCellElement,
        _row: number,
        _col: number,
        _prop: string | number,
        value: string,
    ) => {
        td.innerHTML = `<div class="status-badge ${statusClasses[value] || ""}">${value || ""}</div>`
        return td
    }

    // Функция для форматирования денежных значений
    const moneyRenderer = (
        _instance: Handsontable,
        td: HTMLTableCellElement,
        _row: number,
        _col: number,
        _prop: string | number,
        value: number | null,
    ) => {
        td.innerHTML = value !== null && !isNaN(value) ? value.toFixed(2) : ""
        td.className = "htRight"
        return td
    }

    // Настройки колонок таблицы с новыми заголовками
    const columns = [
        { data: "batchNumber", title: "Баланс", width: 100 },
        {
            data: "status",
            title: "Статус",
            width: 90,
            type: "dropdown",
            source: statusOptions,
            renderer: statusRenderer,
        },
        { data: "clientCode", title: "Клиент", width: 110 },
        {
            data: "departureFromChinaDate",
            title: "Из Китая",
            width: 100,
            type: "numeric",
            correctFormat: true,
            defaultDate: "",
        },
        {
            data: "placesCount",
            title: "Мест",
            width: 100,
            type: "numeric",
            numericFormat: {
                pattern: "0,0",
            },
        },
        {
            data: "weight",
            title: "Вес, кг",
            width: 100,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
        },
        {
            data: "boxesCount",
            title: "Коробки",
            width: 100,
            type: "numeric",
            numericFormat: {
                pattern: "0,0",
            },
        },
        {
            data: "cubicTariff",
            title: "Тариф куб, $",
            width: 120,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "unitsCount",
            title: "Кол-во ед., шт",
            width: 140,
            type: "numeric",
            numericFormat: {
                pattern: "0,0",
            },
        },
        { data: "productName", title: "Наименование", width: 200 },
        {
            data: "productPrice",
            title: "Цена товара, ¥",
            width: 140,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "insurancePercent",
            title: "Страховка, %",
            width: 130,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
        },
        {
            data: "volume",
            title: "Объём, м3",
            width: 120,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.000",
            },
        },
        {
            data: "freightTariff",
            title: "Тариф фрахт, $",
            width: 140,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "insurance",
            title: "Страховка, $",
            width: 130,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "packaging",
            title: "Упаковка, $",
            width: 120,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "total",
            title: "Итого, $",
            width: 100,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
            readOnly: true,
        },
        { data: "notes", title: "Примечание", width: 150 },
        {
            data: "paymentMethod",
            title: "Метод оплаты",
            width: 150,
            type: "dropdown",
            source: paymentMethodOptions,
        },
        {
            data: "paidUSD",
            title: "Оплачено, $",
            width: 120,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "paidRUB",
            title: "Оплачено, ₽",
            width: 120,
            type: "numeric",
            numericFormat: {
                pattern: "0,0.00",
            },
            renderer: moneyRenderer,
        },
        {
            data: "paymentDate",
            title: "Дата оплаты",
            width: 130,
            type: "date",
            dateFormat: "DD.MM.YYYY",
            correctFormat: true,
            defaultDate: "",
        },
        {
            data: "driver",
            title: "Водитель",
            width: 150,
            type: "dropdown",
            source: driverOptions,
        },
        {
            data: "placesSent",
            title: "Мест от.",
            width: 110,
            type: "numeric",
            numericFormat: {
                pattern: "0,0",
            },
        },
        {
            data: "shipmentDate",
            title: "Дата отправки",
            width: 140,
            type: "date",
            dateFormat: "DD.MM.YYYY",
            correctFormat: true,
            defaultDate: "",
        },
        { data: "recipient", title: "Получатель", width: 250 },
        { data: "phone", title: "Телефон", width: 120 },
        { data: "city", title: "Город", width: 120 },
        { data: "country", title: "Страна", width: 120 },
        { data: "transportCompany", title: "ТК", width: 140 },
    ]

    // Настройки таблицы
    const tableSettings: HotTableProps["settings"] = {
        data: filteredData.length ? filteredData : data,
        columns,
        rowHeaders: true,
        colHeaders: true,
        height: "70vh",
        width: "100%",
        licenseKey: "non-commercial-and-evaluation",
        stretchH: "all" as const,
        autoColumnSize: false,
        manualColumnResize: true,
        manualRowResize: true,
        contextMenu: true,
        filters: true,
        dropdownMenu: true,
        columnSorting: true,
        className: "cargo-table",
        fixedColumnsStart: 0, // Убираем фиксированные колонки
        afterGetColHeader: (_col: number, TH: HTMLTableCellElement) => {
            TH.className = "cargo-table-header"
        },
        // Добавляем обработчик изменений в ячейках
        afterChange: (changes, source) => {
            if (source === "edit" && changes) {
                console.log("Данные изменены:", changes)

                // Пересчитываем итоговую сумму при изменении связанных полей
                if (hotTableRef.current) {
                    const hot = hotTableRef.current.hotInstance
                    if (hot) {
                        changes.forEach(([row, prop]) => {
                            if (
                                prop === "volume" ||
                                prop === "cubicTariff" ||
                                prop === "freightTariff" ||
                                prop === "insurance" ||
                                prop === "packaging"
                            ) {
                                const rowData = hot.getDataAtRow(row)
                                const colIndexes = {
                                    volume: columns.findIndex((col) => col.data === "volume"),
                                    cubicTariff: columns.findIndex((col) => col.data === "cubicTariff"),
                                    freightTariff: columns.findIndex((col) => col.data === "freightTariff"),
                                    insurance: columns.findIndex((col) => col.data === "insurance"),
                                    packaging: columns.findIndex((col) => col.data === "packaging"),
                                    total: columns.findIndex((col) => col.data === "total"),
                                }

                                const volume = Number.parseFloat(rowData[colIndexes.volume]) || 0
                                const cubicTariff = Number.parseFloat(rowData[colIndexes.cubicTariff]) || 0
                                const freightTariff = Number.parseFloat(rowData[colIndexes.freightTariff]) || 0
                                const insurance = Number.parseFloat(rowData[colIndexes.insurance]) || 0
                                const packaging = Number.parseFloat(rowData[colIndexes.packaging]) || 0

                                const total = volume * cubicTariff + freightTariff + insurance + packaging

                                hot.setDataAtCell(row, colIndexes.total, total)
                            }
                        })
                    }
                }
            }
        },
        // Включаем редактирование ячеек
        allowInsertRow: true,
        allowInsertColumn: false,
        allowRemoveRow: true,
        allowRemoveColumn: false,
        // Настройки для горизонтальной прокрутки
        viewportColumnRenderingOffset: 20,
        wordWrap: false,
        // Настройки для поиска
        search: {
            searchResultClass: "search-result",
        },
    }

    // Добавляем пустую строку при инициализации, если данных нет
    useEffect(() => {
        if (data.length === 0) {
            setData([{} as CargoItem])
        }
    }, [data])

    return (
        <div className="cargo-table-container">
            <HotTable ref={hotTableRef} settings={tableSettings} />
        </div>
    )
}

export default CargoTable
