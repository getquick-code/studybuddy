import { format, isSameDay, isToday, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths, isWeekend, parseISO } from "date-fns";
import { nl, fr, enUS } from "date-fns/locale";
import type { Exam, StudyTask } from "@shared/schema";
import { ChevronLeft, ChevronRight, Star, Eye, EyeOff, GripVertical } from "lucide-react";
import { useState } from "react";
import { cn, subjectColors, formatDateForDB } from "@/lib/utils";
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useLanguage } from "@/lib/useLanguage";

const dateLocales = { nl, fr, en: enUS };

function ExamLabel({ exam }: { exam: Exam }) {
  const { t } = useLanguage();
  const subjectName = t.subjects[exam.subject] || exam.subject;
  return <span className="truncate">{subjectName}: {exam.title}</span>;
}

interface MonthGridProps {
  exams: Exam[];
  tasks: StudyTask[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

function DraggableCalendarTask({ task, exam }: { task: StudyTask; exam: Exam | undefined }) {
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100,
  } : undefined;

  const subjectName = exam ? t.subjects[exam.subject] || exam.subject : t.subjects.other;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1 cursor-grab active:cursor-grabbing opacity-80",
        subjectColors[exam?.subject || "other"] || subjectColors["other"],
        isDragging && "opacity-50 ring-1 ring-primary shadow-lg"
      )}
      data-testid={`task-badge-${task.id}`}
      {...listeners}
      {...attributes}
      onClick={(e) => e.stopPropagation()}
    >
      <GripVertical className="w-2.5 h-2.5 shrink-0 opacity-50" />
      <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", task.completed ? "bg-green-500" : "bg-current")} />
      <span className="truncate">{subjectName}: {task.title}</span>
    </div>
  );
}

function DayCell({ day, exams, tasks, onSelectDate, selectedDate, currentMonth }: {
  day: Date;
  exams: Exam[];
  tasks: StudyTask[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  currentMonth: Date;
}) {
  const dateStr = formatDateForDB(day);
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
  });

  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
  const dayExams = exams.filter((e) => e.date === dateStr);
  const dayTasks = tasks.filter((t) => t.date === dateStr);
  const isSelected = isSameDay(day, selectedDate);
  const isCurrentDay = isToday(day);
  const isWknd = isWeekend(day);

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelectDate(day)}
      className={cn(
        "min-h-[140px] p-2 border-r border-slate-50 transition-all cursor-pointer relative group flex flex-col last:border-r-0",
        !isCurrentMonth && "bg-slate-50/50 text-slate-400",
        isCurrentMonth && !isWknd && "bg-white hover:bg-indigo-50/30",
        isCurrentMonth && isWknd && "bg-slate-50/30 hover:bg-indigo-50/30",
        isSelected && "ring-2 ring-inset ring-primary bg-indigo-50/50 z-10",
        isOver && "bg-indigo-100/50 ring-2 ring-indigo-400"
      )}
      data-testid={`day-cell-${dateStr}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={cn(
            "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
            isCurrentDay ? "bg-primary text-white" : "text-slate-700",
            !isCurrentMonth && "text-slate-400",
            isWknd && isCurrentMonth && !isCurrentDay && "text-slate-400"
          )}
        >
          {format(day, "d")}
        </span>
        {dayExams.length > 0 && (
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
        )}
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 max-h-[120px] custom-scrollbar">
        {dayExams.map((exam) => (
          <div
            key={exam.id}
            className={cn(
              "text-[10px] px-1.5 py-1 rounded truncate shadow-md mb-1 border-2 border-current/20 flex items-center gap-1",
              subjectColors[exam.subject] || subjectColors["other"]
            )}
            data-testid={`exam-badge-${exam.id}`}
          >
            <Star className="w-3 h-3 shrink-0 fill-current" />
            <ExamLabel exam={exam} />
          </div>
        ))}
        
        {dayTasks.map((task) => {
          const exam = exams.find(e => e.id === task.examId);
          return (
            <DraggableCalendarTask
              key={task.id}
              task={task}
              exam={exam}
            />
          );
        })}
      </div>
    </div>
  );
}

export function MonthGrid({ exams, tasks, onSelectDate, selectedDate }: MonthGridProps) {
  const { language, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); 
  const [hiddenWeeks, setHiddenWeeks] = useState<number[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  calendarDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const toggleWeekVisibility = (weekIndex: number) => {
    if (hiddenWeeks.includes(weekIndex)) {
      setHiddenWeeks(hiddenWeeks.filter(id => id !== weekIndex));
    } else {
      setHiddenWeeks([...hiddenWeeks, weekIndex]);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-6 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-2xl font-display font-bold text-indigo-900 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: dateLocales[language] })}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/50 rounded-full transition-colors text-indigo-600" data-testid="button-prev-month">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/50 rounded-full transition-colors text-indigo-600" data-testid="button-next-month">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] border-b border-slate-100 bg-slate-50">
        <div className="w-8"></div>
        <div className="grid grid-cols-7 w-full">
          {t.calendar.weekdays.map((day, index) => (
            <div 
              key={index} 
              className={cn(
                "py-3 text-center text-sm font-bold uppercase tracking-wider",
                index < 5 ? "text-indigo-600" : "text-slate-400"
              )}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {weeks.map((week, weekIndex) => {
          const isHidden = hiddenWeeks.includes(weekIndex);
          
          return (
            <div key={weekIndex} className="flex border-b border-slate-50 last:border-0">
              <div className="w-8 flex items-center justify-center border-r border-slate-50 bg-slate-50/30">
                <button 
                  onClick={() => toggleWeekVisibility(weekIndex)}
                  className="text-slate-300 hover:text-indigo-500 transition-colors"
                  title={isHidden ? t.calendar.showWeek : t.calendar.hideWeek}
                  data-testid={`button-toggle-week-${weekIndex}`}
                >
                  {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isHidden ? (
                <div className="w-full h-12 bg-slate-50/50 flex items-center justify-center text-slate-400 text-sm italic">
                  {t.calendar.weekHidden}
                </div>
              ) : (
                <div className="grid grid-cols-7 w-full">
                  {week.map((day) => (
                    <DayCell
                      key={day.toISOString()}
                      day={day}
                      exams={exams}
                      tasks={tasks}
                      onSelectDate={onSelectDate}
                      selectedDate={selectedDate}
                      currentMonth={currentMonth}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
