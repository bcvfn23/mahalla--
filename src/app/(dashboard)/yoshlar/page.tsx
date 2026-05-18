"use client";

import { useI18n } from "@/lib/i18n";
import { Search, Filter, Download, FileText, Database } from "lucide-react";

export default function YoshlarPage() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">YAGONA MARKAZIY BAZA</h2>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {lang === 'uz' ? "Yoshlar ro'yxati" : "Список молодежи"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === 'uz' ? "Jami 12,450 ta yoshlar topildi" : "Всего найдено 12,450 молодых людей"}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full text-warning text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <Database className="w-3 h-3" />
          <span>Live DB Syncing</span>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input 
              type="text" 
              placeholder={lang === 'uz' ? "Ism, maktab yoki ID bo'yicha qidirish..." : "Поиск по имени, школе или ID..."}
              className="w-full bg-[#091024] border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <select className="bg-[#091024] border border-card-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
              <option>{lang === 'uz' ? "Barcha darajalar" : "Все уровни"}</option>
              <option>{lang === 'uz' ? "Yuqori xavf" : "Высокий риск"}</option>
              <option>{lang === 'uz' ? "O'rta xavf" : "Средний риск"}</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-safe/10 text-safe border border-safe/20 rounded-xl hover:bg-safe/20 transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              Eksport
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-xl hover:bg-card/80 transition-all text-sm font-medium">
              <FileText className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-card-border border-dashed">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 border border-card-border shadow-lg">
            <Search className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {lang === 'uz' ? "Natija topilmadi" : "Результаты не найдены"}
          </h3>
          <p className="text-sm text-foreground/50 max-w-sm">
            {lang === 'uz' ? "Qidiruv so'zini o'zgartiring yoki filterni tozalang." : "Измените поисковой запрос или очистите фильтры."}
          </p>
        </div>
      </div>
    </div>
  );
}
