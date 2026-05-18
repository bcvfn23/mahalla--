"use client";

import { useI18n } from "@/lib/i18n";
import { Activity, AlertTriangle, RefreshCw, FilePlus, Trash2 } from "lucide-react";

export default function FaollikPage() {
  const { t, lang } = useI18n();

  const activities = [
    {
      id: 1,
      type: "danger",
      icon: AlertTriangle,
      title: lang === 'uz' ? "Xavf darajasi o'zgardi" : "Уровень риска изменен",
      desc: lang === 'uz' ? "Dilbuloq mahallasi" : "Махалля Дилбулок",
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-danger",
      bg: "bg-danger/20"
    },
    {
      id: 2,
      type: "sync",
      icon: RefreshCw,
      title: lang === 'uz' ? "Integratsiya sinxronlashdi" : "Интеграция синхронизирована",
      desc: lang === 'uz' ? "Asalobod mahallasi" : "Махалля Асалобод",
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-safe",
      bg: "bg-safe/20"
    },
    {
      id: 3,
      type: "sync",
      icon: RefreshCw,
      title: lang === 'uz' ? "Integratsiya sinxronlashdi" : "Интеграция синхронизирована",
      desc: lang === 'uz' ? "Bog'imaydon mahallasi" : "Махалля Богимайдон",
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-safe",
      bg: "bg-safe/20"
    },
    {
      id: 4,
      type: "add",
      icon: FilePlus,
      title: lang === 'uz' ? "Yangi yozuv qo'shildi" : "Добавлена новая запись",
      desc: lang === 'uz' ? "Huvaydo mahallasi" : "Махалля Хувайдо",
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-primary",
      bg: "bg-primary/20"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">REAL VAQT</h2>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {lang === 'uz' ? "Tizim faolligi" : "Активность системы"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-safe/10 border border-safe/20 rounded-full text-safe text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">SO'NGGI HARAKATLAR</h3>
              <h2 className="text-lg font-bold text-white">{lang === 'uz' ? "Faollik lenti" : "Лента активности"}</h2>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-card border border-card-border rounded-lg hover:bg-card/80 transition-all text-xs font-medium text-foreground/60">
              <Trash2 className="w-3.5 h-3.5" />
              {lang === 'uz' ? "O'chirish" : "Очистить"}
            </button>
          </div>

          <div className="space-y-4">
            {activities.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-card/40 border border-transparent hover:border-card-border transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <p className="text-xs text-foreground/60 mt-0.5">{item.desc}</p>
                  <p className="text-[10px] text-foreground/40 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl h-fit">
          <div className="mb-6 pb-4 border-b border-card-border/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">KEYINGI QADAMLAR</h3>
            <h2 className="text-lg font-bold text-white">{lang === 'uz' ? "Ustuvor vazifalar" : "Приоритетные задачи"}</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mb-4 border border-card-border">
              <Activity className="w-5 h-5 text-primary/50" />
            </div>
            <p className="text-sm text-foreground/50">
              {lang === 'uz' ? "Hozircha vazifalar yo'q" : "Пока нет задач"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
