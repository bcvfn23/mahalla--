"use client";

import { useI18n } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, Mailbox } from "lucide-react";

export default function KalendarPage() {
  const { t, lang } = useI18n();

  const days = ["DU", "SE", "CHO", "PA", "JU", "SHA", "YA"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {lang === 'uz' ? "Tadbirlar Kalendari" : "Календарь мероприятий"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <button className="p-2 rounded-full bg-card hover:bg-card/80 border border-card-border transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white">May 2026</h2>
            <button className="p-2 rounded-full bg-card hover:bg-card/80 border border-card-border transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-foreground/40">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {/* Empty slots for start of month */}
            <div className="h-16"></div>
            <div className="h-16"></div>
            <div className="h-16"></div>
            <div className="h-16"></div>
            
            {dates.map((date) => (
              <div 
                key={date} 
                className={`h-16 rounded-xl flex items-start p-2 transition-colors cursor-pointer border ${
                  date === 18 
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'bg-card/30 hover:bg-card border-card-border/50 text-white'
                }`}
              >
                {date}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-card-border/50">
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#0b2b4d] text-primary"><div className="w-2 h-2 bg-primary rounded-full"/>Uchrashuv</span>
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#0b3323] text-safe"><div className="w-2 h-2 bg-safe rounded-full"/>Tadbir</span>
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#3b1219] text-danger"><div className="w-2 h-2 bg-danger rounded-full"/>Muddat</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
            <h2 className="text-lg font-bold text-white">18 May 2026</h2>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              + {lang === 'uz' ? "Tadbir" : "Событие"}
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
             <Mailbox className="w-12 h-12 text-primary mb-4" />
             <p>{lang === 'uz' ? "Bu kunda tadbir yo'q" : "В этот день событий нет"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
