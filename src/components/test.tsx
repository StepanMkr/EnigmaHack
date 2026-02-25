import React, { useState, useEffect } from 'react';
import { Button, IconButton, Spinner, Table, Textarea } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import './test.css';
import type { Ticket, ToneType } from './test.model';
import { FaCircle, FaSyncAlt } from 'react-icons/fa';
import { IoSync } from 'react-icons/io5';
import { PiFileCsvDuotone } from 'react-icons/pi';
import { RiFileExcel2Line } from 'react-icons/ri';

const TicketTable: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null); // для отслеживания генерации
  const [aiResponses, setAiResponses] = useState<Record<number, string>>({});

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

  const getToneColor = (tone: ToneType): string => {
    const icons: Record<ToneType, string> = {
      'Позитивный': 'green',
      'Нейтральный': 'orange',
      'Негативный': 'red'
    };
    return icons[tone] || 'gray';
  };

  const handleSync = (): void => {
    setSyncing(true);
    // Имитация запроса за новыми сообщениями
    setTimeout(() => {
      console.log('Синхронизация завершена');
      setSyncing(false);
    }, 1500);
  };

  const handleGenerateResponse = (ticketId: number): void => {
    setGeneratingId(ticketId);

    setTimeout(() => {
      const mockResponses: Record<string, string> = {
        'Негативный': 'Уважаемый клиент! Приносим извинения за доставленные неудобства. Наши специалисты уже работают над решением вашей проблемы. Пожалуйста, ожидайте, мы свяжемся с вами в ближайшее время.',
        'Нейтральный': 'Здравствуйте! Благодарим за обращение. Для решения вашего вопроса нам нужно уточнить некоторые детали. Напишите, пожалуйста, удобное время для звонка.',
        'Позитивный': 'Здравствуйте! Рады, что вы обратились к нам. С удовольствием поможем вам с интеграцией. Направляем ссылку на документацию: https://docs.example.com/api'
      };

      const ticket = tickets.find(t => t.id === ticketId);
      const tone = ticket?.emotionalTone || 'Нейтральный';

      setAiResponses(prev => ({
        ...prev,
        [ticketId]: mockResponses[tone] || 'Спасибо за обращение! Мы обработаем ваш запрос и свяжемся с вами.'
      }));

      setGeneratingId(null);
    }, 2000);
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
    return <div className='spinner-wrapper'><Spinner size="lg" /></div>;
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

      {syncing ? <div className='spinner-wrapper'><Spinner size="lg" /></div> :
        <Table.Root variant="outline" borderColor="gray.300">
          <Table.Header bg="gray.200">
            <Table.Row>
              <Table.ColumnHeader>Дата</Table.ColumnHeader>
              <Table.ColumnHeader>ФИО</Table.ColumnHeader>
              <Table.ColumnHeader>Объект</Table.ColumnHeader>
              <Table.ColumnHeader>Телефон</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Заводские номера</Table.ColumnHeader>
              <Table.ColumnHeader>Тип приборов</Table.ColumnHeader>
              <Table.ColumnHeader>Эмоц. окрас</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Суть вопроса</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tickets.map((ticket: Ticket) => (
              <Table.Row
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`ticket-row ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}>
                <Table.Cell>{formatDate(ticket.date)}</Table.Cell>
                <Table.Cell>{ticket.fullName}</Table.Cell>
                <Table.Cell>{ticket.object}</Table.Cell>
                <Table.Cell>{ticket.phone}</Table.Cell>
                <Table.Cell>{ticket.email}</Table.Cell>
                <Table.Cell>{ticket.serialNumbers}</Table.Cell>
                <Table.Cell>{ticket.deviceType}</Table.Cell>
                <Table.Cell>
                  <FaCircle color={getToneColor(ticket.emotionalTone)} />
                </Table.Cell>
                <Table.Cell textAlign="end">{ticket.issueSummary}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>}

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

              {/* Показываем спиннер или textarea */}
              {generatingId === selectedTicket.id ? (
                <div className="response-spinner">
                  <Spinner size="lg" />
                  {/* <p>Генерация ответа...</p> */}
                </div>
              ) : (
                <textarea
                  className="response-editor"
                  placeholder='Ответ...'
                  value={aiResponses[selectedTicket.id] || ''}
                  onChange={(e) => {
                    // Обновляем ответ при ручном редактировании
                    setAiResponses(prev => ({
                      ...prev,
                      [selectedTicket.id]: e.target.value
                    }));
                  }}
                  rows={6}
                />
              )}

              {/* Кнопка отправки ответа */}
              <div className="detail-actions">
                <Button
                  colorPalette="blue"
                  variant="surface"
                  onClick={() => handleGenerateResponse(selectedTicket.id)}
                  disabled={generatingId === selectedTicket.id}
                >
                  {generatingId === selectedTicket.id ? 'Генерация...' : 'Сгенерировать ответ'}
                </Button>
                <Button
                  onClick={() => handleSendResponse(selectedTicket.id)}
                  disabled={!aiResponses[selectedTicket.id] || generatingId === selectedTicket.id}
                >
                  Отправить
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