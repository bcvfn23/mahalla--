"use client";

import { useI18n } from "@/lib/i18n";
import { CheckCircle } from "lucide-react";

export default function RejalarPage() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            REJA BOSHQARUVI
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {lang === 'uz' ? "Faol rejalar markazi" : "Центр активных планов"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Tasks Synced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            YO'NALTIRILGAN ISHLANMALAR
          </h3>
          <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-card-border/50">
            {lang === 'uz' ? "Kanban Reja Taxtasi" : "Канбан Доска Планов"}
          </h2>
          <div className="flex flex-col items-center justify-center h-full opacity-50 pb-20">
             <CheckCircle className="w-12 h-12 text-primary mb-4" />
             <p>{lang === 'uz' ? "Barcha vazifalar yakunlangan" : "Все задачи завершены"}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            HAFTALIK AKTIVLIK
          </h3>
          <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-card-border/50">
            {lang === 'uz' ? "Faollik grafigi" : "График активности"}
          </h2>
          
          {/* Mock Graph Grid */}
          <div className="relative h-64 mt-8">
             <div className="flex flex-col justify-between h-full text-xs text-foreground/40 border-l border-card-border/50 pl-2">
                <span>1,0</span>
                <span>0,8</span>
                <span>0,6</span>
                <span>0,4</span>
                <span>0,2</span>
                <span>0</span>
             </div>
             <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-foreground/40 pt-2 border-t border-card-border/50">
                <span>1-hafta</span>
                <span>2-hafta</span>
                <span>3-hafta</span>
                <span>4-hafta</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
