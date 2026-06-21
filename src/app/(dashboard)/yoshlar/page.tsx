"use client";

import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { 
  Search, Download, Edit, Trash2, Eye, X, Sparkles, ShieldAlert
} from "lucide-react";
import { useState, useEffect } from "react";
import AddYouthModal from "@/components/modals/AddYouthModal";
import { toast } from "sonner";


interface Youth {
  id: string;
  ism: string;
  familiya: string;
  jshshir: string;
  pasport: string;
  yil: string;
  jins: string;
  maktab: string;
  telefon: string;
  davomat: string;
  mahalla: string;
  xavf: string;
  izoh: string;
  createdAt?: string;
}

export default function YoshlarPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  
  // Standard list states
  const [youthList, setYouthList] = useState<Youth[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("All");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingYouth, setEditingYouth] = useState<Youth | null>(null);
  const [selectedYouthDetail, setSelectedYouthDetail] = useState<Youth | null>(null);

  const canEdit = user?.role === "admin" || user?.role === "yetakchi" || user?.role === "raisi";

  const loadYouth = async () => {
    try {
      const xavfQuery = selectedRiskFilter === "All" ? "" : selectedRiskFilter === "High" ? "Yuqori xavf" : "O'rta xavf";
      const res = await fetch(`/api/youth?limit=100&search=${encodeURIComponent(searchTerm)}&xavf=${encodeURIComponent(xavfQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setYouthList(data.items);
        }
      }
    } catch (e) {
      console.error("Failed to load youth", e);
    }
  };

  useEffect(() => {
    loadYouth();
    window.addEventListener("youthAdded", loadYouth);
    return () => window.removeEventListener("youthAdded", loadYouth);
  }, [searchTerm, selectedRiskFilter]);

  const handleDelete = async (id: string) => {
    if (confirm(lang === 'uz' ? "Rostdan ham o'chirmoqchimisiz?" : "Вы действительно хотите удалить?")) {
      try {
        const res = await fetch(`/api/youth/${id}`, { method: "DELETE" });
        if (res.ok) {
          toast.success(lang === 'uz' ? "Ma'lumot o'chirildi" : "Запись удалена");
          loadYouth();
          window.dispatchEvent(new Event("youthAdded")); // update navbar count
        } else {
          const errData = await res.json();
          toast.error(errData.error || (lang === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка"));
        }
      } catch (e) {
        console.error(e);
        toast.error(lang === 'uz' ? "Server bilan aloqa uzildi" : "Ошибка соединения с сервером");
      }
    }
  };

  const handleEdit = (youth: Youth) => {
    setEditingYouth(youth);
    setEditModalOpen(true);
  };

  const filteredList = youthList;

  // Dynamic skill balance radar charts Depending on risk level
  const getSkillsForYouth = (xavf: string) => {
    const isHigh = xavf === "Yuqori xavf" || xavf === "Высокий риск";
    const isMed = xavf === "O'rta xavf" || xavf === "Средний риск";
    
    if (isHigh) {
      return { bilim: 30, sport: 50, ijtimoiy: 25, it: 35, intizom: 40 };
    } else if (isMed) {
      return { bilim: 60, sport: 65, ijtimoiy: 55, it: 70, intizom: 62 };
    }
    return { bilim: 85, sport: 88, ijtimoiy: 80, it: 78, intizom: 90 };
  };

  const renderRadarChart = (xavf: string) => {
    const skills = getSkillsForYouth(xavf);
    const center = 50;
    const maxRadius = 38;
    
    const angles = [0, 72, 144, 216, 288].map(d => (d - 90) * (Math.PI / 180));
    const values = [skills.bilim, skills.sport, skills.ijtimoiy, skills.it, skills.intizom];

    const points = angles.map((angle, idx) => {
      const val = values[idx];
      const r = (val / 100) * maxRadius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(" ");

    const renderGridPentagon = (percent: number, stroke: string) => {
      const r = maxRadius * (percent / 100);
      const pStr = angles.map(angle => {
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
      }).join(" ");
      return <polygon points={pStr} fill="none" stroke={stroke} strokeWidth="0.5" strokeDasharray={percent !== 100 ? "1 1" : ""} />;
    };

    return (
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[200px] mx-auto filter drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]">
        {renderGridPentagon(100, "rgba(255,255,255,0.2)")}
        {renderGridPentagon(75, "rgba(255,255,255,0.12)")}
        {renderGridPentagon(50, "rgba(255,255,255,0.1)")}
        {renderGridPentagon(25, "rgba(255,255,255,0.08)")}

        {angles.map((angle, idx) => {
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return <line key={idx} x1={center} y1={center} x2={x} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />;
        })}

        <polygon 
          points={points} 
          fill="rgba(6, 182, 212, 0.25)" 
          stroke="#06b6d4" 
          strokeWidth="1.2" 
        />

        {angles.map((angle, idx) => {
          const val = values[idx];
          const r = (val / 100) * maxRadius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return <circle key={idx} cx={x} cy={y} r="1.5" fill="#22d3ee" stroke="#091024" strokeWidth="0.5" />;
        })}
      </svg>
    );
  };

  const handleSimulatePassport = () => {
    toast.success(lang === 'uz' ? "Yoshlar sotsial pasporti yuklab olindi (PDF sinxronlashdi)!" : "Социальный паспорт успешно экспортирован в PDF!");
  };

  return (
    <div className="space-y-6">
      {/* Title Header with responsive buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            {lang === 'uz' ? "VILOYAT MUVOFIQLASHTIRISH MARKAZI" : "ОБЛАСТНОЙ КООРДИНАЦИОННЫЙ ЦЕНТР"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Yoshlar Ro'yxati" : "Список Молодежи"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === 'uz' 
              ? `Yagona bazada jami ${youthList.length} ta yoshlar ro'yxatga olingan. Barcha ma'lumotlar boshqa bo'limlar bilan integratsiya qilingan.` 
              : `В единой базе зарегистрировано ${youthList.length} молодых людей. Все данные интегрированы с другими отделами.`}
          </p>
        </div>

        {/* Register Youth button */}
        <button
          onClick={() => {
            setEditingYouth(null);
            setEditModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
          <span>{lang === 'uz' ? "Yangi yosh qo'shish" : "Зарегистрировать нового"}</span>
        </button>
      </div>

      {/* Main Grid search & filter */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'uz' ? "Ism, maktab, JShShIR yoki passport bo'yicha..." : "Поиск по имени, школе, ПИНФЛ или паспорту..."}
              className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select 
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-background border border-card-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 appearance-none font-bold"
            >
              <option value="All">{lang === 'uz' ? "Barcha darajalar" : "Все уровни"}</option>
              <option value="High">{lang === 'uz' ? "Yuqori xavf" : "Высокий риск"}</option>
              <option value="Medium">{lang === 'uz' ? "O'rta xavf" : "Средний риск"}</option>
            </select>

            <button 
              onClick={() => {
                if (filteredList.length === 0) {
                  toast.error(lang === 'uz' ? "Eksport qilish uchun ma'lumotlar yo'q!" : "Нет данных для экспорта!");
                  return;
                }
                const headers = lang === 'uz'
                  ? "Ism,Familiya,JShShIR,Pasport,Tug'ilgan Yili,Jinsi,Mahalla,Telefon,Maktab,Davomat,Xavf Darajasi,Izoh\n"
                  : "Имя,Фамилия,ПИНФЛ,Паспорт,Год Рождения,Пол,Махалля,Телефон,Школа,Посещаемость,Уровень Риска,Примечание\n";
                  
                const rows = filteredList.map(y => 
                  `"${y.ism}","${y.familiya}","${y.jshshir}","${y.pasport}",${y.yil},"${y.jins}","${y.mahalla}","${y.telefon}","${y.maktab}","${y.davomat}%","${y.xavf}","${y.izoh || ''}"`
                ).join("\n");
                
                const csvContent = "\uFEFF" + headers + rows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `yoshlar_ro'yxati_${lang === 'uz' ? 'uz' : 'ru'}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success(lang === 'uz' ? "Ma'lumotlar eksport qilindi" : "Данные успешно экспортированы");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-safe/10 text-safe border border-safe/20 rounded-xl hover:bg-safe/20 transition-all text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {lang === 'uz' ? "Eksport" : "Экспорт"}
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-t border-card-border border-dashed opacity-70">
            <Search className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-sm font-bold text-foreground mb-1">{lang === 'uz' ? "Hech kim topilmadi" : "Никто не найден"}</h3>
            <p className="text-xs text-foreground/50">{lang === 'uz' ? "Qidiruv parametrlarini o'zgartiring." : "Попробуйте изменить параметры поиска."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-[10px] uppercase tracking-wider text-foreground/50">
                  <th className="p-4 font-bold">{lang === 'uz' ? "F.I.Sh" : "Ф.И.О"}</th>
                  <th className="p-4 font-bold">Pasport / JSHSHIR</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Telefon / Manzil" : "Телефон / Адрес"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Xavf darajasi" : "Уровень риска"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Bo'limlararo aloqa" : "Связи с отделами"}</th>
                  <th className="p-4 font-bold text-right">{lang === 'uz' ? "Harakatlar" : "Действия"}</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-card-border/40">
                {filteredList.map((y) => {
                  const isHired = y.id.startsWith("hired_");
                  const hiredIdx = isHired ? parseInt(y.id.split("_")[1]) : -1;
                  const scenarioIdx = isHired ? hiredIdx % 4 : -1;

                  return (
                    <tr key={y.id} className="hover:bg-card/25 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {y.ism.charAt(0)}{y.familiya.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{y.ism} {y.familiya}</div>
                            <div className="text-[10px] text-foreground/50">{y.maktab}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="text-foreground font-semibold">{y.pasport}</div>
                        <div className="text-[10px] text-foreground/45 mt-0.5">{y.jshshir}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{y.telefon}</div>
                        <div className="text-[10px] text-foreground/45 mt-0.5">{y.mahalla}</div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold bg-opacity-10
                          ${y.xavf === 'Yuqori xavf' || y.xavf === 'Высокий риск' ? 'bg-danger text-danger border-danger/25' : 
                            y.xavf === "O'rta xavf" || y.xavf === 'Средний риск' ? 'bg-warning text-warning border-warning/25' :
                            'bg-safe text-safe border-safe/25'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${y.xavf === 'Yuqori xavf' || y.xavf === 'Высокий риск' ? 'bg-danger' : y.xavf === "O'rta xavf" || y.xavf === 'Средний риск' ? 'bg-warning' : 'bg-safe'}`}></span>
                          {y.xavf}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {isHired ? (
                            <>
                              <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                💼 {lang === 'uz' ? "Band" : "Занят"}
                              </span>
                              {hiredIdx < 15 && (
                                <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                  📋 {lang === 'uz' ? "Rejada" : "В задачах"}
                                </span>
                              )}
                              {scenarioIdx === 0 && (
                                <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-purple-500/10 text-purple-400 border-purple-500/20">
                                  📩 {lang === 'uz' ? "Murojaat hal etilgan" : "Обращение закрыто"}
                                </span>
                              )}
                              {scenarioIdx === 1 && (
                                <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-rose-500/10 text-rose-400 border-rose-500/20">
                                  ⚖️ {lang === 'uz' ? "MIA ro'yxatidan yopildi" : "Снят с учета МВД"}
                                </span>
                              )}
                              {scenarioIdx === 2 && (
                                <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-pink-500/10 text-pink-400 border-pink-500/20">
                                  🤝 {lang === 'uz' ? "Daftardan chiqarilgan" : "Исключен из соц. тетради"}
                                </span>
                              )}
                              {scenarioIdx === 3 && (
                                <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-amber-500/10 text-amber-400 border-amber-500/20">
                                  🏆 {lang === 'uz' ? "Tanlov ishtirokchisi" : "Участник конкурса"}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md border text-[9px] font-semibold bg-slate-500/10 text-slate-400 border-slate-500/20">
                              👤 {lang === 'uz' ? "Shaxsiy profil" : "Личный профиль"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedYouthDetail(y)}
                            className="p-2 bg-card hover:bg-primary/20 hover:text-primary border border-card-border text-foreground/60 rounded-lg transition-all"
                            title={lang === 'uz' ? "To'liq profili ko'rish" : "Смотреть профиль ИИ"}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {canEdit && (
                            <>
                              <button 
                                onClick={() => handleEdit(y)}
                                className="p-2 bg-card hover:bg-primary hover:text-white border border-card-border text-foreground/60 rounded-lg transition-colors"
                                title={lang === 'uz' ? "Tahrirlash" : "Редактировать"}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(y.id)}
                                className="p-2 bg-card hover:bg-danger hover:text-white border border-card-border text-foreground/60 rounded-lg transition-colors"
                                  title={lang === 'uz' ? "O'chirish" : "Удалить"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expanded Interactive Modal Dialog showing Radar-chart of individual youth skills and specific AI corrective paths */}
      {selectedYouthDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-card/30 border-b border-card-border/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>{lang === 'uz' ? "AI Individual Sotsial Pasporti" : "Индивидуальный Социальный Паспорт ИИ"}</span>
              </h3>
              <button 
                onClick={() => setSelectedYouthDetail(null)} 
                className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Left Side: General social profile & dynamic radar graph */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                    {selectedYouthDetail.ism.charAt(0)}{selectedYouthDetail.familiya.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground leading-tight">{selectedYouthDetail.ism} {selectedYouthDetail.familiya}</h2>
                    <span className="text-[10px] text-foreground/50 font-mono mt-0.5 block">{selectedYouthDetail.pasport} | {selectedYouthDetail.jshshir}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-background/60 dark:bg-[#050b18]/60 p-4 rounded-xl border border-card-border">
                  <div>
                    <span className="text-[9px] font-bold text-foreground/45 uppercase">{lang === 'uz' ? "Tug'ilgan yili" : "Год рождения"}</span>
                    <div className="font-bold text-foreground mt-0.5 font-mono">{selectedYouthDetail.yil}</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-foreground/45 uppercase">{lang === 'uz' ? "Davomat" : "Посещаемость"}</span>
                    <div className={`font-bold mt-0.5 font-mono ${parseInt(selectedYouthDetail.davomat) < 80 ? 'text-danger' : 'text-safe'}`}>
                      {selectedYouthDetail.davomat}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-foreground/45 uppercase">{lang === 'uz' ? "Hudud (Mahalla)" : "Махалля"}</span>
                    <div className="font-bold text-foreground mt-0.5">{selectedYouthDetail.mahalla}</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-foreground/45 uppercase">{lang === 'uz' ? "Telefon" : "Телефон"}</span>
                    <div className="font-bold text-foreground mt-0.5 font-mono">{selectedYouthDetail.telefon}</div>
                  </div>
                </div>

                {/* Radar chart box */}
                <div className="bg-background/40 dark:bg-[#050b18]/40 p-3 rounded-xl border border-card-border flex flex-col items-center">
                  <div className="text-[9px] font-bold text-foreground/45 uppercase tracking-wider mb-2">{lang === 'uz' ? "Ko'nikmalar AI balansi" : "ИИ-Баланс Навыков"}</div>
                  <div className="w-full flex items-center justify-between gap-2">
                    <div className="w-1/2">
                      {renderRadarChart(selectedYouthDetail.xavf)}
                    </div>
                    
                    {/* Skills legend values list */}
                    <div className="w-1/2 space-y-1 text-[10px] font-semibold text-foreground/60 pr-2">
                      {Object.entries(getSkillsForYouth(selectedYouthDetail.xavf)).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center">
                          <span className="capitalize">{k === 'bilim' ? (lang === 'uz' ? 'Bilim' : 'Знания') : k === 'it' ? 'IT' : k === 'ijtimoiy' ? (lang === 'uz' ? 'Social' : 'Социал') : k === 'intizom' ? (lang === 'uz' ? 'Intizom' : 'Дисциплина') : (lang === 'uz' ? 'Sport' : 'Спорт')}:</span>
                          <span className="font-mono text-primary font-bold">{v}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: AI Corrective Path / Yo'l xaritasi */}
              <div className="space-y-4">
                <div className="p-4 bg-danger/5 border border-danger/20 rounded-xl flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-danger uppercase tracking-wider">{lang === 'uz' ? "Sotsial Profil" : "Социальный Профиль"}</h4>
                    <p className="text-[11px] text-foreground/75 leading-relaxed mt-1">
                      {selectedYouthDetail.izoh || (lang === 'uz' ? "Profilaktika chora-tadbirlari rejalashtirilmoqda. Tizim tomonidan xavf monitoringi ostida." : "Планируются профилактические меры. Под контролем системы.")}
                    </p>
                  </div>
                </div>

                <div className="bg-background/60 dark:bg-[#050b18]/60 p-4 rounded-xl border border-card-border space-y-3 flex-1 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>{lang === 'uz' ? "AI individual yo'l xaritasi" : "ИИ Индивидуальная траектория"}</span>
                  </div>

                  {/* Vertically progressive correction plan */}
                  <div className="space-y-4 relative pl-3 border-l border-primary/20 ml-1.5 text-xs text-foreground/80 leading-relaxed">
                    <div className="relative">
                      <div className="absolute -left-[16.5px] top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <strong className="text-primary block text-[11px] font-bold uppercase">{lang === 'uz' ? "1. Bandlik va IT-Kvalifikatsiya" : "1. Занятость и IT-Квалификация"}</strong>
                      <p className="text-[10px] text-foreground/60 mt-0.5">
                        {lang === 'uz' ? "Yoshlar daftari orqali tekin IT-kurslariga hamda mentorlarga bog'lash." : "Прикрепить к бесплатным IT-курсам и наставнику через Молодежную тетрадь."}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[16.5px] top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <strong className="text-primary block text-[11px] font-bold uppercase">{lang === 'uz' ? "2. Sotsial-Psixologik moslashuv" : "2. Социально-Психологическая помощь"}</strong>
                      <p className="text-[10px] text-foreground/60 mt-0.5">
                        {lang === 'uz' ? "Mahalla yetakchisi tomonidan haftada kamida 1 marta motivatsion suhbatlar o'tkazish." : "Проведение мотивационных бесед лидером махалли не реже 1 раза в неделю."}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[16.5px] top-1 w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <strong className="text-primary block text-[11px] font-bold uppercase">{lang === 'uz' ? "3. Monitoring va Nazorat" : "3. Мониторинг и Контроль"}</strong>
                      <p className="text-[10px] text-foreground/60 mt-0.5">
                        {lang === 'uz' ? "Kundalik.com davomati va mahalla xarita hotspots tahlili orqali xavfni pasaytirish." : "Снижение уровня риска на основе анализа посещаемости Kundalik.com."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="p-4 bg-card/30 border-t border-card-border/50 flex justify-between items-center">
              <button 
                onClick={handleSimulatePassport} 
                className="flex items-center gap-1.5 px-4 py-2 bg-safe/25 border border-safe/30 text-safe hover:bg-safe/30 rounded-xl text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'uz' ? "Pasport yuklab olish" : "Скачать Паспорт"}</span>
              </button>
              
              <button 
                onClick={() => setSelectedYouthDetail(null)} 
                className="px-6 py-2 bg-primary text-white rounded-xl hover:opacity-95 transition-all text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                {lang === 'uz' ? "Yopish" : "Закрыть"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddYouthModal 
        isOpen={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setEditingYouth(null);
        }} 
        editData={editingYouth} 
      />
    </div>
  );
}
