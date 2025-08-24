import { ApiResponse } from './common';
export interface ApiEndpoints {
    auth: {
        login: '/api/auth/login';
        register: '/api/auth/register';
        logout: '/api/auth/logout';
        refresh: '/api/auth/refresh';
        forgotPassword: '/api/auth/forgot-password';
        resetPassword: '/api/auth/reset-password';
        verifyEmail: '/api/auth/verify-email';
        profile: '/api/auth/profile';
    };
    users: {
        list: '/api/users';
        get: '/api/users/:id';
        create: '/api/users';
        update: '/api/users/:id';
        delete: '/api/users/:id';
    };
    projects: {
        list: '/api/projects';
        get: '/api/projects/:id';
        create: '/api/projects';
        update: '/api/projects/:id';
        delete: '/api/projects/:id';
        members: '/api/projects/:id/members';
        addMember: '/api/projects/:id/members';
        removeMember: '/api/projects/:id/members/:userId';
    };
    tasks: {
        list: '/api/tasks';
        get: '/api/tasks/:id';
        create: '/api/tasks';
        update: '/api/tasks/:id';
        delete: '/api/tasks/:id';
        comments: '/api/tasks/:id/comments';
        addComment: '/api/tasks/:id/comments';
        timeEntries: '/api/tasks/:id/time-entries';
        addTimeEntry: '/api/tasks/:id/time-entries';
    };
    dashboard: {
        overview: '/api/dashboard/overview';
        statistics: '/api/dashboard/statistics';
        recentActivity: '/api/dashboard/recent-activity';
    };
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse extends ApiResponse<{
    user: any;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}> {
}
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}
export interface RegisterResponse extends ApiResponse<{
    user: any;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}> {
}
export interface ForgotPasswordRequest {
    email: string;
}
export interface ForgotPasswordResponse extends ApiResponse<{
    message: string;
}> {
}
export interface ResetPasswordRequest {
    token: string;
    password: string;
}
export interface ResetPasswordResponse extends ApiResponse<{
    message: string;
}> {
}
export interface ApiRequest<T = any> {
    data?: T;
    params?: Record<string, string>;
    query?: Record<string, string>;
    headers?: Record<string, string>;
}
export interface ApiConfig {
    baseURL: string;
    timeout: number;
    headers: Record<string, string>;
}
export interface ApiInterceptor {
    request?: (config: any) => any;
    response?: (response: any) => any;
    error?: (error: any) => any;
}
export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: Date;
    userId?: string;
}
export interface WebSocketEvent {
    type: 'connect' | 'disconnect' | 'message' | 'error';
    data?: any;
}
export interface FileUploadRequest {
    file: File;
    type: 'avatar' | 'project' | 'task';
    entityId?: string;
}
export interface FileUploadResponse extends ApiResponse<{
    file: any;
    url: string;
}> {
}
//# sourceMappingURL=api.d.ts.map