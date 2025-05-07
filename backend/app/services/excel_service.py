import os
import sys
import logging
from typing import Dict, List, Any
from pathlib import Path
import tempfile
from fastapi import UploadFile
from scripts.CargoExcelParser import CargoExcelParser

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger('excel_service')
sys.path.append(str(Path(__file__).parent.parent.parent.parent.parent / "scripts"))

class ExcelService:
    """Сервис для работы с Excel файлами."""

    @staticmethod
    async def parse_cargo_excel(file: UploadFile, period_id: str = "unknown") -> List[Dict[str, Any]]:
        """
        Парсит загруженный Excel файл с данными о грузах.

        Args:
            file: Загруженный файл
            period_id: ID текущего периода

        Returns:
            List[Dict[str, Any]]: Список словарей с данными о грузах
        """
        try:
            # Создаем временный файл для сохранения загруженного файла
            with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as temp_file:
                temp_file_path = temp_file.name

                # Читаем содержимое загруженного файла и записываем во временный файл
                content = await file.read()
                temp_file.write(content)

            logger.info(f"Файл временно сохранен: {temp_file_path}")

            # Парсим Excel файл
            parser = CargoExcelParser(temp_file_path, period_id)
            parsed_data = parser.parse()

            # Удаляем временный файл
            os.unlink(temp_file_path)
            logger.info(f"Временный файл удален: {temp_file_path}")

            return parsed_data

        except Exception as e:
            logger.error(f"Ошибка при парсинге Excel файла: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())

            # Удаляем временный файл в случае ошибки
            try:
                if 'temp_file_path' in locals():
                    os.unlink(temp_file_path)
                    logger.info(f"Временный файл удален после ошибки: {temp_file_path}")
            except Exception as e:
                logger.warning(f"Ошибка при удалении временного файла: {str(e)}")
                pass

            return []
