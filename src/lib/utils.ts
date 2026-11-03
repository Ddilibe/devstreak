import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  parseISO,
  differenceInMinutes,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function longDate(date = new Date()) {
  return format(date, "EEEE, d MMMM");
}

export function shortDate(date: Date | string) {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "d MMM");
}

export function dayKey(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}

export function relativeTime(iso: string) {
  const date = parseISO(iso);
  const mins = differenceInMinutes(new Date(), date);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMM");
}

export function deadlineLabel(iso: string) {
  const date = parseISO(iso);
  const time = format(date, "HH:mm");
  if (isToday(date)) return `Today, ${time}`;
  if (isTomorrow(date)) return `Tomorrow, ${time}`;
  if (isYesterday(date)) return `Yesterday, ${time}`;
  return `${format(date, "d MMM")}, ${time}`;
}

export function pct(value: number) {
  return `${Math.round(value)}%`;
}

export function encode(value: string) {
  return encodeURIComponent(value);
}

export function seededRandom(seed: number) {
  const x = Math.sin(seed * 99991) * 10000;
  return x - Math.floor(x);
}
