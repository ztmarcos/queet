export type Language = 'es' | 'en'

export interface Translations {
  // Navigation
  nav: {
    dashboard: string
    progress: string
    triggers: string
    support: string
    settings: string
  }
  
  // Dashboard
  dashboard: {
    days: string
    withoutSmoking: string
    bestStreak: string
    totalDays: string
    smokingHits: string
    dailyHits: string
    quickActions: string
    update: string
    reset: string
    subtractHit: string
    statistics: string
    startDate: string
    daysSinceStart: string
    triggersRegistered: string
    achievementsObtained: string
    recentAchievements: string
    motivation: string
    motivationQuote: string
    loading: string
  }
  
  // Progress
  progress: {
    detailedProgress: string
    last7Days: string
    last30Days: string
    dailyProgress: string
    nextGoals: string
    completed: string
    nextGoal: string
    futureGoal: string
    daysRemaining: string
    allAchievements: string
  }
  
  // Triggers
  triggers: {
    registerTrigger: string
    newTrigger: string
    triggerType: string
    intensity: string
    notes: string
    optional: string
    describe: string
    cancel: string
    save: string
    recentTriggers: string
    noTriggers: string
    startRegistering: string
    triggerStats: string
    stress: string
    boredom: string
    social: string
    emotional: string
    habit: string
    other: string
    mild: string
    moderate: string
    intense: string
  }
  
  // Support
  support: {
    personalAssistant: string
    hereToHelp: string
    quickQuestions: string
    iWantToSmoke: string
    howToHandleStress: string
    sleepTips: string
    howLongWithdrawal: string
    motivationToContinue: string
    breathingExercises: string
    writeMessage: string
    send: string
  }
  
  // Settings
  settings: {
    appSettings: string
    notifications: string
    dailyReminders: string
    darkMode: string
    comingSoon: string
    dataManagement: string
    exportData: string
    downloadProgress: string
    deleteAccount: string
    deletePermanently: string
    helpSupport: string
    contactSupport: string
    userGuide: string
    howToUse: string
    privacyPolicy: string
    howWeProtect: string
    appInfo: string
    version: string
    yourCompanion: string
    logout: string
    deleteConfirm: string
    deleteConfirmText: string
    language: string
    spanish: string
    english: string
  }
  
  // Auth
  auth: {
    welcome: string
    yourCompanionHealthy: string
    signIn: string
    signUp: string
    signOut: string
    accountCreated: string
    welcomeBack: string
    sessionClosed: string
  }
  
  // Common
  common: {
    days: string
    day: string
    remaining: string
    completed: string
    next: string
    future: string
  }
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      dashboard: 'INICIO',
      progress: 'PROGRESO',
      triggers: 'TRIGGERS',
      support: 'APOYO',
      settings: 'AJUSTES',
    },
    dashboard: {
      days: 'DÍAS',
      withoutSmoking: 'SIN FUMAR MARIHUANA',
      bestStreak: 'MEJOR RACHA',
      totalDays: 'TOTAL DÍAS',
      smokingHits: 'FUMADAS',
      dailyHits: 'HOY',
      quickActions: 'ACCIONES RÁPIDAS',
      update: 'FUMÉ',
      reset: 'REINICIAR',
      subtractHit: '-1 FUMADA',
      statistics: 'ESTADÍSTICAS',
      startDate: 'FECHA DE INICIO:',
      daysSinceStart: 'DÍAS DESDE EL INICIO:',
      triggersRegistered: 'TRIGGERS REGISTRADOS:',
      achievementsObtained: 'LOGROS OBTENIDOS:',
      recentAchievements: 'LOGROS RECIENTES',
      motivation: 'MOTIVACIÓN',
      motivationQuote: '"CADA DÍA QUE PASAS SIN FUMAR ES UN PASO HACIA UNA VIDA MÁS SALUDABLE Y LIBRE."',
      loading: 'CARGANDO...',
    },
    progress: {
      detailedProgress: 'PROGRESO DETALLADO',
      last7Days: 'Últimos 7 días',
      last30Days: 'Últimos 30 días',
      dailyProgress: 'Progreso Diario',
      nextGoals: 'Próximos Objetivos',
      completed: '¡Completado!',
      nextGoal: 'Próximo objetivo',
      futureGoal: 'Objetivo futuro',
      daysRemaining: 'días restantes',
      allAchievements: 'Todos los Logros',
    },
    triggers: {
      registerTrigger: 'REGISTRAR TRIGGER',
      newTrigger: 'NUEVO TRIGGER',
      triggerType: 'TIPO DE TRIGGER',
      intensity: 'INTENSIDAD',
      notes: 'NOTAS (OPCIONAL)',
      optional: 'opcional',
      describe: 'Describe qué pasó, cómo te sentiste...',
      cancel: 'CANCELAR',
      save: 'GUARDAR',
      recentTriggers: 'TRIGGERS RECIENTES',
      noTriggers: 'No hay triggers registrados',
      startRegistering: '¡Empieza a registrar cuando sientas ganas de fumar!',
      triggerStats: 'ESTADÍSTICAS DE TRIGGERS',
      stress: 'Estrés',
      boredom: 'Aburrimiento',
      social: 'Social',
      emotional: 'Emocional',
      habit: 'Hábito',
      other: 'Otro',
      mild: 'Leve',
      moderate: 'Moderado',
      intense: 'Intenso',
    },
    support: {
      personalAssistant: 'ASISTENTE PERSONAL',
      hereToHelp: 'Aquí para ayudarte 24/7',
      quickQuestions: 'PREGUNTAS RÁPIDAS',
      iWantToSmoke: 'Tengo ganas de fumar',
      howToHandleStress: '¿Cómo manejo el estrés?',
      sleepTips: 'Consejos para dormir mejor',
      howLongWithdrawal: '¿Cuánto tiempo dura la abstinencia?',
      motivationToContinue: 'Motivación para continuar',
      breathingExercises: 'Ejercicios de respiración',
      writeMessage: 'Escribe tu mensaje...',
      send: 'ENVIAR',
    },
    settings: {
      appSettings: 'CONFIGURACIÓN DE LA APP',
      notifications: 'NOTIFICACIONES',
      dailyReminders: 'Recordatorios diarios',
      darkMode: 'MODO OSCURO',
      comingSoon: 'Tema oscuro (próximamente)',
      dataManagement: 'GESTIÓN DE DATOS',
      exportData: 'EXPORTAR DATOS',
      downloadProgress: 'Descargar tu progreso',
      deleteAccount: 'ELIMINAR CUENTA',
      deletePermanently: 'Eliminar permanentemente',
      helpSupport: 'AYUDA Y SOPORTE',
      contactSupport: 'CONTACTAR SOPORTE',
      userGuide: 'GUÍA DE USO',
      howToUse: 'Cómo usar la app',
      privacyPolicy: 'POLÍTICA DE PRIVACIDAD',
      howWeProtect: 'Cómo protegemos tus datos',
      appInfo: 'INFORMACIÓN DE LA APP',
      version: 'Versión 1.0.0',
      yourCompanion: 'Tu compañero para dejar de fumar marihuana',
      logout: 'CERRAR SESIÓN',
      deleteConfirm: '¿Eliminar cuenta?',
      deleteConfirmText: 'Esta acción no se puede deshacer. Se eliminarán todos tus datos permanentemente.',
      language: 'IDIOMA',
      spanish: 'Español',
      english: 'English',
    },
    auth: {
      welcome: '¡Bienvenido de vuelta!',
      yourCompanionHealthy: 'TU COMPAÑERO PARA DEJAR DE FUMAR MARIHUANA',
      signIn: 'INICIAR SESIÓN',
      signUp: 'REGISTRARSE',
      signOut: 'Sesión cerrada exitosamente',
      accountCreated: '¡Cuenta creada exitosamente!',
      welcomeBack: '¡Bienvenido de vuelta!',
      sessionClosed: 'Sesión cerrada',
    },
    common: {
      days: 'días',
      day: 'día',
      remaining: 'restante',
      completed: '¡Completado!',
      next: 'Próximo',
      future: 'futuro',
    },
  },
  en: {
    nav: {
      dashboard: 'DASHBOARD',
      progress: 'PROGRESS',
      triggers: 'TRIGGERS',
      support: 'SUPPORT',
      settings: 'SETTINGS',
    },
    dashboard: {
      days: 'DAYS',
      withoutSmoking: 'WITHOUT SMOKING WEED',
      bestStreak: 'BEST STREAK',
      totalDays: 'TOTAL DAYS',
      smokingHits: 'HIT',
      dailyHits: 'TODAY',
      quickActions: 'QUICK ACTIONS',
      update: 'SMOKED',
      reset: 'RESET',
      subtractHit: 'SUBTRACT 1 HIT',
      statistics: 'STATISTICS',
      startDate: 'START DATE:',
      daysSinceStart: 'DAYS SINCE START:',
      triggersRegistered: 'TRIGGERS REGISTERED:',
      achievementsObtained: 'ACHIEVEMENTS OBTAINED:',
      recentAchievements: 'RECENT ACHIEVEMENTS',
      motivation: 'MOTIVATION',
      motivationQuote: '"EVERY DAY YOU SPEND WITHOUT SMOKING IS A STEP TOWARDS A HEALTHIER AND FREER LIFE."',
      loading: 'LOADING...',
    },
    progress: {
      detailedProgress: 'DETAILED PROGRESS',
      last7Days: 'Last 7 days',
      last30Days: 'Last 30 days',
      dailyProgress: 'Daily Progress',
      nextGoals: 'Next Goals',
      completed: 'Completed!',
      nextGoal: 'Next goal',
      futureGoal: 'Future goal',
      daysRemaining: 'days remaining',
      allAchievements: 'All Achievements',
    },
    triggers: {
      registerTrigger: 'REGISTER TRIGGER',
      newTrigger: 'NEW TRIGGER',
      triggerType: 'TRIGGER TYPE',
      intensity: 'INTENSITY',
      notes: 'NOTES (OPTIONAL)',
      optional: 'optional',
      describe: 'Describe what happened, how you felt...',
      cancel: 'CANCEL',
      save: 'SAVE',
      recentTriggers: 'RECENT TRIGGERS',
      noTriggers: 'No triggers registered',
      startRegistering: 'Start registering when you feel like smoking!',
      triggerStats: 'TRIGGER STATISTICS',
      stress: 'Stress',
      boredom: 'Boredom',
      social: 'Social',
      emotional: 'Emotional',
      habit: 'Habit',
      other: 'Other',
      mild: 'Mild',
      moderate: 'Moderate',
      intense: 'Intense',
    },
    support: {
      personalAssistant: 'PERSONAL ASSISTANT',
      hereToHelp: 'Here to help you 24/7',
      quickQuestions: 'QUICK QUESTIONS',
      iWantToSmoke: 'I want to smoke',
      howToHandleStress: 'How to handle stress?',
      sleepTips: 'Sleep tips',
      howLongWithdrawal: 'How long does withdrawal last?',
      motivationToContinue: 'Motivation to continue',
      breathingExercises: 'Breathing exercises',
      writeMessage: 'Write your message...',
      send: 'SEND',
    },
    settings: {
      appSettings: 'APP SETTINGS',
      notifications: 'NOTIFICATIONS',
      dailyReminders: 'Daily reminders',
      darkMode: 'DARK MODE',
      comingSoon: 'Dark theme (coming soon)',
      dataManagement: 'DATA MANAGEMENT',
      exportData: 'EXPORT DATA',
      downloadProgress: 'Download your progress',
      deleteAccount: 'DELETE ACCOUNT',
      deletePermanently: 'Delete permanently',
      helpSupport: 'HELP & SUPPORT',
      contactSupport: 'CONTACT SUPPORT',
      userGuide: 'USER GUIDE',
      howToUse: 'How to use the app',
      privacyPolicy: 'PRIVACY POLICY',
      howWeProtect: 'How we protect your data',
      appInfo: 'APP INFO',
      version: 'Version 1.0.0',
      yourCompanion: 'Your companion to quit smoking weed',
      logout: 'SIGN OUT',
      deleteConfirm: 'Delete account?',
      deleteConfirmText: 'This action cannot be undone. All your data will be permanently deleted.',
      language: 'LANGUAGE',
      spanish: 'Español',
      english: 'English',
    },
    auth: {
      welcome: 'Welcome back!',
      yourCompanionHealthy: 'YOUR COMPANION TO QUIT SMOKING WEED',
      signIn: 'SIGN IN',
      signUp: 'SIGN UP',
      signOut: 'Session closed successfully',
      accountCreated: 'Account created successfully!',
      welcomeBack: 'Welcome back!',
      sessionClosed: 'Session closed',
    },
    common: {
      days: 'days',
      day: 'day',
      remaining: 'remaining',
      completed: 'Completed!',
      next: 'Next',
      future: 'future',
    },
  },
}

export function useTranslations(language: Language): Translations {
  return translations[language]
}
