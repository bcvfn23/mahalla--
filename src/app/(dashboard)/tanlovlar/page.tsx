"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Award, Plus, X, Play, CheckCircle2, Trophy, Sparkles, TrendingUp, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  date: string;
  participants: string;
  status: "kutilmoqda" | "jarayonda" | "yakunlangan";
}

interface MahallaRank {
  name: string;
  points: number;
  completedContests: number;
  activeYouth: number;
}

export default function TanlovlarPage() {
  const { lang } = useI18n();
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", participants: "" });

  const [mahallas, setMahallas] = useState<MahallaRank[]>([
    { name: "Dilbuloq", points: 984, completedContests: 12, activeYouth: 140 },
    { name: "Asalobod", points: 912, completedContests: 9, activeYouth: 115 },
    { name: "Bog'imaydon", points: 875, completedContests: 8, activeYouth: 98 },
    { name: "Huvaydo", points: 798, completedContests: 7, activeYouth: 85 },
    { name: "Do'stlik", points: 642, completedContests: 5, activeYouth: 72 }
  ]);

  useEffect(() => {
    const data = localStorage.getItem("eventsList");
    if (data) {
      setEvents(JSON.parse(data));
    } else {
      const initial: Event[] = [
        { id: 1, title: "Zakovat intellektual o'yini (Sirdaryo bosqichi)", date: "2026-05-25", participants: "50", status: "kutilmoqda" },
        { id: 2, title: "IT-Park Mini-Hackathon 'Cyber Shield'", date: "2026-05-28", participants: "24", status: "kutilmoqda" },
        { id: 3, title: "Sport musobaqasi (Stol tennisi turniri)", date: "2026-05-18", participants: "32", status: "yakunlangan" },
      ];
      setEvents(initial);
      localStorage.setItem("eventsList", JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    const ev: Event = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      participants: newEvent.participants || "0",
      status: "kutilmoqda"
    };

    const updated = [ev, ...events];
    setEvents(updated);
    localStorage.setItem("eventsList", JSON.stringify(updated));
    setNewEvent({ title: "", date: "", participants: "" });
    setIsAddModalOpen(false);
    toast.success(lang === 'uz' ? "Tadbir muvaffaqiyatli qo'shildi!" : "Мероприятие успешно добавлено!");
  };

  const handleUpdateStatus = (id: number, status: "kutilmoqda" | "jarayonda" | "yakunlangan") => {
    const updated = events.map(e => e.id === id ? { ...e, status } : e);
    setEvents(updated);
    localStorage.setItem("eventsList", JSON.stringify(updated));
    
    if (status === 'yakunlangan') {
      // Reward points to a random mahalla in the leaderboard
      const randomIdx = Math.floor(Math.random() * mahallas.length);
      const pointsToReward = 50;
      setMahallas(prev => {
        const next = prev.map((m, idx) => {
          if (idx === randomIdx) {
            return {
              ...m,
              points: m.points + pointsToReward,
              completedContests: m.completedContests + 1
            };
          }
          return m;
        });
        // Sort descending
        return next.sort((a, b) => b.points - a.points);
      });
      toast.success(
        lang === 'uz' 
          ? `Tadbir yakunlandi! ${mahallas[randomIdx].name} mahallasiga +${pointsToReward} ball berildi!` 
          : `Мероприятие завершено! Махалле ${mahallas[randomIdx].name} начислено +${pointsToReward} баллов!`
      );
    } else {
      toast.info(lang === 'uz' ? "Tadbir holati yangilandi" : "Статус мероприятия обновлен");
    }
  };

  const activeCount = events.filter(e => e.status !== 'yakunlangan').length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            YOSHLAR IJTIMOIY TADBIRLARI VA KREATIVLIK
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Tadbirlar va Faollik Reytingi" : "Мероприятия и Рейтинг Активности"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === 'uz' ? "Sport chempionatlari, intellektual va IT-tanlovlar tashkil etish hamda mahalla yetakchilari o'rtasidagi raqobat paneli." : "Организация спортивных чемпионатов, интеллектуальных и IT-конкурсов, а также панель соперничества махаллей."}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-black rounded-xl transition-all text-xs shadow-[0_0_15px_rgba(245,158,11,0.3)]"
        >
          <Plus className="w-4 h-4 text-black font-black" />
          {lang === 'uz' ? "Yangi Tadbir Qo'shish" : "Добавить мероприятие"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Contests Dashboard (Cards instead of simple table) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-card-border border-l-4 border-l-warning flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold text-foreground/40 uppercase">{lang === 'uz' ? "Kutilayotgan tadbirlar" : "Предстоящие"}</div>
                <div className="text-2xl font-black text-foreground mt-1">{activeCount}</div>
              </div>
              <Calendar className="w-8 h-8 text-warning/20" />
            </div>
            <div className="glass-panel p-4 rounded-xl border border-card-border border-l-4 border-l-primary flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold text-foreground/40 uppercase">{lang === 'uz' ? "Jami o'tkazilgan" : "Всего проведено"}</div>
                <div className="text-2xl font-black text-foreground mt-1">{events.length}</div>
              </div>
              <Trophy className="w-8 h-8 text-primary/20" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-foreground/50 tracking-wider">
              {lang === 'uz' ? "Joriy tadbirlar ro'yxati" : "Список текущих мероприятий"}
            </h2>

            {events.length === 0 ? (
              <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center border border-card-border">
                <Award className="w-10 h-10 text-warning/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground">{lang === 'uz' ? "Hozircha tadbirlar rejalashtirilmagan" : "Пока нет запланированных мероприятий"}</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((item) => (
                  <div key={item.id} className="glass-panel p-5 rounded-2xl border border-card-border hover:border-warning/30 transition-all flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#f59e0b]/5 rounded-full filter blur-xl -z-10 group-hover:bg-[#f59e0b]/10 transition-colors"></div>
                    
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border
                          ${item.status === 'kutilmoqda' ? 'bg-card border-card-border text-foreground/55' : 
                            item.status === 'jarayonda' ? 'bg-primary/10 text-primary border-primary/20' : 
                            'bg-safe/10 text-safe border-safe/20'}`}
                        >
                          {item.status === 'kutilmoqda' ? (lang === 'uz' ? "Kutilmoqda" : "Ожидается") : 
                           item.status === 'jarayonda' ? (lang === 'uz' ? "Jarayonda" : "В процессе") : 
                           (lang === 'uz' ? "Yakunlangan" : "Завершено")}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[10px] text-foreground/45 font-mono">
                          <Users className="w-3.5 h-3.5 text-foreground/30" />
                          <span>{item.participants} {lang === 'uz' ? "ta yosh" : "участ."}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-foreground text-sm tracking-tight leading-relaxed mb-4">{item.title}</h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-card-border/50">
                      <span className="text-[10px] text-foreground/50 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-foreground/30" />
                        {item.date}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.status === 'kutilmoqda' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'jarayonda')}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-[10px] font-bold border border-primary/20 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 text-primary fill-current" />
                            <span>{lang === 'uz' ? "Boshlash" : "Начать"}</span>
                          </button>
                        )}
                        {item.status === 'jarayonda' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'yakunlangan')}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-safe/10 hover:bg-safe/20 text-safe rounded-lg text-[10px] font-bold border border-safe/20 transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-safe" />
                            <span>{lang === 'uz' ? "Yakunlash" : "Завершить"}</span>
                          </button>
                        )}
                        {item.status !== 'kutilmoqda' && (
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'kutilmoqda')}
                            className="px-2 py-1.5 bg-card hover:bg-danger/10 text-foreground/40 hover:text-danger rounded-lg text-[10px] border border-card-border transition-all"
                          >
                            {lang === 'uz' ? "Qaytarish" : "Сбросить"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Youth Scoreboard (Trophy rank board) */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
          
          <div>
            <div className="mb-6 pb-4 border-b border-card-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">REYTING</h3>
                <h2 className="text-lg font-bold text-foreground">{lang === 'uz' ? "Mahallalar Scoreboard" : "Рейтинг Махаллей"}</h2>
              </div>
              <Sparkles className="w-5 h-5 text-warning animate-pulse" />
            </div>

            <div className="space-y-4">
              {mahallas.map((m, idx) => {
                let badge = null;
                let bgBorder = "border-card-border bg-background/50 dark:bg-[#050b18]/40";
                
                if (idx === 0) {
                  badge = <Trophy className="w-4 h-4 text-warning" />;
                  bgBorder = "border-warning/30 bg-warning/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]";
                } else if (idx === 1) {
                  badge = <Award className="w-4 h-4 text-foreground/60" />;
                } else if (idx === 2) {
                  badge = <Award className="w-4 h-4 text-orange-400" />;
                }

                return (
                  <div 
                    key={m.name} 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${bgBorder}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Index */}
                      <span className="text-xs font-black text-foreground/35 font-mono w-4 text-center">
                        {idx + 1}
                      </span>
                      
                      <div>
                        <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          {badge}
                          {m.name}
                        </div>
                        <div className="text-[9px] text-foreground/50 mt-0.5 flex items-center gap-2">
                          <span>{m.completedContests} {lang === 'uz' ? "tadbirlar" : "конкурсов"}</span>
                          <span className="w-1 h-1 rounded-full bg-card-border"></span>
                          <span>{m.activeYouth} {lang === 'uz' ? "ta faol yosh" : "актив. мол."}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-primary font-mono">{m.points}</div>
                      <div className="text-[8px] font-bold text-foreground/40 uppercase">{lang === 'uz' ? "BALL" : "БАЛЛОВ"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-card-border/50 text-center">
            <div className="text-[10px] text-foreground/45 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-safe" />
              <span>{lang === 'uz' ? "Faoliyat ballari tadbirlar yakunlanganda beriladi" : "Баллы начисляются за проведение турниров"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
