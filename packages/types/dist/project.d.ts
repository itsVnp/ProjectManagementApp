import { BaseEntity, Priority } from './common';
import { User } from './auth';
import { Task } from './task';
export interface Project extends BaseEntity {
    name: string;
    description?: string;
    status: ProjectStatus;
    priority: Priority;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    currency?: string;
    ownerId: string;
    owner: User;
    members: ProjectMember[];
    tasks: Task[];
    tags: string[];
    attachments: ProjectAttachment[];
    settings: ProjectSettings;
}
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    role: ProjectRole;
    joinedAt: Date;
    user: User;
}
export type ProjectRole = 'owner' | 'admin' | 'member' | 'viewer';
export interface ProjectAttachment {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
}
export interface ProjectSettings {
    allowGuestAccess: boolean;
    requireApproval: boolean;
    autoArchive: boolean;
    archiveAfterDays: number;
    notifications: {
        taskAssignments: boolean;
        projectUpdates: boolean;
        deadlineReminders: boolean;
    };
}
export interface CreateProjectData {
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    currency?: string;
    tags?: string[];
    settings?: Partial<ProjectSettings>;
}
export interface UpdateProjectData {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    priority?: Priority;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    currency?: string;
    tags?: string[];
    settings?: Partial<ProjectSettings>;
}
export interface ProjectFilters {
    status?: ProjectStatus[];
    priority?: Priority[];
    ownerId?: string;
    memberId?: string;
    tags?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
}
//# sourceMappingURL=project.d.ts.map