"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ru" | "uz";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Sidebar
    "nav.dashboard": "Dashboard",
    "nav.yoshlar": "Yoshlar",
    "nav.xarita": "Xarita",
    "nav.faollik": "Faollik",
    "nav.rejalar": "Rejalar",
    "nav.kalendar": "Kalendar",
    "nav.statistika": "Statistika",
    "nav.ai_tahlil": "AI Tahlil",
    "nav.integratsiyalar": "Integratsiyalar",
    "nav.profil": "Profil",
    "nav.chiqish": "Chiqish",
    "section.asosiy": "ASOSIY",
    "section.boshqaruv": "BOSHQARUV",
    "section.hisob": "HISOB",
    
    // Topbar
    "topbar.add_youth": "+ Yosh qo'shish",
    "topbar.search": "Izlash...",
    
    // Global
    "global.app_name": "Mahalla Monitor",
    "global.version": "v5.0 - Asosiy",
  },
  ru: {
    // Sidebar
    "nav.dashboard": "Дашборд",
    "nav.yoshlar": "Молодежь",
    "nav.xarita": "Карта",
    "nav.faollik": "Активность",
    "nav.rejalar": "Планы",
    "nav.kalendar": "Календарь",
    "nav.statistika": "Статистика",
    "nav.ai_tahlil": "AI Анализ",
    "nav.integratsiyalar": "Интеграции",
    "nav.profil": "Профиль",
    "nav.chiqish": "Выйти",
    "section.asosiy": "ОСНОВНОЕ",
    "section.boshqaruv": "УПРАВЛЕНИЕ",
    "section.hisob": "АККАУНТ",
    
    // Topbar
    "topbar.add_youth": "+ Добавить",
    "topbar.search": "Поиск...",
    
    // Global
    "global.app_name": "Mahalla Monitor",
    "global.version": "v5.0 - Базовый",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("uz"); // Default to Uzbek as requested

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && (savedLang === "uz" || savedLang === "ru")) {
      setLang(savedLang);
    }
  }, []);

  const changeLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key: string): string => {
    // Fallback logic
    const dict = translations[lang] as Record<string, string>;
    if (dict[key]) return dict[key];
    
    const fallbackDict = translations["uz"] as Record<string, string>;
    return fallbackDict[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
