"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
  MapPin,
  Activity,
  Cpu,
  Terminal,
  Sparkles
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useI18n } from "@/lib/i18n";

const districtData = [
  { uz: 'Guliston', ru: 'г. Гулистан', crimes: 120, severity: 'high' },
  { uz: 'Oqoltin', ru: 'Акалтынский', crimes: 98, severity: 'medium' },
  { uz: "Sirdaryo t.", ru: 'Сырдарьинский', crimes: 145, severity: 'high' },
  { uz: 'Sayxunobod', ru: 'Сайхунабадский', crimes: 45, severity: 'low' },
  { uz: 'Mirzaobod', ru: 'Мирзаабадский', crimes: 86, severity: 'medium' },
];

export default function Dashboard() {
  const { lang } = useI18n();
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    safeIndex: 100,
    activePatrols: 128
  });
  const [dynamicCrimeData, setDynamicCrimeData] = useState<any[]>([]);
  const [dynamicDistrictData, setDynamicDistrictData] = useState<any[]>([]);
  const [yearFilter, setYearFilter] = useState("current");
  const [liveLogs, setLiveLogs] = useState<any[]>([]);

  // 24/7 AI Live monitoring simulator loop
  useEffect(() => {
    const initialLogs = [
      { id: 1, type: "info", time: "23:54", msgUz: "AI model: Profilaktik xulq-atvor tahlili v2.4 ishga tushirildi.", msgRu: "ИИ модель: Профилактический анализ поведения v2.4 запущена." },
      { id: 2, type: "warn", time: "23:51", msgUz: "Diqqat: Sayxunobod tumanida yoshlar davomati 5.2% ga pasayishi prognoz qilinmoqda.", msgRu: "Внимание: В Сайхунабадском районе прогнозируется снижение посещаемости на 5.2%." },
      { id: 3, type: "ok", time: "23:48", msgUz: "Tizim holati: IIV, DTM va Maktab ma'lumotlar bazasi integratsiyasi muvaffaqiyatli yakunlandi.", msgRu: "Статус системы: Интеграция баз данных МВД, ГЦТ и школ успешно завершена." },
    ];
    setLiveLogs(initialLogs);

    const logsFeed = [
      { type: "info", msgUz: "AI: Guliston shahri bo'yicha sotsial portretlarni qayta ishlash boshlandi.", msgRu: "ИИ: Начата обработка социальных портретов по г. Гулистан." },
      { type: "warn", msgUz: "Diqqat: Oqoltin tumanida yoshlar o'rtasida bandlik ko'rsatkichlarining anomaliyasi aniqlandi.", msgRu: "Внимание: В Акалтынском районе выявлена аномалия показателей занятости среди молодежи." },
      { type: "ok", msgUz: "Taqdim etilgan tavsiyalar: 15 ta preventiv profilaktika suhbatlari muvaffaqiyatli rejalashtirildi.", msgRu: "Выданные рекомендации: Успешно запланировано 15 превентивных профилактических бесед." },
      { type: "info", msgUz: "AI Core: Sirdaryo tumanida profilaktika inspektori patrullarini muvofiqlashtirish yangilandi.", msgRu: "AI Core: Обновлена координация патрулей инспектора профилактики в Сырдарьинском районе." },
      { type: "warn", msgUz: "AI Signal: 3 nafar yuqori xavfli yoshlar guruhining koordinatalari mos tushishi qayd etildi.", msgRu: "ИИ Сигнал: Зафиксировано совпадение координат 3 молодых людей из группы высокого риска." }
    ];

    let logCounter = 4;
    const interval = setInterval(() => {
      const randomLog = logsFeed[Math.floor(Math.random() * logsFeed.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setLiveLogs(prev => {
        const updated = [
          { id: logCounter++, type: randomLog.type, time: timeStr, msgUz: randomLog.msgUz, msgRu: randomLog.msgRu },
          ...prev
        ];
        if (updated.length > 5) updated.pop();
        return updated;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const res = await fetch("/api/statistics");
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const data = await res.json();
        
        if (data.success && active) {
          setStats({
            totalIncidents: data.incidentsCount,
            activeIncidents: data.activeIncidentsCount,
            safeIndex: data.safeIndex,
            activePatrols: 128
          });
          
          setDynamicCrimeData(data.crimeTrend);
          setDynamicDistrictData(data.districtStats);
        }
      } catch (err) {
        console.error("Dashboard statistics load error:", err);
      }
    }

    fetchStats();
    
    return () => {
      active = false;
    };
  }, [lang, yearFilter]);

  const kpiCards = [
    {
      title: lang === 'uz' ? "Jami insidentlar" : "Всего инцидентов",
      value: stats.totalIncidents.toString(),
      change: "+12.5%",
      trend: "up",
      icon: ShieldAlert,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: lang === 'uz' ? "Xavfsizlik indeksi" : "Индекс безопасности",
      value: `${stats.safeIndex}/100`,
      change: "+2.4%",
      trend: "up",
      icon: Activity,
      color: "text-safe",
      bg: "bg-safe/10",
    },
    {
      title: lang === 'uz' ? "Faol (Ochiq) ishlar" : "Активные (Открытые) дела",
      value: stats.activeIncidents.toString(),
      change: "-1",
      trend: "down",
      icon: MapPin,
      color: "text-danger",
      bg: "bg-danger/10",
    },
    {
      title: lang === 'uz' ? "Faol patrullar" : "Активные патрули",
      value: stats.activePatrols.toString(),
      change: "+14",
      trend: "up",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {lang === 'uz' ? "Tizim sharhi" : "Обзор системы"}
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          {lang === 'uz' ? "Haqiqiy vaqtda jinoyatchilik tahlili (Sirdaryo v.)" : "Аналитика преступности в реальном времени (Сырдарьинская обл.)"}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon className={`h-24 w-24 ${card.color}`} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground/70">{card.title}</p>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-foreground">{card.value}</h3>
                <span className={`flex items-center text-xs font-medium ${card.trend === 'up' && card.color === 'text-warning' ? 'text-danger' : card.trend === 'down' ? 'text-safe' : 'text-primary'}`}>
                  {card.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {card.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {lang === 'uz' ? "Jinoyatchilik dinamikasi" : "Динамика преступности"}
            </h2>
            <select 
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-card border border-card-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
            >
              <option value="current">{lang === 'uz' ? "Joriy yil" : "Текущий год"}</option>
              <option value="past">{lang === 'uz' ? "O'tgan yil" : "Прошлый год"}</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicCrimeData.length > 0 ? dynamicCrimeData : [{ name: 'Jan', value: 0, risk: 0 }]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="value" name={lang === 'uz' ? "Insidentlar" : "Инциденты"} stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="risk" name={lang === 'uz' ? "Xavf darajasi" : "Уровень риска"} stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart / List */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {lang === 'uz' ? "Xavf bo'yicha top tumanlar" : "Топ районов по риску"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {dynamicDistrictData.sort((a, b) => b.crimes - a.crimes).map((district, i) => (
              <div key={district.uz} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-card-border/50 hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${district.severity === 'high' ? 'bg-danger/20 text-danger border border-danger/30' :
                      district.severity === 'medium' ? 'bg-warning/20 text-warning border border-warning/30' :
                        'bg-safe/20 text-safe border border-safe/30'}`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lang === 'uz' ? district.uz : district.ru}</p>
                    <p className="text-xs text-foreground/50">{district.crimes} {lang === 'uz' ? 'insidentlar' : 'инцидентов'}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium
                  ${district.severity === 'high' ? 'text-danger bg-danger/10' :
                    district.severity === 'medium' ? 'text-warning bg-warning/10' :
                      'text-safe bg-safe/10'}`}
                >
                  {district.severity === 'high' ? (lang === 'uz' ? 'Kritik' : 'Критично') : district.severity === 'medium' ? (lang === 'uz' ? 'Diqqat' : 'Внимание') : (lang === 'uz' ? "Me'yor" : 'Норма')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 24/7 AI Predictive Monitoring Console */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl border border-primary/20 animate-pulse">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-0.5">Real-Time AI Core</h3>
              <h2 className="text-lg font-bold text-foreground">{lang === 'uz' ? "Bashoratli AI va 24/7 Monitoring Konsoli" : "Предиктивный ИИ и консоль мониторинга 24/7"}</h2>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-safe/10 text-safe text-[10px] font-mono font-bold uppercase rounded-lg border border-safe/20 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-safe animate-ping" />
            Live Sync
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs max-h-[300px] overflow-y-auto pr-1">
          {liveLogs.map((log) => (
            <div 
              key={log.id} 
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                log.type === 'warn' ? 'bg-danger/5 border-danger/20 text-danger' : 
                log.type === 'ok' ? 'bg-safe/5 border-safe/20 text-safe' : 
                'bg-primary/5 border-primary/20 text-primary'
              }`}
            >
              <span className="text-foreground/45 font-bold shrink-0">[{log.time}]</span>
              <span className={`font-black uppercase shrink-0 ${
                log.type === 'warn' ? 'text-danger' : 
                log.type === 'ok' ? 'text-safe' : 
                'text-primary'
              }`}>
                {log.type === 'warn' ? 'WARN' : log.type === 'ok' ? 'OK' : 'INFO'}
              </span>
              <p className="text-foreground/80 leading-relaxed">
                {lang === 'uz' ? log.msgUz : log.msgRu}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
