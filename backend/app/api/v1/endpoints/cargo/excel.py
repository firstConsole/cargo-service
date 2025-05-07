from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from typing import List, Dict, Any
from app.api.v1.auth.auth import get_current_user
from app.api.v1.models.Users import User
from app.services.excel_service import ExcelService

router = APIRouter()

@router.post("/upload", response_model=List[Dict[str, Any]])
async def upload_excel_file(
        file: UploadFile = File(...),
        period_id: str = None,
        current_user: User = Depends(get_current_user)
):
    """
    Загружает и парсит Excel файл с данными о грузах.

    Args:
        file: Загруженный Excel файл
        period_id: ID периода
        current_user: Текущий пользователь

    Returns:
        List[Dict[str, Any]]: Список словарей с данными о грузах
    """
    # Проверяем, что загружен Excel файл
    if not file.filename.endswith(('.xlsx', '.xls', '.xlsm')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Загруженный файл должен быть в формате Excel (.xlsx, .xls, .xlsm)"
        )

    # Используем period_id или значение по умолчанию
    period_id = period_id or "unknown"

    # Парсим Excel файл
    excel_service = ExcelService()
    parsed_data = await excel_service.parse_cargo_excel(file, period_id)

    if not parsed_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Не удалось обработать Excel файл. Проверьте формат и содержимое файла."
        )

    return parsed_data
