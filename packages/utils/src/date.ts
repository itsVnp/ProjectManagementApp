import { format, formatDistance, formatRelative, isToday, isYesterday, isTomorrow, addDays, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

/**
 * Date utility functions using date-fns
 */

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(date, formatStr);
}

/**
 * Formats a date to show relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true });
}

/**
 * Formats a date to show relative date (e.g., "yesterday", "today")
 */
export function formatRelativeDate(date: Date): string {
  return formatRelative(date, new Date());
}

/**
 * Checks if a date is today
 */
export function isDateToday(date: Date): boolean {
  return isToday(date);
}

/**
 * Checks if a date is yesterday
 */
export function isDateYesterday(date: Date): boolean {
  return isYesterday(date);
}

/**
 * Checks if a date is tomorrow
 */
export function isDateTomorrow(date: Date): boolean {
  return isTomorrow(date);
}

/**
 * Gets a human-readable date string
 */
export function getHumanReadableDate(date: Date): string {
  if (isDateToday(date)) {
    return 'Today';
  }
  if (isDateYesterday(date)) {
    return 'Yesterday';
  }
  if (isDateTomorrow(date)) {
    return 'Tomorrow';
  }
  return formatDate(date);
}

/**
 * Gets the start of a day
 */
export function getStartOfDay(date: Date): Date {
  return startOfDay(date);
}

/**
 * Gets the end of a day
 */
export function getEndOfDay(date: Date): Date {
  return endOfDay(date);
}

/**
 * Gets the start of a week
 */
export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
}

/**
 * Gets the end of a week
 */
export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 }); // Monday
}

/**
 * Gets the start of a month
 */
export function getStartOfMonth(date: Date): Date {
  return startOfMonth(date);
}

/**
 * Gets the end of a month
 */
export function getEndOfMonth(date: Date): Date {
  return endOfMonth(date);
}

/**
 * Adds days to a date
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days);
}

/**
 * Subtracts days from a date
 */
export function subtractDaysFromDate(date: Date, days: number): Date {
  return subDays(date, days);
}

/**
 * Calculates the difference in days between two dates
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  return differenceInDays(date1, date2);
}

/**
 * Calculates the difference in hours between two dates
 */
export function getHoursDifference(date1: Date, date2: Date): number {
  return differenceInHours(date1, date2);
}

/**
 * Calculates the difference in minutes between two dates
 */
export function getMinutesDifference(date1: Date, date2: Date): number {
  return differenceInMinutes(date1, date2);
}

/**
 * Formats a duration in minutes to a human-readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Formats a time entry duration
 */
export function formatTimeEntry(startTime: Date, endTime?: Date): string {
  if (!endTime) {
    return 'In progress';
  }
  const minutes = getMinutesDifference(endTime, startTime);
  return formatDuration(minutes);
}

/**
 * Gets the week number of a date
 */
export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/**
 * Checks if a date is overdue
 */
export function isOverdue(date: Date): boolean {
  return date < new Date();
}

/**
 * Gets the number of days until a date
 */
export function getDaysUntil(date: Date): number {
  return getDaysDifference(date, new Date());
}

/**
 * Gets the number of days since a date
 */
export function getDaysSince(date: Date): number {
  return getDaysDifference(new Date(), date);
}

/**
 * Formats a date range
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getTime() === endDate.getTime()) {
    return formatDate(startDate);
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

/**
 * Gets the current timestamp
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * Converts a timestamp to a Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}

/**
 * Converts a Date object to a timestamp
 */
export function dateToTimestamp(date: Date): number {
  return date.getTime();
} 