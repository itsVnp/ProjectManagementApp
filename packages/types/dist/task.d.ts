import { BaseEntity, Priority } from './common';
import { User } from './auth';
import { Project } from './project';
export interface Task extends BaseEntity {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: Date;
    completedAt?: Date;
    estimatedHours?: number;
    actualHours?: number;
    projectId: string;
    project: Project;
    assigneeId?: string;
    assignee?: User;
    createdById: string;
    createdBy: User;
    parentTaskId?: string;
    parentTask?: Task;
    subtasks: Task[];
    tags: string[];
    attachments: TaskAttachment[];
    comments: TaskComment[];
    timeEntries: TimeEntry[];
}
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'cancelled';
export interface TaskAttachment {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedBy: string;
    uploadedAt: Date;
}
export interface TaskComment extends BaseEntity {
    content: string;
    taskId: string;
    authorId: string;
    author: User;
    mentions: string[];
    attachments: TaskAttachment[];
}
export interface TimeEntry extends BaseEntity {
    taskId: string;
    userId: string;
    user: User;
    startTime: Date;
    endTime?: Date;
    duration?: number;
    description?: string;
    billable: boolean;
    hourlyRate?: number;
}
export interface CreateTaskData {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: Date;
    estimatedHours?: number;
    projectId: string;
    assigneeId?: string;
    parentTaskId?: string;
    tags?: string[];
}
export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Priority;
    dueDate?: Date;
    estimatedHours?: number;
    assigneeId?: string;
    parentTaskId?: string;
    tags?: string[];
}
export interface TaskFilters {
    status?: TaskStatus[];
    priority?: Priority[];
    assigneeId?: string;
    projectId?: string;
    createdById?: string;
    tags?: string[];
    dueDateRange?: {
        start: Date;
        end: Date;
    };
    isOverdue?: boolean;
}
export interface TaskStatistics {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    dueToday: number;
    dueThisWeek: number;
    averageCompletionTime: number;
}
//# sourceMappingURL=task.d.ts.map