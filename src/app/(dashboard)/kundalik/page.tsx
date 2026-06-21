"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Search,
  RefreshCw,
  Sparkles,
  PhoneCall,
  UserCheck,
  Home,
  ArrowRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

// Static mock data representing real-world database synchronization with Kundalik.com
const initialAlerts = [
  { id: 1, name: "Azizov Dilshod", school: "4-sonli maktab", class: "9-B", days: 4, statusUz: "Xavf ostida", statusRu: "В группе риска", phone: "+998 90 123 45 67" },
  { id: 2, name: "Karimova Madina", school: "2-sonli maktab", class: "11-A", days: 3, statusUz: "Nazorat ostida", statusRu: "Под наблюдением", phone: "+998 93 456 78 90" },
  { id: 3, name: "Tursunov Sanjar", school: "4-sonli maktab", class: "10-C", days: 3, statusUz: "Nazorat ostida", statusRu: "Под наблюдением", phone: "+998 99 789 01 23" },
  { id: 4, name: "Oripov Farrux", school: "1-sonli maktab", class: "8-D", days: 5, statusUz: "Yuqori xavf", statusRu: "Высокий риск", phone: "+998 94 321 09 87" }
];

const initialRisks = [
  { id: 1, name: "Tursunov Sanjar", school: "4-sonli maktab", class: "10-C", gpa: 2.8, weakUz: "Matematika, Fizika", weakRu: "Математика, Физика" },
  { id: 2, name: "Karimova Madina", school: "2-sonli maktab", class: "11-A", gpa: 3.1, weakUz: "Ingliz tili, Tarix", weakRu: "Английский, История" },
  { id: 3, name: "Sodiqova Nargiza", school: "5-sonli maktab", class: "9-A", gpa: 2.9, weakUz: "Kimyo, Biologiya", weakRu: "Химия, Биология" },
  { id: 4, name: "Rasulov Jasur", school: "1-sonli maktab", class: "11-B", gpa: 3.0, weakUz: "Matematika, Ingliz tili", weakRu: "Математика, Английский" }
];

const attendanceTrend = [
  { name: "Dush", uz: "Du", ru: "Пн", rate: 95.1 },
  { name: "Sesh", uz: "Se", ru: "Вт", rate: 94.8 },
  { name: "Chor", uz: "Ch", ru: "Ср", rate: 93.6 },
  { name: "Pay", uz: "Pa", ru: "Чт", rate: 92.1 },
  { name: "Jum", uz: "Ju", ru: "Пт", rate: 94.2 },
  { name: "Shan", uz: "Sha", ru: "Сб", rate: 95.0 }
];

const schoolPerformance = [
  { name: "1-maktab", uz: "1-maktab", ru: "Школа №1", gpa: 4.1 },
  { name: "2-maktab", uz: "2-maktab", ru: "Школа №2", gpa: 3.8 },
  { name: "4-maktab", uz: "4-maktab", ru: "Школа №4", gpa: 3.5 },
  { name: "5-maktab", uz: "5-maktab", ru: "Школа №5", gpa: 4.2 }
];

export default function KundalikDashboard() {
  const { lang } = useI18n();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [risks, setRisks] = useState(initialRisks);

  useEffect(() => {
    setLastSync(lang === "uz" ? "2 daqiqa oldin" : "2 минуты назад");
  }, [lang]);

  const handleSync = () => {
    setSyncing(true);
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    const runSync = async () => {
      try {
        toast.info(lang === 'uz' ? "Kundalik.com API xavfsiz shlyuziga ulanmoqda..." : "Подключение к защищенному шлюзу Kundalik.com API...");
        await delay(1000);
        toast.info(lang === 'uz' ? "Sirdaryo viloyati maktablari ma'lumotlar bazasi sinxronlashtirilmoqda..." : "Синхронизация базы данных школ Сырдарьинской области...");
        await delay(1200);
        toast.info(lang === 'uz' ? "Maktab davomatida anomal pasayishlar (3 kundan ortiq) tahlil qilinmoqda..." : "Анализ аномальных пропусков занятий (более 3 дней)...");
        await delay(1000);
        
        setLastSync(lang === "uz" ? "hoziroq" : "только что");
        setSyncing(false);
        toast.success(lang === 'uz' ? "Sinxronizatsiya muvaffaqiyatli yakunlandi! 182 nafar o'quvchi ma'lumotlari yangilandi." : "Синхронизация успешно завершена! Обновлены данные 182 учащихся.");
      } catch (err) {
        setSyncing(false);
        toast.error(lang === 'uz' ? "Sinxronizatsiya vaqtida xatolik yuz berdi" : "Произошла ошибка при синхронизации");
      }
    };
    runSync();
  };

  const handleAction = (studentName: string, type: "call" | "visit" | "mentor") => {
    let msg = "";
    if (type === "call") {
      msg = lang === "uz" ? `Ota-onalarga qo'ng'iroq qilindi (${studentName})` : `Выполнен звонок родителям (${studentName})`;
    } else if (type === "visit") {
      msg = lang === "uz" ? `Uyga borib o'rganish tashrifi rejalashtirildi (${studentName})` : `Запланирован визит на дом для выяснения причин (${studentName})`;
    } else {
      msg = lang === "uz" ? `Mahalla yetakchisi mentor sifatida biriktirildi (${studentName})` : `Молодежный лидер назначен ментором (${studentName})`;
    }
    toast.success(msg);
  };

  // Filter alerts & risks based on search term
  const filteredAlerts = alerts.filter(
    (a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.school.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredRisks = risks.filter(
    (r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Sync Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {lang === "uz" ? "Kundalik.com Tahlil Platformasi" : "Аналитическая платформа Kundalik.com"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === "uz"
              ? `Ta'lim muassasalaridagi davomat va o'zlashtirish ko'rsatkichlarini real vaqtda tahlil qilish.`
              : "Анализ успеваемости и посещаемости в образовательных учреждениях в реальном времени."}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-foreground/40 hidden md:inline">
            {lang === "uz" ? "Oxirgi yangilanish:" : "Последнее обновление:"} <strong className="text-foreground/70">{lastSync}</strong>
          </span>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            {syncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {lang === "uz" ? "Kundalik.com sinxronizatsiyasi" : "Синхронизация с Kundalik.com"}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder={lang === "uz" ? "O'quvchi ismi yoki maktab..." : "Имя ученика или школа..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-card-border rounded-xl text-sm text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary transition-all"
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: lang === "uz" ? "Mahalladagi o'quvchilar" : "Учащиеся в махалле",
            value: "182",
            desc: lang === "uz" ? "Kundalik.com ulangan" : "Подключено к Kundalik.com",
            icon: Users,
            color: "text-primary bg-primary/10 border-primary/20"
          },
          {
            title: lang === "uz" ? "Dars qoldirish ogohlantirishlari" : "Предупреждения о прогулах",
            value: alerts.length.toString(),
            desc: lang === "uz" ? "Ketma-ket 3+ kun qoldirgan" : "Пропущено 3+ дня подряд",
            icon: AlertTriangle,
            color: "text-danger bg-danger/10 border-danger/20 glow-danger"
          },
          {
            title: lang === "uz" ? "Ta'limiy xavf ostida" : "В группе риска (Успеваемость)",
            value: risks.length.toString(),
            desc: lang === "uz" ? "O'rtacha ball (GPA) < 3.2" : "Средний балл (GPA) < 3.2",
            icon: GraduationCap,
            color: "text-warning bg-warning/10 border-warning/20"
          },
          {
            title: lang === "uz" ? "Bugungi davomat ko'rsatkichi" : "Посещаемость сегодня",
            value: "94.2%",
            desc: lang === "uz" ? "Toshkent va Sirdaryo maktablari" : "Школы Ташкента и Сырдарьи",
            icon: CheckCircle,
            color: "text-safe bg-safe/10 border-safe/20"
          }
        ].map((card, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-card border flex items-center justify-between shadow-lg ${card.color}`}>
            <div className="space-y-1">
              <span className="text-xs font-medium text-foreground/60">{card.title}</span>
              <div className="text-3xl font-black text-foreground">{card.value}</div>
              <span className="text-[10px] text-foreground/50 block">{card.desc}</span>
            </div>
            <div className="p-3 bg-background rounded-xl border border-card-border">
              <card.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance trend area chart */}
        <div className="p-6 rounded-2xl bg-card border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {lang === "uz" ? "Haftalik davomat tendensiyasi (%)" : "Еженедельный тренд посещаемости (%)"}
            </h2>
            <span className="text-xs text-primary font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {lang === "uz" ? "Tizimli tahlil" : "Системный анализ"}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={lang === "uz" ? "uz" : "ru"} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <YAxis domain={[85, 100]} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131a2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="rate" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#attendanceColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPA bar chart */}
        <div className="p-6 rounded-2xl bg-card border border-card-border shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {lang === "uz" ? "Maktablar kesimida o'rtacha ball (GPA)" : "Средний балл (GPA) в разрезе школ"}
            </h2>
            <span className="text-xs text-warning font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> {lang === "uz" ? "IT va Davlat reytingi" : "IT и Гос. рейтинг"}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={lang === "uz" ? "uz" : "ru"} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <YAxis domain={[0, 5]} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#131a2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
                />
                <Bar dataKey="gpa" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CRITICAL ABSENCE ALERTS (3+ days) */}
      <div className="p-6 rounded-2xl bg-card border border-card-border shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-danger animate-pulse" />
          <h2 className="text-xl font-bold text-foreground">
            {lang === "uz" ? "Dars qoldirish bo'yicha favqulodda ogohlantirishlar (3+ kun)" : "Критические предупреждения о пропусках (3+ дней)"}
          </h2>
        </div>
        <p className="text-xs text-foreground/50">
          {lang === "uz"
            ? "Ushbu yoshlar ketma-ket 3 kundan ortiq maktabga kelmagan. Yoshlar yetakchisi va mahalla noziri zudlik bilan sababini aniqlashi shart."
            : "Эти учащиеся отсутствовали в школе более 3 дней подряд. Лидер молодежи и инспектор махалли обязаны оперативно выяснить причину."}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border text-foreground/50 text-xs font-bold uppercase">
                <th className="py-3 px-4">{lang === "uz" ? "O'quvchi" : "Ученик"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "Maktab va Sinf" : "Школа и Класс"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "Prospusk (kun)" : "Пропуски (дней)"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "Holati" : "Статус"}</th>
                <th className="py-3 px-4 text-right">{lang === "uz" ? "Tezkor choralar" : "Быстрые меры"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-foreground/80">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-foreground/40 text-xs">
                    {lang === "uz" ? "Ogohlantirishlar mavjud emas" : "Нет активных предупреждений"}
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-background/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-foreground">{alert.name}</td>
                    <td className="py-4 px-4">{alert.school} ({alert.class})</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger text-xs font-black border border-danger/20">
                        {alert.days} {lang === "uz" ? "kun" : "дней"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-warning/80 font-medium">{lang === "uz" ? alert.statusUz : alert.statusRu}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAction(alert.name, "call")}
                          className="p-2 bg-background border border-card-border hover:border-primary rounded-lg text-foreground/60 hover:text-primary transition-all"
                          title={lang === "uz" ? "Ota-onasiga qo'ng'iroq" : "Звонок родителям"}
                        >
                          <PhoneCall className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(alert.name, "visit")}
                          className="p-2 bg-background border border-card-border hover:border-primary rounded-lg text-foreground/60 hover:text-primary transition-all"
                          title={lang === "uz" ? "Uyiga borib o'rganish" : "Визит на дом"}
                        >
                          <Home className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(alert.name, "mentor")}
                          className="p-2 bg-background border border-card-border hover:border-primary rounded-lg text-foreground/60 hover:text-primary transition-all"
                          title={lang === "uz" ? "Mentor biriktirish" : "Назначить ментора"}
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACADEMIC PERFORMANCE RISKS */}
      <div className="p-6 rounded-2xl bg-card border border-card-border shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-warning" />
          <h2 className="text-xl font-bold text-foreground">
            {lang === "uz" ? "Ta'lim o'zlashtirishi past o'quvchilar (GPA < 3.2)" : "Учащиеся с низкой успеваемостью (GPA < 3.2)"}
          </h2>
        </div>
        <p className="text-xs text-foreground/50">
          {lang === "uz"
            ? "O'quv rejasini o'zlashtirishda qiynalayotgan yoshlar. Mahalla IT markazlariga yoki bepul to'garaklarga yo'naltirish tavsiya etiladi."
            : "Молодежь, испытывающая трудности в учебе. Рекомендуется направить в бесплатные кружки или IT-центры махалли."}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-card-border text-foreground/50 text-xs font-bold uppercase">
                <th className="py-3 px-4">{lang === "uz" ? "O'quvchi" : "Ученик"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "Maktab va Sinf" : "Школа и Класс"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "O'rtacha Ball (GPA)" : "Средний Балл (GPA)"}</th>
                <th className="py-3 px-4">{lang === "uz" ? "O'zlashtirishi qiyin fanlar" : "Слабые предметы"}</th>
                <th className="py-3 px-4 text-right">{lang === "uz" ? "Tavsiya etilgan chora" : "Рекомендуемая мера"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-foreground/80">
              {filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-foreground/40 text-xs">
                    {lang === "uz" ? "O'quvchilar ro'yxati bo'sh" : "Список пуст"}
                  </td>
                </tr>
              ) : (
                filteredRisks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-background/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-foreground">{risk.name}</td>
                    <td className="py-4 px-4">{risk.school} ({risk.class})</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/20">
                        {risk.gpa} / 5.0
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-foreground/75">
                      {lang === "uz" ? risk.weakUz : risk.weakRu}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => toast.info(lang === "uz" ? `Bepul to'garakka yo'naltirish xati yuborildi (${risk.name})` : `Отправлено направление на бесплатные курсы (${risk.name})`)}
                        className="px-3 py-1.5 bg-background border border-card-border hover:border-primary text-xs font-semibold rounded-lg text-foreground hover:text-primary transition-all flex items-center gap-1.5 ml-auto"
                      >
                        {lang === "uz" ? "Kurslarga yo'naltirish" : "Направить на курсы"}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
