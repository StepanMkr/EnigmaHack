import type { Email, EmailDetailResponse, EmailsResponse, SearchResponse } from "./model";

export class MockEmailService {
  private mockEmails: Email[];

  constructor() {
    this.mockEmails = this.generateMockEmails(17);
  }

  private generateMockEmails(count: number): Email[] {
    const firstNames: string[] = ['Иван', 'Петр', 'Сергей', 'Анна', 'Мария', 'Дмитрий', 'Елена', 'Алексей', 'Ольга', 'Николай'];
    const lastNames: string[] = ['Иванов', 'Петров', 'Сидоров', 'Смирнова', 'Кузнецова', 'Попов', 'Лебедев', 'Козлов', 'Новиков', 'Морозов'];
    const domains: string[] = ['company.ru', 'gmail.com', 'yandex.ru', 'mail.ru', 'work.com'];
    const subjects: string[] = [
      'Отчет за месяц', 'Встреча в пятницу', 'Важное уведомление', 'Счет на оплату', 
      'Документация по проекту', 'Приглашение на конференцию', 'Обновление ПО',
      'Задача на неделю', 'Презентация для клиента', 'Новости компании'
    ];
    const bodies: string[] = [
      'Добрый день! Направляю отчет по проекту за прошедший месяц...',
      'Коллеги, напоминаю о встрече в пятницу в 15:00 в переговорной №3...',
      'Срочная информация! Изменение в регламенте работы...',
      'Во вложении счет на оплату услуг. Прошу оплатить до конца недели...',
      'Обновил документацию, прошу ознакомиться с изменениями...',
      'Приглашаем вас принять участие в ежегодной конференции...',
      'Вышло обновление системы, необходимо установить до понедельника...',
      'План работ на следующую неделю во вложении...',
      'Подготовил презентацию для завтрашней встречи с клиентом...',
      'Новости компании: запуск нового проекта и изменения в штатном расписании...'
    ];

    const emails: Email[] = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const subjectIndex = Math.floor(Math.random() * subjects.length);
      const bodyIndex = Math.floor(Math.random() * bodies.length);
      
      const date = new Date(now);
      date.setDate(date.getDate() - (count - i - 1));
      
      emails.push({
        id: String(i + 1),
        date: date.toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timestamp: date.getTime(),
        sender_name: `${firstName} ${lastName}`,
        sender_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        subject: subjects[subjectIndex],
        body_preview: bodies[bodyIndex],
        body_full: bodies[bodyIndex] + ' ' + 'Текст письма... '.repeat(20),
        is_read: Math.random() > 0.3
      });
    }
    
    return emails;
  }

  async getEmails(page: number = 1, perPage: number = 10, sortOrder: string = 'asc'): Promise<EmailsResponse> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const sortedEmails = [...this.mockEmails].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.timestamp - b.timestamp;
      } else {
        return b.timestamp - a.timestamp;
      }
    });
    
    const total = sortedEmails.length;
    const totalPages = Math.ceil(total / perPage);
    const startIdx = (page - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, total);
    
    const pageEmails = sortedEmails.slice(startIdx, endIdx);
    
    return {
      success: true,
      data: {
        emails: pageEmails,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_emails: total,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1,
          sort_order: sortOrder
        }
      }
    };
  }

  async getEmailById(id: string): Promise<EmailDetailResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const email = this.mockEmails.find(e => e.id === id);
    
    if (email) {
      return {
        success: true,
        data: {
          ...email,
          attachments: [
            { filename: 'document.pdf', size: 12345 },
            { filename: 'image.jpg', size: 67890 }
          ]
        }
      };
    }
    
    return { success: false, error: 'Email not found' };
  }

  async searchEmails(query: string, page: number = 1, perPage: number = 10): Promise<SearchResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = this.mockEmails.filter(email => 
      email.subject.toLowerCase().includes(query.toLowerCase()) ||
      email.body_preview.toLowerCase().includes(query.toLowerCase()) ||
      email.sender_name.toLowerCase().includes(query.toLowerCase())
    );
    
    const total = results.length;
    const totalPages = Math.ceil(total / perPage);
    const startIdx = (page - 1) * perPage;
    const endIdx = Math.min(startIdx + perPage, total);
    
    return {
      success: true,
      data: {
        query,
        emails: results.slice(startIdx, endIdx),
        pagination: {
          current_page: page,
          per_page: perPage,
          total_emails: total,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1
        }
      }
    };
  }
}