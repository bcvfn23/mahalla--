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
    "global.app_name": "Safe Mahalla",
    "global.version": "v5.0 - Asosiy",
    
    // Landing
    "landing.title": "Shahar Xavfsizligining\nIntellektual Tahlili",
    "landing.subtitle": "Enterprise darajasidagi bashoratli tahlil platformasi. Haqiqiy vaqtda jinoyatchilikni monitoring qilish, xavf o'choqlarini aniqlash va IIV hamda Smart City tuzilmalari uchun sun'iy intellekt yordamida tavsiyalar yaratish.",
    "landing.login": "Tizimga kirish",
    "landing.demo": "Namoyish",
    "landing.badge": "Yangi avlod Davlat AI texnologiyasi",
    "landing.about": "Loyiha haqida",
    "landing.api": "API Hujjatlari",
    "landing.feat1.title": "Interaktiv Heatmap",
    "landing.feat1.desc": "Shahar xaritasida xavf va patrul zonalarini vizualizatsiya qilish.",
    "landing.feat2.title": "Bashoratli AI",
    "landing.feat2.desc": "Tarixiy ma'lumotlar va trendlar asosida jinoyatchilik o'sishini bashorat qilish.",
    "landing.feat3.title": "24/7 Monitoring",
    "landing.feat3.desc": "Avtomatik xabar berish tizimi bilan real vaqtda ma'lumotlarni tahlil qilish.",
    
    // AI Sidebar
    "ai.title": "AI Assistent",
    "ai.risk_title": "Xavf oshdi",
    "ai.risk_desc": "Yunusobod tumanida so'nggi 48 soat ichida jinoyatchilik xavfi 14% ga o'sdi.",
    "ai.hotspot_title": "Potensial o'choq",
    "ai.hotspot_desc": "Chorsu bozori atrofida anomal faollik (o'g'rilik) aniqlandi.",
    "ai.rec_title": "AI Tavsiyasi",
    "ai.rec_desc": "Chilonzor tumanida tungi patrullar sonini 20% ga oshirish.",
    "ai.status": "AI tizimi ma'lumotlarni real vaqtda tahlil qilmoqda",
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
    "global.app_name": "Safe Mahalla",
    "global.version": "v5.0 - Базовый",

    // Landing
    "landing.title": "Интеллектуальная Аналитика\nБезопасности Города",
    "landing.subtitle": "Платформа предиктивной аналитики уровня Enterprise. Мониторинг преступности в реальном времени, выявление очагов опасности и генерация рекомендаций с помощью искусственного интеллекта для структур МВД и Smart City.",
    "landing.login": "Войти в систему",
    "landing.demo": "Демонстрация",
    "landing.badge": "Next-Generation Government AI Technology",
    "landing.about": "О проекте",
    "landing.api": "Документация API",
    "landing.feat1.title": "Интерактивный Heatmap",
    "landing.feat1.desc": "Визуализация зон риска и патрулирования на детализированной карте города.",
    "landing.feat2.title": "Предиктивный ИИ",
    "landing.feat2.desc": "Прогнозирование роста преступности на основе исторических данных и трендов.",
    "landing.feat3.title": "Мониторинг 24/7",
    "landing.feat3.desc": "Анализ данных в реальном времени с автоматической системой уведомлений.",
    
    // AI Sidebar
    "ai.title": "AI Ассистент",
    "ai.risk_title": "Риск повышен",
    "ai.risk_desc": "В Юнусабадском районе риск преступности вырос на 14% за последние 48 часов.",
    "ai.hotspot_title": "Потенциальный очаг",
    "ai.hotspot_desc": "Обнаружена аномальная активность вблизи рынка Чорсу (кражи).",
    "ai.rec_title": "Рекомендация ИИ",
    "ai.rec_desc": "Увеличить частоту ночных патрулей в Чиланзарском районе на 20%.",
    "ai.status": "Система ИИ анализирует данные в реальном времени",
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
