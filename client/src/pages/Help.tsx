import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/useLanguage";
import { Language } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Calendar,
  BookOpen,
  CheckSquare,
  GripVertical,
  ListChecks,
  TrendingUp,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Globe,
  GraduationCap,
  HelpCircle,
  Wand2,
} from "lucide-react";

import dashboardImage from "@assets/image_1764702957444.png";
import resultsImage from "@assets/image_1764703047856.png";
import addExamImage from "@assets/image_1764613527659.png";
import tasksImage from "@assets/image_1764613625390.png";
import templatesImage from "@assets/image_1764613722103.png";

const stepIcons = {
  calendar: Calendar,
  addExam: BookOpen,
  suggestions: Wand2,
  tasks: CheckSquare,
  dragDrop: GripVertical,
  subtasks: ListChecks,
  progress: TrendingUp,
  results: BarChart3,
  templates: FileText,
};

const stepImages: Record<string, string | null> = {
  calendar: dashboardImage,
  addExam: addExamImage,
  suggestions: null,
  tasks: tasksImage,
  dragDrop: dashboardImage,
  subtasks: null,
  progress: resultsImage,
  results: resultsImage,
  templates: templatesImage,
};

const stepColors = {
  calendar: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
  addExam: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  suggestions: { bg: "bg-cyan-100", text: "text-cyan-600", border: "border-cyan-200" },
  tasks: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
  dragDrop: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  subtasks: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
  progress: { bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200" },
  results: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
  templates: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
};

const stepKeys = ["calendar", "addExam", "suggestions", "tasks", "dragDrop", "subtasks", "progress", "results", "templates"] as const;

export default function Help() {
  const { t, language, setLanguage, languageNames } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToNext = () => {
    if (currentStep < stepKeys.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentKey = stepKeys[currentStep];
  const CurrentIcon = stepIcons[currentKey];
  const currentImage = stepImages[currentKey];
  const colors = stepColors[currentKey];
  const step = t.help.steps[currentKey];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t.help.backToDashboard}</span>
          </Link>
          <div className="flex items-center gap-4">
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
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageDropdown(false);
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
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl text-slate-800">StudyBuddy</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm">{t.help.subtitle}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800">
              {t.help.title}
            </h1>
          </motion.div>

          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {stepKeys.map((key, index) => {
                const StepIcon = stepIcons[key];
                const stepColor = stepColors[key];
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentStep(index)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index === currentStep
                        ? `${stepColor.bg} ${stepColor.text} ring-2 ring-offset-2 ${stepColor.border}`
                        : index < currentStep
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                    data-testid={`step-indicator-${index}`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center mb-4 text-sm text-slate-500">
            {t.help.step} {currentStep + 1} {t.help.of} {stepKeys.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8"
            >
              <div className={`${colors.bg} p-4 relative`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center ${colors.text}`}>
                    <CurrentIcon className="w-5 h-5" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-800">
                    {step.title}
                  </h2>
                </div>
                {currentImage ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl overflow-hidden shadow-lg border-4 border-white"
                  >
                    <img
                      src={currentImage}
                      alt={step.title}
                      className="w-full h-auto object-cover"
                      data-testid={`image-step-${currentKey}`}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center py-8"
                  >
                    <div className={`w-32 h-32 bg-white rounded-3xl shadow-lg flex items-center justify-center ${colors.text}`}>
                      <CurrentIcon className="w-16 h-16" />
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-600 text-lg text-center mb-4 max-w-xl mx-auto"
                >
                  {step.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`flex items-center gap-3 ${colors.bg} p-4 rounded-xl max-w-md mx-auto`}
                >
                  <Lightbulb className={`w-5 h-5 ${colors.text} flex-shrink-0`} />
                  <p className={`text-sm ${colors.text}`}>{step.tip}</p>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mb-16">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentStep === 0}
              className="gap-2"
              data-testid="button-previous"
            >
              <ChevronLeft className="w-4 h-4" />
              {t.help.previous}
            </Button>

            {currentStep === stepKeys.length - 1 ? (
              <Button asChild className="gap-2" data-testid="button-get-started">
                <Link href="/">
                  {t.help.getStarted}
                  <GraduationCap className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button onClick={goToNext} className="gap-2" data-testid="button-next">
                {t.help.next}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800">
                {t.help.features.title}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.calendar}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100"
              >
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.subjects}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100"
              >
                <GripVertical className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.dragDrop}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-100"
              >
                <ListChecks className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.subtasks}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100"
              >
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.progress}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border border-indigo-100"
              >
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.results}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100"
              >
                <FileText className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.templates}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-100"
              >
                <Globe className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-slate-700">{t.help.features.multilang}</span>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
