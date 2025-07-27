export interface ShortenedURL {
    shortUrl: string;
    originalUrl: string;
    timestamp: Date;
}
export interface ManagedURL {
    id: string;
    short_key: string;
    original_url: string;
    created_by: string;
    clicks?: number;
}
export interface AuditLog {
    id: string;
    action: string;
    performed_at: Date;
    performed_by: string;
}
