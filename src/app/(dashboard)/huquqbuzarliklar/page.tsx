"use client";

import { useI18n } from "@/lib/i18n";
import { AlertTriangle, Plus, FileText, Search, Filter, ShieldAlert, CheckCircle, Clock, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Incident {
  id: string | number;
  name: string;
  typeUz: string;
  typeRu: string;
  date: string;
  locationUz: string;
  locationRu: string;
  status: string;
  severity: string;
}

const initialIncidents: Incident[] = [
  { id: 1, name: "Aliyev Vali", typeUz: "Mayda bezorilik", typeRu: "Мелкое хулиганство", date: "2024-05-18 21:45", locationUz: "Guliston sh., Navoiy ko'chasi", locationRu: "г. Гулистан, ул. Навои", status: "jarayonda", severity: "medium" },
  { id: 2, name: "Noma'lum", typeUz: "O'g'rilik (Avtomashina)", typeRu: "Кража (Автомобиль)", date: "2024-05-17 03:20", locationUz: "Sirdaryo t., 2-mikrorayon", locationRu: "Сырдарьинский р., 2-й микрорайон", status: "ochiq", severity: "high" },
  { id: 3, name: "Karimov Jasur", typeUz: "Jamoat tartibini buzish", typeRu: "Нарушение общественного порядка", date: "2024-05-16 19:10", locationUz: "Sayxunobod t., Markaziy bozor", locationRu: "Сайхунабадский р., Центральный рынок", status: "yopilgan", severity: "low" },
  { id: 4, name: "Rustamov Doston", typeUz: "Yo'l harakati qoidabuzarligi", typeRu: "Нарушение ПДД", date: "2024-05-15 14:30", locationUz: "Oqoltin t., Toshkent yo'li", locationRu: "Акалтынский р., Ташкентский тракт", status: "yopilgan", severity: "low" },
];

export default function HuquqbuzarliklarPage() {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({ name: "", type: "", location: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [viewIncident, setViewIncident] = useState<any>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("/api/incidents");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            setIncidents(data.items);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch incidents, falling back to localStorage", err);
      }
      
      const localData = localStorage.getItem("incidentsList");
      if (localData) {
        setIncidents(JSON.parse(localData));
      } else {
        setIncidents(initialIncidents);
        localStorage.setItem("incidentsList", JSON.stringify(initialIncidents));
      }
    };
    fetchIncidents();
  }, []);


  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.name.toLowerCase().includes(search.toLowerCase()) || 
                          (lang === 'uz' ? inc.typeUz : inc.typeRu).toLowerCase().includes(search.toLowerCase()) ||
                          (lang === 'uz' ? inc.locationUz : inc.locationRu).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.name || !newRecord.type || !newRecord.location) return;

    const bodyPayload = {
      name: newRecord.name,
      typeUz: newRecord.type,
      typeRu: newRecord.type,
      locationUz: newRecord.location,
      locationRu: newRecord.location,
      status: "ochiq",
      severity: "medium"
    };

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.item) {
          const updatedIncidents = [data.item, ...incidents];
          setIncidents(updatedIncidents);
          localStorage.setItem("incidentsList", JSON.stringify(updatedIncidents));
          setNewRecord({ name: "", type: "", location: "" });
          setIsModalOpen(false);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to save incident to server", err);
    }

    // Local-only fallback
    const fallbackInc = {
      id: Date.now().toString(),
      name: newRecord.name,
      typeUz: newRecord.type,
      typeRu: newRecord.type,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      locationUz: newRecord.location,
      locationRu: newRecord.location,
      status: "ochiq",
      severity: "medium"
    };
    const updatedIncidents = [fallbackInc, ...incidents];
    setIncidents(updatedIncidents);
    localStorage.setItem("incidentsList", JSON.stringify(updatedIncidents));
    setNewRecord({ name: "", type: "", location: "" });
    setIsModalOpen(false);
  };


  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    try {
      const res = await fetch(`/api/incidents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
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

    const updated = incidents.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc);
    setIncidents(updated);
    localStorage.setItem("incidentsList", JSON.stringify(updated));
    setViewIncident(null);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm(lang === 'uz' ? "Rostdan ham o'chirmoqchimisiz?" : "Вы действительно хотите удалить?")) {
      try {
        const res = await fetch(`/api/incidents/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Deleted successfully on server
          }
        }
      } catch (err) {
        console.error("Failed to delete incident on server", err);
      }

      const updated = incidents.filter(inc => inc.id !== id);
      setIncidents(updated);
      localStorage.setItem("incidentsList", JSON.stringify(updated));
      setViewIncident(null);
    }
  };


  return (
    <div className="space-y-6">
      {/* View Details Modal */}
      {viewIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-card-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-card-border/50">
              <h3 className="text-lg font-bold text-foreground">
                {lang === 'uz' ? "Qayd tafsilotlari" : "Детали записи"}
              </h3>
              <button onClick={() => setViewIncident(null)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b border-card-border/50 pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {viewIncident.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-foreground">{viewIncident.name}</h4>
                  <p className="text-sm text-foreground/50">{lang === 'uz' ? viewIncident.typeUz : viewIncident.typeRu}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-foreground/50 text-xs mb-1 uppercase">{lang === 'uz' ? "Sana & Vaqt" : "Дата & Время"}</p>
                  <p className="font-medium text-foreground">{viewIncident.date}</p>
                </div>
                <div>
                  <p className="text-foreground/50 text-xs mb-1 uppercase">{lang === 'uz' ? "Status" : "Статус"}</p>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${viewIncident.status === 'ochiq' ? 'bg-danger/20 text-danger border border-danger/30' : 
                        viewIncident.status === 'jarayonda' ? 'bg-warning/20 text-warning border border-warning/30' : 
                        'bg-safe/20 text-safe border border-safe/30'}
                    `}>
                      {lang === 'uz' ? viewIncident.status : (viewIncident.status === 'ochiq' ? 'ОТКРЫТО' : viewIncident.status === 'jarayonda' ? 'В ПРОЦЕССЕ' : 'ЗАКРЫТО')}
                    </span>
                </div>
                <div className="col-span-2">
                  <p className="text-foreground/50 text-xs mb-1 uppercase">{lang === 'uz' ? "Joylashuv" : "Локация"}</p>
                  <p className="font-medium text-foreground">{lang === 'uz' ? viewIncident.locationUz : viewIncident.locationRu}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-card/30 border-t border-card-border/50 flex justify-between items-center">
              <button 
                onClick={() => handleDelete(viewIncident.id)} 
                className="px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors text-sm font-medium"
              >
                {lang === 'uz' ? "O'chirish" : "Удалить"}
              </button>
              
              <div className="flex gap-2">
                {viewIncident.status !== 'yopilgan' && (
                  <button 
                    onClick={() => handleUpdateStatus(viewIncident.id, 'yopilgan')} 
                    className="px-4 py-2 bg-safe/20 text-safe hover:bg-safe/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    {lang === 'uz' ? "Yopish (Bajarildi)" : "Закрыть дело"}
                  </button>
                )}
                <button onClick={() => setViewIncident(null)} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  {lang === 'uz' ? "Qaytish" : "Назад"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-card-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-card-border/50">
              <h3 className="text-lg font-bold text-foreground">
                {lang === 'uz' ? "Yangi qayd qo'shish" : "Добавить запись"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase mb-1">
                  {lang === 'uz' ? "F.I.SH / Gumondor" : "Ф.И.О / Подозреваемый"}
                </label>
                <input 
                  type="text" 
                  value={newRecord.name}
                  onChange={e => setNewRecord({...newRecord, name: e.target.value})}
                  className="w-full bg-card border border-card-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary/50 outline-none focus:outline-none transition-colors"
                  placeholder={lang === 'uz' ? "Masalan: Aliyev Vali yoki Noma'lum" : "Например: Алиев Вали или Неизвестно"}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase mb-1">
                  {lang === 'uz' ? "Qoidabuzarlik turi" : "Тип правонарушения"}
                </label>
                <input 
                  type="text" 
                  value={newRecord.type}
                  onChange={e => setNewRecord({...newRecord, type: e.target.value})}
                  className="w-full bg-card border border-card-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary/50 outline-none focus:outline-none transition-colors"
                  placeholder={lang === 'uz' ? "Masalan: O'g'rilik" : "Например: Кража"}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 uppercase mb-1">
                  {lang === 'uz' ? "Joylashuv / Manzil" : "Локация / Адрес"}
                </label>
                <input 
                  type="text" 
                  value={newRecord.location}
                  onChange={e => setNewRecord({...newRecord, location: e.target.value})}
                  className="w-full bg-card border border-card-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary/50 outline-none focus:outline-none transition-colors"
                  placeholder="Guliston sh., ..."
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg border border-card-border hover:bg-card transition-colors text-sm font-medium">
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  {lang === 'uz' ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            {lang === 'uz' ? "Uchastkavoy Paneli" : "Панель Участкового"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-danger" />
            {lang === 'uz' ? "Huquqbuzarliklar Jurnali" : "Журнал Правонарушений"}
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-danger text-white rounded-xl hover:bg-danger/90 transition-all text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        >
          <Plus className="w-4 h-4" />
          {lang === 'uz' ? "Yangi qayd qo'shish" : "Добавить запись"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-card-border/50 flex items-center gap-4">
          <div className="p-3 bg-danger/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <div>
            <p className="text-xs text-foreground/50 uppercase font-bold">{lang === 'uz' ? "Jami Qaydlar" : "Всего записей"}</p>
            <p className="text-2xl font-bold text-foreground">{incidents.length + 120}</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-card-border/50 flex items-center gap-4">
          <div className="p-3 bg-warning/10 rounded-lg">
            <Clock className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-xs text-foreground/50 uppercase font-bold">{lang === 'uz' ? "Jarayonda" : "В процессе"}</p>
            <p className="text-2xl font-bold text-foreground">18</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-card-border/50 flex items-center gap-4">
          <div className="p-3 bg-safe/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-safe" />
          </div>
          <div>
            <p className="text-xs text-foreground/50 uppercase font-bold">{lang === 'uz' ? "Yopilgan ishlar" : "Закрытые дела"}</p>
            <p className="text-2xl font-bold text-foreground">106</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-card-border/50 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-card-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input 
              type="text" 
              placeholder={lang === 'uz' ? "Ism, holat yoki manzil bo'yicha qidiruv..." : "Поиск по имени, делу или адресу..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-card-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-card border border-card-border rounded-lg text-sm text-foreground hover:bg-card/80 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {lang === 'uz' ? "Filtrlash" : "Фильтр"}
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-card-border rounded-xl shadow-xl z-10 overflow-hidden">
                {['all', 'ochiq', 'jarayonda', 'yopilgan'].map(status => (
                  <button 
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilterMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-background/50 ${statusFilter === status ? 'text-primary font-bold' : 'text-foreground'}`}
                  >
                    {status === 'all' ? (lang === 'uz' ? "Barchasi" : "Все") : 
                     status === 'ochiq' ? (lang === 'uz' ? "Ochiq" : "Открыто") : 
                     status === 'jarayonda' ? (lang === 'uz' ? "Jarayonda" : "В процессе") : 
                     (lang === 'uz' ? "Yopilgan" : "Закрыто")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 bg-card-border/10">
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">#</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">{lang === 'uz' ? "F.I.SH / Holat" : "Ф.И.О / Дело"}</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">{lang === 'uz' ? "Joylashuv" : "Локация"}</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">{lang === 'uz' ? "Sana & Vaqt" : "Дата & Время"}</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider">{lang === 'uz' ? "Status" : "Статус"}</th>
                <th className="p-4 text-xs font-bold text-foreground/50 uppercase tracking-wider text-right">{lang === 'uz' ? "Harakat" : "Действие"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/30">
              {filteredIncidents.length > 0 ? filteredIncidents.map((inc, i) => (
                <tr key={inc.id} className="hover:bg-card/30 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground/70">{(i + 1).toString().padStart(3, '0')}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-foreground">{inc.name === "Noma'lum" ? (lang === 'uz' ? "Noma'lum" : "Неизвестно") : inc.name}</p>
                    <p className="text-xs text-foreground/50">{lang === 'uz' ? inc.typeUz : inc.typeRu}</p>
                  </td>
                  <td className="p-4 text-sm text-foreground/70">{lang === 'uz' ? inc.locationUz : inc.locationRu}</td>
                  <td className="p-4 text-sm text-foreground/70">{inc.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${inc.status === 'ochiq' ? 'bg-danger/20 text-danger border border-danger/30' : 
                        inc.status === 'jarayonda' ? 'bg-warning/20 text-warning border border-warning/30' : 
                        'bg-safe/20 text-safe border border-safe/30'}
                    `}>
                      {lang === 'uz' ? inc.status : (inc.status === 'ochiq' ? 'ОТКРЫТО' : inc.status === 'jarayonda' ? 'В ПРОЦЕССЕ' : 'ЗАКРЫТО')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setViewIncident(inc)} className="px-3 py-1.5 bg-card border border-card-border rounded-lg text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors">
                      {lang === 'uz' ? "Ko'rish" : "Смотреть"}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-foreground/50">
                    {lang === 'uz' ? "Ma'lumot topilmadi" : "Данные не найдены"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
