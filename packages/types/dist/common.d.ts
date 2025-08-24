export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}
export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
export interface FileUpload {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedAt: Date;
}
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
    data?: any;
}
//# sourceMappingURL=common.d.ts.map