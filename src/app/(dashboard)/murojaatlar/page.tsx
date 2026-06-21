"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Inbox, Plus, AlertCircle, X, Clock, User, Tag, CheckCircle2, Sparkles, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Appeal {
  id: string | number;
  fullName: string;
  type: string;
  text: string;
  date: string;
  status: "yangi" | "jarayonda" | "hal etilgan";
  predictedCategory?: string;
}


const initialAppeals: Appeal[] = [
  { 
    id: 1, 
    fullName: "Rustamov Alisher", 
    type: "Moddiy yordam so'rovi", 
    text: "Mening oilaviy sharoitim og'ir, vaqtincha ishsizman. Kompyuter kurslarida o'qish uchun subsidiya ajratishda yordam so'rayman.", 
    date: "2026-05-19 10:00", 
    status: "yangi",
    predictedCategory: "Moddiy Yordam"
  },
  { 
    id: 2, 
    fullName: "Karimova Ziyoda", 
    type: "IT-Park inkubatsiya loyihasi", 
    text: "Sirdaryoda yosh xotin-qizlar uchun IT startap loyihamiz bor. Server infratuzilmasi uchun grant olish masalasida yordam zarur.", 
    date: "2026-05-18 14:30", 
    status: "jarayonda",
    predictedCategory: "Startap va Tadbirkorlik"
  },
];

export default function MurojaatlarPage() {
  const { lang } = useI18n();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewAppeal, setViewAppeal] = useState<Appeal | null>(null);
  
  const [newAppeal, setNewAppeal] = useState({ fullName: "", type: "", text: "" });
  const [predictedCat, setPredictedCat] = useState("");

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const res = await fetch("/api/appeals");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            setAppeals(data.items);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch appeals, falling back to localStorage", err);
      }
      
      const localData = localStorage.getItem("appealsList");
      if (localData) {
        setAppeals(JSON.parse(localData));
      } else {
        setAppeals(initialAppeals);
        localStorage.setItem("appealsList", JSON.stringify(initialAppeals));
      }
    };
    fetchAppeals();
  }, []);


  // Simple heuristic Client-side AI Category Predictor
  const predictCategory = (subject: string, body: string) => {
    const text = (subject + " " + body).toLowerCase();
    if (text.includes("pul") || text.includes("yordam") || text.includes("moddiy") || text.includes("subsidiya") || text.includes("moliya")) {
      return lang === 'uz' ? "Moddiy Ko'mak (AI)" : "Материальная Помощь (AI)";
    }
    if (text.includes("ish") || text.includes("ishlash") || text.includes("bandlik") || text.includes("vakansiya") || text.includes("mehnat")) {
      return lang === 'uz' ? "Bandlik va Ish (AI)" : "Занятость и Работа (AI)";
    }
    if (text.includes("ta'lim") || text.includes("maktab") || text.includes("universitet") || text.includes("kurs") || text.includes("o'qish") || text.includes("kontrakt")) {
      return lang === 'uz' ? "Ta'lim va IT-Kurslar (AI)" : "Образование и IT (AI)";
    }
    if (text.includes("nizo") || text.includes("oilaviy") || text.includes("janjal") || text.includes("huquq") || text.includes("sud")) {
      return lang === 'uz' ? "Huquqiy va Oilaviy (AI)" : "Юридическая помощь (AI)";
    }
    if (text.includes("loyiha") || text.includes("startap") || text.includes("biznes") || text.includes("grant")) {
      return lang === 'uz' ? "Biznes va Startap (AI)" : "Бизнес и Стартапы (AI)";
    }
    return lang === 'uz' ? "Konsultatsiya (AI)" : "Консультация (AI)";
  };

  useEffect(() => {
    if (newAppeal.type || newAppeal.text) {
      setPredictedCat(predictCategory(newAppeal.type, newAppeal.text));
    } else {
      setPredictedCat("");
    }
  }, [newAppeal.type, newAppeal.text]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppeal.fullName || !newAppeal.type) return;

    const bodyPayload = {
      fullName: newAppeal.fullName,
      type: newAppeal.type,
      text: newAppeal.text,
      status: "yangi",
      predictedCategory: predictedCat.replace(" (AI)", "")
    };

    try {
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          const updated = [data.item, ...appeals];
          setAppeals(updated);
          localStorage.setItem("appealsList", JSON.stringify(updated));
          window.dispatchEvent(new Event("youthAdded")); // update counter badge
          setNewAppeal({ fullName: "", type: "", text: "" });
          setIsAddModalOpen(false);
          toast.success(lang === 'uz' ? "Murojaat muvaffaqiyatli ro'yxatga olindi!" : "Обращение успешно зарегистрировано!");
          return;
        }
      }
    } catch (err) {
      console.error("Failed to save appeal to server", err);
    }

    // Local-only fallback
    const fallbackAppeal: Appeal = {
      id: Date.now().toString(),
      fullName: newAppeal.fullName,
      type: newAppeal.type,
      text: newAppeal.text,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: "yangi",
      predictedCategory: predictedCat.replace(" (AI)", "")
    };

    const updated = [fallbackAppeal, ...appeals];
    setAppeals(updated);
    localStorage.setItem("appealsList", JSON.stringify(updated));
    window.dispatchEvent(new Event("youthAdded")); // update counter badge
    setNewAppeal({ fullName: "", type: "", text: "" });
    setIsAddModalOpen(false);
    toast.success(lang === 'uz' ? "Murojaat saqlandi (Faqat lokal)!" : "Обращение сохранено (Локально)!");
  };


  const handleUpdateStatus = async (id: string | number, status: "yangi" | "jarayonda" | "hal etilgan") => {
    try {
      const res = await fetch(`/api/appeals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Status updated on server successfully
        }
      }
    } catch (err) {
      console.error("Failed to update status on server", err);
    }

    const updated = appeals.map(a => a.id === id ? { ...a, status } : a);
    setAppeals(updated);
    localStorage.setItem("appealsList", JSON.stringify(updated));
    window.dispatchEvent(new Event("youthAdded")); // update counter badge
    
    // Update active viewed appeal details
    const active = updated.find(a => a.id === id) || null;
    setViewAppeal(active);
    toast.success(lang === 'uz' ? "Murojaat holati yangilandi!" : "Статус обращения обновлен!");
  };


  const yangiCount = appeals.filter(a => a.status === 'yangi').length;
  const jarayondaCount = appeals.filter(a => a.status === 'jarayonda').length;
  const halCount = appeals.filter(a => a.status === 'hal etilgan').length;

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            Yoshlar Yetakchisi & Rais Paneli
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Fuqarolar Murojaatlari" : "Обращения Граждан"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === 'uz' ? "Yoshlarning arizalari, takliflari va yordam so'rovlarini tahlil qilish hamda monitoring etish markazi." : "Центр анализа и мониторинга заявлений, предложений и запросов о помощи от молодежи."}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl hover:opacity-95 transition-all text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-4 h-4 text-white" />
          {lang === 'uz' ? "Murojaat Qo'shish" : "Добавить обращение"}
        </button>
      </div>

      {/* Numerical Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-card-border border-l-4 border-l-primary relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Yangi Murojaatlar" : "Новые Обращения"}</div>
          <div className="text-3xl font-black text-foreground flex items-baseline gap-2">
            {yangiCount}
            {yangiCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-card-border border-l-4 border-l-warning relative overflow-hidden group hover:border-warning/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full filter blur-xl -z-10 group-hover:bg-warning/10 transition-colors"></div>
          <div className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Jarayonda" : "В процессе"}</div>
          <div className="text-3xl font-black text-foreground">{jarayondaCount}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-card-border border-l-4 border-l-safe relative overflow-hidden group hover:border-safe/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-safe/5 rounded-full filter blur-xl -z-10 group-hover:bg-safe/10 transition-colors"></div>
          <div className="text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Hal etilgan" : "Решенные"}</div>
          <div className="text-3xl font-black text-foreground">{halCount}</div>
        </div>
      </div>

      {appeals.length === 0 ? (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center py-20 text-center border border-card-border">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 border border-card-border shadow-lg">
            <Inbox className="w-8 h-8 text-foreground/30" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {lang === 'uz' ? "Murojaatlar ro'yxati bo'sh" : "Список обращений пуст"}
          </h3>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-card-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/60 dark:bg-[#050b18]/60 text-[10px] uppercase tracking-wider text-foreground/50 border-b border-card-border">
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "F.I.O" : "Ф.И.О"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Murojaat mavzusi" : "Тема обращения"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Soha/Kategoriya" : "Сфера/Категория"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Kelgan sana" : "Дата подачи"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Status" : "Статус"}</th>
                  <th className="p-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-card-border/50">
                {appeals.map((item, index) => (
                  <tr key={item.id} className="hover:bg-card/20 transition-colors">
                    <td className="p-4 text-foreground/50 font-mono">{index + 1}</td>
                    <td className="p-4 font-bold text-foreground">{item.fullName}</td>
                    <td className="p-4 text-foreground/80 max-w-xs truncate">{item.type}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-card border border-card-border text-[10px] text-primary font-bold">
                        {item.predictedCategory || (lang === 'uz' ? "Umumiy" : "Общее")}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/50 font-mono">{item.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border
                        ${item.status === 'yangi' ? 'bg-primary/10 text-primary border-primary/20' : 
                          item.status === 'jarayonda' ? 'bg-warning/10 text-warning border-warning/20' : 
                          'bg-safe/10 text-safe border-safe/20'}`}
                      >
                        {item.status === 'yangi' ? (lang === 'uz' ? "Yangi" : "Новое") : 
                         item.status === 'jarayonda' ? (lang === 'uz' ? "Jarayonda" : "В процессе") : 
                         (lang === 'uz' ? "Hal etilgan" : "Решено")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setViewAppeal(item)} 
                        className="px-3 py-1 text-[10px] font-bold bg-card border border-card-border hover:border-primary/50 rounded-lg transition-colors text-foreground"
                      >
                        {lang === 'uz' ? "Ko'rish" : "Смотреть"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Detail Modal with Interactive Workflow Progress Timeline */}
      {viewAppeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-card/30 border-b border-card-border/50 flex justify-between items-center">
              <h3 className="text-md font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                {lang === 'uz' ? "Murojaat Ishchi Varaqasi" : "Рабочий лист обращения"}
              </h3>
              <button 
                onClick={() => setViewAppeal(null)} 
                className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Detail fields */}
              <div className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-wider">{lang === 'uz' ? "Murojaatchi" : "Заявитель"}</label>
                    <div className="text-xs font-bold text-foreground mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {viewAppeal.fullName}
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-foreground/40 uppercase tracking-wider">{lang === 'uz' ? "Sana va Vaqt" : "Дата и время"}</label>
                    <div className="text-xs text-foreground/80 mt-1 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-foreground/40" />
                      {viewAppeal.date}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-wider">{lang === 'uz' ? "Mavzu toifasi" : "Тема обращения"}</label>
                  <div className="text-xs font-bold text-foreground mt-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    {viewAppeal.type}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-foreground/40 uppercase tracking-wider">{lang === 'uz' ? "Batafsil matni" : "Текст обращения"}</label>
                  <div className="text-xs text-foreground/80 mt-1 p-3.5 bg-background dark:bg-[#050b18] border border-card-border rounded-xl leading-relaxed">
                    {viewAppeal.text || (lang === 'uz' ? "Kiritilmagan" : "Не указан")}
                  </div>
                </div>
              </div>

              {/* Progress Flow timeline (futuristic node graphics) */}
              <div className="md:col-span-2 bg-background/60 dark:bg-[#050b18]/60 p-4 rounded-xl border border-card-border flex flex-col">
                <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? "Xronologik Ijro Oqimi" : "Ход выполнения"}</span>
                </div>

                {/* Vertical node list */}
                <div className="flex-1 space-y-6 relative pl-4 border-l border-card-border/80 ml-2">
                  {/* Step 1: Submitted */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-safe border-4 border-card"></div>
                    <div className="text-[10px] font-bold text-safe uppercase">{lang === 'uz' ? "1. Ariza yuborildi" : "1. Подано"}</div>
                    <div className="text-[9px] text-foreground/50 mt-0.5">{viewAppeal.date}</div>
                  </div>

                  {/* Step 2: System ingestion */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-safe border-4 border-card"></div>
                    <div className="text-[10px] font-bold text-safe uppercase flex items-center gap-1">
                      <span>2. AI Core Ingest</span>
                    </div>
                    <div className="text-[9px] text-foreground/50 mt-0.5">{lang === 'uz' ? "Tizim avto-tasnifladi" : "Авто-классифицировано ИИ"}</div>
                  </div>

                  {/* Step 3: assigned to Yetakchi / jarayonda */}
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-4 border-card
                      ${viewAppeal.status === 'jarayonda' || viewAppeal.status === 'hal etilgan' ? 'bg-warning' : 'bg-foreground/20'}`}
                    ></div>
                    <div className={`text-[10px] font-bold uppercase
                      ${viewAppeal.status === 'jarayonda' || viewAppeal.status === 'hal etilgan' ? 'text-warning' : 'text-foreground/30'}`}
                    >
                      {lang === 'uz' ? "3. Jarayonga olindi" : "3. В работе"}
                    </div>
                    <div className="text-[9px] text-foreground/45 mt-0.5">
                      {viewAppeal.status === 'jarayonda' || viewAppeal.status === 'hal etilgan' 
                        ? (lang === 'uz' ? "Mas'ul biriktirildi" : "Назначен ответственный") 
                        : (lang === 'uz' ? "Kutilmoqda" : "Ожидает")}
                    </div>
                  </div>

                  {/* Step 4: Solved */}
                  <div className="relative">
                    <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-4 border-card
                      ${viewAppeal.status === 'hal etilgan' ? 'bg-safe' : 'bg-foreground/20'}`}
                    ></div>
                    <div className={`text-[10px] font-bold uppercase
                      ${viewAppeal.status === 'hal etilgan' ? 'text-safe' : 'text-foreground/30'}`}
                    >
                      {lang === 'uz' ? "4. Muvaffaqiyatli hal etildi" : "4. Решено"}
                    </div>
                    <div className="text-[9px] text-foreground/45 mt-0.5">
                      {viewAppeal.status === 'hal etilgan' 
                        ? (lang === 'uz' ? "Muammo yopildi" : "Вопрос закрыт") 
                        : (lang === 'uz' ? "Faol holatda" : "В процессе")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 bg-card/30 border-t border-card-border/50 flex justify-between items-center">
              <div className="flex gap-2">
                {viewAppeal.status === 'yangi' && (
                  <button 
                    onClick={() => handleUpdateStatus(viewAppeal.id, 'jarayonda')} 
                    className="px-4 py-2 bg-warning/20 text-warning hover:bg-warning/30 border border-warning/30 rounded-xl transition-colors text-xs font-bold"
                  >
                    {lang === 'uz' ? "Jarayonga olish" : "Взять в работу"}
                  </button>
                )}
                {viewAppeal.status !== 'hal etilgan' && (
                  <button 
                    onClick={() => handleUpdateStatus(viewAppeal.id, 'hal etilgan')} 
                    className="px-4 py-2 bg-safe/20 text-safe hover:bg-safe/30 border border-safe/30 rounded-xl transition-colors text-xs font-bold"
                  >
                    {lang === 'uz' ? "Hal qilingan deb belgilash" : "Решить обращение"}
                  </button>
                )}
              </div>
              <button 
                onClick={() => setViewAppeal(null)} 
                className="px-5 py-2 bg-primary text-white rounded-xl hover:opacity-95 transition-colors text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                {lang === 'uz' ? "Yopish" : "Закрыть"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal with Predictive AI Category Widget */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-card/30 border-b border-card-border/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {lang === 'uz' ? "Yangi Murojaat Ro'yxatga Olish" : "Регистрация нового обращения"}
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Yoshning F.I.Sh" : "Ф.И.О Молодого человека"}</label>
                <input 
                  required 
                  type="text" 
                  value={newAppeal.fullName} 
                  onChange={(e) => setNewAppeal({...newAppeal, fullName: e.target.value})} 
                  placeholder={lang === 'uz' ? "Masalan: Samandar Rahimov" : "Например: Самандаров Рахим"}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/30" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Mavzu sarlavhasi" : "Краткая тема"}</label>
                <input 
                  required 
                  type="text" 
                  value={newAppeal.type} 
                  onChange={(e) => setNewAppeal({...newAppeal, type: e.target.value})} 
                  placeholder={lang === 'uz' ? "Masalan: Kasb-hunar o'rganish" : "Например: Обучение профессии"}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/30" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Batafsil sharh" : "Подробное описание"}</label>
                <textarea 
                  rows={4} 
                  value={newAppeal.text} 
                  onChange={(e) => setNewAppeal({...newAppeal, text: e.target.value})} 
                  placeholder={lang === 'uz' ? "Murojaat yoki muammoning to'liq bayoni..." : "Полное описание обращения или проблемы..."}
                  className="w-full bg-background border border-card-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-foreground/30 leading-relaxed" 
                />
              </div>

              {/* Dynamic AI Predicted Category Badge */}
              {predictedCat && (
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase">{lang === 'uz' ? "AI Predictor:" : "AI Анализ темы:"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/25 border border-primary/30 text-[9px] font-black text-primary uppercase">
                    {predictedCat}
                  </span>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-5 py-2.5 bg-card border border-card-border text-foreground/60 rounded-xl hover:bg-card-border transition-colors text-xs font-bold"
                >
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl hover:opacity-90 transition-all text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  {lang === 'uz' ? "Tizimga kiritish" : "Зарегистрировать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
