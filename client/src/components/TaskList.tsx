import type { StudyTask, Exam, SubTask } from "@shared/schema";
import { CheckCircle2, Circle, BookOpen, Pencil, Plus, Trash2, CheckSquare, Square, GripVertical, Copy } from "lucide-react";
import { cn, subjectColors } from "@/lib/utils";
import { format } from "date-fns";
import { nl, fr, enUS } from "date-fns/locale";
import { useState, useRef, useEffect } from "react";
import { useDraggable } from '@dnd-kit/core';
import { useLanguage } from "@/lib/useLanguage";

const dateLocales = { nl, fr, en: enUS };

function SubjectLabel({ exam, subjectColor }: { exam: Exam | undefined; subjectColor: string }) {
  const { t } = useLanguage();
  return (
    <span className={cn("text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full", subjectColor)}>
      {exam ? t.subjects[exam.subject] || exam.subject : t.subjects.other}
    </span>
  );
}

function TaskActionButtons({ task, onAddSubTask, onEdit, onDuplicate, onDelete }: { 
  task: StudyTask;
  onAddSubTask: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-1">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddSubTask();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary transition-all"
        title={t.tasks.addSubtask}
        data-testid={`button-add-subtask-${task.id}`}
      >
        <Plus className="w-3 h-3" />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-primary transition-all"
        title={t.tasks.edit}
        data-testid={`button-edit-task-${task.id}`}
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-500 transition-all"
        title={t.tasks.duplicate}
        data-testid={`button-duplicate-task-${task.id}`}
      >
        <Copy className="w-3 h-3" />
      </button>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-all"
        title={t.tasks.deleteTask}
        data-testid={`button-delete-task-${task.id}`}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

interface TaskListProps {
  tasks: StudyTask[];
  exams: Exam[];
  subtasks: SubTask[];
  onToggleTask: (taskId: number) => void;
  onUpdateTaskTitle: (taskId: number, newTitle: string) => void;
  onAddSubTask: (taskId: number, title: string) => void;
  onToggleSubTask: (subTaskId: number) => void;
  onUpdateSubTask: (subTaskId: number, title: string) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onAddTask: (title: string, examId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
  date: Date;
}


function DraggableTask({ task, exam, taskSubtasks, onToggleTask, onUpdateTaskTitle, onAddSubTask, onToggleSubTask, onUpdateSubTask, onDeleteSubTask, onDeleteTask, onDuplicateTask }: {
  task: StudyTask;
  exam: Exam | undefined;
  taskSubtasks: SubTask[];
  onToggleTask: (taskId: number) => void;
  onUpdateTaskTitle: (taskId: number, newTitle: string) => void;
  onAddSubTask: (taskId: number, title: string) => void;
  onToggleSubTask: (subTaskId: number) => void;
  onUpdateSubTask: (subTaskId: number, title: string) => void;
  onDeleteSubTask: (subTaskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onDuplicateTask: (taskId: number) => void;
}) {
  const { t } = useLanguage();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [addingSubTask, setAddingSubTask] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const subTaskEditRef = useRef<HTMLInputElement>(null);
  const subTaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    if (addingSubTask && subTaskInputRef.current) {
      subTaskInputRef.current.focus();
    }
  }, [addingSubTask]);

  useEffect(() => {
    if (editingSubTaskId && subTaskEditRef.current) {
      subTaskEditRef.current.focus();
    }
  }, [editingSubTaskId]);

  const subjectColor = exam ? (subjectColors[exam.subject] || subjectColors["other"]) : subjectColors["other"];
  const isEditing = editingId === task.id;

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease, opacity 200ms ease, box-shadow 200ms ease',
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-col p-4 rounded-2xl border transition-all hover:shadow-md bg-white relative",
        task.completed ? "border-green-200 bg-green-50/30 opacity-90" : "border-slate-100",
        isDragging && "ring-2 ring-primary"
      )}
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex items-start gap-3">
        <button
          {...listeners}
          {...attributes}
          className="mt-1 text-slate-300 hover:text-primary transition-colors cursor-grab active:cursor-grabbing"
          data-testid={`button-drag-task-${task.id}`}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <button
          onClick={() => !isEditing && onToggleTask(task.id)}
          className={cn("mt-1 transition-colors", task.completed ? "text-green-500" : "text-slate-300 group-hover:text-primary")}
          data-testid={`button-toggle-task-${task.id}`}
        >
          {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1">
            <SubjectLabel exam={exam} subjectColor={subjectColor} />
          </div>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              defaultValue={task.title}
              className="w-full bg-transparent font-medium text-slate-800 focus:outline-none border-b border-primary/50 pb-0.5"
              data-testid={`input-edit-task-${task.id}`}
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => {
                onUpdateTaskTitle(task.id, e.target.value);
                setEditingId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onUpdateTaskTitle(task.id, e.currentTarget.value);
                  setEditingId(null);
                }
                if (e.key === "Escape") {
                  setEditingId(null);
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-between group/title">
              <h4 className={cn("font-medium text-slate-800 truncate pr-2", task.completed && "line-through text-slate-500")} data-testid={`text-task-title-${task.id}`}>
                {task.title}
              </h4>
              <TaskActionButtons
                task={task}
                onAddSubTask={() => setAddingSubTask(true)}
                onEdit={() => setEditingId(task.id)}
                onDuplicate={() => onDuplicateTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            </div>
          )}
        </div>
      </div>

      {(taskSubtasks.length > 0 || addingSubTask) && (
        <div className="mt-3 pl-9 space-y-2">
          {taskSubtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2 group/sub" data-testid={`subtask-item-${subtask.id}`}>
              <button 
                onClick={() => onToggleSubTask(subtask.id)}
                className={cn("transition-colors", subtask.completed ? "text-green-500" : "text-slate-300 hover:text-primary")}
                data-testid={`button-toggle-subtask-${subtask.id}`}
              >
                {subtask.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>
              {editingSubTaskId === subtask.id ? (
                <input
                  ref={subTaskEditRef}
                  type="text"
                  defaultValue={subtask.title}
                  className="flex-1 text-sm bg-slate-50 border-b border-primary focus:outline-none px-1 py-0.5"
                  data-testid={`input-edit-subtask-${subtask.id}`}
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      onUpdateSubTask(subtask.id, e.target.value);
                    }
                    setEditingSubTaskId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.currentTarget.value.trim()) {
                        onUpdateSubTask(subtask.id, e.currentTarget.value);
                      }
                      setEditingSubTaskId(null);
                    }
                    if (e.key === "Escape") {
                      setEditingSubTaskId(null);
                    }
                  }}
                />
              ) : (
                <span
                  className={cn("text-sm flex-1 text-slate-600 cursor-pointer", subtask.completed && "line-through text-slate-400")}
                  onClick={() => setEditingSubTaskId(subtask.id)}
                  data-testid={`text-subtask-title-${subtask.id}`}
                >
                  {subtask.title}
                </span>
              )}
              <button 
                onClick={() => onDeleteSubTask(subtask.id)}
                className="text-slate-300 hover:text-red-400 opacity-0 group-hover/sub:opacity-100 transition-opacity"
                data-testid={`button-delete-subtask-${subtask.id}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {addingSubTask && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <Square className="w-4 h-4 text-slate-300" />
              <input
                ref={subTaskInputRef}
                type="text"
                placeholder={t.subtasks.enterSubtask}
                className="flex-1 text-sm bg-slate-50 border-b border-slate-200 focus:border-primary focus:outline-none px-1 py-0.5"
                data-testid={`input-add-subtask-${task.id}`}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    onAddSubTask(task.id, e.target.value);
                  }
                  setAddingSubTask(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.currentTarget.value.trim()) {
                      onAddSubTask(task.id, e.currentTarget.value);
                    }
                    setAddingSubTask(false);
                  }
                  if (e.key === "Escape") {
                    setAddingSubTask(false);
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TaskList({ 
  tasks, 
  exams, 
  subtasks,
  onToggleTask, 
  onUpdateTaskTitle, 
  onAddSubTask,
  onToggleSubTask,
  onUpdateSubTask,
  onDeleteSubTask,
  onAddTask,
  onDeleteTask,
  onDuplicateTask,
  date 
}: TaskListProps) {
  const { language, t } = useLanguage();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<number | null>(exams[0]?.id || null);
  const addTaskInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingTask && addTaskInputRef.current) {
      addTaskInputRef.current.focus();
    }
  }, [isAddingTask]);

  const handleSubmitNewTask = () => {
    if (newTaskTitle.trim() && selectedExamId !== null) {
      onAddTask(newTaskTitle, selectedExamId);
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-xl text-slate-800 flex items-center gap-2">
          {t.tasks.tasksFor} {format(date, "d MMMM", { locale: dateLocales[language] })}
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-sans" data-testid="text-task-count">
            {tasks.length} {t.stats.tasks.toLowerCase()}
          </span>
        </h3>
        <button
          onClick={() => setIsAddingTask(true)}
          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all"
          title={t.tasks.addTask}
          data-testid="button-add-task"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAddingTask && (
        <div className="bg-white p-4 rounded-2xl border border-primary/30 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="space-y-3">
            <input
              ref={addTaskInputRef}
              type="text"
              placeholder={t.tasks.enterTask}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              data-testid="input-new-task-title"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmitNewTask();
                }
                if (e.key === "Escape") {
                  setIsAddingTask(false);
                  setNewTaskTitle("");
                }
              }}
            />
            <select
              value={selectedExamId || ""}
              onChange={(e) => setSelectedExamId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
              data-testid="select-exam-for-task"
            >
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {t.subjects[exam.subject] || exam.subject} - {exam.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle("");
                }}
                className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                data-testid="button-cancel-add-task"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmitNewTask}
                disabled={!newTaskTitle.trim()}
                className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-confirm-add-task"
              >
                {t.header.add}
              </button>
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 && !isAddingTask ? (
        <div className="flex flex-col items-center justify-center h-48 text-center p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-display font-bold text-slate-700">{t.tasks.noTasks}</h3>
          <p className="text-slate-500 text-sm mt-1">{t.tasks.dragHint}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const exam = exams.find(e => e.id === task.examId);
            const taskSubtasks = subtasks.filter(st => st.taskId === task.id).sort((a, b) => a.orderIndex - b.orderIndex);
            
            return (
              <DraggableTask
                key={task.id}
                task={task}
                exam={exam}
                taskSubtasks={taskSubtasks}
                onToggleTask={onToggleTask}
                onUpdateTaskTitle={onUpdateTaskTitle}
                onAddSubTask={onAddSubTask}
                onToggleSubTask={onToggleSubTask}
                onUpdateSubTask={onUpdateSubTask}
                onDeleteSubTask={onDeleteSubTask}
                onDeleteTask={onDeleteTask}
                onDuplicateTask={onDuplicateTask}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
