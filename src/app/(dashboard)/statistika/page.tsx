"use client";

import { useI18n } from "@/lib/i18n";
import { LineChart, BarChart2, Activity, Database, AlertCircle, TrendingUp } from "lucide-react";

export default function StatistikaPage() {
  const { t, lang } = useI18n();

  const stats = [
    {
      title: lang === 'uz' ? "JAMI TAHLIL QILINGAN" : "ВСЕГО ПРОАНАЛИЗИРОВАНО",
      value: "0",
      change: "+12%",
      desc: lang === 'uz' ? "o'tgan oydan" : "с прошлого месяца",
      trend: "up"
    },
    {
      title: lang === 'uz' ? "KRITIK HUDUDLAR" : "КРИТИЧЕСКИЕ ЗОНЫ",
      value: "0",
      change: "Diqqat talab",
      desc: lang === 'uz' ? "Diqqat talab" : "Требует внимания",
      trend: "danger"
    },
    {
      title: lang === 'uz' ? "O'RTACHA BARQARORLIK" : "СРЕДНЯЯ СТАБИЛЬНОСТЬ",
      value: "0%",
      change: "Tizim normada",
      desc: lang === 'uz' ? "Tizim normada" : "Система в норме",
      trend: "safe"
    },
    {
      title: lang === 'uz' ? "API MUROJAATLAR" : "API ЗАПРОСЫ",
      value: "2 460",
      change: "",
      desc: lang === 'uz' ? "So'nggi 24 soat" : "За последние 24 часа",
      trend: "neutral"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            {lang === 'uz' ? "MA'LUMOT TAHLILI MARKAZI" : "ЦЕНТР АНАЛИЗА ДАННЫХ"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {lang === 'uz' ? "Statistika va API Tahlil" : "Статистика и API Анализ"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-safe/10 border border-safe/20 rounded-full text-safe text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
          <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
          <span>API Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-4">{stat.title}</h3>
            <div className="text-4xl font-black text-white mb-4 tracking-tight">{stat.value}</div>
            
            <div className="flex items-center gap-2 text-xs font-medium">
              {stat.trend === 'up' && <span className="text-safe flex items-center gap-1"><TrendingUp className="w-3 h-3"/> {stat.change}</span>}
              {stat.trend === 'danger' && <span className="text-warning flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {stat.desc}</span>}
              {stat.trend === 'safe' && <span className="text-safe">{stat.desc}</span>}
              {stat.trend === 'neutral' && <span className="text-foreground/50">{stat.desc}</span>}
              {stat.trend === 'up' && <span className="text-foreground/50">{stat.desc}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">RISK TAQSIMOTI</h3>
              <h2 className="text-lg font-bold text-white">{lang === 'uz' ? "Gibrid holat kesimi" : "Гибридный срез состояний"}</h2>
            </div>
            <button className="px-3 py-1.5 bg-card border border-card-border rounded-lg text-xs font-medium text-foreground/70 hover:text-white transition-colors">
              Hisobot
            </button>
          </div>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-card-border/50 rounded-xl">
             <BarChart2 className="w-8 h-8 text-foreground/20" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <div className="mb-6 pb-4 border-b border-card-border/50">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">AI BASHORATI</h3>
            <h2 className="text-lg font-bold text-white">{lang === 'uz' ? "Xavf va Davomat tendensiyasi" : "Тенденции риска и посещаемости"}</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-danger"></div><span className="text-sm text-foreground/70">Yuqori xavf <strong className="text-white">0</strong></span></div>
          </div>
          <div className="h-36 flex items-center justify-center border-2 border-dashed border-card-border/50 rounded-xl">
             <LineChart className="w-8 h-8 text-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
