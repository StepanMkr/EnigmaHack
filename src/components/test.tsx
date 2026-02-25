import React, { useState, useEffect } from 'react';
import { Button, IconButton } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import './test.css';
import type { Ticket, ToneType } from './test.model';
import { FaSyncAlt } from 'react-icons/fa';
import { IoSync } from 'react-icons/io5';
import { PiFileCsvDuotone } from 'react-icons/pi';
import { RiFileExcel2Line } from 'react-icons/ri';

const TicketTable: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Моковые данные
  const mockTickets: Ticket[] = [
    {
      id: 1,
      date: '2024-02-24T10:30:00',
      fullName: 'Иван Петров',
      object: 'Котельная №3',
      phone: '+7 (999) 123-45-67',
      email: 'ivan.petrov@email.com',
      serialNumbers: ['SN-2024-001', 'SN-2024-002'],
      deviceType: 'Котел отопительный Protherm',
      emotionalTone: 'Негативный',
      issueSummary: 'Клиент не может провести оплату картой, получает ошибку',
      originalMessage: 'Добрый день! Уже третий раз пытаюсь оплатить заказ, но сайт выдает ошибку "Транзакция отклонена". Карта рабочая, деньги на счету есть. Помогите срочно!',
    },
    {
      id: 2,
      date: '2024-02-24T09:15:00',
      fullName: 'Елена Смирнова',
      object: 'ТЦ "Меркурий"',
      phone: '+7 (495) 234-56-78',
      email: 'elena.smirnova@company.ru',
      serialNumbers: ['AC-2023-789'],
      deviceType: 'Кондиционер Mitsubishi',
      emotionalTone: 'Нейтральный',
      issueSummary: 'Клиент хочет сменить тариф, но не уверен в выборе',
      originalMessage: 'Здравствуйте! Думаю перейти на другой тариф. Сейчас у меня базовый, но нужно больше функций. Не могу определиться между Про и Бизнес. Что посоветуете?',
    },
    {
      id: 3,
      date: '2024-02-24T08:45:00',
      fullName: 'Алексей Иванов',
      object: 'Завод "Металлист"',
      phone: '+7 (343) 345-67-89',
      email: 'alex.ivanov@metal.ru',
      serialNumbers: ['PUMP-456', 'PUMP-457', 'PUMP-458'],
      deviceType: 'Насосное оборудование Grundfos',
      emotionalTone: 'Позитивный',
      issueSummary: 'Вопрос по документации API и лимитам интеграции',
      originalMessage: 'Добрый день! Планируем интеграцию вашего оборудования в нашу систему мониторинга. Нужна документация по API и информация по лимитам запросов. Спасибо!',
    },
    {
      id: 4,
      date: '2024-02-24T07:20:00',
      fullName: 'Михаил Соколов',
      object: 'Офис "Плаза"',
      phone: '+7 (911) 456-78-90',
      email: 'urgent.client@mail.com',
      serialNumbers: ['BOILER-001'],
      deviceType: 'Котел электрический Vaillant',
      emotionalTone: 'Негативный',
      issueSummary: 'Полная неработоспособность оборудования, система не запускается',
      originalMessage: 'Срочно! Котел перестал работать, выдает ошибку E04. В офисе холодно, сотрудники мерзнут! Нужно срочно решить проблему!',
    }
  ];

  useEffect(() => {
    // Имитация загрузки данных с сервера
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const getToneIcon = (tone: ToneType): string => {
    const icons: Record<ToneType, string> = {
      'Позитивный': '😊',
      'Нейтральный': '😐',
      'Негативный': '😠'
    };
    return icons[tone] || '😐';
  };

  const handleSync = (): void => {
    setSyncing(true);
    // Имитация запроса за новыми сообщениями
    setTimeout(() => {
      console.log('Синхронизация завершена');
      setSyncing(false);
    }, 1500);
  };

  const downloadCsv = async (): Promise<void> => {
    try {
      const headers = ['id;дата;фио;объект;телефон;email;заводские номера;тип приборов;эмоциональный окрас;суть вопроса'];

      const rows = tickets.map(ticket =>
        `${ticket.id};${new Date(ticket.date).toLocaleString('ru-RU')};${ticket.fullName};${ticket.object};${ticket.phone};${ticket.email};${ticket.serialNumbers};${ticket.deviceType};${ticket.emotionalTone};${ticket.issueSummary}`
      );

      const csvText = "\uFEFF" + [...headers, ...rows].join('\n');

      const blob = new Blob([csvText], {
        type: 'text/csv;charset=utf-8;'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tickets.csv';

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } catch (e) {
      console.error(e);
      alert('Ошибка скачивания CSV');
    }
  };

  const downloadXlsx = (): void => {
    try {
      const data = tickets.map(ticket => ({
        id: ticket.id,
        дата: new Date(ticket.date).toLocaleString('ru-RU'),
        фио: ticket.fullName,
        объект: ticket.object,
        телефон: ticket.phone,
        email: ticket.email,
        'заводские номера': ticket.serialNumbers,
        'тип приборов': ticket.deviceType,
        'эмоциональный окрас': ticket.emotionalTone,
        'суть вопроса': ticket.issueSummary,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Обращения");

      XLSX.writeFile(workbook, "tickets.xlsx");
    } catch (e) {
      console.error(e);
      alert('Ошибка скачивания XLSX');
    }
  };

  const handleSendResponse = (ticketId: number): void => {
    setTickets((prev: Ticket[]) => prev.map((t: Ticket) =>
      t.id === ticketId
        ? { ...t, reviewedByHuman: true, status: 'Отправлено' }
        : t
    ));
    setSelectedTicket(null);
    alert('Ответ отправлен');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Загрузка обращений...</div>;
  }

  return (
    <div className="ticket-system">
      {/* Кнопки управления */}
      <div className="action-buttons">
        <IconButton
          aria-label="Search database"
          onClick={handleSync}
          loading={syncing}
        >
          <IoSync />
        </IconButton>
        <Button
          onClick={downloadCsv}
        >
          <PiFileCsvDuotone /> Скачать CSV
        </Button>
        <Button
          onClick={downloadXlsx}
        >
          <RiFileExcel2Line /> Скачать Excel (.xlsx)
        </Button>
      </div>

      {/* Основная таблица */}
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>ФИО</th>
            <th>Объект</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Заводские номера</th>
            <th>Тип приборов</th>
            <th>Эмоц. окрас</th>
            <th>Суть вопроса</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket: Ticket) => (
            <tr
              key={ticket.id}
              className={`ticket-row ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <td>{formatDate(ticket.date)}</td>
              <td>{ticket.fullName}</td>
              <td>{ticket.object}</td>
              <td>{ticket.phone}</td>
              <td>{ticket.email}</td>
              <td>{ticket.serialNumbers}</td>
              <td>{ticket.deviceType}</td>
              <td>
                <span title={`Тон: ${ticket.emotionalTone}`}>
                  {getToneIcon(ticket.emotionalTone)}
                </span>
              </td>
              <td>{ticket.issueSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Панель детального просмотра */}
      {selectedTicket && (
        <div className="ticket-detail">
          <div className="detail-header">
            <h3>Детали обращения</h3>
            <button
              className="close-btn"
              onClick={() => setSelectedTicket(null)}
            >
              ✕
            </button>
          </div>

          <div className="detail-content">
            <div className="original-message">
              <h4>Исходное сообщение:</h4>
              <p><strong>От:</strong> {selectedTicket.fullName} ({selectedTicket.email})</p>
              <p><strong>Телефон:</strong> {selectedTicket.phone}</p>
              <p><strong>Объект:</strong> {selectedTicket.object}</p>
              <p><strong>Заводские номера:</strong> {selectedTicket.serialNumbers}</p>
              <p><strong>Тип приборов:</strong> {selectedTicket.deviceType}</p>
              <p><strong>Дата:</strong> {formatDate(selectedTicket.date)}</p>
              <div className="message-box">
                {selectedTicket.originalMessage}
              </div>
            </div>

            <div className="ai-response">
              <h4>Проект ответа:</h4>
              <textarea
                className="response-editor"
                // defaultValue={selectedTicket.aiResponse}
                rows={6}
              />

              {/* Кнопка отправки ответа */}
              <div className="detail-actions">
                <Button
                  colorScheme="blue"
                  onClick={() => handleSendResponse(selectedTicket.id)}
                  // disabled={selectedTicket.reviewedByHuman}
                  className="send-button"
                >
                  {/* {selectedTicket.reviewedByHuman ? '✓ Ответ отправлен' : '✉️ Отправить ответ'} */}
                  Отправить
                </Button>
                <Button>
                  Сгенерировать ИИ ответ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTable;