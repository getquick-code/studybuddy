import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Exam } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const subjectColors: Record<string, string> = {
  dutch: "bg-orange-100 text-orange-700",
  french: "bg-rose-100 text-rose-700",
  english: "bg-sky-100 text-sky-700",
  german: "bg-yellow-100 text-yellow-700",
  spanish: "bg-red-100 text-red-700",
  latin: "bg-purple-100 text-purple-700",
  greek: "bg-violet-100 text-violet-700",
  math: "bg-blue-100 text-blue-700",
  physics: "bg-cyan-100 text-cyan-700",
  chemistry: "bg-teal-100 text-teal-700",
  biology: "bg-lime-100 text-lime-700",
  science: "bg-emerald-100 text-emerald-700",
  geography: "bg-stone-200 text-stone-700",
  history: "bg-amber-100 text-amber-700",
  economics: "bg-indigo-100 text-indigo-700",
  religion: "bg-pink-100 text-pink-700",
  ethics: "bg-fuchsia-100 text-fuchsia-700",
  music: "bg-green-100 text-green-700",
  art: "bg-gray-200 text-gray-700",
  pe: "bg-neutral-200 text-neutral-700",
  ict: "bg-slate-200 text-slate-700",
  technology: "bg-zinc-300 text-zinc-700",
  other: "bg-zinc-100 text-zinc-600",
};

export const subjectNames: Record<string, string> = {
  dutch: "Nederlands",
  french: "Frans",
  english: "Engels",
  german: "Duits",
  spanish: "Spaans",
  latin: "Latijn",
  greek: "Grieks",
  math: "Wiskunde",
  physics: "Fysica",
  chemistry: "Chemie",
  biology: "Biologie",
  science: "Natuurwetenschappen",
  geography: "Aardrijkskunde",
  history: "Geschiedenis",
  economics: "Economie",
  religion: "Godsdienst",
  ethics: "Zedenleer",
  music: "Muziek",
  art: "Plastische opvoeding",
  pe: "Lichamelijke opvoeding",
  ict: "Informatica",
  technology: "Technologie",
  other: "Overig",
};

export function getExamByDate(exams: Exam[], dateStr: string): Exam | undefined {
  return exams.find(exam => exam.date === dateStr);
}

export function formatDateForDB(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
