"use client";

import { useI18n } from "@/lib/i18n";
import { Activity, AlertTriangle, RefreshCw, FilePlus, Trash2, CheckCircle2, Circle, Plus, ShieldAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export default function FaollikPage() {
  const { lang } = useI18n();

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "danger",
      icon: AlertTriangle,
      title: lang === 'uz' ? "Xavf darajasi o'zgardi" : "Уровень риска изменен",
      desc: lang === 'uz' ? "Dilbuloq mahallasi - 1 ta yuqori xavf guruhi aniqlandi" : "Махалля Дилбулок - обнаружена 1 группа высокого риска",
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-danger",
      bg: "bg-danger/20 animate-pulse"
    },
    {
      id: 2,
      type: "sync",
      icon: RefreshCw,
      title: lang === 'uz' ? "Integratsiya sinxronlashdi" : "Интеграция синхронизирована",
      desc: lang === 'uz' ? "mehnat.uz orqali Asalobod mahallasida 12 ta yangi vakansiya yuklandi" : "Через mehnat.uz загружено 12 новых вакансий в махалле Асалобод",
      time: lang === 'uz' ? "3 daqiqa oldin" : "3 минуты назад",
      color: "text-safe",
      bg: "bg-safe/20"
    },
    {
      id: 3,
      type: "sync",
      icon: RefreshCw,
      title: lang === 'uz' ? "Kundalik.com tizimli yangilanish" : "Системное обновление Kundalik.com",
      desc: lang === 'uz' ? "Bog'imaydon maktablarida o'rtacha davomat 94.2% gacha ko'tarildi" : "Средняя посещаемость в школах Богимайдон выросла до 94.2%",
      time: lang === 'uz' ? "15 daqiqa oldin" : "15 минут назад",
      color: "text-primary",
      bg: "bg-primary/20"
    },
    {
      id: 4,
      type: "add",
      icon: FilePlus,
      title: lang === 'uz' ? "Yangi profilaktik yozuv" : "Новая профилактическая запись",
      desc: lang === 'uz' ? "Huvaydo mahallasida yashovchi A. Rustamovga AI yo'llanma berdi" : "ИИ выдал направление А. Рустамову из махалли Хувайдо",
      time: lang === 'uz' ? "1 soat oldin" : "1 час назад",
      color: "text-warning",
      bg: "bg-warning/20"
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");

  // Load and save tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("leaderTasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const defaultTasks: Task[] = [
        { id: 1, text: lang === 'uz' ? "Rustamov Alisher bilan profilaktik suhbat o'tkazish" : "Провести проф. беседу с Рустамовым Алишером", completed: false, priority: "high" },
        { id: 2, text: lang === 'uz' ? "Mehnat.uz orqali yoshlarga bo'sh ish o'rinlarini yuborish" : "Разослать молодежи вакансии через Mehnat.uz", completed: true, priority: "medium" },
        { id: 3, text: lang === 'uz' ? "3-maktab direktoridan haftalik davomat hisobotini olish" : "Получить отчет по посещаемости у директора школы №3", completed: false, priority: "low" }
      ];
      setTasks(defaultTasks);
      localStorage.setItem("leaderTasks", JSON.stringify(defaultTasks));
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("leaderTasks", JSON.stringify(newTasks));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const task: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      priority: taskPriority
    };

    const updated = [task, ...tasks];
    saveTasks(updated);
    setNewTaskText("");
    toast.success(lang === 'uz' ? "Yangi vazifa muvaffaqiyatli qo'shildi!" : "Новая задача успешно добавлена!");
  };

  const handleToggleTask = (id: number) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  const handleDeleteTask = (id: number) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
    toast.info(lang === 'uz' ? "Vazifa o'chirildi" : "Задача удалена");
  };

  const handleSimulateAlert = () => {
    const alertTitlesUz = [
      "Favqulodda AI Signal: Yuqori xavfli zona",
      "MVD Tezkor Signal: Guruh yig'ilishi",
      "Kritik Davomat pasayishi: Maktab №9",
      "Ijtimoiy tarmoq AI skaneri: Depressiv xatti-harakat"
    ];
    const alertTitlesRu = [
      "Экстренный ИИ Сигнал: Зона высокого риска",
      "Оперативный сигнал МВД: Сбор группы",
      "Критическое падение посещаемости: Школа №9",
      "ИИ сканер соцсетей: Депрессивное поведение"
    ];

    const alertDescsUz = [
      "Guliston bog'i yaqinida nazorat ostidagi yoshlar klasteri to'plandi.",
      "Mirzaobod tumanida 4 nafar profilaktik ro'yxatdagi shaxs koordinatasi mos keldi.",
      "9-maktabda davomat darajasi keskin 68% gacha tushib ketdi (Kamida 15 o'quvchi).",
      "Mahalliy yoshlar guruhida xavotirli kontent ulashish holati aniqlandi."
    ];
    const alertDescsRu = [
      "В районе парка Гулистан зафиксировано скопление контролируемой молодежи.",
      "В Мирзаабадском районе совпали координаты 4 лиц, состоящих на учете.",
      "В школе №9 уровень посещаемости резко упал до 68% (Минимум 15 учеников).",
      "Выявлен факт публикации тревожного контента в местной молодежной группе."
    ];

    const randomIndex = Math.floor(Math.random() * alertTitlesUz.length);
    const newAlert = {
      id: Date.now(),
      type: "danger",
      icon: ShieldAlert,
      title: lang === 'uz' ? alertTitlesUz[randomIndex] : alertTitlesRu[randomIndex],
      desc: lang === 'uz' ? alertDescsUz[randomIndex] : alertDescsRu[randomIndex],
      time: lang === 'uz' ? "Hozirgina" : "Только что",
      color: "text-danger",
      bg: "bg-danger/25 border border-danger/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse"
    };

    setActivities(prev => [newAlert, ...prev]);
    toast.error(lang === 'uz' ? "Diqqat: Yangi tezkor xavf signali qabul qilindi!" : "Внимание: Получен новый экстренный сигнал тревоги!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            OPERATIV BOSHQARUV TIZIMI
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Tizim Faolligi va Vazifalar" : "Активность Системы и Задачи"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === 'uz' ? "Sirdaryo viloyati bo'yicha real vaqt rejimidagi ogohlantirishlar va yetakchilar uchun topshiriqlar paneli." : "Панель оповещений в реальном времени по Сырдарьинской области и оперативных задач для лидеров."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateAlert}
            className="flex items-center gap-2 px-4 py-2.5 bg-danger/20 hover:bg-danger/30 text-danger border border-danger/30 rounded-xl font-bold transition-all text-xs shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>{lang === 'uz' ? "Tezkor alert simulyatsiyasi" : "Симулировать Alert"}</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-safe/10 border border-safe/20 rounded-full text-safe text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span>Live Feed Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Activity Feed */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-card-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">SO'NGGI HARAKATLAR</h3>
              <h2 className="text-lg font-bold text-foreground">{lang === 'uz' ? "Tezkor Ogohlantirishlar Lenti" : "Лента оперативных оповещений"}</h2>
            </div>
            {activities.length > 0 && (
              <button
                onClick={() => {
                  setActivities([]);
                  toast.info(lang === 'uz' ? "Lenta tozalandi" : "Лента очищена");
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-card border border-card-border rounded-lg hover:bg-card/80 transition-all text-xs font-bold text-foreground/60"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {lang === 'uz' ? "O'chirish" : "Очистить"}
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-background/50 dark:bg-[#050b18]/40 rounded-xl border border-card-border hover:border-primary/20 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                      <span className="text-[9px] text-foreground/40 font-mono whitespace-nowrap shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-foreground/60 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                <Activity className="w-12 h-12 text-foreground/20 mb-4" />
                <p className="text-sm text-foreground/60">{lang === 'uz' ? "Faollik lenti bo'sh. Alert simulyatsiya qilib ko'ring." : "Лента активности пуста. Попробуйте симулировать оповещение."}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Task Board */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full filter blur-3xl -z-10"></div>
          
          <div>
            <div className="mb-6 pb-4 border-b border-card-border/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">KEYINGI QADAMLAR</h3>
              <h2 className="text-lg font-bold text-foreground">{lang === 'uz' ? "Mahalla yetakchisi vazifalari" : "Задачи лидера махалли"}</h2>
            </div>

            {/* Task Add Form */}
            <form onSubmit={handleAddTask} className="mb-6 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder={lang === 'uz' ? "Yangi vazifa matni..." : "Текст новой задачи..."}
                  className="flex-1 bg-background border border-card-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-foreground/40 uppercase">{lang === 'uz' ? "Ustuvorlik:" : "Приоритет:"}</span>
                <div className="flex gap-1.5">
                  {(["high", "medium", "low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase border transition-all ${
                        taskPriority === p 
                          ? (p === 'high' ? 'bg-danger/20 border-danger text-danger' : p === 'medium' ? 'bg-warning/20 border-warning text-warning' : 'bg-safe/20 border-safe text-safe') 
                          : 'bg-card border-card-border text-foreground/40'
                      }`}
                    >
                      {p === 'high' ? (lang === 'uz' ? "Katta" : "Высокий") : p === 'medium' ? (lang === 'uz' ? "O'rta" : "Средний") : (lang === 'uz' ? "Kichik" : "Низкий")}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Task List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      task.completed 
                        ? 'bg-card/30 border-card-border/40 opacity-60' 
                        : 'bg-background/50 dark:bg-[#050b18]/40 border-card-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button 
                        onClick={() => handleToggleTask(task.id)}
                        className={`text-foreground/40 hover:text-primary transition-colors shrink-0`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-safe" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      
                      <span className={`text-xs text-foreground truncate ${task.completed ? 'line-through text-foreground/50' : 'font-medium'}`}>
                        {task.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[8px] font-black uppercase px-1 rounded-sm border ${
                        task.priority === 'high' ? 'bg-danger/10 border-danger/20 text-danger' :
                        task.priority === 'medium' ? 'bg-warning/10 border-warning/20 text-warning' :
                        'bg-safe/10 border-safe/20 text-safe'
                      }`}>
                        {task.priority === 'high' ? 'H' : task.priority === 'medium' ? 'M' : 'L'}
                      </span>
                      
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-foreground/30 hover:text-danger p-1 rounded hover:bg-card-border/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                  <CheckCircle2 className="w-8 h-8 text-foreground/20 mb-3" />
                  <p className="text-xs">{lang === 'uz' ? "Hozircha vazifalar yo'q" : "Пока нет задач"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
