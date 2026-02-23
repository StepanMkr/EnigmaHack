import React, { useState, useEffect } from 'react';
import type { Attachment, Email, EmailDetail, PaginationInfo } from './model';
import { MockEmailService } from './email.service';
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { IconButton, Spinner } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { Input } from "@chakra-ui/react"
import { FaChevronCircleLeft, FaChevronCircleRight, FaSort } from 'react-icons/fa';
import { IoIosStats } from 'react-icons/io';
import { Table } from "@chakra-ui/react"

interface Styles {
    [key: string]: React.CSSProperties;
}

const EmailList: React.FC = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current_page: 1,
        per_page: 10,
        total_pages: 0,
        total_emails: 0,
        has_next: false,
        has_prev: false
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);

    const [emailService] = useState<MockEmailService>(() => new MockEmailService());

    const loadEmails = async (page: number, isPagination: boolean = false): Promise<void> => {
        if (isPagination) {
            setPaginationLoading(true);
        } else {
            setLoading(true);
            setSelectedEmail(null);
        }

        try {
            const result = await emailService.getEmails(page, 10, sortOrder);
            if (result.success && result.data) {
                setEmails(result.data.emails);
                setPagination(result.data.pagination);
            }
        } catch (error) {
            console.error('Error loading emails:', error);
        } finally {
            if (isPagination) {
                setPaginationLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleSearch = async (page: number = 1, isPagination: boolean = false): Promise<void> => {
        if (!searchQuery.trim()) {
            loadEmails(1, isPagination);
            return;
        }

        if (isPagination) {
            setPaginationLoading(true);
        } else {
            setLoading(true);
            setSelectedEmail(null);
        }

        try {
            const result = await emailService.searchEmails(searchQuery, page, 10);
            if (result.success && result.data) {
                setEmails(result.data.emails);
                setPagination({
                    current_page: result.data.pagination.current_page,
                    per_page: result.data.pagination.per_page,
                    total_pages: result.data.pagination.total_pages,
                    total_emails: result.data.pagination.total_emails,
                    has_next: result.data.pagination.has_next,
                    has_prev: result.data.pagination.has_prev
                });
            }
        } catch (error) {
            console.error('Error searching emails:', error);
        } finally {
            if (isPagination) {
                setPaginationLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    const handleEmailClick = async (emailId: string): Promise<void> => {
        setDetailLoading(true);

        try {
            const result = await emailService.getEmailById(emailId);
            if (result.success && result.data) {
                setSelectedEmail(result.data);
            }
        } catch (error) {
            console.error('Error loading email details:', error);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        loadEmails(1);
    }, [sortOrder]);

    const handlePageChange = (newPage: number): void => {
        if (searchQuery) {
            handleSearch(newPage, true);
        } else {
            loadEmails(newPage, true);
        }
    };

    const toggleSort = (): void => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const styles: Styles = {
        container: {
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#f5f5f5',
            fontFamily: 'Arial, sans-serif'
        },
        content: {
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '24px 32px'
        },
        header: {
            marginBottom: '24px'
        },
        title: {
            display: 'flex',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
        },
        controls: {
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            alignItems: 'center',
            flexWrap: 'wrap'
        },
        searchBox: {
            display: 'flex',
            gap: '8px',
            flex: 1,
            minWidth: '300px'
        },
        searchInput: {
            flex: 1,
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
        },
        buttonSecondary: {
            backgroundColor: '#6c757d'
        },
        stats: {
            padding: '8px 16px',
            backgroundColor: 'black',
            borderRadius: '4px',
            fontSize: '14px',
            color: 'white',
            width: '170px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
        },
        mainContent: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '24px'
        },
        emailList: {
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'relative',
            minHeight: '400px'
        },
        emailItem: {
            padding: '16px 20px',
            borderBottom: '1px solid #e0e0e0',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        },
        selectedEmail: {
            backgroundColor: '#e3f2fd'
        },
        emailHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            color: '#666',
            fontSize: '13px'
        },
        subject: {
            fontWeight: 'bold',
            marginBottom: '6px',
            color: '#333',
            fontSize: '15px'
        },
        preview: {
            color: '#666',
            fontSize: '13px',
            lineHeight: '1.4'
        },
        detailPanel: {
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            padding: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'relative',
            minHeight: '400px'
        },
        detailTable: {
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: '12px 16px',
            marginBottom: '24px',
            fontSize: '14px'
        },
        tableLabel: {
            color: '#666',
            fontWeight: '500',
            padding: '8px 0'
        },
        tableValue: {
            color: '#333',
            padding: '8px 0',
            wordBreak: 'break-word'
        },
        bodyContainer: {
            marginTop: '24px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
        },
        bodyText: {
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333',
            whiteSpace: 'pre-wrap'
        },
        attachments: {
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
        },
        attachmentsTitle: {
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '12px',
            color: '#333'
        },
        attachmentItem: {
            fontSize: '13px',
            color: '#1976d2',
            marginBottom: '8px'
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            marginTop: '24px'
        },
        actionButtons: {
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            justifyContent: 'flex-end'
        },
        demoNotice: {
            marginTop: '20px',
            fontSize: '12px',
            color: '#999',
            textAlign: 'center'
        },
        spinnerOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10,
            borderRadius: '12px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <MdOutlineMarkEmailUnread style={{ display: 'flex', alignItems: 'center', width: '28px', height: '28px', marginRight: '8px' }} />
                        <h1 style={styles.title}>Почтовый клиент (Демо с моками)</h1>
                    </div>

                    <div style={styles.controls}>
                        <div style={styles.searchBox}>
                            <Input
                                placeholder="Поиск писем..."
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <IconButton
                                aria-label="Search database"
                                onClick={() => handleSearch()}
                            >
                                <LuSearch />
                            </IconButton>
                        </div>

                        <IconButton
                            style={{ padding: '8px 12px' }}
                            onClick={toggleSort}
                        >
                            <FaSort />
                            {sortOrder === 'asc' ? 'Сначала старые' : 'Сначала новые'}
                        </IconButton>

                        <div style={styles.stats}>
                            <div><IoIosStats style={{ width: '20px', height: '20px', marginRight: '8px' }} /></div>
                            Всего писем: {pagination.total_emails}
                        </div>
                    </div>
                </div>

                <div>
                    {loading ? (
                        <div style={{ margin: '0 auto', textAlign: 'center', padding: '100px 0' }}>
                            <Spinner size="lg" />
                        </div>
                    ) : (
                        <>
                            <div style={styles.mainContent}>
                                <div style={styles.emailList}>
                                    {paginationLoading && (
                                        <div style={styles.spinnerOverlay}>
                                            <Spinner size="lg" color="blue.500" />
                                        </div>
                                    )}

                                    {emails.length === 0 ? (
                                        <div style={{ padding: '60px', textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                            📭 Писем не найдено
                                        </div>
                                    ) : (
                                        emails.map((email: Email) => (
                                            <div
                                                key={email.id}
                                                style={{
                                                    ...styles.emailItem,
                                                    ...(selectedEmail?.id === email.id ? styles.selectedEmail : {}),
                                                    backgroundColor: selectedEmail?.id === email.id ? '#e3f2fd' :
                                                        email.is_read ? 'white' : '#fff9c4'
                                                }}
                                                onClick={() => handleEmailClick(email.id)}
                                                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                                                    if (selectedEmail?.id !== email.id) {
                                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                    }
                                                }}
                                                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                                                    if (selectedEmail?.id !== email.id) {
                                                        e.currentTarget.style.backgroundColor = email.is_read ? 'white' : '#fff9c4';
                                                    }
                                                }}
                                            >
                                                <div style={styles.emailHeader}>
                                                    <span>👤 {email.sender_name}</span>
                                                    <span>📅 {email.date}</span>
                                                </div>
                                                <div style={styles.subject}>
                                                    {!email.is_read && '🔴 '}
                                                    {email.subject}
                                                </div>
                                                <div style={styles.preview}>
                                                    {email.body_preview}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div style={styles.detailPanel}>
                                    {detailLoading && (
                                        <div style={styles.spinnerOverlay}>
                                            <Spinner size="lg" color="blue.500" />
                                        </div>
                                    )}

                                    {selectedEmail ? (
                                        <div>
                                            <Table.Root size="sm">
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell>Тема:</Table.Cell>
                                                        <Table.Cell>{selectedEmail.subject}</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>ФИО:</Table.Cell>
                                                        <Table.Cell>{selectedEmail.sender_name}</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Email:</Table.Cell>
                                                        <Table.Cell>{selectedEmail.sender_email}</Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell>Дата:</Table.Cell>
                                                        <Table.Cell>{selectedEmail.date}</Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table.Root>

                                            <div style={styles.bodyContainer}>
                                                <div style={styles.bodyText}>{selectedEmail.body_full}</div>
                                            </div>

                                            {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                                                <div style={styles.attachments}>
                                                    <div style={styles.attachmentsTitle}>📎 Вложения:</div>
                                                    {selectedEmail.attachments.map((att: Attachment, idx: number) => (
                                                        <div key={idx} style={styles.attachmentItem}>
                                                            {att.filename} ({(att.size / 1024).toFixed(2)} KB)
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div style={styles.actionButtons}>
                                                <button style={styles.button}>📥 Скачать CSV</button>
                                                <button style={styles.button}>📊 Скачать XLSX</button>
                                                <button style={styles.button}>✉️ Сгенерировать ответ</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', color: '#666', padding: '60px' }}>
                                            Выберите письмо для просмотра
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={styles.pagination}>
                                <IconButton
                                    aria-label="Previous page"
                                    variant="ghost"
                                    size={"md"}
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={!pagination.has_prev || paginationLoading}
                                >
                                    <FaChevronCircleLeft />
                                </IconButton>
                                <span style={{ fontSize: '15px', color: '#333' }}>
                                    Страница {pagination.current_page} из {pagination.total_pages}
                                </span>
                                <IconButton
                                    aria-label="Next page"
                                    variant="ghost"
                                    size={"md"}
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={!pagination.has_next || paginationLoading}
                                >
                                    <FaChevronCircleRight />
                                </IconButton>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailList;