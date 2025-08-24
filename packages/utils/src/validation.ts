import { z } from 'zod';

/**
 * Validation utilities using Zod
 */

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .optional();

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .optional();

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
});

// Project validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().positive('Budget must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.date().optional(),
  estimatedHours: z.number().positive('Estimated hours must be positive').optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  assigneeId: z.string().optional(),
  parentTaskId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

// User validation schemas
export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name must be less than 50 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: phoneSchema,
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: urlSchema,
});

// Utility functions
export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error.errors.map(e => e.message) };
    }
    return { isValid: false, errors: ['Invalid password'] };
  }
}

export function validateForm<T>(schema: z.ZodSchema<T>, data: any): { isValid: boolean; errors: Record<string, string>; data?: T } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, errors: {}, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Type exports
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;
export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>; 