import { Button } from '@chakra-ui/react';

export default function DownloadCsvButton() {
    const downloadCsv = async () => {
        try {


            const csvText = "\uFEFF" + `id;имя;город;заказы;сумма
1;Алиса;Москва;5;320.50
2;Боб;Лондон;2;99.99
3;Чарли;Торонто;8;712.00
4;Диана;Берлин;3;150.75
5;Эрик;Амстердам;6;410.20`;

            const blob = new Blob([csvText], {
                type: 'text/csv;charset=utf-8;'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.csv';

            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

        } catch (e) {
            console.error(e);
            alert('Ошибка скачивания CSV');
        }
    };

    return (
        <Button onClick={downloadCsv}>
            Скачать CSV
        </Button>
    );
}