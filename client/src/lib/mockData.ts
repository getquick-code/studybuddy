import { addDays, subDays, format, eachDayOfInterval, isSameDay } from "date-fns";
import { v4 as uuidv4 } from "uuid"; // We'll use a simple random ID generator if uuid isn't available, but for now mock strings are fine

export type Subject = "latin" | "math" | "dutch" | "geography" | "science" | "french" | "other";

export interface Exam {
  id: string;
  subject: Subject;
  title: string;
  date: Date;
  difficulty: "hard" | "medium" | "easy";
  description?: string;
  understanding: number; // 0-100 percentage
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudyTask {
  id: string;
  examId: string;
  title: string;
  date: Date; // The date this study task is scheduled for
  completed: boolean;
  durationMinutes: number;
  subtasks: SubTask[];
}

// Initial exams based on user request
// 1 Latin 8 dec
// 2 Math 9 dec
// 3 Dutch 10 dec
// 4 Geo 11 dec
// 5 Science 11 dec
// 6 French 12 dec
// Study starts 1 dec
// Science and Geo are smaller

const createDate = (day: number) => new Date(2025, 11, day); // Month is 0-indexed, 11 is Dec

export const initialExams: Exam[] = [
  {
    id: "ex-1",
    subject: "latin",
    title: "Examen Latijn",
    date: createDate(8),
    difficulty: "hard",
    description: "Woordenschat & Grammatica: Declinaties 1-3",
    understanding: 60
  },
  {
    id: "ex-2",
    subject: "math",
    title: "Examen Wiskunde",
    date: createDate(9),
    difficulty: "hard",
    description: "Algebra & Meetkunde",
    understanding: 45
  },
  {
    id: "ex-3",
    subject: "dutch",
    title: "Examen Nederlands",
    date: createDate(10),
    difficulty: "medium",
    description: "Begrijpend lezen & Spelling",
    understanding: 80
  },
  {
    id: "ex-4",
    subject: "geography",
    title: "Examen Natuurkunde", // User asked for Geography = Natuurkunde
    date: createDate(11),
    difficulty: "easy",
    description: "Europese Landen & Klimaat",
    understanding: 75
  },
  {
    id: "ex-5",
    subject: "science",
    title: "Examen Aardrijkskunde", // Renamed from Wetenschappen to Aardrijkskunde
    date: createDate(11),
    difficulty: "easy",
    description: "Ecosystemen & Cellen",
    understanding: 70
  },
  {
    id: "ex-6",
    subject: "french",
    title: "Examen Frans",
    date: createDate(12),
    difficulty: "medium",
    description: "Werkwoorden 'avoir' & 'être', basiswoordenschat",
    understanding: 50
  }
];

// Generate a default study plan
export const generateInitialTasks = (exams: Exam[]): StudyTask[] => {
  const tasks: StudyTask[] = [];
  
  // Latin (Dec 8)
  tasks.push({ 
    id: "t-lat-1", 
    examId: "ex-1", 
    title: "Latijn: Woordenschat herhalen", 
    date: createDate(1), 
    completed: false, 
    durationMinutes: 45,
    subtasks: [
      { id: "st-lat-1-1", title: "Woordjes hfdst 1-3", completed: false },
      { id: "st-lat-1-2", title: "Woordjes hfdst 4-6", completed: false }
    ]
  });
  tasks.push({ id: "t-lat-2", examId: "ex-1", title: "Latijn: Grammatica regels", date: createDate(3), completed: false, durationMinutes: 45, subtasks: [] });
  tasks.push({ id: "t-lat-3", examId: "ex-1", title: "Latijn: Oefentekst vertalen", date: createDate(6), completed: false, durationMinutes: 60, subtasks: [] });
  tasks.push({ id: "t-lat-4", examId: "ex-1", title: "Latijn: Alles herhalen", date: createDate(7), completed: false, durationMinutes: 30, subtasks: [] });

  // Math (Dec 9)
  tasks.push({ id: "t-mat-1", examId: "ex-2", title: "Wiskunde: Algebra oefeningen", date: createDate(2), completed: false, durationMinutes: 45, subtasks: [] });
  tasks.push({ id: "t-mat-2", examId: "ex-2", title: "Wiskunde: Meetkunde bewijzen", date: createDate(5), completed: false, durationMinutes: 45, subtasks: [] });
  tasks.push({ id: "t-mat-3", examId: "ex-2", title: "Wiskunde: Proefexamen", date: createDate(7), completed: false, durationMinutes: 60, subtasks: [] });
  tasks.push({ id: "t-mat-4", examId: "ex-2", title: "Wiskunde: Formules leren", date: createDate(8), completed: false, durationMinutes: 30, subtasks: [] });

  // Dutch (Dec 10)
  tasks.push({ id: "t-dut-1", examId: "ex-3", title: "Nederlands: Spellingsregels", date: createDate(4), completed: false, durationMinutes: 40, subtasks: [] });
  tasks.push({ id: "t-dut-2", examId: "ex-3", title: "Nederlands: Leesoefening", date: createDate(8), completed: false, durationMinutes: 40, subtasks: [] });
  tasks.push({ id: "t-dut-3", examId: "ex-3", title: "Nederlands: Samenvatting", date: createDate(9), completed: false, durationMinutes: 30, subtasks: [] });

  // Geography (Dec 11) -> Natuurkunde
  tasks.push({ id: "t-geo-1", examId: "ex-4", title: "Natuurkunde: Kaarten studeren", date: createDate(6), completed: false, durationMinutes: 30, subtasks: [] });
  tasks.push({ id: "t-geo-2", examId: "ex-4", title: "Natuurkunde: Hoofdsteden quiz", date: createDate(9), completed: false, durationMinutes: 30, subtasks: [] });

  // Science (Dec 11) -> Aardrijkskunde
  tasks.push({ id: "t-sci-1", examId: "ex-5", title: "Aardrijkskunde: Hfdst 4 lezen", date: createDate(5), completed: false, durationMinutes: 30, subtasks: [] });
  tasks.push({ id: "t-sci-2", examId: "ex-5", title: "Aardrijkskunde: Definities", date: createDate(10), completed: false, durationMinutes: 30, subtasks: [] });

  // French (Dec 12)
  tasks.push({ id: "t-fre-1", examId: "ex-6", title: "Frans: Woordenlijst", date: createDate(2), completed: false, durationMinutes: 30, subtasks: [] });
  tasks.push({ id: "t-fre-2", examId: "ex-6", title: "Frans: Werkwoorden vervoegen", date: createDate(10), completed: false, durationMinutes: 45, subtasks: [] });
  tasks.push({ id: "t-fre-3", examId: "ex-6", title: "Frans: Mondeling oefenen", date: createDate(11), completed: false, durationMinutes: 30, subtasks: [] });

  return tasks;
};

export const subjectColors: Record<Subject, string> = {
  latin: "bg-chart-1 text-white border-chart-1",
  math: "bg-chart-2 text-white border-chart-2",
  dutch: "bg-chart-3 text-white border-chart-3",
  geography: "bg-chart-4 text-white border-chart-4",
  science: "bg-chart-4 text-white border-chart-4",
  french: "bg-chart-5 text-white border-chart-5",
  other: "bg-gray-500 text-white border-gray-500"
};

export const subjectSoftColors: Record<Subject, string> = {
  latin: "bg-purple-100 text-purple-700 border-purple-200",
  math: "bg-sky-100 text-sky-700 border-sky-200",
  dutch: "bg-orange-100 text-orange-700 border-orange-200",
  geography: "bg-teal-100 text-teal-700 border-teal-200",
  science: "bg-teal-100 text-teal-700 border-teal-200",
  french: "bg-pink-100 text-pink-700 border-pink-200",
  other: "bg-gray-100 text-gray-700 border-gray-200"
};

export const subjectNames: Record<Subject, string> = {
  latin: "Latijn",
  math: "Wiskunde",
  dutch: "Nederlands",
  geography: "Natuurkunde",
  science: "Aardrijkskunde",
  french: "Frans",
  other: "Andere"
};
