import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Calendar, Clock, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { generateTaskSuggestions, SuggestedTask } from "@/lib/taskTemplates";
import { subjectColors } from "@/lib/utils";
import type { Exam } from "@shared/schema";

interface TaskSuggestionModalProps {
  exam: Exam;
  t: any;
  onClose: () => void;
  onConfirm: (tasks: SuggestedTask[]) => void;
}

export function TaskSuggestionModal({ exam, t, onClose, onConfirm }: TaskSuggestionModalProps) {
  const taskTitles = t.taskSuggestions?.taskTitles || {};
  
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>(() => 
    generateTaskSuggestions(exam.subject, exam.date, exam.difficulty as 'easy' | 'medium' | 'hard', taskTitles)
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");

  const toggleTask = (index: number) => {
    setSuggestions(suggestions.map((s, i) => 
      i === index ? { ...s, selected: !s.selected } : s
    ));
  };

  const updateTaskDate = (index: number, date: string) => {
    setSuggestions(suggestions.map((s, i) => 
      i === index ? { ...s, date } : s
    ));
  };

  const updateTaskDuration = (index: number, duration: number) => {
    setSuggestions(suggestions.map((s, i) => 
      i === index ? { ...s, durationMinutes: duration } : s
    ));
  };

  const updateTaskTitle = (index: number, title: string) => {
    setSuggestions(suggestions.map((s, i) => 
      i === index ? { ...s, title } : s
    ));
  };

  const removeTask = (index: number) => {
    setSuggestions(suggestions.filter((_, i) => i !== index));
  };

  const addCustomTask = () => {
    if (!newTaskTitle.trim() || !newTaskDate) return;
    
    const newTask: SuggestedTask = {
      title: newTaskTitle.trim(),
      date: newTaskDate,
      durationMinutes: 45,
      selected: true,
      phase: 'practice' as const,
    };
    
    setSuggestions([...suggestions, newTask].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    setNewTaskTitle("");
    setNewTaskDate("");
  };

  const selectedCount = suggestions.filter(s => s.selected).length;
  const totalMinutes = suggestions.filter(s => s.selected).reduce((sum, s) => sum + s.durationMinutes, 0);

  const subjectColor = subjectColors[exam.subject] || subjectColors.other;

  const phaseLabels = {
    foundation: t.taskSuggestions?.phases?.foundation || 'Basis',
    practice: t.taskSuggestions?.phases?.practice || 'Oefenen',
    review: t.taskSuggestions?.phases?.review || 'Herhalen',
  };

  const phaseColors = {
    foundation: 'bg-blue-100 text-blue-700',
    practice: 'bg-green-100 text-green-700',
    review: 'bg-purple-100 text-purple-700',
  };

  const handleConfirm = () => {
    const selectedTasks = suggestions.filter(s => s.selected);
    onConfirm(selectedTasks);
  };

  if (suggestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-2">
              {t.taskSuggestions?.noSuggestions || 'Geen suggesties beschikbaar'}
            </h3>
            <p className="text-slate-600 mb-4">
              {t.taskSuggestions?.examTooSoon || 'Het examen is te dichtbij om taken voor te stellen. Je kunt handmatig taken toevoegen.'}
            </p>
            <Button onClick={onClose}>
              {t.common?.close || 'Sluiten'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className={`${subjectColor.split(' ')[0]} p-5`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-slate-800">
                  {t.taskSuggestions?.title || 'Voorgestelde taken'}
                </h2>
                <p className="text-sm text-slate-600">
                  {t.subjects?.[exam.subject] || exam.subject} - {exam.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              data-testid="button-close-suggestions"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-slate-600 mb-4">
            {t.taskSuggestions?.description || 'Op basis van je examen hebben we studietaken voor je voorbereid. Pas ze aan zoals je wilt!'}
          </p>

          <div className="space-y-3">
            {suggestions.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-xl p-4 transition-all ${
                  task.selected 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.selected}
                    onCheckedChange={() => toggleTask(index)}
                    className="mt-1"
                    data-testid={`checkbox-task-${index}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${phaseColors[task.phase]}`}>
                        {phaseLabels[task.phase]}
                      </span>
                    </div>
                    {showAdvanced ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTaskTitle(index, e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded-lg text-sm mb-2"
                        data-testid={`input-task-title-${index}`}
                      />
                    ) : (
                      <p className="font-medium text-slate-800 mb-2">{task.title}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {showAdvanced ? (
                          <input
                            type="date"
                            value={task.date}
                            onChange={(e) => updateTaskDate(index, e.target.value)}
                            className="px-2 py-0.5 border border-slate-200 rounded text-xs"
                            data-testid={`input-task-date-${index}`}
                          />
                        ) : (
                          <span>{new Date(task.date).toLocaleDateString('nl-BE', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {showAdvanced ? (
                          <input
                            type="number"
                            value={task.durationMinutes}
                            onChange={(e) => updateTaskDuration(index, parseInt(e.target.value) || 30)}
                            className="w-16 px-2 py-0.5 border border-slate-200 rounded text-xs"
                            min={15}
                            max={180}
                            step={15}
                            data-testid={`input-task-duration-${index}`}
                          />
                        ) : (
                          <span>{task.durationMinutes} min</span>
                        )}
                      </div>
                      {showAdvanced && (
                        <button
                          onClick={() => removeTask(index)}
                          className="ml-auto text-red-500 hover:text-red-700"
                          data-testid={`button-remove-task-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-4"
            data-testid="button-toggle-advanced"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAdvanced 
              ? (t.taskSuggestions?.hideAdvanced || 'Verberg bewerkingsmodus')
              : (t.taskSuggestions?.showAdvanced || 'Aanpassen')
            }
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <h4 className="font-medium text-sm text-slate-700 mb-3">
                {t.taskSuggestions?.addCustom || 'Eigen taak toevoegen'}
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={t.taskSuggestions?.taskPlaceholder || 'Taak titel...'}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  data-testid="input-custom-task-title"
                />
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  data-testid="input-custom-task-date"
                />
                <Button
                  onClick={addCustomTask}
                  disabled={!newTaskTitle.trim() || !newTaskDate}
                  size="sm"
                  className="gap-1"
                  data-testid="button-add-custom-task"
                >
                  <Plus className="w-4 h-4" />
                  {t.taskSuggestions?.add || 'Toevoegen'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-slate-100 p-5 bg-slate-50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">{selectedCount}</span> {t.taskSuggestions?.tasksSelected || 'taken geselecteerd'}
              <span className="mx-2">•</span>
              <span className="font-medium text-slate-800">{Math.floor(totalMinutes / 60)}u {totalMinutes % 60}m</span> {t.taskSuggestions?.totalTime || 'studietijd'}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-testid="button-skip-suggestions"
            >
              {t.taskSuggestions?.skip || 'Overslaan'}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="flex-1 gap-2"
              data-testid="button-confirm-suggestions"
            >
              <Check className="w-4 h-4" />
              {t.taskSuggestions?.confirm || 'Taken aanmaken'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
