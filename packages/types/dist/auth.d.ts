import { BaseEntity } from './common';
export interface User extends BaseEntity {
    email: string;
    name: string;
    role: UserRole;
    isEmailVerified: boolean;
    subscriptionTier: SubscriptionTier;
    avatarUrl?: string;
    preferences?: UserPreferences;
}
export type UserRole = 'admin' | 'user' | 'manager';
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    timezone?: string;
    notifications?: NotificationSettings;
}
export interface NotificationSettings {
    email: boolean;
    push: boolean;
    sms: boolean;
    projectUpdates: boolean;
    taskAssignments: boolean;
    mentions: boolean;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    password: string;
    name: string;
}
export interface PasswordResetRequest {
    email: string;
}
export interface PasswordReset {
    token: string;
    password: string;
}
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
export interface JwtPayload {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    iat: number;
    exp: number;
}
//# sourceMappingURL=auth.d.ts.map