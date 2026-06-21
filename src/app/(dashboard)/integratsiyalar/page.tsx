"use client";

import { useI18n } from "@/lib/i18n";
import { Zap, Clock, ShieldCheck, Loader2, Terminal, Lock, Server, Globe, Search, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function IntegratsiyalarPage() {
  const { t, lang } = useI18n();

  const [syncStates, setSyncStates] = useState<Record<string, { syncing: boolean; lastSyncTime: "initial" | "just_now" }>>({
    kundalik: { syncing: false, lastSyncTime: "initial" },
    mandat: { syncing: false, lastSyncTime: "initial" },
    mia: { syncing: false, lastSyncTime: "initial" },
    employment: { syncing: false, lastSyncTime: "initial" }
  });

  const integrations = [
    {
      id: "kundalik",
      name: "kundalik.com",
      status: "ONLINE",
      statusColor: "bg-safe",
      desc: lang === 'uz' ? "Umumiy o'rta ta'lim davomat va fan ko'rsatkichlari sinxron holatda." : "Синхронизация посещаемости и оценок общего среднего образования.",
      connected: 182,
      errors: 0,
      ping: "45ms",
      lastSync: syncStates.kundalik.lastSyncTime === "just_now" 
        ? (lang === 'uz' ? "hoziroq" : "только что") 
        : (lang === 'uz' ? "2 daqiqa oldin" : "2 минуты назад"),
      syncing: syncStates.kundalik.syncing
    },
    {
      id: "mandat",
      name: "mandat.uz",
      status: "ONLINE",
      statusColor: "bg-safe",
      desc: lang === 'uz' ? "Oliy ta'lim imtihon natijalari va yo'nalishlar yangilangan." : "Результаты экзаменов и направления высшего образования обновлены.",
      connected: 45,
      errors: 0,
      ping: "78ms",
      lastSync: syncStates.mandat.lastSyncTime === "just_now" 
        ? (lang === 'uz' ? "hoziroq" : "только что") 
        : (lang === 'uz' ? "10 daqiqa oldin" : "10 минут назад"),
      syncing: syncStates.mandat.syncing
    },
    {
      id: "mia",
      name: "mia.gov.uz (IIV)",
      status: "SECURE",
      statusColor: "bg-primary",
      desc: lang === 'uz' ? "Ichki ishlar vazirligi tezkor profilaktika va qidiruv ma'lumotlar bazasi." : "Оперативная база данных профилактики и розыска Министерства внутренних дел.",
      connected: 8,
      errors: 1,
      ping: "115ms",
      lastSync: syncStates.mia.lastSyncTime === "just_now" 
        ? (lang === 'uz' ? "hoziroq" : "только что") 
        : (lang === 'uz' ? "1 soat oldin" : "1 час назад"),
      syncing: syncStates.mia.syncing
    },
    {
      id: "employment",
      name: "mehnat.uz",
      status: "ONLINE",
      statusColor: "bg-safe",
      desc: lang === 'uz' ? "Kambag'allikni qisqartirish va bandlik vazirligi bo'sh ish o'rinlari reyestri." : "Реестр вакансий Министерства сокращения бедности и занятости.",
      connected: 29,
      errors: 0,
      ping: "92ms",
      lastSync: syncStates.employment.lastSyncTime === "just_now" 
        ? (lang === 'uz' ? "hoziroq" : "только что") 
        : (lang === 'uz' ? "30 daqiqa oldin" : "30 минут назад"),
      syncing: syncStates.employment.syncing
    }
  ];

  const [syncingAll, setSyncingAll] = useState(false);

  // Terminal state
  const [selectedDb, setSelectedDb] = useState("mia");
  const [queryInput, setQueryInput] = useState("31208945678912");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [querying, setQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<{
    nameUz?: string;
    nameRu?: string;
    birth?: string;
    statusUz?: string;
    statusRu?: string;
    detailsUz?: string;
    detailsRu?: string;
    aiRecommendationUz?: string;
    aiRecommendationRu?: string;
    count?: number;
    positions?: { titleUz: string; titleRu: string; employerUz: string; employerRu: string; salary: string }[];
    studentUz?: string;
    studentRu?: string;
    institutionUz?: string;
    institutionRu?: string;
    specialtyUz?: string;
    specialtyRu?: string;
    gradYear?: string;
    gpa?: string;
    verified?: boolean;
  } | null>(null);

  // Dynamic Terminal Styling based on selectedDb
  const getTerminalStyles = () => {
    switch (selectedDb) {
      case "employment":
        return {
          bg: "bg-[#f0fdf4] dark:bg-[#010603] border-emerald-300 dark:border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
          headerBg: "bg-[#dcfce7] dark:bg-[#0b1c12] border-emerald-200 dark:border-emerald-500/20",
          text: "text-emerald-950 dark:text-emerald-400",
          accentText: "text-emerald-500/60 dark:text-emerald-500/50",
          cursor: "bg-emerald-700 dark:bg-emerald-400",
          globe: "text-emerald-600 dark:text-emerald-500/70"
        };
      case "higheredu":
        return {
          bg: "bg-[#faf5ff] dark:bg-[#04010a] border-purple-300 dark:border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.15)]",
          headerBg: "bg-[#f3e8ff] dark:bg-[#140b1c] border-purple-200 dark:border-purple-500/20",
          text: "text-purple-950 dark:text-purple-400",
          accentText: "text-purple-500/60 dark:text-purple-500/50",
          cursor: "bg-purple-700 dark:bg-purple-400",
          globe: "text-purple-600 dark:text-purple-500/70"
        };
      case "mia":
      default:
        return {
          bg: "bg-[#f0f9ff] dark:bg-[#02050c] border-cyan-300 dark:border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]",
          headerBg: "bg-[#e0f2fe] dark:bg-[#0b1329] border-cyan-200 dark:border-cyan-500/20",
          text: "text-cyan-950 dark:text-cyan-400",
          accentText: "text-cyan-500/60 dark:text-cyan-500/50",
          cursor: "bg-cyan-700 dark:bg-cyan-400",
          globe: "text-cyan-600 dark:text-cyan-500/70"
        };
    }
  };

  const termStyle = getTerminalStyles();

  const handleSync = (id: string) => {
    setSyncStates(prev => ({
      ...prev,
      [id]: { ...prev[id], syncing: true }
    }));
    
    setTimeout(() => {
      setSyncStates(prev => ({
        ...prev,
        [id]: { syncing: false, lastSyncTime: "just_now" }
      }));
      toast.success(lang === 'uz' ? "Sinxronizatsiya muvaffaqiyatli yakunlandi" : "Синхронизация успешно завершена");
    }, 1500);
  };

  const handleSyncAll = () => {
    setSyncingAll(true);
    setSyncStates(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        next[k] = { ...next[k], syncing: true };
      });
      return next;
    });
    
    setTimeout(() => {
      setSyncStates(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          next[k] = { syncing: false, lastSyncTime: "just_now" };
        });
        return next;
      });
      setSyncingAll(false);
      toast.success(lang === 'uz' ? "Barcha tizimlar muvaffaqiyatli sinxronlandi" : "Все системы успешно синхронизированы");
    }, 2000);
  };

  const runSimulationQuery = async () => {
    if (!queryInput) {
      toast.error(lang === 'uz' ? "So'rov maydoni bo'sh bo'lishi mumkin emas!" : "Поле запроса не может быть пустым!");
      return;
    }
    setQuerying(true);
    setQueryResult(null);
    setTerminalLogs([]);

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setTerminalLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    try {
      const response = await fetch("/api/integrations/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedDb, query: queryInput }),
      });

      const apiData = await response.json();

      if (!response.ok) {
        throw new Error(apiData.error || "Failed to connect to gateway");
      }

      await addLog(`[SYSTEM] [${new Date().toLocaleTimeString()}] INITIATING SECURE REST-API CONNECTION TO ${selectedDb.toUpperCase()}.GOV.UZ...`, 100);
      await addLog(`[GATEWAY] RESOLVING ROUTE TO SECURE SUBNET: 10.220.14.89 (GOVNET-SRD)`, 300);
      await addLog(`[SECURITY] SHIFTING CYCLIC ROTARY ENCRYPTION TO AES-256 GCM...`, 400);
      await addLog(`[TLS] ESTABLISHING HANDSHAKE WITH GOVERNMENT CERTIFICATE AUTHORITY (CA_UZ_GOLDEN)...`, 400);
      await addLog(`[TLS] HANDSHAKE STATUS: SECURE CONNECTION ESTABLISHED (PFS - ECDHE-RSA-AES256-GCM-SHA384)`, 400);
      await addLog(`[AUTH] VALIDATING EXECUTIVE TOKEN SYSTEM PATH...`, 300);
      await addLog(`[AUTH] APP TOKEN LEVEL 3 (Syrdarya Gov Youth Panel) - [AUTHORIZED]`, 300);
      
      if (selectedDb === "mia") {
        await addLog(`[SQL] QUERY SENT: SELECT * FROM iiv_preventive_db WHERE jshshir = '${queryInput}'`, 400);
        await addLog(`[SQL] INDEXED FIELDS: STATUS, CRIME_INDEX, REGISTRATION_TYPE`, 200);
        await addLog(`[SYSTEM] PARSING JSON ENCRYPTED PAYLOAD FROM IIV DATACENTER...`, 400);
        await addLog(`[SUCCESS] 200 OK - TARGET RECORD ${apiData.found ? "FOUND AND VERIFIED" : "NOT FOUND (FALLBACK ACTIVE)"}.`, 300);
      } else if (selectedDb === "employment") {
        await addLog(`[API] GET REQUEST: /api/v1/jobs/registry?district=Sirdaryo&category='${queryInput}'`, 400);
        await addLog(`[API] PARSING VACANCIES IN SYRDARYA DISTRICT REGISTRY...`, 300);
        await addLog(`[SYSTEM] FILTERING SALARY RANGE > 3,500,000 UZS...`, 300);
        await addLog(`[SUCCESS] 200 OK - RECEIVED ${apiData.count} MATCHING POSITIONS.`, 300);
      } else {
        await addLog(`[API] ENCRYPTED PAYLOAD REQ: /oliy-talim/diploma/verify?id=${queryInput}`, 400);
        await addLog(`[DB] SEARCHING CENTRAL REGISTRY OF THE MINISTRY OF HIGHER EDUCATION...`, 300);
        await addLog(`[SUCCESS] 200 OK - DIPLOMA/CERTIFICATE SERIAL ${apiData.verified ? "VERIFIED" : "INVALID"}.`, 300);
      }

      setQueryResult(apiData);
      setQuerying(false);
      toast.success(lang === 'uz' ? "Xavfsiz so'rov muvaffaqiyatli yakunlandi!" : "Безопасный запрос успешно выполнен!");
    } catch (err: any) {
      console.error(err);
      await addLog(`[ERROR] [TLS] HANDSHAKE OR GATEWAY TIMEOUT: ${err.message || "Unknown error"}`, 200);
      setQuerying(false);
      toast.error(lang === 'uz' ? "So'rov yuborishda xatolik yuz berdi" : "Произошла ошибка при отправке запроса");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            API VA EXTERNAL TIZIMLAR
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Integratsiya va Sandboks" : "Интеграции и Песочница API"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === 'uz' ? "Davlat idoralari va vazirliklar tizimlari bilan real vaqtda xavfsiz integratsiya xabi." : "Безопасный хаб интеграции в реальном времени с государственными ведомствами."}
          </p>
        </div>
        <button 
          onClick={handleSyncAll}
          disabled={syncingAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-xs"
        >
          {syncingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-white" />}
          {lang === 'uz' ? "Barcha tizimlarni sinxronlash" : "Синхронизировать все"}
        </button>
      </div>

      {/* Integrations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {integrations.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-card-border relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-2xl -z-10 group-hover:bg-primary/10 transition-colors"></div>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-card border border-card-border flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`}></span>
                      <span className="text-[9px] font-bold text-foreground/50 tracking-wider">{item.status}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleSync(item.id)}
                  disabled={item.syncing || syncingAll}
                  className="flex items-center gap-1 px-2.5 py-1 bg-card border border-card-border hover:border-primary/50 rounded-lg text-[10px] font-medium text-foreground hover:text-primary transition-all disabled:opacity-50"
                >
                  {item.syncing ? <Loader2 className="w-3 h-3 text-primary animate-spin" /> : <Zap className="w-3 h-3 text-primary" />}
                  Sync
                </button>
              </div>

              <p className="text-xs text-foreground/60 leading-relaxed mb-6 h-12 overflow-hidden">{item.desc}</p>
            </div>

            <div>
              <div className="bg-background/50 rounded-xl p-3 grid grid-cols-3 gap-2 border border-card-border mb-4">
                <div className="text-center">
                  <div className="text-md font-black text-safe">{item.connected}</div>
                  <div className="text-[8px] font-bold text-foreground/40 uppercase mt-0.5">OK</div>
                </div>
                <div className="text-center border-l border-r border-card-border/50">
                  <div className="text-md font-black text-danger">{item.errors}</div>
                  <div className="text-[8px] font-bold text-foreground/40 uppercase mt-0.5">ERR</div>
                </div>
                <div className="text-center">
                  <div className="text-md font-black text-primary">{item.ping}</div>
                  <div className="text-[8px] font-bold text-foreground/40 uppercase mt-0.5">PING</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 font-semibold">
                <Clock className="w-3 h-3 text-foreground/30" />
                <span>Sync: <strong className="text-foreground/60">{item.lastSync}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Futuristic API Sandbox Terminal Console Section */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#06b6d4]/5 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {lang === 'uz' ? "Davlat organlari API sandbaksi (Xavfsiz so'rovlar)" : "Песочница API госструктур (Безопасные запросы)"}
            </h2>
            <p className="text-xs text-foreground/50">
              {lang === 'uz' ? "MVD, Bandlik yoki Oliy ta'lim ma'lumotlar bazasidan test ma'lumotlarini so'rash simulyatori." : "Симулятор запросов тестовых данных из баз МВД, Занятости или Минвуза."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Form Panel */}
          <div className="space-y-4">
            <div className="bg-card/50 p-5 rounded-xl border border-card-border space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                  {lang === 'uz' ? "1. Tizimni tanlang" : "1. Выберите систему"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      setSelectedDb("mia");
                      setQueryInput("31208945678912");
                      setQueryResult(null);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${selectedDb === 'mia' ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-card border-card-border text-foreground/60 hover:text-foreground'}`}
                  >
                    IIV (MVD)
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDb("employment");
                      setQueryInput("IT development");
                      setQueryResult(null);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${selectedDb === 'employment' ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-card border-card-border text-foreground/60 hover:text-foreground'}`}
                  >
                    Bandlik
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDb("higheredu");
                      setQueryInput("DIP-9844093");
                      setQueryResult(null);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${selectedDb === 'higheredu' ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'bg-card border-card-border text-foreground/60 hover:text-foreground'}`}
                  >
                    Oliy ta'lim
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                  {selectedDb === 'mia' ? (lang === 'uz' ? "JShShIR (14 xonali son)" : "ПИНФЛ (14-значный код)") :
                   selectedDb === 'employment' ? (lang === 'uz' ? "Kasb-hunar toifasi yoki kalit so'z" : "Категория профессии или ключевое слово") :
                   (lang === 'uz' ? "Diplom seriyasi va raqami" : "Серия и номер диплома")}
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={queryInput} 
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="w-full bg-background border border-card-border rounded-lg pl-3 pr-10 py-2.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                </div>
              </div>

              <button 
                onClick={runSimulationQuery}
                disabled={querying}
                className="w-full py-3 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {querying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{lang === 'uz' ? "Ulanish o'rnatilmoqda..." : "Установка соединения..."}</span>
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 text-white" />
                    <span>{lang === 'uz' ? "Xavfsiz so'rovni yuborish" : "Отправить безопасный запрос"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Display */}
            {queryResult && (
              <div className="bg-card/50 p-5 rounded-xl border border-card-border space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 pb-2 border-b border-card-border/50 text-xs font-bold text-safe">
                  <CheckCircle2 className="w-4 h-4 text-safe" />
                  <span>{lang === 'uz' ? "TIZIM JAVOBI (VERIFIED)" : "ОТВЕТ СИСТЕМЫ (ПОДТВЕРЖДЕНО)"}</span>
                </div>

                {selectedDb === 'mia' && queryResult && (
                  <div className="space-y-2 text-xs">
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "F.I.O:" : "Ф.И.О:"}</span> <strong className="text-foreground font-bold">{lang === 'uz' ? queryResult.nameUz : queryResult.nameRu}</strong></div>
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Tug'ilgan sana:" : "Дата рожд:"}</span> <strong className="text-foreground/80 font-mono">{queryResult.birth}</strong></div>
                    <div>
                      <span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Status:" : "Статус:"}</span> 
                      <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-danger/10 text-danger border border-danger/20">{lang === 'uz' ? queryResult.statusUz : queryResult.statusRu}</span>
                    </div>
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Batafsil:" : "Детали:"}</span> <p className="text-foreground/75 mt-0.5 leading-relaxed">{lang === 'uz' ? queryResult.detailsUz : queryResult.detailsRu}</p></div>
                    <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20 mt-2">
                      <div className="text-[10px] font-bold uppercase text-primary mb-1">Gemini AI Tavsiyasi:</div>
                      <p className="text-foreground/80 text-[11px] leading-relaxed">{lang === 'uz' ? queryResult.aiRecommendationUz : queryResult.aiRecommendationRu}</p>
                    </div>
                  </div>
                )}

                {selectedDb === 'employment' && queryResult && queryResult.positions && (
                  <div className="space-y-3 text-xs">
                    <div className="text-foreground/50 font-bold">{lang === 'uz' ? `Mavjud bo'sh ish o'rinlari (${queryResult.count} ta):` : `Доступные вакансии (${queryResult.count}):`}</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {queryResult.positions.map((p, idx: number) => (
                        <div key={idx} className="p-2.5 bg-background/50 rounded-lg border border-card-border">
                          <div className="font-bold text-foreground text-xs">{lang === 'uz' ? p.titleUz : p.titleRu}</div>
                          <div className="text-[10px] text-foreground/50 mt-0.5">{lang === 'uz' ? p.employerUz : p.employerRu}</div>
                          <div className="text-[10px] font-bold text-primary mt-1 font-mono">{p.salary}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDb === 'higheredu' && queryResult && (
                  <div className="space-y-2 text-xs">
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Talaba F.I.Sh:" : "Ф.И.О Студента:"}</span> <strong className="text-foreground font-bold">{lang === 'uz' ? queryResult.studentUz : queryResult.studentRu}</strong></div>
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "OTM nomi:" : "ВУЗ:"}</span> <strong className="text-foreground/80">{lang === 'uz' ? queryResult.institutionUz : queryResult.institutionRu}</strong></div>
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Mutaxassislik:" : "Специальность:"}</span> <strong className="text-foreground/80">{lang === 'uz' ? queryResult.specialtyUz : queryResult.specialtyRu}</strong></div>
                    <div><span className="text-foreground/40 font-semibold">{lang === 'uz' ? "Bitirgan yili:" : "Год выпуска:"}</span> <strong className="text-foreground/80 font-mono">{queryResult.gradYear}</strong></div>
                    <div><span className="text-foreground/40 font-semibold">GPA:</span> <strong className="text-safe font-mono">{queryResult.gpa}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Shell Terminal Panel */}
          <div className={`lg:col-span-2 flex flex-col rounded-xl border overflow-hidden h-[340px] transition-all duration-500 ${termStyle.bg}`}>
            {/* Terminal Header */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between transition-colors duration-500 ${termStyle.headerBg}`}>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/80"></div>
                <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                <div className="w-3 h-3 rounded-full bg-safe/80"></div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-foreground/40 tracking-wider">
                <Globe className={`w-3 h-3 transition-colors duration-500 ${termStyle.globe}`} />
                <span>SECURE TERMINAL CONSOLE</span>
              </div>
              <div className="w-8"></div>
            </div>

            {/* Terminal Screen Body */}
            <div className={`flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-card-border transition-colors duration-500 ${termStyle.text}`}>
              {terminalLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-60 text-center select-none font-semibold">
                  <Terminal className="w-8 h-8 opacity-40 mb-2 animate-pulse" />
                  <p>{lang === 'uz' ? "Terminal tayyor. So'rov yuborishni kuting..." : "Терминал готов. Ожидайте отправки запроса..."}</p>
                </div>
              ) : (
                terminalLogs.map((log, idx) => {
                  let color = "";
                  if (log.includes("[SYSTEM]")) color = "opacity-50 font-mono";
                  else if (log.includes("[SUCCESS]") || log.includes("VERIFIED")) color = "text-safe font-semibold";
                  else if (log.includes("[SECURITY]")) color = "text-warning font-bold";
                  else color = termStyle.text;
                  return (
                    <div key={idx} className={`${color} leading-relaxed break-all`}>
                      <span className={`select-none mr-2 transition-colors duration-500 ${termStyle.accentText}`}>$</span>
                      {log}
                    </div>
                  );
                })
              )}
              {querying && (
                <div className="flex items-center gap-2 animate-pulse mt-2">
                  <span className={`mr-2 transition-colors duration-500 ${termStyle.accentText}`}>$</span>
                  <span className={`inline-block w-2.5 h-4 animate-blink ${termStyle.cursor}`}></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

