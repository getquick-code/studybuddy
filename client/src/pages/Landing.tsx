import { useState, useRef, useEffect } from "react";
import { CalendarIcon, Shield, Users, Share2, HelpCircle, BarChart3, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { Language } from "@/lib/i18n";
import { Link } from "wouter";
import calendarScreenshot from "@assets/image_1764702957444.png";
import resultsScreenshot from "@assets/image_1764703047856.png";

export default function Landing() {
  const { t, language, setLanguage, languageNames } = useLanguage();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full px-6 py-8">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800">StudyBuddy</h1>
              <p className="text-sm text-slate-500">{t.header.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2.5 rounded-xl border border-slate-200 transition-colors"
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
            <Link
              href="/help"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-3 rounded-xl transition-all"
              data-testid="button-help"
            >
              <HelpCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Help</span>
            </Link>
            <a
              href="/api/login"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all"
              data-testid="button-login"
            >
              {t.common.login}
            </a>
          </div>
        </header>

        <main className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-6">
            {t.welcome.title}
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            {t.welcome.description}
          </p>

          <a
            href="/api/login"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all mb-16"
            data-testid="button-start-now-top"
          >
            {t.welcome.getStarted}
          </a>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{t.welcome.feature1Title}</h3>
              <p className="text-slate-600 text-sm">{t.welcome.feature1Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{t.welcome.feature2Title}</h3>
              <p className="text-slate-600 text-sm">{t.welcome.feature2Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{t.welcome.feature3Title}</h3>
              <p className="text-slate-600 text-sm">{t.welcome.feature3Desc}</p>
            </div>
          </div>

          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary to-blue-500 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <CalendarIcon className="w-6 h-6" />
                  <h3 className="font-display font-bold text-xl">{t.welcome.calendarPreview}</h3>
                </div>
              </div>
              <img 
                src={calendarScreenshot} 
                alt="StudyBuddy Calendar View" 
                className="w-full"
                data-testid="img-calendar-preview"
              />
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <BarChart3 className="w-6 h-6" />
                  <h3 className="font-display font-bold text-xl">{t.welcome.resultsPreview}</h3>
                </div>
              </div>
              <img 
                src={resultsScreenshot} 
                alt="StudyBuddy Results Overview" 
                className="w-full"
                data-testid="img-results-preview"
              />
            </div>
          </div>

          <a
            href="/api/login"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/30 transition-all"
            data-testid="button-get-started"
          >
            {t.welcome.getStarted}
          </a>
        </main>
      </div>
    </div>
  );
}
