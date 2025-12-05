export type SubjectCategory = 'language' | 'exact' | 'memory' | 'creative' | 'practical';

export interface TaskTemplate {
  titleKey: string;
  phase: 'foundation' | 'practice' | 'review';
  durationMinutes: number;
  priority: number;
}

export const subjectCategories: Record<string, SubjectCategory> = {
  dutch: 'language',
  french: 'language',
  english: 'language',
  german: 'language',
  spanish: 'language',
  latin: 'language',
  greek: 'language',
  math: 'exact',
  physics: 'exact',
  chemistry: 'exact',
  biology: 'memory',
  science: 'exact',
  geography: 'memory',
  history: 'memory',
  economics: 'memory',
  religion: 'memory',
  ethics: 'memory',
  music: 'creative',
  art: 'creative',
  pe: 'practical',
  ict: 'practical',
  technology: 'practical',
  other: 'memory',
};

export const taskTemplatesByCategory: Record<SubjectCategory, TaskTemplate[]> = {
  language: [
    { titleKey: 'readChapter', phase: 'foundation', durationMinutes: 45, priority: 1 },
    { titleKey: 'vocabulary', phase: 'foundation', durationMinutes: 30, priority: 2 },
    { titleKey: 'grammarExercises', phase: 'practice', durationMinutes: 45, priority: 3 },
    { titleKey: 'practiceTexts', phase: 'practice', durationMinutes: 40, priority: 4 },
    { titleKey: 'reviewNotes', phase: 'review', durationMinutes: 30, priority: 5 },
    { titleKey: 'practiceTest', phase: 'review', durationMinutes: 45, priority: 6 },
  ],
  exact: [
    { titleKey: 'studyTheory', phase: 'foundation', durationMinutes: 45, priority: 1 },
    { titleKey: 'learnFormulas', phase: 'foundation', durationMinutes: 30, priority: 2 },
    { titleKey: 'solveExercises', phase: 'practice', durationMinutes: 60, priority: 3 },
    { titleKey: 'extraExercises', phase: 'practice', durationMinutes: 45, priority: 4 },
    { titleKey: 'reviewMistakes', phase: 'review', durationMinutes: 30, priority: 5 },
    { titleKey: 'practiceTest', phase: 'review', durationMinutes: 45, priority: 6 },
  ],
  memory: [
    { titleKey: 'readChapter', phase: 'foundation', durationMinutes: 45, priority: 1 },
    { titleKey: 'makeSummary', phase: 'foundation', durationMinutes: 40, priority: 2 },
    { titleKey: 'learnTerms', phase: 'practice', durationMinutes: 35, priority: 3 },
    { titleKey: 'studyDates', phase: 'practice', durationMinutes: 30, priority: 4 },
    { titleKey: 'reviewAll', phase: 'review', durationMinutes: 40, priority: 5 },
    { titleKey: 'practiceTest', phase: 'review', durationMinutes: 45, priority: 6 },
  ],
  creative: [
    { titleKey: 'studyTheory', phase: 'foundation', durationMinutes: 30, priority: 1 },
    { titleKey: 'practiceSkills', phase: 'practice', durationMinutes: 45, priority: 2 },
    { titleKey: 'reviewExamples', phase: 'practice', durationMinutes: 30, priority: 3 },
    { titleKey: 'finalPrep', phase: 'review', durationMinutes: 30, priority: 4 },
  ],
  practical: [
    { titleKey: 'studyTheory', phase: 'foundation', durationMinutes: 40, priority: 1 },
    { titleKey: 'practiceHands', phase: 'practice', durationMinutes: 50, priority: 2 },
    { titleKey: 'reviewSteps', phase: 'practice', durationMinutes: 30, priority: 3 },
    { titleKey: 'finalPrep', phase: 'review', durationMinutes: 30, priority: 4 },
  ],
};

export interface SuggestedTask {
  title: string;
  date: string;
  durationMinutes: number;
  selected: boolean;
  phase: 'foundation' | 'practice' | 'review';
}

export function generateTaskSuggestions(
  subject: string,
  examDate: string,
  difficulty: 'easy' | 'medium' | 'hard',
  taskTitles: Record<string, string>
): SuggestedTask[] {
  const category = subjectCategories[subject] || 'memory';
  const templates = taskTemplatesByCategory[category];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);
  
  const daysUntilExam = Math.floor((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExam <= 0) {
    return [];
  }
  
  const difficultyMultiplier = difficulty === 'easy' ? 0.7 : difficulty === 'hard' ? 1.3 : 1;
  const maxTasks = Math.min(
    Math.floor(daysUntilExam * 0.8),
    Math.ceil(templates.length * difficultyMultiplier)
  );
  
  const selectedTemplates = templates.slice(0, Math.max(2, maxTasks));
  
  const phaseDistribution = {
    foundation: 0.3,
    practice: 0.4,
    review: 0.3,
  };
  
  const suggestions: SuggestedTask[] = [];
  
  selectedTemplates.forEach((template, index) => {
    let dayOffset: number;
    
    if (template.phase === 'foundation') {
      dayOffset = Math.floor(daysUntilExam * (0.1 + (index * 0.15)));
    } else if (template.phase === 'practice') {
      dayOffset = Math.floor(daysUntilExam * (0.4 + ((index - 2) * 0.15)));
    } else {
      dayOffset = Math.max(1, Math.floor(daysUntilExam * (0.8 + ((index - 4) * 0.1))));
    }
    
    dayOffset = Math.max(0, Math.min(dayOffset, daysUntilExam - 1));
    
    const taskDate = new Date(today);
    taskDate.setDate(taskDate.getDate() + dayOffset);
    
    const year = taskDate.getFullYear();
    const month = String(taskDate.getMonth() + 1).padStart(2, '0');
    const day = String(taskDate.getDate()).padStart(2, '0');
    
    suggestions.push({
      title: taskTitles[template.titleKey] || template.titleKey,
      date: `${year}-${month}-${day}`,
      durationMinutes: template.durationMinutes,
      selected: true,
      phase: template.phase,
    });
  });
  
  suggestions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return suggestions;
}
