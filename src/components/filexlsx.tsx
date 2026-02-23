import { Button } from "@chakra-ui/react";
import * as XLSX from "xlsx";

export default function DownloadXlsxButton() {
  const downloadXlsx = () => {
    // 1. Табличные данные
    const data = [
      { id: 1, имя: "Алиса", город: "Москва", заказы: 5, сумма: 320.5 },
      { id: 2, имя: "Боб", город: "Лондон", заказы: 2, сумма: 99.99 },
      { id: 3, имя: "Чарли", город: "Торонто", заказы: 8, сумма: 712.0 },
      { id: 4, имя: "Диана", город: "Берлин", заказы: 3, сумма: 150.75 },
      { id: 5, имя: "Эрик", город: "Амстердам", заказы: 6, сумма: 410.2 }
    ];

    // 2. Преобразуем в worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 3. Создаём workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Отчёт");

    // 4. Скачивание файла
    XLSX.writeFile(workbook, "report.xlsx");
  };

  return (
    <Button onClick={downloadXlsx}>
      Скачать Excel (.xlsx)
    </Button>
  );
}