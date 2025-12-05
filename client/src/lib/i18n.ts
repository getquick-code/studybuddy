import { nl, fr, enUS } from 'date-fns/locale';

export type Language = 'nl' | 'fr' | 'en';

export const languageNames: Record<Language, string> = {
  nl: 'Nederlands',
  fr: 'Français',
  en: 'English'
};

export const dateLocales = {
  nl: nl,
  fr: fr,
  en: enUS
};

export const translations = {
  nl: {
    header: {
      title: 'StudyBuddy',
      subtitle: 'Jouw persoonlijke studiebuddy',
      selectUser: 'Selecteer leerling',
      addUser: 'Nieuwe leerling toevoegen',
      enterName: 'Naam invoeren...',
      add: 'Toevoegen',
      resultsOverview: 'Resultatenoverzicht',
    },
    calendar: {
      today: 'Vandaag',
      months: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
      weekdays: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
      weekdaysFull: ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
      showWeek: 'Toon week',
      hideWeek: 'Verberg week',
      weekHidden: 'Week verborgen',
    },
    exams: {
      title: 'Examens & Toetsen',
      addExam: 'Nieuw examen',
      addTest: 'Nieuwe toets',
      exam: 'Examen',
      test: 'Toets',
      subject: 'Vak',
      examTitle: 'Titel',
      date: 'Datum',
      description: 'Beschrijving',
      addDescription: 'Voeg beschrijving toe...',
      understanding: 'Begrip leerstof',
      readiness: 'Gereedheid (Taken)',
      result: 'Resultaat',
      delete: 'Verwijderen',
      cancel: 'Annuleren',
      save: 'Opslaan',
      noExams: 'Geen examens gepland',
      selectSubject: 'Selecteer vak',
    },
    tasks: {
      title: 'Studietaken',
      tasksFor: 'Taken voor',
      addTask: 'Taak toevoegen',
      enterTask: 'Nieuwe taak...',
      noTasks: 'Geen taken voor deze dag',
      dragHint: 'Sleep taken om te verplaatsen',
      minutes: 'min',
      completed: 'voltooid',
      subtasks: 'subtaken',
      duplicate: 'Dupliceren',
      edit: 'Bewerken',
      deleteTask: 'Verwijderen',
      addSubtask: 'Subtaak toevoegen',
    },
    subtasks: {
      title: 'Subtaken',
      addSubtask: 'Subtaak toevoegen',
      enterSubtask: 'Nieuwe subtaak...',
      duration: 'Duur (minuten)',
      noSubtasks: 'Geen subtaken',
    },
    stats: {
      dailyStats: 'Dagstatistieken',
      tasks: 'Taken',
      subtasks: 'Subtaken',
      timeSpent: 'Tijd besteed',
      totalTime: 'Totale tijd',
      completedOnly: '(alleen voltooide)',
    },
    results: {
      title: 'Resultatenoverzicht',
      avgUnderstanding: 'Gemiddeld Begrip',
      avgReadiness: 'Gemiddelde Gereedheid',
      avgResult: 'Gemiddeld Resultaat',
      perSubject: 'Resultaten per vak',
      understanding: 'Begrip',
      readiness: 'Gereedheid',
      result: 'Resultaat',
      close: 'Sluiten',
      noData: 'Geen data beschikbaar',
    },
    subjects: {
      dutch: 'Nederlands',
      french: 'Frans',
      english: 'Engels',
      german: 'Duits',
      spanish: 'Spaans',
      latin: 'Latijn',
      greek: 'Grieks',
      math: 'Wiskunde',
      physics: 'Fysica',
      chemistry: 'Chemie',
      biology: 'Biologie',
      science: 'Natuurkunde',
      geography: 'Aardrijkskunde',
      history: 'Geschiedenis',
      economics: 'Economie',
      religion: 'Godsdienst',
      ethics: 'Ethiek',
      music: 'Muziek',
      art: 'Kunst',
      pe: 'Lichamelijke opvoeding',
      it: 'Informatica',
      technology: 'Technologie',
      other: 'Andere',
    },
    difficulty: {
      easy: 'Makkelijk',
      medium: 'Gemiddeld',
      hard: 'Moeilijk',
    },
    common: {
      loading: 'Laden...',
      error: 'Er is een fout opgetreden',
      save: 'Opslaan',
      cancel: 'Annuleren',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      close: 'Sluiten',
      login: 'Inloggen',
      logout: 'Uitloggen',
    },
    welcome: {
      title: 'Plan je examens slim!',
      subtitle: 'Voer je naam in om te beginnen met je studieplanning',
      description: 'StudyBuddy helpt je om je studietijd te organiseren, je voortgang bij te houden, en je examens met vertrouwen te halen.',
      placeholder: 'Jouw naam...',
      button: 'Begin met studeren',
      getStarted: 'Start nu gratis',
      feature1Title: 'Slimme Planning',
      feature1Desc: 'Maak studietaken en verdeel ze over je kalender met drag-and-drop.',
      feature2Title: 'Privé & Veilig',
      feature2Desc: 'Jouw studieplanning is alleen voor jou. Log veilig in met je account.',
      feature3Title: 'Deel met Anderen',
      feature3Desc: 'Leraren kunnen sjablonen delen en leerlingen kunnen van elkaar leren.',
      calendarPreview: 'Jouw Studiekalender',
      resultsPreview: 'Resultaten Overzicht',
    },
    settings: {
      title: 'Instellingen',
      defaultSubtaskDuration: 'Standaard subtaakduur',
    },
    messages: {
      resultsCompare: 'Vergelijk je begrip met je resultaten',
      perExam: 'Overzicht per Examen',
      wellPrepared: 'Goed voorbereid',
      almostReady: 'Bijna klaar',
      stillStudying: 'Nog studeren',
      examCount: 'examen',
      examsCount: 'examens',
      readinessLegend: 'Legende Gereedheid',
      readinessFormula: 'Gereedheid = 60% voltooide taken + 40% begrip leerstof',
      youGotThis: 'Jij kan dit!',
      totalProgress: 'Totale Voortgang',
      done: 'Klaar',
      yourPlanning: 'Jouw Planning',
      newExamTest: 'Nieuw Examen / Toets',
      exampleTitle: 'bijv. Hoofdstuk 3 toets',
      exampleDescription: 'bijv. Pagina 40-60',
      optional: 'optioneel',
      switchUser: 'Wissel van gebruiker',
      active: 'Actief',
      clickToChangeDate: 'Klik om datum te wijzigen',
      hours: 'u',
      dragToMove: 'Sleep naar een andere dag',
    },
    roleSelection: {
      title: 'Wie ben je?',
      subtitle: 'Kies je rol om te beginnen',
      student: 'Leerling',
      studentDesc: 'Plan je examens en studietaken',
      teacher: 'Leraar',
      teacherDesc: 'Maak sjablonen en deel met leerlingen',
      saving: 'Opslaan...',
    },
    templates: {
      title: 'Sjablonen',
      myTemplates: 'Mijn Sjablonen',
      publicTemplates: 'Openbare Sjablonen',
      createTemplate: 'Sjabloon maken',
      createFromSchedule: 'Maak van mijn rooster',
      templateName: 'Sjabloon naam',
      templateDescription: 'Beschrijving',
      makePublic: 'Openbaar maken',
      deleteTemplate: 'Sjabloon verwijderen',
      useTemplate: 'Gebruik sjabloon',
      copyToSchedule: 'Kopieer naar mijn planning',
      noTemplates: 'Geen sjablonen beschikbaar',
      confirmCopy: 'Weet je zeker dat je dit sjabloon wilt toepassen?',
      copySuccess: 'Sjabloon succesvol gekopieerd!',
      createSuccess: 'Sjabloon succesvol aangemaakt!',
      by: 'door',
      examsIncluded: 'examens',
    },
    taskSuggestions: {
      title: 'Voorgestelde taken',
      description: 'Op basis van je examen hebben we studietaken voor je voorbereid. Pas ze aan zoals je wilt!',
      noSuggestions: 'Geen suggesties beschikbaar',
      examTooSoon: 'Het examen is te dichtbij om taken voor te stellen. Je kunt handmatig taken toevoegen.',
      tasksSelected: 'taken geselecteerd',
      totalTime: 'studietijd',
      skip: 'Overslaan',
      confirm: 'Taken aanmaken',
      showAdvanced: 'Aanpassen',
      hideAdvanced: 'Verberg bewerkingsmodus',
      addCustom: 'Eigen taak toevoegen',
      taskPlaceholder: 'Taak titel...',
      add: 'Toevoegen',
      phases: {
        foundation: 'Basis',
        practice: 'Oefenen',
        review: 'Herhalen',
      },
      taskTitles: {
        readChapter: 'Hoofdstuk doorlezen',
        vocabulary: 'Woordenschat leren',
        grammarExercises: 'Grammatica oefeningen',
        practiceTexts: 'Teksten oefenen',
        reviewNotes: 'Notities doornemen',
        practiceTest: 'Proeftoets maken',
        studyTheory: 'Theorie studeren',
        learnFormulas: 'Formules leren',
        solveExercises: 'Oefeningen maken',
        extraExercises: 'Extra oefeningen',
        reviewMistakes: 'Fouten bekijken',
        makeSummary: 'Samenvatting maken',
        learnTerms: 'Begrippen leren',
        studyDates: 'Data/feiten leren',
        reviewAll: 'Alles herhalen',
        practiceSkills: 'Vaardigheden oefenen',
        reviewExamples: 'Voorbeelden bekijken',
        finalPrep: 'Laatste voorbereiding',
        practiceHands: 'Praktijk oefenen',
        reviewSteps: 'Stappen doornemen',
      },
    },
    help: {
      title: 'Hoe werkt StudyBuddy?',
      subtitle: 'Een stap-voor-stap handleiding',
      getStarted: 'Aan de slag',
      backToDashboard: 'Terug naar planning',
      previous: 'Vorige',
      next: 'Volgende',
      step: 'Stap',
      of: 'van',
      steps: {
        calendar: {
          title: 'Kalender Overzicht',
          description: 'Bekijk al je examens en studietaken in een overzichtelijke maandkalender. Klik op een dag om de details te zien.',
          tip: 'Tip: Klik op pijltjes om tussen maanden te navigeren.',
        },
        addExam: {
          title: 'Examens Toevoegen',
          description: 'Voeg examens en toetsen toe met vak, datum en moeilijkheidsgraad. Kies uit 23 Belgische schoolvakken met kleurcodes.',
          tip: 'Tip: Voeg een beschrijving toe om te onthouden welke hoofdstukken je moet studeren.',
        },
        suggestions: {
          title: 'Slimme Taaksuggesties',
          description: 'Na het toevoegen van een examen krijg je automatisch studietaken voorgesteld. De taken zijn verdeeld over basis, oefening en herhaling fases.',
          tip: 'Tip: Pas de suggesties aan naar jouw studietempo en voeg eigen taken toe!',
        },
        tasks: {
          title: 'Studietaken Maken',
          description: 'Maak studietaken voor elk examen. Stel de geschatte studietijd in en verdeel je werk over meerdere dagen.',
          tip: 'Tip: Kleinere taken zijn makkelijker om af te vinken!',
        },
        dragDrop: {
          title: 'Drag & Drop',
          description: 'Versleep taken tussen dagen of verander de volgorde met drag-and-drop. Plan je studie flexibel en pas aan wanneer nodig.',
          tip: 'Tip: Sleep een taak naar een andere dag als je planning verandert.',
        },
        subtasks: {
          title: 'Subtaken',
          description: 'Verdeel grote taken in kleinere subtaken. Vink ze af terwijl je studeert om je voortgang te zien.',
          tip: 'Tip: Elke subtaak kan een eigen tijdsduur hebben.',
        },
        progress: {
          title: 'Voortgang Bijhouden',
          description: 'Houd je begrip van de leerstof bij en vul je resultaten in na het examen. Zie hoeveel je al hebt gedaan.',
          tip: 'Tip: Het begripsniveau helpt je bepalen hoeveel je nog moet studeren.',
        },
        results: {
          title: 'Resultaten Dashboard',
          description: 'Bekijk je prestaties per vak in grafieken. Vergelijk je begrip met je uiteindelijke resultaten.',
          tip: 'Tip: Gebruik het dashboard om te zien welke vakken extra aandacht nodig hebben.',
        },
        templates: {
          title: 'Sjablonen Gebruiken',
          description: 'Leraren kunnen studieschema\'s opslaan als sjablonen. Leerlingen kunnen publieke sjablonen kopiëren en aanpassen.',
          tip: 'Tip: Sjablonen behouden de timing tussen taken, ook bij andere examendatums.',
        },
      },
      features: {
        title: 'Belangrijkste Features',
        calendar: 'Visuele maandkalender',
        subjects: '23 Belgische schoolvakken',
        dragDrop: 'Drag-and-drop planning',
        subtasks: 'Subtaken met tijdsduur',
        progress: 'Voortgang bijhouden',
        results: 'Resultaten dashboard',
        templates: 'Deelbare sjablonen',
        multilang: 'Nederlands, Frans & Engels',
      },
    },
  },
  fr: {
    header: {
      title: 'StudyBuddy',
      subtitle: 'Ton assistant d\'étude personnel',
      selectUser: 'Sélectionner élève',
      addUser: 'Ajouter un nouvel élève',
      enterName: 'Entrer le nom...',
      add: 'Ajouter',
      resultsOverview: 'Aperçu des résultats',
    },
    calendar: {
      today: "Aujourd'hui",
      months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
      weekdays: ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'],
      weekdaysFull: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      showWeek: 'Afficher semaine',
      hideWeek: 'Masquer semaine',
      weekHidden: 'Semaine masquée',
    },
    exams: {
      title: 'Examens & Tests',
      addExam: 'Nouvel examen',
      addTest: 'Nouveau test',
      exam: 'Examen',
      test: 'Test',
      subject: 'Matière',
      examTitle: 'Titre',
      date: 'Date',
      description: 'Description',
      addDescription: 'Ajouter une description...',
      understanding: 'Compréhension',
      readiness: 'Préparation (Tâches)',
      result: 'Résultat',
      delete: 'Supprimer',
      cancel: 'Annuler',
      save: 'Enregistrer',
      noExams: 'Aucun examen prévu',
      selectSubject: 'Sélectionner une matière',
    },
    tasks: {
      title: 'Tâches d\'étude',
      tasksFor: 'Tâches pour le',
      addTask: 'Ajouter une tâche',
      enterTask: 'Nouvelle tâche...',
      noTasks: 'Aucune tâche pour ce jour',
      dragHint: 'Glissez les tâches pour les déplacer',
      minutes: 'min',
      completed: 'terminé',
      subtasks: 'sous-tâches',
      duplicate: 'Dupliquer',
      edit: 'Modifier',
      deleteTask: 'Supprimer',
      addSubtask: 'Ajouter une sous-tâche',
    },
    subtasks: {
      title: 'Sous-tâches',
      addSubtask: 'Ajouter une sous-tâche',
      enterSubtask: 'Nouvelle sous-tâche...',
      duration: 'Durée (minutes)',
      noSubtasks: 'Aucune sous-tâche',
    },
    stats: {
      dailyStats: 'Statistiques du jour',
      tasks: 'Tâches',
      subtasks: 'Sous-tâches',
      timeSpent: 'Temps passé',
      totalTime: 'Temps total',
      completedOnly: '(terminées uniquement)',
    },
    results: {
      title: 'Aperçu des résultats',
      avgUnderstanding: 'Compréhension moyenne',
      avgReadiness: 'Préparation moyenne',
      avgResult: 'Résultat moyen',
      perSubject: 'Résultats par matière',
      understanding: 'Compréhension',
      readiness: 'Préparation',
      result: 'Résultat',
      close: 'Fermer',
      noData: 'Aucune donnée disponible',
    },
    subjects: {
      dutch: 'Néerlandais',
      french: 'Français',
      english: 'Anglais',
      german: 'Allemand',
      spanish: 'Espagnol',
      latin: 'Latin',
      greek: 'Grec',
      math: 'Mathématiques',
      physics: 'Physique',
      chemistry: 'Chimie',
      biology: 'Biologie',
      science: 'Sciences naturelles',
      geography: 'Géographie',
      history: 'Histoire',
      economics: 'Économie',
      religion: 'Religion',
      ethics: 'Éthique',
      music: 'Musique',
      art: 'Art',
      pe: 'Éducation physique',
      it: 'Informatique',
      technology: 'Technologie',
      other: 'Autre',
    },
    difficulty: {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      login: 'Connexion',
      logout: 'Déconnexion',
    },
    welcome: {
      title: 'Planifie tes examens intelligemment!',
      subtitle: 'Entrez votre nom pour commencer votre planning d\'études',
      description: 'StudyBuddy t\'aide à organiser ton temps d\'étude, suivre ta progression et réussir tes examens en confiance.',
      placeholder: 'Votre nom...',
      button: 'Commencer à étudier',
      getStarted: 'Commencer gratuitement',
      feature1Title: 'Planification intelligente',
      feature1Desc: 'Crée des tâches d\'étude et organise-les sur ton calendrier avec glisser-déposer.',
      feature2Title: 'Privé & Sécurisé',
      feature2Desc: 'Ton planning d\'études est privé. Connecte-toi en sécurité avec ton compte.',
      feature3Title: 'Partage avec d\'autres',
      feature3Desc: 'Les enseignants peuvent partager des modèles et les élèves peuvent apprendre ensemble.',
      calendarPreview: 'Ton Calendrier d\'Études',
      resultsPreview: 'Aperçu des Résultats',
    },
    settings: {
      title: 'Paramètres',
      defaultSubtaskDuration: 'Durée par défaut des sous-tâches',
    },
    messages: {
      resultsCompare: 'Comparez votre compréhension avec vos résultats',
      perExam: 'Aperçu par Examen',
      wellPrepared: 'Bien préparé',
      almostReady: 'Presque prêt',
      stillStudying: 'Encore étudier',
      examCount: 'examen',
      examsCount: 'examens',
      readinessLegend: 'Légende Préparation',
      readinessFormula: 'Préparation = 60% tâches terminées + 40% compréhension',
      youGotThis: 'Tu peux le faire!',
      totalProgress: 'Progression totale',
      done: 'Terminé',
      yourPlanning: 'Ton Planning',
      newExamTest: 'Nouvel Examen / Test',
      exampleTitle: 'ex. Test chapitre 3',
      exampleDescription: 'ex. Pages 40-60',
      optional: 'optionnel',
      switchUser: "Changer d'utilisateur",
      active: 'Actif',
      clickToChangeDate: 'Cliquez pour modifier la date',
      hours: 'h',
      dragToMove: 'Glissez vers un autre jour',
    },
    roleSelection: {
      title: 'Qui êtes-vous?',
      subtitle: 'Choisissez votre rôle pour commencer',
      student: 'Élève',
      studentDesc: 'Planifiez vos examens et tâches d\'étude',
      teacher: 'Enseignant',
      teacherDesc: 'Créez des modèles et partagez avec les élèves',
      saving: 'Enregistrement...',
    },
    templates: {
      title: 'Modèles',
      myTemplates: 'Mes Modèles',
      publicTemplates: 'Modèles Publics',
      createTemplate: 'Créer un modèle',
      createFromSchedule: 'Créer à partir de mon planning',
      templateName: 'Nom du modèle',
      templateDescription: 'Description',
      makePublic: 'Rendre public',
      deleteTemplate: 'Supprimer le modèle',
      useTemplate: 'Utiliser le modèle',
      copyToSchedule: 'Copier vers mon planning',
      noTemplates: 'Aucun modèle disponible',
      confirmCopy: 'Voulez-vous vraiment appliquer ce modèle?',
      copySuccess: 'Modèle copié avec succès!',
      createSuccess: 'Modèle créé avec succès!',
      by: 'par',
      examsIncluded: 'examens',
    },
    taskSuggestions: {
      title: 'Tâches suggérées',
      description: 'En fonction de votre examen, nous avons préparé des tâches d\'étude. Personnalisez-les comme vous le souhaitez!',
      noSuggestions: 'Aucune suggestion disponible',
      examTooSoon: 'L\'examen est trop proche pour suggérer des tâches. Vous pouvez ajouter des tâches manuellement.',
      tasksSelected: 'tâches sélectionnées',
      totalTime: 'temps d\'étude',
      skip: 'Passer',
      confirm: 'Créer les tâches',
      showAdvanced: 'Personnaliser',
      hideAdvanced: 'Masquer le mode édition',
      addCustom: 'Ajouter une tâche personnalisée',
      taskPlaceholder: 'Titre de la tâche...',
      add: 'Ajouter',
      phases: {
        foundation: 'Base',
        practice: 'Pratique',
        review: 'Révision',
      },
      taskTitles: {
        readChapter: 'Lire le chapitre',
        vocabulary: 'Apprendre le vocabulaire',
        grammarExercises: 'Exercices de grammaire',
        practiceTexts: 'Pratiquer les textes',
        reviewNotes: 'Revoir les notes',
        practiceTest: 'Faire un test blanc',
        studyTheory: 'Étudier la théorie',
        learnFormulas: 'Apprendre les formules',
        solveExercises: 'Faire les exercices',
        extraExercises: 'Exercices supplémentaires',
        reviewMistakes: 'Revoir les erreurs',
        makeSummary: 'Faire un résumé',
        learnTerms: 'Apprendre les termes',
        studyDates: 'Apprendre les dates/faits',
        reviewAll: 'Tout réviser',
        practiceSkills: 'Pratiquer les compétences',
        reviewExamples: 'Revoir les exemples',
        finalPrep: 'Préparation finale',
        practiceHands: 'Pratique manuelle',
        reviewSteps: 'Revoir les étapes',
      },
    },
    help: {
      title: 'Comment fonctionne StudyBuddy?',
      subtitle: 'Un guide étape par étape',
      getStarted: 'Commencer',
      backToDashboard: 'Retour au planning',
      previous: 'Précédent',
      next: 'Suivant',
      step: 'Étape',
      of: 'sur',
      steps: {
        calendar: {
          title: 'Vue Calendrier',
          description: 'Visualisez tous vos examens et tâches d\'étude dans un calendrier mensuel clair. Cliquez sur un jour pour voir les détails.',
          tip: 'Astuce: Cliquez sur les flèches pour naviguer entre les mois.',
        },
        addExam: {
          title: 'Ajouter des Examens',
          description: 'Ajoutez des examens et tests avec matière, date et niveau de difficulté. Choisissez parmi 23 matières scolaires belges avec codes couleur.',
          tip: 'Astuce: Ajoutez une description pour vous souvenir des chapitres à étudier.',
        },
        suggestions: {
          title: 'Suggestions de Tâches Intelligentes',
          description: 'Après avoir ajouté un examen, vous recevez automatiquement des suggestions de tâches d\'étude. Les tâches sont réparties en phases de base, pratique et révision.',
          tip: 'Astuce: Personnalisez les suggestions selon votre rythme d\'étude et ajoutez vos propres tâches!',
        },
        tasks: {
          title: 'Créer des Tâches',
          description: 'Créez des tâches d\'étude pour chaque examen. Définissez le temps d\'étude estimé et répartissez votre travail sur plusieurs jours.',
          tip: 'Astuce: Les petites tâches sont plus faciles à accomplir!',
        },
        dragDrop: {
          title: 'Glisser-Déposer',
          description: 'Faites glisser les tâches entre les jours ou changez l\'ordre avec le glisser-déposer. Planifiez votre étude de manière flexible.',
          tip: 'Astuce: Faites glisser une tâche vers un autre jour si votre planning change.',
        },
        subtasks: {
          title: 'Sous-tâches',
          description: 'Divisez les grandes tâches en sous-tâches plus petites. Cochez-les pendant que vous étudiez pour voir votre progression.',
          tip: 'Astuce: Chaque sous-tâche peut avoir sa propre durée.',
        },
        progress: {
          title: 'Suivre la Progression',
          description: 'Suivez votre compréhension de la matière et entrez vos résultats après l\'examen. Voyez combien vous avez déjà accompli.',
          tip: 'Astuce: Le niveau de compréhension vous aide à déterminer combien vous devez encore étudier.',
        },
        results: {
          title: 'Tableau des Résultats',
          description: 'Consultez vos performances par matière dans des graphiques. Comparez votre compréhension avec vos résultats finaux.',
          tip: 'Astuce: Utilisez le tableau de bord pour voir quelles matières nécessitent plus d\'attention.',
        },
        templates: {
          title: 'Utiliser les Modèles',
          description: 'Les enseignants peuvent sauvegarder des plannings d\'étude comme modèles. Les élèves peuvent copier et personnaliser les modèles publics.',
          tip: 'Astuce: Les modèles conservent le timing entre les tâches, même avec des dates d\'examen différentes.',
        },
      },
      features: {
        title: 'Fonctionnalités Principales',
        calendar: 'Calendrier mensuel visuel',
        subjects: '23 matières scolaires belges',
        dragDrop: 'Planification glisser-déposer',
        subtasks: 'Sous-tâches avec durée',
        progress: 'Suivi de progression',
        results: 'Tableau des résultats',
        templates: 'Modèles partageables',
        multilang: 'Néerlandais, Français & Anglais',
      },
    },
  },
  en: {
    header: {
      title: 'StudyBuddy',
      subtitle: 'Your personal study buddy',
      selectUser: 'Select student',
      addUser: 'Add new student',
      enterName: 'Enter name...',
      add: 'Add',
      resultsOverview: 'Results Overview',
    },
    calendar: {
      today: 'Today',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekdaysFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      showWeek: 'Show week',
      hideWeek: 'Hide week',
      weekHidden: 'Week hidden',
    },
    exams: {
      title: 'Exams & Tests',
      addExam: 'New exam',
      addTest: 'New test',
      exam: 'Exam',
      test: 'Test',
      subject: 'Subject',
      examTitle: 'Title',
      date: 'Date',
      description: 'Description',
      addDescription: 'Add description...',
      understanding: 'Understanding',
      readiness: 'Readiness (Tasks)',
      result: 'Result',
      delete: 'Delete',
      cancel: 'Cancel',
      save: 'Save',
      noExams: 'No exams scheduled',
      selectSubject: 'Select subject',
    },
    tasks: {
      title: 'Study Tasks',
      tasksFor: 'Tasks for',
      addTask: 'Add task',
      enterTask: 'New task...',
      noTasks: 'No tasks for this day',
      dragHint: 'Drag tasks to move them',
      minutes: 'min',
      completed: 'completed',
      subtasks: 'subtasks',
      duplicate: 'Duplicate',
      edit: 'Edit',
      deleteTask: 'Delete',
      addSubtask: 'Add subtask',
    },
    subtasks: {
      title: 'Subtasks',
      addSubtask: 'Add subtask',
      enterSubtask: 'New subtask...',
      duration: 'Duration (minutes)',
      noSubtasks: 'No subtasks',
    },
    stats: {
      dailyStats: 'Daily Statistics',
      tasks: 'Tasks',
      subtasks: 'Subtasks',
      timeSpent: 'Time spent',
      totalTime: 'Total time',
      completedOnly: '(completed only)',
    },
    results: {
      title: 'Results Overview',
      avgUnderstanding: 'Average Understanding',
      avgReadiness: 'Average Readiness',
      avgResult: 'Average Result',
      perSubject: 'Results per subject',
      understanding: 'Understanding',
      readiness: 'Readiness',
      result: 'Result',
      close: 'Close',
      noData: 'No data available',
    },
    subjects: {
      dutch: 'Dutch',
      french: 'French',
      english: 'English',
      german: 'German',
      spanish: 'Spanish',
      latin: 'Latin',
      greek: 'Greek',
      math: 'Mathematics',
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      science: 'Science',
      geography: 'Geography',
      history: 'History',
      economics: 'Economics',
      religion: 'Religion',
      ethics: 'Ethics',
      music: 'Music',
      art: 'Art',
      pe: 'Physical Education',
      it: 'IT',
      technology: 'Technology',
      other: 'Other',
    },
    difficulty: {
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      login: 'Login',
      logout: 'Logout',
    },
    welcome: {
      title: 'Plan your exams the smart way!',
      subtitle: 'Enter your name to start with your study planning',
      description: 'StudyBuddy helps you organize your study time, track your progress, and ace your exams with confidence.',
      placeholder: 'Your name...',
      button: 'Start studying',
      getStarted: 'Get started for free',
      feature1Title: 'Smart Planning',
      feature1Desc: 'Create study tasks and organize them on your calendar with drag-and-drop.',
      feature2Title: 'Private & Secure',
      feature2Desc: 'Your study schedule is private. Log in securely with your account.',
      feature3Title: 'Share with Others',
      feature3Desc: 'Teachers can share templates and students can learn from each other.',
      calendarPreview: 'Your Study Calendar',
      resultsPreview: 'Results Overview',
    },
    settings: {
      title: 'Settings',
      defaultSubtaskDuration: 'Default subtask duration',
    },
    messages: {
      resultsCompare: 'Compare your understanding with your results',
      perExam: 'Overview per Exam',
      wellPrepared: 'Well prepared',
      almostReady: 'Almost ready',
      stillStudying: 'Still studying',
      examCount: 'exam',
      examsCount: 'exams',
      readinessLegend: 'Readiness Legend',
      readinessFormula: 'Readiness = 60% completed tasks + 40% understanding',
      youGotThis: 'You got this!',
      totalProgress: 'Total Progress',
      done: 'Done',
      yourPlanning: 'Your Planning',
      newExamTest: 'New Exam / Test',
      exampleTitle: 'e.g. Chapter 3 test',
      exampleDescription: 'e.g. Pages 40-60',
      optional: 'optional',
      switchUser: 'Switch user',
      active: 'Active',
      clickToChangeDate: 'Click to change date',
      hours: 'h',
      dragToMove: 'Drag to another day',
    },
    roleSelection: {
      title: 'Who are you?',
      subtitle: 'Choose your role to get started',
      student: 'Student',
      studentDesc: 'Plan your exams and study tasks',
      teacher: 'Teacher',
      teacherDesc: 'Create templates and share with students',
      saving: 'Saving...',
    },
    templates: {
      title: 'Templates',
      myTemplates: 'My Templates',
      publicTemplates: 'Public Templates',
      createTemplate: 'Create Template',
      createFromSchedule: 'Create from my schedule',
      templateName: 'Template name',
      templateDescription: 'Description',
      makePublic: 'Make public',
      deleteTemplate: 'Delete template',
      useTemplate: 'Use template',
      copyToSchedule: 'Copy to my schedule',
      noTemplates: 'No templates available',
      confirmCopy: 'Are you sure you want to apply this template?',
      copySuccess: 'Template copied successfully!',
      createSuccess: 'Template created successfully!',
      by: 'by',
      examsIncluded: 'exams',
    },
    taskSuggestions: {
      title: 'Suggested Tasks',
      description: 'Based on your exam, we\'ve prepared study tasks for you. Customize them as you like!',
      noSuggestions: 'No suggestions available',
      examTooSoon: 'The exam is too soon to suggest tasks. You can add tasks manually.',
      tasksSelected: 'tasks selected',
      totalTime: 'study time',
      skip: 'Skip',
      confirm: 'Create tasks',
      showAdvanced: 'Customize',
      hideAdvanced: 'Hide edit mode',
      addCustom: 'Add custom task',
      taskPlaceholder: 'Task title...',
      add: 'Add',
      phases: {
        foundation: 'Foundation',
        practice: 'Practice',
        review: 'Review',
      },
      taskTitles: {
        readChapter: 'Read chapter',
        vocabulary: 'Learn vocabulary',
        grammarExercises: 'Grammar exercises',
        practiceTexts: 'Practice texts',
        reviewNotes: 'Review notes',
        practiceTest: 'Practice test',
        studyTheory: 'Study theory',
        learnFormulas: 'Learn formulas',
        solveExercises: 'Solve exercises',
        extraExercises: 'Extra exercises',
        reviewMistakes: 'Review mistakes',
        makeSummary: 'Make summary',
        learnTerms: 'Learn terms',
        studyDates: 'Study dates/facts',
        reviewAll: 'Review everything',
        practiceSkills: 'Practice skills',
        reviewExamples: 'Review examples',
        finalPrep: 'Final preparation',
        practiceHands: 'Hands-on practice',
        reviewSteps: 'Review steps',
      },
    },
    help: {
      title: 'How does StudyBuddy work?',
      subtitle: 'A step-by-step guide',
      getStarted: 'Get Started',
      backToDashboard: 'Back to planning',
      previous: 'Previous',
      next: 'Next',
      step: 'Step',
      of: 'of',
      steps: {
        calendar: {
          title: 'Calendar Overview',
          description: 'View all your exams and study tasks in a clear monthly calendar. Click on a day to see the details.',
          tip: 'Tip: Click the arrows to navigate between months.',
        },
        addExam: {
          title: 'Add Exams',
          description: 'Add exams and tests with subject, date, and difficulty level. Choose from 23 Belgian school subjects with color codes.',
          tip: 'Tip: Add a description to remember which chapters to study.',
        },
        suggestions: {
          title: 'Smart Task Suggestions',
          description: 'After adding an exam, you automatically get suggested study tasks. Tasks are distributed across foundation, practice, and review phases.',
          tip: 'Tip: Customize the suggestions to match your study pace and add your own tasks!',
        },
        tasks: {
          title: 'Create Study Tasks',
          description: 'Create study tasks for each exam. Set the estimated study time and spread your work over multiple days.',
          tip: 'Tip: Smaller tasks are easier to check off!',
        },
        dragDrop: {
          title: 'Drag & Drop',
          description: 'Drag tasks between days or change the order with drag-and-drop. Plan your study flexibly and adjust when needed.',
          tip: 'Tip: Drag a task to another day if your schedule changes.',
        },
        subtasks: {
          title: 'Subtasks',
          description: 'Break large tasks into smaller subtasks. Check them off while studying to see your progress.',
          tip: 'Tip: Each subtask can have its own duration.',
        },
        progress: {
          title: 'Track Progress',
          description: 'Track your understanding of the material and enter your results after the exam. See how much you\'ve already accomplished.',
          tip: 'Tip: The understanding level helps you determine how much more you need to study.',
        },
        results: {
          title: 'Results Dashboard',
          description: 'View your performance per subject in charts. Compare your understanding with your final results.',
          tip: 'Tip: Use the dashboard to see which subjects need more attention.',
        },
        templates: {
          title: 'Using Templates',
          description: 'Teachers can save study schedules as templates. Students can copy and customize public templates.',
          tip: 'Tip: Templates preserve the timing between tasks, even with different exam dates.',
        },
      },
      features: {
        title: 'Key Features',
        calendar: 'Visual monthly calendar',
        subjects: '23 Belgian school subjects',
        dragDrop: 'Drag-and-drop planning',
        subtasks: 'Subtasks with duration',
        progress: 'Progress tracking',
        results: 'Results dashboard',
        templates: 'Shareable templates',
        multilang: 'Dutch, French & English',
      },
    },
  },
} as const;

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    selectUser: string;
    addUser: string;
    enterName: string;
    add: string;
    resultsOverview: string;
  };
  calendar: {
    today: string;
    months: readonly string[];
    weekdays: readonly string[];
    weekdaysFull: readonly string[];
    showWeek: string;
    hideWeek: string;
    weekHidden: string;
  };
  exams: {
    title: string;
    addExam: string;
    addTest: string;
    exam: string;
    test: string;
    subject: string;
    examTitle: string;
    date: string;
    description: string;
    addDescription: string;
    understanding: string;
    readiness: string;
    result: string;
    delete: string;
    cancel: string;
    save: string;
    noExams: string;
    selectSubject: string;
  };
  tasks: {
    title: string;
    tasksFor: string;
    addTask: string;
    enterTask: string;
    noTasks: string;
    dragHint: string;
    minutes: string;
    completed: string;
    subtasks: string;
    duplicate: string;
    edit: string;
    deleteTask: string;
    addSubtask: string;
  };
  subtasks: {
    title: string;
    addSubtask: string;
    enterSubtask: string;
    duration: string;
    noSubtasks: string;
  };
  stats: {
    dailyStats: string;
    tasks: string;
    subtasks: string;
    timeSpent: string;
    totalTime: string;
    completedOnly: string;
  };
  results: {
    title: string;
    avgUnderstanding: string;
    avgReadiness: string;
    avgResult: string;
    perSubject: string;
    understanding: string;
    readiness: string;
    result: string;
    close: string;
    noData: string;
  };
  subjects: {
    [key: string]: string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    login: string;
    logout: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    description: string;
    placeholder: string;
    button: string;
    getStarted: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    calendarPreview: string;
    resultsPreview: string;
  };
  settings: {
    title: string;
    defaultSubtaskDuration: string;
  };
  messages: {
    resultsCompare: string;
    perExam: string;
    wellPrepared: string;
    almostReady: string;
    stillStudying: string;
    examCount: string;
    examsCount: string;
    readinessLegend: string;
    readinessFormula: string;
    youGotThis: string;
    totalProgress: string;
    done: string;
    yourPlanning: string;
    newExamTest: string;
    exampleTitle: string;
    exampleDescription: string;
    optional: string;
    switchUser: string;
    active: string;
    clickToChangeDate: string;
    hours: string;
    dragToMove: string;
  };
  roleSelection: {
    title: string;
    subtitle: string;
    student: string;
    studentDesc: string;
    teacher: string;
    teacherDesc: string;
    saving: string;
  };
  templates: {
    title: string;
    myTemplates: string;
    publicTemplates: string;
    createTemplate: string;
    createFromSchedule: string;
    templateName: string;
    templateDescription: string;
    makePublic: string;
    deleteTemplate: string;
    useTemplate: string;
    copyToSchedule: string;
    noTemplates: string;
    confirmCopy: string;
    copySuccess: string;
    createSuccess: string;
    by: string;
    examsIncluded: string;
  };
  help: {
    title: string;
    subtitle: string;
    getStarted: string;
    backToDashboard: string;
    previous: string;
    next: string;
    step: string;
    of: string;
    steps: {
      calendar: { title: string; description: string; tip: string };
      addExam: { title: string; description: string; tip: string };
      suggestions: { title: string; description: string; tip: string };
      tasks: { title: string; description: string; tip: string };
      dragDrop: { title: string; description: string; tip: string };
      subtasks: { title: string; description: string; tip: string };
      progress: { title: string; description: string; tip: string };
      results: { title: string; description: string; tip: string };
      templates: { title: string; description: string; tip: string };
    };
    features: {
      title: string;
      calendar: string;
      subjects: string;
      dragDrop: string;
      subtasks: string;
      progress: string;
      results: string;
      templates: string;
      multilang: string;
    };
  };
}

export function getTranslation(lang: Language): Translations {
  return translations[lang] as Translations;
}
