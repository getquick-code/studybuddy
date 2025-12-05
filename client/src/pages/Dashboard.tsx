import { useState, useEffect, useRef } from "react";
import type { Exam, StudyTask, SubTask, User } from "@shared/schema";
import { MonthGrid } from "@/components/MonthGrid";
import { TaskList } from "@/components/TaskList";
import { TaskSuggestionModal } from "@/components/TaskSuggestionModal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { format, isSameDay, parseISO } from "date-fns";
import { nl, fr, enUS } from "date-fns/locale";
import { Trophy, Calendar as CalendarIcon, PieChart, Pencil, Plus, Trash2, X, BarChart3, Globe, LogOut, ChevronDown, FolderOpen, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { Templates } from "@/components/Templates";
import { Slider } from "@/components/ui/slider";
import { subjectColors, formatDateForDB } from "@/lib/utils";
import * as api from "@/lib/api";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from "@/lib/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import type { Language } from "@/lib/i18n";
import type { SuggestedTask } from "@/lib/taskTemplates";

const dateLocales = { nl, fr, en: enUS };

export default function Dashboard() {
  const { language, setLanguage, setLanguageFromUser, t, languageNames } = useLanguage();
  const { user: authUser } = useAuth();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 11, 1));
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [editingExamField, setEditingExamField] = useState<"title" | "date" | "description" | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [showAddExam, setShowAddExam] = useState(false);
  const [newExamSubject, setNewExamSubject] = useState("other");
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [newExamDescription, setNewExamDescription] = useState("");
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTaskSuggestions, setShowTaskSuggestions] = useState(false);
  const [newlyCreatedExam, setNewlyCreatedExam] = useState<Exam | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (authUser) {
      loadData(authUser.id);
      if (authUser.language) {
        setLanguageFromUser(authUser.language as Language);
      }
    }
  }, [authUser]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadData(userId: number) {
    try {
      setLoading(true);
      const [examsData, tasksData, subtasksData] = await Promise.all([
        api.fetchExams(userId),
        api.fetchTasks(userId),
        api.fetchAllSubTasks(userId),
      ]);
      setExams(examsData);
      setTasks(tasksData);
      setSubtasks(subtasksData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleTask(taskId: number) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updated = await api.updateTask(taskId, { completed: !task.completed });
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
  }

  async function handleUpdateTaskTitle(taskId: number, newTitle: string) {
    if (!newTitle.trim()) return;
    const updated = await api.updateTask(taskId, { title: newTitle });
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
  }

  async function handleAddSubTask(taskId: number, title: string) {
    const taskSubtasks = subtasks.filter(st => st.taskId === taskId);
    const maxOrder = taskSubtasks.length > 0 ? Math.max(...taskSubtasks.map(st => st.orderIndex)) : -1;
    const newSubTask = await api.createSubTask(taskId, title, maxOrder + 1);
    setSubtasks([...subtasks, newSubTask]);
  }

  async function handleToggleSubTask(subTaskId: number) {
    const subtask = subtasks.find(st => st.id === subTaskId);
    if (!subtask) return;
    const updated = await api.updateSubTask(subTaskId, { completed: !subtask.completed });
    setSubtasks(subtasks.map(st => st.id === subTaskId ? updated : st));
  }

  async function handleUpdateSubTask(subTaskId: number, title: string) {
    const updated = await api.updateSubTask(subTaskId, { title });
    setSubtasks(subtasks.map(st => st.id === subTaskId ? updated : st));
  }

  async function handleDeleteSubTask(subTaskId: number) {
    await api.deleteSubTask(subTaskId);
    setSubtasks(subtasks.filter(st => st.id !== subTaskId));
  }

  async function handleAddTask(title: string, examId: number) {
    if (!authUser) return;
    const dateStr = formatDateForDB(selectedDate);
    const tasksOnDate = tasks.filter(t => t.date === dateStr);
    const maxOrder = tasksOnDate.length > 0 ? Math.max(...tasksOnDate.map(t => t.orderIndex)) : -1;
    
    const newTask = await api.createTask({
      userId: authUser.id,
      title,
      examId,
      date: dateStr,
      completed: false,
      durationMinutes: 60,
      orderIndex: maxOrder + 1,
    });
    setTasks([...tasks, newTask]);
  }

  async function handleDeleteTask(taskId: number) {
    await api.deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
    setSubtasks(subtasks.filter(st => st.taskId !== taskId));
  }

  async function handleDuplicateTask(taskId: number) {
    try {
      const duplicatedTask = await api.duplicateTask(taskId);
      setTasks([...tasks, duplicatedTask]);
      
      const newSubtasks = await api.fetchSubTasks(duplicatedTask.id);
      setSubtasks([...subtasks, ...newSubtasks]);
    } catch (error) {
      console.error("Failed to duplicate task:", error);
    }
  }

  async function handleUpdateExamTitle(examId: number, newTitle: string) {
    if (!newTitle.trim()) return;
    const updated = await api.updateExam(examId, { title: newTitle });
    setExams(exams.map(e => e.id === examId ? updated : e));
  }

  async function handleUpdateExamDate(examId: number, newDate: string) {
    const updated = await api.updateExam(examId, { date: newDate });
    setExams(exams.map(e => e.id === examId ? updated : e));
  }

  async function handleUpdateExamDescription(examId: number, newDesc: string) {
    const updated = await api.updateExam(examId, { description: newDesc });
    setExams(exams.map(e => e.id === examId ? updated : e));
  }

  async function handleUpdateExamUnderstanding(examId: number, newValue: number) {
    const updated = await api.updateExam(examId, { understanding: newValue });
    setExams(exams.map(e => e.id === examId ? updated : e));
  }

  async function handleUpdateExamResults(examId: number, newValue: number) {
    const updated = await api.updateExam(examId, { results: newValue });
    setExams(exams.map(e => e.id === examId ? updated : e));
  }

  async function handleCreateExam() {
    if (!authUser || !newExamTitle.trim() || !newExamDate) return;
    try {
      const newExam = await api.createExam({
        userId: authUser.id,
        subject: newExamSubject,
        title: newExamTitle.trim(),
        date: newExamDate,
        difficulty: "medium",
        description: newExamDescription.trim() || undefined,
        understanding: 0,
        results: 0,
      });
      setExams([...exams, newExam]);
      setShowAddExam(false);
      setNewExamSubject("other");
      setNewExamTitle("");
      setNewExamDate("");
      setNewExamDescription("");
      
      setNewlyCreatedExam(newExam);
      setShowTaskSuggestions(true);
    } catch (error) {
      console.error("Failed to create exam:", error);
    }
  }

  async function handleConfirmTaskSuggestions(suggestedTasks: SuggestedTask[]) {
    if (!authUser || !newlyCreatedExam) return;
    
    try {
      const createdTasks: StudyTask[] = [];
      for (let i = 0; i < suggestedTasks.length; i++) {
        const task = suggestedTasks[i];
        const newTask = await api.createTask({
          userId: authUser.id,
          examId: newlyCreatedExam.id,
          title: task.title,
          date: task.date,
          completed: false,
          durationMinutes: task.durationMinutes,
          orderIndex: i,
        });
        createdTasks.push(newTask);
      }
      setTasks([...tasks, ...createdTasks]);
      setShowTaskSuggestions(false);
      setNewlyCreatedExam(null);
    } catch (error) {
      console.error("Failed to create suggested tasks:", error);
    }
  }

  function handleCloseTaskSuggestions() {
    setShowTaskSuggestions(false);
    setNewlyCreatedExam(null);
  }

  async function handleDeleteExam(examId: number) {
    try {
      const examTasks = tasks.filter(t => t.examId === examId);
      const examTaskIds = examTasks.map(t => t.id);
      
      await api.deleteExam(examId);
      setExams(exams.filter(e => e.id !== examId));
      setTasks(tasks.filter(t => t.examId !== examId));
      setSubtasks(subtasks.filter(st => !examTaskIds.includes(st.taskId)));
    } catch (error) {
      console.error("Failed to delete exam:", error);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(Number(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) return;

    const taskId = Number(active.id);
    const newDateStr = String(over.id);

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.date === newDateStr) return;

    const tasksOnNewDate = tasks.filter(t => t.date === newDateStr);
    const maxOrder = tasksOnNewDate.length > 0 ? Math.max(...tasksOnNewDate.map(t => t.orderIndex)) : -1;

    try {
      const updated = await api.moveTask(taskId, newDateStr, maxOrder + 1);
      setTasks(tasks.map(t => t.id === taskId ? updated : t));
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  }

  const selectedDateStr = formatDateForDB(selectedDate);
  const selectedTasks = tasks.filter(t => t.date === selectedDateStr);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedTasks / totalTasks) * 100) || 0;

  const activeTask = activeTaskId ? tasks.find(t => t.id === activeTaskId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg font-medium text-slate-600">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background pb-20">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-slate-800" data-testid="text-app-title">{t.header.title}</h1>
                <p className="text-xs text-slate-500 font-medium">{t.messages.youGotThis} 🎓</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.messages.totalProgress}</div>
                <div className="font-display font-bold text-primary" data-testid="text-progress-percentage">{progress}% {t.messages.done}</div>
              </div>
              <div className="w-32 hidden md:block">
                <ProgressBar value={progress} />
              </div>

              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors"
                  data-testid="button-language-dropdown"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700 text-sm">{languageNames[language]}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-slate-100 shadow-lg py-2 z-50">
                    {(Object.keys(languageNames) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={async () => {
                          setLanguage(lang);
                          setShowLanguageDropdown(false);
                          if (authUser) {
                            try {
                              await api.updateUserLanguage(authUser.id, lang);
                            } catch (error) {
                              console.error("Failed to save language preference:", error);
                            }
                          }
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-left ${language === lang ? 'bg-primary/5' : ''}`}
                        data-testid={`button-select-lang-${lang}`}
                      >
                        <span className="font-medium text-slate-700">{languageNames[lang]}</span>
                        {language === lang && (
                          <span className="ml-auto text-xs text-primary font-bold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/help"
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors text-slate-600"
                data-testid="button-help"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Help</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
                  {authUser?.profileImageUrl ? (
                    <img 
                      src={authUser.profileImageUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${authUser?.name || 'default'}&backgroundColor=e0e7ff`} 
                      alt="Avatar" 
                      className="w-full h-full"
                    />
                  )}
                </div>
                <span className="font-medium text-slate-700 max-w-[100px] truncate hidden md:block" data-testid="text-current-user">
                  {authUser?.name}
                </span>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors text-slate-600"
                  data-testid="button-templates"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{t.templates.title}</span>
                </button>
                <a
                  href="/api/logout"
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition-colors text-slate-600"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">{t.common.logout}</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full px-6 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-9 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-display font-bold text-slate-800">{t.messages.yourPlanning}</h2>
                <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm capitalize">
                  {format(selectedDate, "MMMM yyyy", { locale: dateLocales[language] })}
                </span>
              </div>
              <MonthGrid 
                exams={exams} 
                tasks={tasks} 
                onSelectDate={setSelectedDate} 
                selectedDate={selectedDate} 
              />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-slate-800">{t.exams.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowResultsModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
                    data-testid="button-results-dashboard"
                  >
                    <BarChart3 className="w-4 h-4" />
                    {t.header.resultsOverview}
                  </button>
                  <button
                    onClick={() => setShowAddExam(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
                    data-testid="button-add-exam"
                  >
                    <Plus className="w-4 h-4" />
                    {t.header.add}
                  </button>
                </div>
              </div>

              {showAddExam && (
                <div className="bg-white p-5 rounded-2xl border-2 border-primary/20 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-slate-800">{t.messages.newExamTest}</h4>
                    <button
                      onClick={() => {
                        setShowAddExam(false);
                        setNewExamSubject("other");
                        setNewExamTitle("");
                        setNewExamDate("");
                        setNewExamDescription("");
                      }}
                      className="text-slate-400 hover:text-slate-600"
                      data-testid="button-cancel-add-exam"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.exams.subject}</label>
                      <select
                        value={newExamSubject}
                        onChange={(e) => setNewExamSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        data-testid="select-exam-subject"
                      >
                        {Object.keys(t.subjects).map((key) => (
                          <option key={key} value={key}>{t.subjects[key]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.exams.date}</label>
                      <input
                        type="date"
                        value={newExamDate}
                        onChange={(e) => setNewExamDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        data-testid="input-exam-date"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.exams.examTitle}</label>
                      <input
                        type="text"
                        value={newExamTitle}
                        onChange={(e) => setNewExamTitle(e.target.value)}
                        placeholder={t.messages.exampleTitle}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        data-testid="input-exam-title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.exams.description} ({t.messages.optional})</label>
                      <input
                        type="text"
                        value={newExamDescription}
                        onChange={(e) => setNewExamDescription(e.target.value)}
                        placeholder={t.messages.exampleDescription}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        data-testid="input-exam-description-new"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => {
                        setShowAddExam(false);
                        setNewExamSubject("other");
                        setNewExamTitle("");
                        setNewExamDate("");
                        setNewExamDescription("");
                      }}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800"
                      data-testid="button-cancel-exam"
                    >
                      {t.exams.cancel}
                    </button>
                    <button
                      onClick={handleCreateExam}
                      disabled={!newExamTitle.trim() || !newExamDate}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="button-save-exam"
                    >
                      {t.exams.save}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
                {exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => (
                  <div key={exam.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden" data-testid={`card-exam-${exam.id}`}>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-10"
                      title={t.exams.delete}
                      data-testid={`button-delete-exam-${exam.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${subjectColors[exam.subject]?.split(" ")[0] || "bg-slate-200"}`} />
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${subjectColors[exam.subject] || "bg-slate-100 text-slate-700"}`}>
                          {t.subjects[exam.subject] || exam.subject}
                        </span>
                        {editingExamId === exam.id && editingExamField === "title" ? (
                          <input
                            type="text"
                            autoFocus
                            defaultValue={exam.title}
                            className="w-full font-display font-bold text-lg text-slate-800 border-b border-primary focus:outline-none bg-transparent mt-2"
                            data-testid={`input-exam-title-${exam.id}`}
                            onBlur={(e) => {
                              handleUpdateExamTitle(exam.id, e.target.value);
                              setEditingExamId(null);
                              setEditingExamField(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateExamTitle(exam.id, e.currentTarget.value);
                                setEditingExamId(null);
                                setEditingExamField(null);
                              }
                            }}
                          />
                        ) : (
                          <h4 
                            className="font-display font-bold text-lg text-slate-800 mt-2 group-hover:text-primary transition-colors cursor-pointer"
                            onClick={() => {
                              setEditingExamId(exam.id);
                              setEditingExamField("title");
                            }}
                            data-testid={`text-exam-title-${exam.id}`}
                          >
                            {exam.title} <Pencil className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-50" />
                          </h4>
                        )}
                      </div>
                      {editingExamId === exam.id && editingExamField === "date" ? (
                        <input
                          type="date"
                          autoFocus
                          defaultValue={exam.date}
                          className="text-center bg-slate-50 rounded-lg p-2 border border-primary focus:outline-none"
                          data-testid={`input-exam-date-${exam.id}`}
                          onBlur={(e) => {
                            handleUpdateExamDate(exam.id, e.target.value);
                            setEditingExamId(null);
                            setEditingExamField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateExamDate(exam.id, e.currentTarget.value);
                              setEditingExamId(null);
                              setEditingExamField(null);
                            }
                          }}
                        />
                      ) : (
                        <div 
                          className="text-center bg-slate-50 rounded-lg p-2 min-w-[60px] cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => {
                            setEditingExamId(exam.id);
                            setEditingExamField("date");
                          }}
                          title={t.messages.clickToChangeDate}
                          data-testid={`button-edit-exam-date-${exam.id}`}
                        >
                          <div className="text-xs text-slate-400 font-bold uppercase">{format(parseISO(exam.date), "MMM", { locale: dateLocales[language] })}</div>
                          <div className="text-xl font-display font-bold text-slate-800">{format(parseISO(exam.date), "d")}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pl-2 mb-4 relative group/desc">
                      {editingExamId === exam.id && editingExamField === "description" ? (
                        <input 
                          type="text" 
                          autoFocus
                          defaultValue={exam.description || ""}
                          className="w-full text-sm text-slate-800 border-b border-primary focus:outline-none bg-transparent"
                          data-testid={`input-exam-description-${exam.id}`}
                          onBlur={(e) => {
                            handleUpdateExamDescription(exam.id, e.target.value);
                            setEditingExamId(null);
                            setEditingExamField(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateExamDescription(exam.id, e.currentTarget.value);
                              setEditingExamId(null);
                              setEditingExamField(null);
                            }
                          }}
                        />
                      ) : (
                        <p 
                          className="text-sm text-slate-500 line-clamp-2 cursor-pointer hover:text-slate-800 transition-colors"
                          onClick={() => {
                            setEditingExamId(exam.id);
                            setEditingExamField("description");
                          }}
                          title={t.common.edit}
                          data-testid={`text-exam-description-${exam.id}`}
                        >
                          {exam.description || t.exams.addDescription} 
                          <Pencil className="w-3 h-3 inline-block ml-1 opacity-0 group-hover/desc:opacity-50" />
                        </p>
                      )}
                    </div>
                    
                    <div className="pl-2 space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                          <span>{t.exams.readiness}</span>
                          <span className="font-medium text-green-600" data-testid={`text-exam-readiness-${exam.id}`}>
                            {Math.round((tasks.filter(task => task.examId === exam.id && task.completed).length / Math.max(tasks.filter(task => task.examId === exam.id).length, 1)) * 100)}%
                          </span>
                        </div>
                        <ProgressBar 
                          value={Math.round((tasks.filter(task => task.examId === exam.id && task.completed).length / Math.max(tasks.filter(task => task.examId === exam.id).length, 1)) * 100)} 
                          className="h-1.5" 
                          indicatorColor="bg-green-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                          <span>{t.exams.understanding}</span>
                          <span className="font-medium text-blue-600" data-testid={`text-exam-understanding-${exam.id}`}>{exam.understanding}%</span>
                        </div>
                        <Slider 
                          defaultValue={[exam.understanding]} 
                          max={100} 
                          step={5} 
                          onValueChange={(vals) => handleUpdateExamUnderstanding(exam.id, vals[0])}
                          className="py-1"
                          data-testid={`slider-understanding-${exam.id}`}
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1 text-slate-400">
                          <span>{t.exams.result}</span>
                          <span className="font-medium text-purple-600" data-testid={`text-exam-results-${exam.id}`}>{exam.results}%</span>
                        </div>
                        <Slider 
                          defaultValue={[exam.results]} 
                          max={100} 
                          step={5} 
                          onValueChange={(vals) => handleUpdateExamResults(exam.id, vals[0])}
                          className="py-1"
                          data-testid={`slider-results-${exam.id}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-100/50 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-slate-800" data-testid="text-selected-day">{format(selectedDate, "d")}</h2>
                  <p className="text-slate-500 font-medium uppercase tracking-wide text-sm capitalize" data-testid="text-selected-weekday">{format(selectedDate, "EEEE", { locale: dateLocales[language] })}</p>
                </div>
                {progress === 100 && (
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 animate-bounce">
                    <Trophy className="w-6 h-6" />
                  </div>
                )}
              </div>

              <TaskList 
                tasks={selectedTasks} 
                exams={exams} 
                subtasks={subtasks}
                onToggleTask={handleToggleTask} 
                onUpdateTaskTitle={handleUpdateTaskTitle}
                onAddSubTask={handleAddSubTask}
                onToggleSubTask={handleToggleSubTask}
                onUpdateSubTask={handleUpdateSubTask}
                onDeleteSubTask={handleDeleteSubTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onDuplicateTask={handleDuplicateTask}
                date={selectedDate}
              />
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-slate-400" />
                  Dagelijkse Statistieken
                </h4>
                {(() => {
                  const selectedTaskIds = selectedTasks.map(t => t.id);
                  const selectedSubtasks = subtasks.filter(st => selectedTaskIds.includes(st.taskId));
                  const defaultDuration = authUser?.defaultSubtaskDuration || 60;
                  
                  // Calculate dynamic task time using user's preferred subtask duration
                  const calculatedTaskTime = selectedTasks.reduce((acc, t) => {
                    const taskSubtaskCount = selectedSubtasks.filter(st => st.taskId === t.id).length;
                    const taskDuration = Math.max(defaultDuration, taskSubtaskCount * defaultDuration);
                    return acc + taskDuration;
                  }, 0);
                  
                  // Calculate SPENT time: only completed tasks/subtasks count
                  const spentTime = selectedTasks.reduce((acc, t) => {
                    const taskSubtasks = selectedSubtasks.filter(st => st.taskId === t.id);
                    const taskSubtaskCount = taskSubtasks.length;
                    const taskDuration = Math.max(defaultDuration, taskSubtaskCount * defaultDuration);
                    
                    if (t.completed) {
                      // Task is completed - count full task time
                      return acc + taskDuration;
                    } else {
                      // Task not completed - count only completed subtasks
                      const completedCount = taskSubtasks.filter(st => st.completed).length;
                      return acc + (completedCount * defaultDuration);
                    }
                  }, 0);
                  
                  const spentHours = Math.floor(spentTime / 60);
                  const spentMinutes = spentTime % 60;
                  const completedSubtasks = selectedSubtasks.filter(st => st.completed).length;
                  
                  return (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <div className="text-2xl font-display font-bold text-slate-800" data-testid="text-daily-task-count">{selectedTasks.length}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.stats.tasks}</div>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-2xl text-center">
                        <div className="text-2xl font-display font-bold text-amber-600" data-testid="text-daily-subtask-count">
                          {completedSubtasks}/{selectedSubtasks.length}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.stats.subtasks}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl text-center">
                        <div className="text-2xl font-display font-bold text-slate-600" data-testid="text-task-time">
                          {calculatedTaskTime}m
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.stats.totalTime}</div>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-2xl text-center">
                        <div className="text-2xl font-display font-bold text-primary" data-testid="text-daily-study-time">
                          {spentHours > 0 ? `${spentHours}${t.messages.hours} ${spentMinutes}m` : `${spentMinutes}m`}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">{t.stats.timeSpent}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">{t.settings.defaultSubtaskDuration}</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={authUser?.defaultSubtaskDuration || 60}
                    onChange={async (e) => {
                      if (!authUser) return;
                      const newDuration = parseInt(e.target.value);
                      try {
                        await api.updateUserPreference(authUser.id, newDuration);
                      } catch (error) {
                        console.error("Failed to update preference:", error);
                      }
                    }}
                    data-testid="input-default-subtask-duration"
                    className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-sm text-slate-500">{t.tasks.minutes}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showResultsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowResultsModal(false)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-800">{t.results.title}</h2>
                <p className="text-sm text-slate-500">{t.messages.resultsCompare}</p>
              </div>
              <button
                onClick={() => setShowResultsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                data-testid="button-close-results-modal"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {(() => {
                const examData = exams.map(exam => {
                  const examTasks = tasks.filter(task => task.examId === exam.id);
                  const completedTasks = examTasks.filter(task => task.completed).length;
                  const readiness = examTasks.length > 0 
                    ? Math.round((0.6 * (completedTasks / examTasks.length) + 0.4 * (exam.understanding / 100)) * 100)
                    : Math.round(exam.understanding * 0.4);
                  
                  return {
                    id: exam.id,
                    subjectKey: exam.subject,
                    subject: t.subjects[exam.subject] || exam.subject,
                    title: exam.title,
                    date: exam.date,
                    understanding: exam.understanding,
                    results: exam.results,
                    readiness,
                    color: subjectColors[exam.subject]?.split(" ")[0]?.replace("bg-", "") || "slate-200",
                  };
                });

                const avgUnderstanding = examData.length > 0 
                  ? Math.round(examData.reduce((acc, e) => acc + e.understanding, 0) / examData.length) 
                  : 0;
                const avgResults = examData.length > 0 
                  ? Math.round(examData.reduce((acc, e) => acc + e.results, 0) / examData.length) 
                  : 0;
                const avgReadiness = examData.length > 0 
                  ? Math.round(examData.reduce((acc, e) => acc + e.readiness, 0) / examData.length) 
                  : 0;

                const getReadinessColor = (value: number) => {
                  if (value >= 80) return "text-green-600 bg-green-100";
                  if (value >= 50) return "text-amber-600 bg-amber-100";
                  return "text-red-600 bg-red-100";
                };

                const getReadinessLabel = (value: number) => {
                  if (value >= 80) return t.messages.wellPrepared;
                  if (value >= 50) return t.messages.almostReady;
                  return t.messages.stillStudying;
                };

                return (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-display font-bold text-blue-600">{avgUnderstanding}%</div>
                        <div className="text-sm text-blue-600/70 font-medium">{t.results.avgUnderstanding}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-display font-bold text-green-600">{avgReadiness}%</div>
                        <div className="text-sm text-green-600/70 font-medium">{t.results.avgReadiness}</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-2xl text-center">
                        <div className="text-3xl font-display font-bold text-purple-600">{avgResults}%</div>
                        <div className="text-sm text-purple-600/70 font-medium">{t.results.avgResult}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl">
                      <h3 className="font-display font-bold text-slate-800 mb-4">{t.results.perSubject}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(() => {
                          const subjectAggregates = examData.reduce((acc, exam) => {
                            const subjectKey = exam.subjectKey;
                            if (!acc[subjectKey]) {
                              acc[subjectKey] = {
                                subjectKey,
                                subjectName: exam.subject,
                                count: 0,
                                totalUnderstanding: 0,
                                totalReadiness: 0,
                                totalResults: 0,
                                resultsCount: 0,
                              };
                            }
                            acc[subjectKey].count++;
                            acc[subjectKey].totalUnderstanding += exam.understanding;
                            acc[subjectKey].totalReadiness += exam.readiness;
                            if (exam.results > 0) {
                              acc[subjectKey].totalResults += exam.results;
                              acc[subjectKey].resultsCount++;
                            }
                            return acc;
                          }, {} as Record<string, { subjectKey: string; subjectName: string; count: number; totalUnderstanding: number; totalReadiness: number; totalResults: number; resultsCount: number }>);

                          return Object.values(subjectAggregates).map((subjectData) => {
                            const avgUnderstanding = Math.round(subjectData.totalUnderstanding / subjectData.count);
                            const avgReadiness = Math.round(subjectData.totalReadiness / subjectData.count);
                            const avgResults = subjectData.resultsCount > 0 
                              ? Math.round(subjectData.totalResults / subjectData.resultsCount)
                              : 0;
                            
                            const barData = [
                              { name: t.results.understanding, value: avgUnderstanding, fill: '#3b82f6' },
                              { name: t.results.readiness, value: avgReadiness, fill: '#22c55e' },
                              { name: t.results.result, value: avgResults, fill: '#8b5cf6' },
                            ];
                            
                            return (
                              <div key={subjectData.subjectKey} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-center mb-2">
                                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${subjectColors[subjectData.subjectKey] || 'bg-slate-100 text-slate-600'}`}>
                                    {subjectData.subjectName}
                                  </span>
                                  <div className="text-xs text-slate-400 mt-1">{subjectData.count} {subjectData.count > 1 ? t.messages.examsCount : t.messages.examCount}</div>
                                </div>
                                <div className="h-28">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                      <XAxis type="number" domain={[0, 100]} hide />
                                      <YAxis type="category" dataKey="name" width={65} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                                        {barData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="text-[10px] flex justify-between mt-1">
                                  <span className="text-blue-600 font-bold">{avgUnderstanding}%</span>
                                  <span className="text-green-600 font-bold">{avgReadiness}%</span>
                                  <span className="text-purple-600 font-bold">{avgResults > 0 ? `${avgResults}%` : '-'}</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                      <div className="flex justify-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-slate-600">{t.results.understanding}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-slate-600">{t.results.readiness}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          <span className="text-slate-600">{t.results.result}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl">
                      <h3 className="font-display font-bold text-slate-800 mb-4">{t.messages.perExam}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              <th className="text-left py-3 px-2 font-bold text-slate-600">{t.exams.subject}</th>
                              <th className="text-left py-3 px-2 font-bold text-slate-600">{t.exams.examTitle}</th>
                              <th className="text-center py-3 px-2 font-bold text-slate-600">{t.exams.date}</th>
                              <th className="text-center py-3 px-2 font-bold text-slate-600">{t.results.understanding}</th>
                              <th className="text-center py-3 px-2 font-bold text-slate-600">{t.results.readiness}</th>
                              <th className="text-center py-3 px-2 font-bold text-slate-600">{t.results.result}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {examData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((exam) => (
                              <tr key={exam.id} className="border-b border-slate-100 hover:bg-white transition-colors">
                                <td className="py-3 px-2">
                                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${subjectColors[exam.subject] || 'bg-slate-100 text-slate-600'}`}>
                                    {t.subjects[exam.subject] || exam.subject}
                                  </span>
                                </td>
                                <td className="py-3 px-2 font-medium text-slate-800">{exam.title}</td>
                                <td className="py-3 px-2 text-center text-slate-500">{format(parseISO(exam.date), "d MMM", { locale: dateLocales[language] })}</td>
                                <td className="py-3 px-2 text-center">
                                  <span className="font-medium text-blue-600">{exam.understanding}%</span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getReadinessColor(exam.readiness)}`}>
                                    {exam.readiness}% - {getReadinessLabel(exam.readiness)}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                  <span className={`font-medium ${exam.results > 0 ? 'text-purple-600' : 'text-slate-400'}`}>
                                    {exam.results > 0 ? `${exam.results}%` : '-'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-2xl">
                      <h4 className="font-bold text-slate-700 mb-2">{t.messages.readinessLegend}</h4>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 font-bold text-xs">≥80%</span>
                          <span className="text-slate-600">{t.messages.wellPrepared}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 font-bold text-xs">50-79%</span>
                          <span className="text-slate-600">{t.messages.almostReady}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 font-bold text-xs">&lt;50%</span>
                          <span className="text-slate-600">{t.messages.stillStudying}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        {t.messages.readinessFormula}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {authUser && (
        <Templates
          user={authUser}
          open={showTemplates}
          onOpenChange={setShowTemplates}
        />
      )}

      {showTaskSuggestions && newlyCreatedExam && (
        <TaskSuggestionModal
          exam={newlyCreatedExam}
          t={t}
          onClose={handleCloseTaskSuggestions}
          onConfirm={handleConfirmTaskSuggestions}
        />
      )}

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-primary cursor-grabbing transform scale-105">
            <div className="font-medium text-sm text-slate-800">{activeTask.title}</div>
            <div className="text-xs text-slate-400 mt-1">{t.messages.dragToMove}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
