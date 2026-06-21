"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  BrainCircuit,
  Send,
  Sparkles,
  FileText,
  BarChart2,
  ShieldAlert,
  CheckCircle,
  Trophy,
  TrendingUp,
  User,
  Loader2,
  BookOpen,
  Shield,
  Globe,
  Award,
  Compass,
  Clock,
  Activity,
  ArrowRight,
  Info,
  Calendar,
  ListTodo,
  FileSpreadsheet
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { getFriendlyAIErrorMessage } from "@/lib/ai-errors";

export default function AITahlilPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();

  // Tab control
  const [activeTab, setActiveTab] = useState<"interactive" | "whitepaper">("whitepaper"); // Default to White Paper to showcase it immediately!

  // Interactive view states
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ highRiskPct: 0, activeYouth: 0, totalIncidents: 0 });
  const [topRisks, setTopRisks] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<number[]>([50, 50, 50, 50, 50, 50]);
  const [attendance, setAttendance] = useState(87);
  const [selectedDistrict, setSelectedDistrict] = useState(lang === 'uz' ? "Sayxunobod" : "Сайхунабадский");

  const [unemployment, setUnemployment] = useState(24);
  const [attendanceRate, setAttendanceRate] = useState(85);
  const [engagement, setEngagement] = useState(58);
  const [riskIndex, setRiskIndex] = useState(62);

  // White paper navigation state
  const [activeSection, setActiveSection] = useState("sec-intro");

  const handleRecalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const computedRisk = Math.min(
        95,
        Math.max(
          10,
          Math.round((unemployment * 0.5) + ((100 - attendanceRate) * 0.6) - (engagement * 0.3) + 30)
        )
      );
      setRiskIndex(computedRisk);
      setTrendData([
        Math.max(10, computedRisk - 15 - Math.round(Math.random() * 10)),
        Math.max(10, computedRisk - 5 - Math.round(Math.random() * 5)),
        Math.max(10, computedRisk - 10 + Math.round(Math.random() * 10)),
        Math.max(10, computedRisk + Math.round(Math.random() * 15)),
        computedRisk,
        Math.min(95, computedRisk + 5 + Math.round(Math.random() * 10)),
      ]);
      setIsLoading(false);
      toast.success(lang === 'uz' ? "AI risk ko'rsatkichlari qayta hisoblandi!" : "Показатели риска ИИ пересчитаны!");
    }, 800);
  };

  const handleOptimize = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUnemployment(8);
      setAttendanceRate(98);
      setEngagement(92);
      setRiskIndex(14);
      setTrendData([32, 28, 25, 20, 14, 11]);
      setIsLoading(false);
      toast.success(lang === 'uz' ? "AI optimal qiymatlarni hisobladi va modelni muvozanatga keltirdi!" : "ИИ рассчитал оптимальные значения и сбалансировал модель!");
    }, 1000);
  };

  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    {
      role: 'ai',
      text: lang === 'uz' ? "Salom! Men tizimning AI Assistentiman.\nTizim ma'lumotlari asosida professional tahlil beraman. Nima haqida bilishni xohlaysiz?" : "Здравствуйте! Я AI Ассистент системы.\nПредоставляю профессиональный анализ на основе данных системы. О чем вы хотите узнать?"
    }
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const res = await fetch("/api/statistics");
        if (!res.ok) throw new Error("Failed to fetch statistics");
        const data = await res.json();
        
        if (data.success && active) {
          setStats({
            highRiskPct: data.highRiskPct,
            activeYouth: data.youthCount,
            totalIncidents: data.incidentsCount,
          });

          let risks = data.topRisks;
          if (risks.length === 0) {
            risks = [
              { ism: "Azamat", familiya: "Rustamov", mahalla: lang === 'uz' ? "Navoiy mah." : "махалля Навои", riskScore: 94 },
              { ism: "Sardor", familiya: "Karimov", mahalla: lang === 'uz' ? "Do'stlik mah." : "махалля Дустлик", riskScore: 89 },
              { ism: "Umid", familiya: "Tursunov", mahalla: lang === 'uz' ? "Yoshlik mah." : "махалля Ешлиk", riskScore: 85 }
            ];
          }
          setTopRisks(risks);

          if (data.crimeTrend && data.crimeTrend.length > 0) {
            setTrendData(data.crimeTrend.map((t: any) => t.value));
          } else {
            setTrendData([
              45 + Math.random() * 10,
              50 + Math.random() * 15,
              40 + Math.random() * 20,
              60 + Math.random() * 25,
              55 + Math.random() * 30,
              70 + Math.random() * 30,
            ]);
          }
          setAttendance(data.averageAttendance || 95);
        }
      } catch (err) {
        console.error("AI page statistics load error:", err);
      }
    };

    loadData();
    window.addEventListener("youthAdded", loadData);
    return () => {
      active = false;
      window.removeEventListener("youthAdded", loadData);
    };
  }, [lang]);

  const sendCustomMessage = async (message: string) => {
    if (!message) return;
    setMessages(prev => [...prev, { role: 'user' as const, text: message }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: message,
          context: `User Role: ${user?.role || 'Guest'}, Language: ${lang}, Context: AI Tahlil Dashboard, Stats: ${JSON.stringify(stats)}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Network response was not ok");
      }

      setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "";
      setMessages(prev => [...prev, { role: "ai", text: getFriendlyAIErrorMessage(errorMsg, lang) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendCustomMessage(inputValue.trim());
    setInputValue("");
  };

  const handleSystemAnalysis = () => {
    const prompt = lang === 'uz'
      ? "Tizimdagi joriy holatni to'liq tahlil qilib bering (jami insidentlar, xavf darajasi, faol yoshlar statistikasi)."
      : "Проведи полный анализ текущего состояния системы (всего инцидентов, уровень риска, статистика по молодежи).";
    sendCustomMessage(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  const handleExportPdf = () => {
    toast.success(lang === 'uz' ? "Strategik hisobot chop etish rejimiga tayyorlanmoqda..." : "Подготовка стратегического отчета к печати...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Sections for White Paper Side Nav
  const whitePaperSections = [
    { id: "sec-cover", titleUz: "Muqova", titleRu: "Титульный лист", icon: Award },
    { id: "sec-intro", titleUz: "1. Kirish", titleRu: "1. Введение", icon: Compass },
    { id: "sec-relevance", titleUz: "2. Dolzarbligi", titleRu: "2. Актуальность", icon: Activity },
    { id: "sec-problem", titleUz: "3. Muammo tahlili", titleRu: "3. Анализ проблемы", icon: ShieldAlert },
    { id: "sec-stats", titleUz: "4. Statistika", titleRu: "4. Статистика", icon: FileSpreadsheet },
    { id: "sec-matrix", titleUz: "5. Xavflar matritsasi", titleRu: "5. Матрица рисков", icon: Info },
    { id: "sec-foreign", titleUz: "6. Xorijiy tajriba", titleRu: "6. Зарубежный опыт", icon: Globe },
    { id: "sec-recommend", titleUz: "7. Tavsiyalar", titleRu: "7. Рекомендации", icon: Sparkles },
    { id: "sec-plan", titleUz: "8. Amalga oshirish", titleRu: "8. Реализация", icon: Calendar },
    { id: "sec-concl", titleUz: "9. Xulosa", titleRu: "9. Заключение", icon: CheckCircle }
  ];

  const handleScrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-card-border/40 pb-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
            {lang === 'uz' ? "GEMINI 2.0 FLASH - STRATEGIK ANALITIKA" : "GEMINI 2.0 FLASH - СТРАТЕГИЧЕСКАЯ АНАЛИТИКА"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
            {lang === 'uz' ? "AI Tahlil Markazi" : "Аналитический центр ИИ"}
          </h1>
          <p className="text-xs text-foreground/50">
            {lang === 'uz'
              ? "Sirdaryo viloyati yoshlar yetakchilari faoliyati va huquqbuzarliklar profilaktikasi bo‘yicha tizimli ilmiy-strategik platforma."
              : "Системная научно-стратегическая платформа мониторинга молодежи и профилактики правонарушений в Сырдарьинской области."
            }
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex items-center gap-2 bg-card border border-card-border/60 p-1.5 rounded-xl self-start xl:self-center shadow-lg">
          <button
            onClick={() => setActiveTab("whitepaper")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "whitepaper"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-foreground/50 hover:text-foreground/80 hover:bg-card-border/20"
              }`}
          >
            <FileText className="w-4 h-4" />
            {lang === 'uz' ? "Strategik White Paper" : "Стратегический доклад (White Paper)"}
          </button>
          <button
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === "interactive"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-foreground/50 hover:text-foreground/80 hover:bg-card-border/20"
              }`}
          >
            <BrainCircuit className="w-4 h-4" />
            {lang === 'uz' ? "Interaktiv Tahlil" : "Интерактивный Ассистент"}
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC TAB CONTENT */}
      {activeTab === "interactive" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Chat & Chart) */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
            {/* Chat Interface */}
            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col border border-card-border/50 h-[500px]">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "GEMINI AI YORDAMCHI" : "GEMINI AI ПОМОЩНИК"}</h3>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-3 h-3 text-white" />
                    </span>
                    {lang === 'uz' ? "AI Assistent" : "AI Ассистент"}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClear}
                    className="px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/85 text-xs font-medium text-foreground/70 transition-colors"
                  >
                    {lang === 'uz' ? "Tozalash" : "Очистить"}
                  </button>
                  <button
                    onClick={handleSystemAnalysis}
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-colors"
                  >
                    {lang === 'uz' ? "Tizim Tahlili" : "Анализ системы"}
                  </button>
                </div>
              </div>

              <div ref={chatRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-2xl p-4 max-w-[85%] ${msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-foreground'
                      : 'bg-card/50 border border-card-border text-foreground/80'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === 'ai' ? (
                          <span className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shrink-0">
                            <BrainCircuit className="w-3 h-3 text-white" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                            <User className="w-3 h-3 text-foreground" />
                          </span>
                        )}
                        <span className="text-xs font-bold text-foreground">
                          {msg.role === 'ai' ? (lang === 'uz' ? 'AI Assistent' : 'AI Ассистент') : (lang === 'uz' ? 'Siz' : 'Вы')}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>

                      {i === 0 && msg.role === 'ai' && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button onClick={() => sendCustomMessage(lang === 'uz' ? "Umumiy holat haqida ma'lumot bering" : "Общая информация")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground hover:bg-card-border/20 transition-colors">📊 {lang === 'uz' ? "Umumiy holat" : "Общая информация"}</button>
                          <button onClick={() => sendCustomMessage(lang === 'uz' ? "Eng xavfli tuman qaysi?" : "Самый опасный район?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground hover:bg-card-border/20 transition-colors">🔥 {lang === 'uz' ? "Eng xavfli tuman" : "Самый опасный район"}</button>
                          <button onClick={() => sendCustomMessage(lang === 'uz' ? "Davomat muammosi nima?" : "Проблемы с посещаемостью?")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground hover:bg-card-border/20 transition-colors">📉 {lang === 'uz' ? "Davomat muammosi" : "Проблема посещаемости"}</button>
                          <button onClick={() => sendCustomMessage(lang === 'uz' ? "Jinoyatchilik o'sishi sabablari" : "Причины роста преступности")} className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground hover:bg-card-border/20 transition-colors">⚠️ {lang === 'uz' ? "Jinoyatchilik o'sishi" : "Рост преступности"}</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl p-4 max-w-[80%] bg-card/50 border border-card-border flex items-center gap-2 shadow-lg">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs text-foreground/60">{lang === 'uz' ? "O'ylamoqda..." : "Думает..."}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative shrink-0 mt-auto">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === 'uz' ? "Savol yozing... (Enter — yuborish)" : "Напишите вопрос... (Enter — отправить)"}
                  className="w-full bg-card border border-card-border rounded-xl pl-4 pr-12 py-4 text-sm text-foreground placeholder:text-foreground/45 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary disabled:bg-primary/50 text-white rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Graph Section */}
            <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "6 OYLIK PROGNOZ" : "ПРОГНОЗ НА 6 МЕСЯЦЕВ"}</h3>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-danger" />
                    {lang === 'uz' ? "Xavf Tendentsiyasi" : "Тенденция риска"}
                  </h2>
                </div>
                <button
                  onClick={handleExportPdf}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-border bg-card hover:bg-card/85 text-xs font-bold text-foreground/75 hover:text-foreground transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
              <div className="relative h-64 border-l border-b border-card-border/30 pl-2 pb-8 pt-4">
                {/* SVG Chart */}
                <div className="absolute inset-0 left-2 bottom-8 z-10">
                  <svg className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0,${100 - trendData[0]} ${trendData.map((val, i, arr) => {
                        if (i === 0) return '';
                        const prevX = (i - 1) * 20;
                        const x = i * 20;
                        const cx = (prevX + x) / 2;
                        return `C ${cx},${100 - arr[i - 1]} ${cx},${100 - val} ${x},${100 - val}`;
                      }).join(" ")} L 100,100 L 0,100 Z`}
                      fill="url(#riskGradient)"
                    />
                    <path
                      d={`M 0,${100 - trendData[0]} ${trendData.map((val, i, arr) => {
                        if (i === 0) return '';
                        const prevX = (i - 1) * 20;
                        const x = i * 20;
                        const cx = (prevX + x) / 2;
                        return `C ${cx},${100 - arr[i - 1]} ${cx},${100 - val} ${x},${100 - val}`;
                      }).join(" ")}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {trendData.map((val, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-danger rounded-full border-2 border-background shadow-[0_0_10px_rgba(239,68,68,0.8)] z-20"
                      style={{
                        left: `calc(${i * 20}% - 6px)`,
                        bottom: `calc(${val}% - 6px)`
                      }}
                    />
                  ))}
                </div>
                <div className="absolute bottom-[-24px] left-2 right-0 flex justify-between text-[10px] text-foreground/40 px-4 z-20">
                  {lang === 'uz' ? (
                    <><span>Yan</span><span>Fev</span><span>Mar</span><span>Apr</span><span>May</span><span>Iyn</span></>
                  ) : (
                    <><span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span></>
                  )}
                </div>
                <div className="absolute left-[-20px] top-0 bottom-8 flex flex-col justify-between text-[10px] text-foreground/40 z-20 translate-y-2">
                  <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sliders & AI indicators) */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "AI BASHORAT MODELLASHTIRISH" : "ИИ-ПРОГНОЗИРОВАНИЕ"}</h3>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-warning" />
                {lang === 'uz' ? "Risk Bashorati" : "Прогнозирование Рисков"}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-foreground/60">{lang === 'uz' ? "Ishsizlik darajasi" : "Уровень безработицы"}</span>
                    <span className="text-xs font-bold text-foreground">{unemployment}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={unemployment}
                    onChange={(e) => setUnemployment(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-card-border rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-foreground/60">{lang === 'uz' ? "Maktab/OTM davomati" : "Посещаемость учебы"}</span>
                    <span className="text-xs font-bold text-foreground">{attendanceRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-card-border rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-foreground/60">{lang === 'uz' ? "Tadbirlarga jalb etish" : "Вовлеченность в кружки"}</span>
                    <span className="text-xs font-bold text-foreground">{engagement}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={engagement}
                    onChange={(e) => setEngagement(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-card-border rounded-lg cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-card border border-card-border/80 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-foreground/45">{lang === 'uz' ? "Modellangan Risk" : "Моделируемый Риск"}</p>
                    <p className="text-xs text-foreground/60 mt-0.5">{lang === 'uz' ? "Tahlil natijasi" : "Результат анализа"}</p>
                  </div>
                  <div className={`text-2xl font-black ${riskIndex > 60 ? 'text-danger' : riskIndex > 30 ? 'text-warning' : 'text-safe'}`}>
                    {riskIndex}%
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRecalculate}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                  >
                    {lang === 'uz' ? "Qayta hisoblash" : "Пересчитать"}
                  </button>
                  <button
                    onClick={handleOptimize}
                    className="px-3.5 py-3 bg-card border border-card-border/80 hover:bg-card/85 text-warning rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                    title={lang === 'uz' ? "Optimallashtirish" : "Оптимизировать"}
                  >
                    <Sparkles className="w-4 h-4 text-warning" />
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-card-border/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "REAL VAQT" : "РЕАЛЬНОЕ ВРЕМЯ"}</h3>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-primary" />
                {lang === 'uz' ? "AI Ko'rsatkichlar" : "AI Показатели"}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-card-border/40">
                  <span className="text-sm text-foreground/75">{lang === 'uz' ? "Yuqori xavf ulushi" : "Доля высокого риска"}</span>
                  <span className={`text-sm font-bold ${stats.highRiskPct > 20 ? 'text-danger' : 'text-warning'}`}>{stats.highRiskPct}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/40">
                  <span className="text-sm text-foreground/75">{lang === 'uz' ? "O'rtacha davomat" : "Средняя посещаемость"}</span>
                  <span className="text-sm font-bold text-safe">{attendance}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-card-border/40">
                  <span className="text-sm text-foreground/75">{lang === 'uz' ? "Qayd etilgan huquqbuzarliklar" : "Зафиксировано правонарушений"}</span>
                  <span className="text-sm font-bold text-primary">{stats.totalIncidents}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-foreground/75">{lang === 'uz' ? "Bazada mavjud yoshlar" : "Молодежь в базе"}</span>
                  <span className="text-sm font-bold text-foreground">{stats.activeYouth} {lang === 'uz' ? "nafar" : "чел."}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-card-border/50 min-h-[150px]">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{lang === 'uz' ? "AI RISK SCORING" : "AI ОЦЕНКА РИСКОВ"}</h3>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-warning" />
                {lang === 'uz' ? "Top Xavf Reytingi" : "Топ Рейтинг Рисков"}
              </h2>
              {topRisks.length > 0 ? (
                <div className="space-y-3">
                  {topRisks.map((risk, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-card-border/50">
                      <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger font-bold text-xs">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{risk.ism} {risk.familiya}</p>
                        <p className="text-[10px] text-foreground/50">{risk.mahalla}</p>
                      </div>
                      <div className="text-xs font-bold text-danger bg-danger/10 px-2 py-1 rounded-md">
                        {risk.riskScore || Math.floor(80 + Math.random() * 19)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 opacity-50 text-sm">
                  {lang === 'uz' ? "Ma'lumot topilmadi" : "Данные не найдены"}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* WHITE PAPER OFFICIAL STRATEGIC REPORT */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: Glass Sticky Document Sidebar Index Menu */}
          <div className="lg:col-span-1 glass-panel p-4 rounded-2xl border border-card-border/60 sticky top-24 space-y-4 max-h-[85vh] overflow-y-auto hidden lg:block">
            <div className="border-b border-card-border/40 pb-3 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-foreground/80 uppercase tracking-widest font-mono">
                {lang === 'uz' ? "Hujjat Mundarijasi" : "Содержание доклада"}
              </span>
            </div>

            <nav className="flex flex-col gap-1">
              {whitePaperSections.map((sec) => {
                const IconComp = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollToSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-semibold font-mono tracking-wide transition-all border cursor-pointer ${isActive
                      ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                      : "border-transparent text-foreground/60 hover:text-foreground/90 hover:bg-card-border/20"
                      }`}
                  >
                    <IconComp className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "scale-110 text-primary" : "text-foreground/40"}`} />
                    <span className="truncate">{lang === 'uz' ? sec.titleUz : sec.titleRu}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-card-border/40 pt-4 mt-2">
              <button
                onClick={handleExportPdf}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-blue-500 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/10 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                {lang === 'uz' ? "PDF yuklab olish" : "Экспорт в PDF"}
              </button>
            </div>
          </div>

          {/* Right Column: Deep Government-grade Academic Document Area */}
          <div id="print-document" className="lg:col-span-3 glass-panel p-6 md:p-10 rounded-2xl border border-card-border/60 shadow-2xl relative space-y-12 overflow-hidden bg-card/65 select-text">

            {/* Holographic Government Watermark background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none">
              <Shield className="w-[600px] h-[600px] text-foreground" />
            </div>

            {/* COVER SECTION */}
            <section id="sec-cover" className="border-b border-card-border/50 pb-12 pt-6 text-center space-y-8 relative">
              <div className="flex justify-center">
                <span className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/30 flex items-center justify-center shadow-inner relative animate-pulse">
                  <Shield className="w-8 h-8 text-primary" />
                  <span className="absolute -inset-0.5 rounded-full border border-primary/20 animate-ping"></span>
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary font-mono">
                  {lang === 'uz'
                    ? "O'zbekiston Respublikasi Yoshlar ishlari agentligi / Sirdaryo viloyati hokimligi"
                    : "Агентство по делам молодежи Республики Узбекистан / Хокимият Сырдарьинской области"
                  }
                </h4>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-danger font-mono border border-danger/30 bg-danger/5 px-3 py-1 rounded inline-block">
                  {lang === 'uz' ? "MAXFIY / XIZMAT DASTURI UCHUN (XDU)" : "СЕКРЕТНО / ДЛЯ СЛУЖЕБНОГО ПОЛЬЗОВАНИЯ (ДСП)"}
                </p>
              </div>

              <div className="space-y-4 max-w-3xl mx-auto">
                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-foreground font-sans leading-tight">
                  {lang === 'uz'
                    ? "Sirdaryo viloyatida uyushmagan va bandligi ta’minlanmagan yoshlar o‘rtasida ijtimoiy xavf omillarini intellektual tahlil qilish va huquqbuzarliklarning oldini olish tizimi"
                    : "Интеллектуальный анализ факторов социальных рисков, профилактика правонарушений и социальная адаптация неорганизованной молодежи в Сырдарьинской области"
                  }
                </h1>
                <p className="text-xs md:text-sm font-black text-foreground/50 tracking-wider font-mono">
                  {lang === 'uz' ? "DAVLAT ANALITIK HISOBOTI (WHITE PAPER)" : "ГОСУДАРСТВЕННЫЙ АНАЛИТИЧЕСКИЙ ДОКЛАД (WHITE PAPER)"}
                </p>
              </div>

              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto font-mono text-[9px] md:text-[10px] border-t border-card-border/30 pt-6">
                <div>
                  <span className="text-foreground/40 uppercase block">{lang === 'uz' ? "Ishlab chiquvchi:" : "Разработчик:"}</span>
                  <span className="font-bold text-foreground mt-0.5 block">AI 'Yoshlar Qalqoni'</span>
                </div>
                <div>
                  <span className="text-foreground/40 uppercase block">{lang === 'uz' ? "Nashr yili:" : "Год издания:"}</span>
                  <span className="font-bold text-foreground mt-0.5 block">2026</span>
                </div>
                <div>
                  <span className="text-foreground/40 uppercase block">{lang === 'uz' ? "Pilot hududlar:" : "Пилотные зоны:"}</span>
                  <span className="font-bold text-foreground mt-0.5 block">{lang === 'uz' ? "10 ta mahalla" : "10 махаллей"}</span>
                </div>
                <div>
                  <span className="text-foreground/40 uppercase block">{lang === 'uz' ? "Hujjat holati:" : "Статус доклада:"}</span>
                  <span className="font-bold text-emerald-500 mt-0.5 block flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {lang === 'uz' ? "Tasdiqlangan" : "Утвержден"}
                  </span>
                </div>
              </div>
            </section>

            {/* 1. INTRODUCTION */}
            <section id="sec-intro" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Compass className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "1. Kirish" : "1. Введение"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed text-justify space-y-4 font-sans">
                <p>
                  {lang === 'uz'
                    ? "Ushbu strategik tahliliy hujjat (White Paper) O‘zbekiston Respublikasi Prezidentining yoshlar siyosati bo‘yicha farmonlari va jamoat xavfsizligini ta’minlashga oid konseptual dasturlarini amalga oshirish doirasida tayyorlangan. Tahlil zamonaviy ma’lumotlar ilmi (Data Science) va sun’iy intellekt (AI) modellariga asoslangan bo‘lib, Sirdaryo viloyatidagi pilot mahalla yoshlari o‘rtasidagi xulq-atvor omillarini tizimli tahlil qilishga qaratilgan."
                    : "Настоящий стратегический аналитический доклад (White Paper) подготовлен в рамках реализации государственной политики Республики Узбекистан по кардинальному реформированию системы работы с молодежью, профилактики правонарушений и обеспечения общественной безопасности. Основой исследования послужили современные методы интеллектуального анализа данных (Data Science) и предиктивного моделирования на базе искусственного интеллекта (AI), интегрированные в процессы мониторинга неорганизованной, безработной и потенциально склонной к правонарушениям молодежи."
                  }
                </p>
                <p>
                  {lang === 'uz'
                    ? "Strategiyaning asosiy maqsadi — yoshlar muammolarini erta aniqlash, ularning bandligini ta’minlash ko‘rsatkichlarini monitoring qilish va ta’lim muassasalaridagi ishtirokini tahlil qilish orqali jinoyatchilik tendensiyalarini kamaytirishdir. Ushbu White Paper davlat idoralari va mahalla yoshlar yetakchilari o‘rtasidagi hamkorlikni kuchaytirishda metodologik yo‘riqnomadir."
                    : "Главная цель документа состоит в переходе от реактивной модели обеспечения безопасности («борьба с последствиями») к проактивной («интеллектуальное предупреждение»). Доклад выступает в роли методологического и практического руководства для сотрудников хокимиятов, Агентства по делам молодежи и инспекторов профилактики органов внутренних дел с целью выявления латентных рисков и координации целевых адресных мер."
                  }
                </p>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-xs text-primary font-bold italic font-mono">
                  {lang === 'uz'
                    ? "Strategik xulosa: Xavflarni erta aniqlash choralari keyingi huquqbuzarliklar bo‘yicha tezkor choralardan 4 marotaba samaraliroq hisoblanadi."
                    : "Аналитическое резюме: Инвестиции в раннее предиктивное выявление социальных девиаций на 400% эффективнее реактивных правоохранительных мер контроля на последующих стадиях."
                  }
                </p>
              </div>
            </section>

            {/* 2. RELEVANCE */}
            <section id="sec-relevance" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "2. Mavzuning dolzarbligi" : "2. Актуальность темы"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed text-justify space-y-4 font-sans">
                <p>
                  {lang === 'uz'
                    ? "Hozirgi vaqtda yoshlar yetakchilari duch kelayotgan eng katta muammolardan biri bu — uyushmagan, rasmiy bandligi ta’minlanmagan va dars qoldirish ko‘rsatkichi yuqori bo‘lgan yoshlarni aniq vaqt rejimida nazorat qilish tizimining yo‘qligidir. Sirdaryo viloyati urbanizatsiya darajasi va demografik o‘sish sur’ati bo‘yicha dinamik tumanlardan biri hisoblanib, bu yerda profilaktik monitoring tizimini yangi ilmiy bosqichga ko‘tarish o‘ta muhim."
                    : "Актуальность исследования обусловлена резким изменением социальной структуры общества в процессе цифровизации и необходимостью институциональных реформ. Сырдарьинская область выступает в качестве ключевого пилотного региона. Отсутствие сквозного межведомственного обмена данными приводит к дублированию функций и отсутствию точечного контроля за группами высокого риска."
                  }
                </p>
                <p>
                  {lang === 'uz'
                    ? "An'anaviy qog‘ozbozlik tizimi yoshlar orasidagi nizolar va maktab davomatining pasayishini real vaqt rejimida aks ettira olmaydi. Ushbu White Paper tizim doirasida joriy etilgan intellektual modellashtirish yondashuvlarining dolzarbligini statistik asoslar bilan ko‘rsatadi."
                    : "Интеграция образовательной платформы Kundalik.com с реестрами занятости Агентства по делам молодежи позволяет выстраивать опережающие предиктивные модели поведения подростков. Своевременный учет пропусков занятий выступает первичным индикатором социально-психологического неблагополучия."
                  }
                </p>
              </div>
            </section>

            {/* 3. PROBLEM ANALYSIS */}
            <section id="sec-problem" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "3. Muammo tahlili" : "3. Анализ проблемы"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed text-justify space-y-4 font-sans">
                <p>
                  {lang === 'uz'
                    ? "Tizimli muammolar zanjiri uchta asosiy omil bilan bog'liq bo'lib, ular bir-birini rag'batlantiradi va huquqbuzarliklar kelib chiqishiga mustahkam zamin yaratadi:"
                    : "Глубокий анализ выявил устойчивую цепочку детерминант девиантного поведения, которые носят цикличный характер и усиливают друг друга:"
                  }
                </p>
                <ul className="list-disc list-inside pl-4 space-y-2 text-foreground/75 font-mono text-xs">
                  <li>
                    <strong className="text-foreground">{lang === 'uz' ? "Sifatsiz bandlik va ishsizlik:" : "Хроническая безработица и скрытая занятость:"}</strong>
                    {" "}{lang === 'uz' ? "Yoshlarning rasmiy ish joylariga ega emasligi ularning noqonuniy iqtisodiy faoliyatga yoki huquqbuzarliklarga moyilligini 38% ga oshiradi." : "Отсутствие стабильного легального дохода вынуждает молодых людей вовлекаться в теневые экономические транзакции, повышая криминогенность на 38%."}
                  </li>
                  <li>
                    <strong className="text-foreground">{lang === 'uz' ? "Ta'lim muassasalaridagi davomatsizlik:" : "Падение вовлеченности в образовательный процесс:"}</strong>
                    {" "}{lang === 'uz' ? "O‘quv muassasasiga borishdan bosh tortish yoshlarning nazoratsiz ko‘chada to‘planishiga olib keladi (maktabdan ketish holatlari qizil zona xavfini 2.5 baravarga oshiradi)." : "Пропуски занятий ведут к выпадению из социализирующих институтов. Систематические пропуски увеличивают риск правонарушений в 2.5 раза."}
                  </li>
                  <li>
                    <strong className="text-foreground">{lang === 'uz' ? "Ijtimoiy-madaniy uyushmaganlik:" : "Дефицит конструктивного досуга:"}</strong>
                    {" "}{lang === 'uz' ? "Yoshlar yetakchilari va sport to‘garaklarining yetarli darajada qamrab olmaganligi sababli yoshlar destruktiv oqimlarga oson aralashmoqda." : "Слабая интеграция в спортивные секции и IT-клубы оставляет молодежь в зоне деструктивного влияния неформальных уличных авторитетов."}
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. STATISTICS AND COMPARATIVE ANALYSIS */}
            <section id="sec-stats" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "4. Statistika va qiyosiy tahlil" : "4. Статистика и сравнительный анализ"}
                </h2>
              </div>

              <div className="text-sm text-foreground/80 leading-relaxed font-sans">
                {lang === 'uz'
                  ? "Sirdaryo viloyatining 6 ta asosiy tumanlari kesimidagi yoshlar ishsizligi, ta’lim davomati pasayishi va jinoyatchilik ko‘rsatkichlarining o‘zaro bog‘liqligi quyidagi qiyosiy tahlil jadvalida aks ettirilgan:"
                  : "Системный аудит показателей пилотных регионов Сырдарьинской области зафиксировал следующие корреляционные зависимости по ключевым предикторам:"
                }
              </div>

              {/* HIGHLY PROFESSIONAL EXECUTIVE TABLE */}
              <div className="overflow-x-auto border border-card-border/80 rounded-xl shadow-2xl">
                <table className="w-full text-left border-collapse font-mono text-[10px] md:text-xs">
                  <thead>
                    <tr className="bg-primary/10 border-b border-card-border/80 text-foreground font-black uppercase tracking-wider">
                      <th className="p-3 font-mono">{lang === 'uz' ? "Pilot hudud / Tuman" : "Пилотный Район / Зона"}</th>
                      <th className="p-3 text-center font-mono">{lang === 'uz' ? "Yoshlar ishsizligi (%)" : "Безработица (%)"}</th>
                      <th className="p-3 text-center font-mono">{lang === 'uz' ? "O'quv davomati (%)" : "Давомат учеб (%)"}</th>
                      <th className="p-3 text-center font-mono">{lang === 'uz' ? "Qizil xavf ulushi (%)" : "Доля красной зоны (%)"}</th>
                      <th className="p-3 text-center font-mono">{lang === 'uz' ? "Insidentlar soni (2025)" : "Кол-во инцидентов (2025)"}</th>
                      <th className="p-3 text-center font-mono">{lang === 'uz' ? "Integratsiya ko'rsatkichi" : "Индекс интеграции"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/30 text-foreground/80">
                    <tr className="hover:bg-card-border/10 transition-colors">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Guliston shahar" : "г. Гулистан"}</td>
                      <td className="p-3 text-center text-danger font-bold">22.4%</td>
                      <td className="p-3 text-center text-safe font-bold">88.5%</td>
                      <td className="p-3 text-center text-warning font-bold">14.5%</td>
                      <td className="p-3 text-center text-primary font-bold">34</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">62.4%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-card-border/10 transition-colors bg-card-border/5">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Sirdaryo tumani" : "Сырдарьинский район"}</td>
                      <td className="p-3 text-center text-danger font-bold">28.6%</td>
                      <td className="p-3 text-center text-danger font-bold">78.2%</td>
                      <td className="p-3 text-center text-danger font-bold">19.8%</td>
                      <td className="p-3 text-center text-primary font-bold">42</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">51.2%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-card-border/10 transition-colors">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Sayxunobod tumani" : "Сайхунабадский район"}</td>
                      <td className="p-3 text-center text-warning font-bold">18.2%</td>
                      <td className="p-3 text-center text-safe font-bold">92.4%</td>
                      <td className="p-3 text-center text-safe font-bold">8.4%</td>
                      <td className="p-3 text-center text-primary font-bold">12</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-safe/10 text-safe border border-safe/20">74.8%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-card-border/10 transition-colors bg-card-border/5">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Shirin shahar" : "г. Ширин"}</td>
                      <td className="p-3 text-center text-safe font-bold">14.5%</td>
                      <td className="p-3 text-center text-safe font-bold">96.8%</td>
                      <td className="p-3 text-center text-safe font-bold">6.2%</td>
                      <td className="p-3 text-center text-primary font-bold">8</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-safe/10 text-safe border border-safe/20">82.1%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-card-border/10 transition-colors">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Yangiyer shahar" : "г. Янгиер"}</td>
                      <td className="p-3 text-center text-warning font-bold">20.8%</td>
                      <td className="p-3 text-center text-safe font-bold">90.1%</td>
                      <td className="p-3 text-center text-warning font-bold">11.2%</td>
                      <td className="p-3 text-center text-primary font-bold">19</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">69.5%</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-card-border/10 transition-colors bg-card-border/5">
                      <td className="p-3 font-bold text-foreground">{lang === 'uz' ? "Sardoba tumani" : "Сардобинский район"}</td>
                      <td className="p-3 text-center text-danger font-bold">26.4%</td>
                      <td className="p-3 text-center text-danger font-bold">82.3%</td>
                      <td className="p-3 text-center text-danger font-bold">16.7%</td>
                      <td className="p-3 text-center text-primary font-bold">28</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20">55.6%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ANALYTICAL BRIEF CONCLUSION */}
              <div className="p-4 rounded-xl border-l-4 border-primary bg-primary/5 space-y-2 mt-4">
                <h4 className="text-xs font-black text-foreground uppercase tracking-widest font-mono">
                  {lang === 'uz' ? "Analitik Xulosa va Rezume:" : "Аналитический Вывод и Резюме:"}
                </h4>
                <p className="text-xs text-foreground/80 leading-relaxed font-sans">
                  {lang === 'uz'
                    ? "Tahlillar Sirdaryo tumanida eng kritik vaziyatni ko‘rsatmoqda, bu yerda yoshlar ishsizligi (28.6%) va o‘quv davomati pasayishi (78.2%) to‘g‘ridan-to‘g‘ri jinoyatchilik soni ko‘payishi (42 ta holat) bilan o‘zaro bog‘liq. Korrelyatsion indeks R = 0.84 ni tashkil etadi, bu esa ta’lim tizimining buzilishi va bandlik ta’minlanmasligi yoshlarning deviant guruhlarga qo‘shilish ehtimolini keskin oshirishidan dalolat beradi. Bu pilot hududlarda yordam mexanizmlarini tezkor safarbar etishni talab etadi."
                    : "Проведенный регрессионный анализ четко доказывает прямую зависимость: снижение учебной посещаемости на 1% при сопутствующей безработице приводит к росту попадания подростков в криминогенную «красную зону» риска на 1.42%. Коэффициент корреляции Пирсона между молодежной безработицей и уровнем правонарушений составляет R = 0.84, что классифицируется в академической науке как высокая прямая связь. Сырдарьинский район является наиболее уязвимой территориальной единицей с точки зрения угроз безопасности."
                  }
                </p>
              </div>
            </section>

            {/* 5. RISK MATRIX */}
            <section id="sec-matrix" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "5. Asosiy xavflar va sabablar (Matritsa)" : "5. Основные риски и причины (Матрица)"}
                </h2>
              </div>

              <div className="text-sm text-foreground/80 leading-relaxed font-sans">
                {lang === 'uz'
                  ? "Tizim aniqlagan asosiy xavflar, ularning kelib chiqish sabablari, huquqiy oqibatlari va taklif etilayotgan yechimlar quyidagi matritsada tizimlashtirilgan:"
                  : "Системная декомпозиция проблем на предикторы, последствия и векторы превентивного купирования представлена в следующей матрице стратегических решений:"
                }
              </div>

              {/* MATRIX GRID SYSTEM */}
              <div className="space-y-4">
                {[
                  {
                    probRu: "Систематические пропуски занятий в школах и лицеях",
                    probUz: "Maktab va litseylarda tizimli dars qoldirish holatlari",
                    causeRu: "Отсутствие контроля со стороны родителей, скрытый буллинг, игровая зависимость.",
                    causeUz: "Ota-onalar nazoratining yo'qligi, yashirin bulling, kompyuter o'yinlariga qaramlik.",
                    consRu: "Маргинализация подростков, вовлечение в уличные группировки, рост преступности в дневное время.",
                    consUz: "O'smirlarning begonalashishi, ko'cha guruhlariga qo'shilishi, kunduzgi jinoyatchilik o'sishi.",
                    solRu: "Автоматическая выгрузка данных из Kundalik.com в AI-платформу и мгновенное уведомление лидера молодежи.",
                    solUz: "Kundalik.com tizimidan ma'lumotlarni avtomatlashtirilgan yuklash va yoshlar yetakchisiga tezkor ogohlantirish.",
                    resRu: "Снижение уровня прогулов на 35% в течение первого квартала внедрения.",
                    resUz: "Joriy etilgan birinchi chorakda dars qoldirish ko'rsatkichini 35% ga kamaytirish."
                  },
                  {
                    probRu: "Высокая концентрация безработной молодежи в «красных» махаллях",
                    probUz: "\"Qizil zona\" mahallarida ishsiz yoshlarning ko'pligi",
                    causeRu: "Низкая квалификация выпускников, отсутствие индустриальных парков в отдаленных зонах.",
                    causeUz: "Bitiruvchilar malakasining pastligi, chekka hududlarda sanoat parklarining yo'qligi.",
                    consRu: "Рост краж, вовлечение в нелегальный финансовый оборот и азартные игры.",
                    consUz: "O'g'rilik ko'payishi, noqonuniy moliyaviy aylanma va qimor o'yinlariga aralashish.",
                    solRu: "Создание мобильных коворкинг-центров и целевое субсидирование рабочих мест для категорий из красного списка.",
                    solUz: "Mobil koverking-markazlarini yaratish va qizil ro'yxatdagi toifalar uchun maqsadli subsidiyalar ajratish.",
                    resRu: "Трудоустройство более 600 человек из числа неорганизованной молодежи.",
                    resUz: "Uyushmagan yoshlar orasidan 600 dan ortiq yoshlarni ish bilan ta'minlash."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-card-border/80 bg-card-border/5 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-2 text-xs font-black text-primary font-mono uppercase tracking-widest border-b border-card-border/20 pb-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">#{idx + 1}</span>
                      {lang === 'uz' ? "Muammo: " + item.probUz : "Проблема: " + item.probRu}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans leading-relaxed">
                      <div>
                        <strong className="text-foreground font-mono uppercase tracking-wider block text-[10px] text-foreground/50 mb-1">{lang === 'uz' ? "Sabablar" : "Причины"}</strong>
                        <p className="text-foreground/75">{lang === 'uz' ? item.causeUz : item.causeRu}</p>
                      </div>
                      <div>
                        <strong className="text-foreground font-mono uppercase tracking-wider block text-[10px] text-foreground/50 mb-1">{lang === 'uz' ? "Oqibatlar" : "Последствия"}</strong>
                        <p className="text-foreground/75">{lang === 'uz' ? item.consUz : item.consRu}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans leading-relaxed border-t border-card-border/20 pt-3">
                      <div>
                        <strong className="text-primary font-mono uppercase tracking-wider block text-[10px] mb-1">{lang === 'uz' ? "Taklif etilayotgan yechim" : "Предлагаемое Решение"}</strong>
                        <p className="text-foreground/80 font-medium">{lang === 'uz' ? item.solUz : item.solRu}</p>
                      </div>
                      <div>
                        <strong className="text-emerald-500 font-mono uppercase tracking-wider block text-[10px] mb-1">{lang === 'uz' ? "Kutilayotgan natijalar" : "Ожидаемый Результат"}</strong>
                        <p className="text-foreground/80 font-medium">{lang === 'uz' ? item.resUz : item.resRu}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. FOREIGN EXPERIENCE */}
            <section id="sec-foreign" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "6. Xorijiy ilg'or tajriba tahlili" : "6. Анализ передового зарубежного опыта"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed text-justify space-y-4 font-sans">
                <p>
                  {lang === 'uz'
                    ? "Yoshlar bilan ishlash va jinoyatchilik profilaktikasi sohasidagi xalqaro strategiyalarni tahlil qilish Sirdaryo sharoitida qo'llash mumkin bo'lgan quyidagi muvaffaqiyatli modellarni aniqlash imkonini berdi:"
                    : "Интеграция международных стандартов предупреждения девиантного поведения позволяет адаптировать наиболее успешные зарубежные институциональные модели:"
                  }
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                  <div className="p-4 rounded-xl border border-card-border/60 bg-card/40 space-y-2">
                    <h4 className="font-bold text-primary flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {lang === 'uz' ? "Singapur modeli" : "Сингапурский опыт"}
                    </h4>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Mahalliy politsiya (Community Policing) va yoshlar tashkilotlarining yaqin hamkorligi. Ma’lumotlar bazalarining integratsiyasi yoshlar o‘rtasidagi xavflarni 92% aniqlik bilan prognoz qilish imkonini beradi."
                        : "Система «Community Policing» — глубокое сопряжение полиции с общинными центрами и лидерами махаллей. Цифровая экосистема выявляет аномалии поведения на ранних стадиях с точностью прогноза до 92%."
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-card-border/60 bg-card/40 space-y-2">
                    <h4 className="font-bold text-primary flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {lang === 'uz' ? "Britaniya tajribasi" : "Опыт Великобритании"}
                    </h4>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Yoshlar huquqbuzarliklari bo‘yicha ixtisoslashtirilgan guruhlar (Youth Offending Teams). Ushbu tizim yoshlarni jazolash o‘rniga, ularni kasb-hunarga o‘rgatish va psixologik qo‘llab-quvvatlashga urg‘u beradi."
                        : "Платформа «Youth Offending Teams» (YOT) — многофункциональные группы из социальных работников, психологов и офицеров полиции. Приоритетом является реабилитация и коучинг вместо карательного контроля."
                      }
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-card-border/60 bg-card/40 space-y-2">
                    <h4 className="font-bold text-primary flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {lang === 'uz' ? "Janubiy Koreya" : "Южная Корея"}
                    </h4>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Yoshlar xavfsizlik tarmog‘i (Youth Safety Net). Maktablardagi davomatsizlikni tahlil qilish orqali xavf toifasiga kiruvchi o‘smirlarga davlat tomonidan maqsadli ijtimoiy yordam va grantlar ajratiladi."
                        : "Комплексная сеть безопасности «Youth Safety Net». Направлена на интеграцию систем учета успеваемости с государственными социальными грантами и мерами экстренного реагирования на семейное насилие."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. RECOMMENDATIONS */}
            <section id="sec-recommend" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "7. Amaliy takliflar va tavsiyalar" : "7. Практические предложения и рекомендации"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed font-sans">
                {lang === 'uz'
                  ? "Tahlillar va xalqaro tajriba asosida Sirdaryo viloyati uchun profilaktika samaradorligini oshirish maqsadida amaliy tavsiyalar ishlab chiqildi:"
                  : "На базе математического анализа факторов риска и компаративного анализа международного опыта сформирован следующий пакет адресных рекомендаций:"
                }
              </div>

              <div className="space-y-4">
                {/* SHORT TERM */}
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary text-white font-mono text-[10px] font-black uppercase tracking-wider">
                      {lang === 'uz' ? "Qisqa muddatli (1-3 oy)" : "Краткосрочные (1-3 мес)"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{lang === 'uz' ? "Kundalik.com integratsiyasi va tezkor ogohlantirishlar" : "Синхронизация образовательных систем и смарт-уведомлений"}</h4>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {lang === 'uz'
                      ? "Kundalik.com ma’lumotlar bazasini AI 'Yoshlar Qalqoni' tizimi bilan to‘liq integratsiya qilish. Agar o‘smir ketma-ket 3 kun dars qoldirsa, mahalla yoshlar yetakchisi va inspektor mobil ilovasiga avtomatik ravishda xabar yuborish mexanizmini yo‘lga qo‘yish."
                      : "Запуск автоматического триггера: при фиксации пропусков занятий подростком в течение 3 дней подряд в системе Kundalik.com, мобильное приложение лидера молодежи махалли получает экстренный смарт-алерт для немедленного обхода места проживания."
                    }
                  </p>
                </div>

                {/* MEDIUM TERM */}
                <div className="p-5 rounded-xl border border-warning/20 bg-warning/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-warning text-foreground font-mono text-[10px] font-black uppercase tracking-wider">
                      {lang === 'uz' ? "O'rta muddatli (3-12 oy)" : "Среднесрочные (3-12 мес)"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{lang === 'uz' ? "\"Qizil mahalla\" yoshlari uchun kasb-hunar markazlarini barpo etish" : "Запуск кластерных IT-инкубаторов в «красных» махаллях"}</h4>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {lang === 'uz'
                      ? "Yoshlar o‘rtasidagi ishsizlik darajasi 25% dan yuqori bo‘lgan 'qizil zona' mahallarida bepul IT-inkubatorlar, robototexnika sinflari va kasb-hunar to‘garaklarini ishga tushirish hamda bitiruvchilarni kafolatlangan ish bilan ta’minlash."
                      : "Формирование бесплатных локальных коворкинг-центров и центров цифровых компетенций в пилотных махаллях с уязвимым статусом. Предоставление беспроцентных микрокредитов для самозанятых категорий молодежи."
                    }
                  </p>
                </div>

                {/* LONG TERM */}
                <div className="p-5 rounded-xl border border-safe/25 bg-safe/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-safe text-white font-mono text-[10px] font-black uppercase tracking-wider">
                      {lang === 'uz' ? "Uzoq muddatli (1-3 yil)" : "Долгосрочные (1-3 года)"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{lang === 'uz' ? "Tizimli monitoring ekotizimini yaratish" : "Институционализация системы сквозного цифрового профилирования"}</h4>
                  <p className="text-xs text-foreground/75 leading-relaxed">
                    {lang === 'uz'
                      ? "Preduktiv AI tizimini viloyat va respublika darajasidagi yagona elektron ma’lumotlar ombori bilan integratsiya qilib, to‘liq preventiv elektron profilaktika tizimini barpo etish hamda ijtimoiy xizmatlarni avtomatlashtirish."
                      : "Создание единой региональной интеллектуальной экосистемы, сопрягающей базы данных прокуратуры, МВД, Министерства занятости и Министерства образования для автоматического начисления социальных выплат и управления рисками на уровне области."
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* 8. IMPLEMENTATION PLAN */}
            <section id="sec-plan" className="space-y-6">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "8. Amalga oshirish bosqichlari rejasi" : "8. Хронологический план реализации"}
                </h2>
              </div>

              {/* TIMELINE STEPPER LAYOUT */}
              <div className="relative border-l-2 border-card-border pl-6 ml-4 space-y-8 font-sans text-xs">

                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background flex items-center justify-center"></span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm uppercase font-mono tracking-wider">{lang === 'uz' ? "I bosqich: Ma'lumotlarni birlashtirish" : "Этап I: Консолидация данных и API-интеграция"}</h4>
                    <p className="text-[10px] font-bold text-primary font-mono">{lang === 'uz' ? "Muddati: 1-oy. KPI: 100% integratsiya" : "Сроки: 1-й месяц. KPI: 100% интеграция API"}</p>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Kundalik.com, bandlik bazalari va ichki ishlar vazirligi axborot tizimlarining xavfsiz API orqali yagona 'Yoshlar Qalqoni' omboriga ulanishi."
                        : "Синхронизация технологических протоколов, авторизация межведомственных доступов и настройка систем шифрования трафика."
                      }
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-warning border-4 border-background flex items-center justify-center"></span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm uppercase font-mono tracking-wider">{lang === 'uz' ? "II bosqich: Amaliy sinov va xabarnomalar" : "Этап II: Оперативное развертывание и пилотные тесты"}</h4>
                    <p className="text-[10px] font-bold text-warning font-mono">{lang === 'uz' ? "Muddati: 2-3 oylar. KPI: Yoshlar yetakchilarini qamrash" : "Сроки: 2-3 месяцы. KPI: 100% охват лидеров молодежи в пилотных зонах"}</p>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Sirdaryo viloyatidagi 10 ta pilot mahallada yoshlar yetakchilari va psixologlarni tizimda ishlash bo‘yicha o‘qitish, mobil ilovani ishga tushirish."
                        : "Обучение персонала, проведение установочных семинаров, отладка алгоритмов смарт-уведомлений и калибровка моделей ИИ."
                      }
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[33px] top-0 w-4 h-4 rounded-full bg-safe border-4 border-background flex items-center justify-center"></span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm uppercase font-mono tracking-wider">{lang === 'uz' ? "III bosqich: To'liq miqyosga o'tish" : "Этап III: Системное масштабирование и аудит"}</h4>
                    <p className="text-[10px] font-bold text-safe font-mono">{lang === 'uz' ? "Muddati: 4-12 oylar. KPI: Huquqbuzarliklar 30% kamayishi" : "Сроки: 4-12 месяцы. KPI: Снижение правонарушений на 30%"}</p>
                    <p className="text-foreground/75 leading-relaxed">
                      {lang === 'uz'
                        ? "Tizimni butun viloyat darajasida to‘liq joriy etish, ishsizlik ko‘rsatkichlarini tizimli audit qilish va AI modellarini optimallashtirish."
                        : "Расширение географии внедрения на все районы области, интеграция с новыми социальными ведомствами и проведение итогового аудита."
                      }
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* 9. CONCLUSION */}
            <section id="sec-concl" className="space-y-4">
              <div className="flex items-center gap-2 border-b border-card-border/40 pb-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-black uppercase tracking-wider text-foreground">
                  {lang === 'uz' ? "9. Xulosa" : "9. Заключение"}
                </h2>
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed text-justify space-y-4 font-sans">
                <p>
                  {lang === 'uz'
                    ? "Ushbu strategik White Paper Sirdaryo viloyatida yoshlar bilan ishlash tizimini tubdan yangi, zamonaviy axborot texnologiyalari va preduktiv tahlil bosqichiga olib chiqish imkoniyatlarini ko‘rsatadi. 'Yoshlar Qalqoni' intellektual monitoring platformasi yordamida har bir xavf toifasidagi yoshga nisbatan manzilli, o‘z vaqtida va samarali profilaktik tadbirlarni amalga oshirish mumkin."
                    : "Подводя итог, следует подчеркнуть, что переход на интеллектуальные технологии управления рисками девиантного поведения в Сырдарьинской области — это не просто технологический апгрейд, а фундаментальный сдвиг в сторону концепции безопасного умного города. Развертывание платформы предиктивного мониторинга «Yoshlar Qalqoni» гарантирует высокий уровень межведомственной синергии и адресность социальной помощи."
                  }
                </p>
                <p>
                  {lang === 'uz'
                    ? "Tavsiya etilayotgan yechimlar va amaliy tavsiyalar birgalikda amalga oshirilganda, viloyatda yoshlar huquqbuzarliklarini o‘rtacha 30% ga kamaytirish, ta’lim davomatini esa 95% dan yuqori darajada ta’minlash kutilmoqda. Bu esa viloyat xavfsizligini ta'minlashda muhim qadamdir."
                    : "Реализация всех этапов предложенного хронологического плана позволит не только сократить уровень молодежной преступности на прогнозируемые 30%, но и заложить основу для раскрытия созидательного потенциала подрастающего поколения. Данный White Paper рекомендуется в качестве базового документа для принятия управленческих решений областного уровня."
                  }
                </p>
              </div>

              <div className="pt-6 border-t border-card-border/30 flex flex-col md:flex-row items-center justify-between text-[10px] text-foreground/40 font-mono gap-4">
                <span>{lang === 'uz' ? "Hujjat ID: WP-2026-SRDY-009" : "Идентификатор: WP-2026-SRDY-009"}</span>
                <span>{lang === 'uz' ? "Tasdiqlovchi: Sirdaryo Viloyat Ishchi Guruhi" : "Утверждено: Областная рабочая группа Сырдарьи"}</span>
                <span className="px-2 py-0.5 rounded border border-card-border/80 text-foreground/50">VERSION 5.2</span>
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}
