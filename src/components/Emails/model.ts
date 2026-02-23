export interface Email {
  id: string;
  date: string;
  timestamp: number;
  sender_name: string;
  sender_email: string;
  subject: string;
  body_preview: string;
  body_full: string;
  is_read: boolean;
}

export interface Attachment {
  filename: string;
  size: number;
}

export interface EmailDetail extends Email {
  attachments?: Attachment[];
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_emails: number;
  has_next: boolean;
  has_prev: boolean;
  sort_order?: string;
}

export interface EmailsResponse {
  success: boolean;
  data?: {
    emails: Email[];
    pagination: PaginationInfo;
  };
  error?: string;
}

export interface EmailDetailResponse {
  success: boolean;
  data?: EmailDetail;
  error?: string;
}

export interface SearchResponse {
  success: boolean;
  data?: {
    query: string;
    emails: Email[];
    pagination: PaginationInfo;
  };
  error?: string;
}