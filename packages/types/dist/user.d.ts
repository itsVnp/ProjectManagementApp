import { BaseEntity } from './common';
export interface UserProfile extends BaseEntity {
    userId: string;
    firstName: string;
    lastName: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    phone?: string;
    location?: string;
    website?: string;
    socialLinks: SocialLinks;
    skills: string[];
    experience: Experience[];
    education: Education[];
    preferences: UserPreferences;
}
export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
    github?: string;
    portfolio?: string;
}
export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
}
export interface Education {
    id: string;
    degree: string;
    institution: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    notifications: NotificationPreferences;
    privacy: PrivacySettings;
}
export interface NotificationPreferences {
    email: {
        enabled: boolean;
        projectUpdates: boolean;
        taskAssignments: boolean;
        mentions: boolean;
        deadlineReminders: boolean;
        weeklyDigest: boolean;
    };
    push: {
        enabled: boolean;
        projectUpdates: boolean;
        taskAssignments: boolean;
        mentions: boolean;
        deadlineReminders: boolean;
    };
    sms: {
        enabled: boolean;
        urgentOnly: boolean;
    };
}
export interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'team';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMentions: boolean;
    allowDirectMessages: boolean;
}
export interface UserStats {
    totalProjects: number;
    completedProjects: number;
    totalTasks: number;
    completedTasks: number;
    totalHours: number;
    averageTaskCompletionTime: number;
    productivityScore: number;
}
export interface CreateUserProfileData {
    firstName: string;
    lastName: string;
    displayName?: string;
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
    socialLinks?: Partial<SocialLinks>;
    skills?: string[];
}
export interface UpdateUserProfileData {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
    socialLinks?: Partial<SocialLinks>;
    skills?: string[];
}
//# sourceMappingURL=user.d.ts.map