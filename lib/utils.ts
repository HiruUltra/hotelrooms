import { clsx, type ClassValue } from "clsx";
import { differenceInCalendarDays, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nightsBetween(checkIn: Date | string, checkOut: Date | string) {
  return Math.max(0, differenceInCalendarDays(new Date(checkOut), new Date(checkIn)));
}

export function formatMoney(amount: number, currency = "LKR") {
  return `${currency} ${new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)}`;
}

export function formatDateTime(value: Date | string) {
  return format(new Date(value), "PP p");
}

export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
