"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { Briefcase, Plus, X, GraduationCap, CheckCircle } from "lucide-react";

export default function BandlikPage() {
  const { lang } = useI18n();
  const [people, setPeople] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ fullName: "", profession: "" });

  useEffect(() => {
    const data = localStorage.getItem("bandlikList");
    if (data) {
      setPeople(JSON.parse(data));
    } else {
      const initial = [
        { id: 1, fullName: "Umarov Jasur", profession: "Dasturchi", status: "ishsiz" },
        { id: 2, fullName: "Nazarova Madina", profession: "Tikuvchi", status: "band" },
      ];
      setPeople(initial);
      localStorage.setItem("bandlikList", JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.fullName || !newPerson.profession) return;

    const person = {
      id: Date.now(),
      fullName: newPerson.fullName,
      profession: newPerson.profession,
      status: "ishsiz"
    };

    const updated = [person, ...people];
    setPeople(updated);
    localStorage.setItem("bandlikList", JSON.stringify(updated));
    setNewPerson({ fullName: "", profession: "" });
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    const updated = people.map(p => p.id === id ? { ...p, status } : p);
    setPeople(updated);
    localStorage.setItem("bandlikList", JSON.stringify(updated));
  };

  const ishsizCount = people.filter(p => p.status === 'ishsiz').length;
  const bandCount = people.filter(p => p.status === 'band').length;
  const oqishdaCount = people.filter(p => p.status === "o'qishda").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            Yoshlar Yetakchisi Paneli
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Yoshlar Bandligi" : "Трудоустройство молодежи"}
          </h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-4 h-4" />
          {lang === 'uz' ? "Yoshlarni qo'shish" : "Добавить молодежь"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-danger">
          <div className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">{lang === 'uz' ? "Ishsiz yoshlar" : "Безработные"}</div>
          <div className="text-3xl font-black text-foreground">{ishsizCount}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-safe">
          <div className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">{lang === 'uz' ? "Band qilinganlar" : "Трудоустроенные"}</div>
          <div className="text-3xl font-black text-foreground">{bandCount}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-warning">
          <div className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">{lang === 'uz' ? "O'qishga jalb qilinganlar" : "Отправлены на учебу"}</div>
          <div className="text-3xl font-black text-foreground">{oqishdaCount}</div>
        </div>
      </div>

      {people.length === 0 ? (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 border border-card-border shadow-lg">
            <Briefcase className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {lang === 'uz' ? "Ishsiz yoshlar jadvali bo'sh" : "Таблица безработной молодежи пуста"}
          </h3>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-card-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-card/50 text-[10px] uppercase tracking-wider text-foreground/50 border-b border-card-border">
                  <th className="p-4 font-bold">#</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "F.I.O" : "Ф.И.О"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Mutaxassisligi/Qiziqishi" : "Специальность/Интересы"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Status" : "Статус"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Amallar" : "Действия"}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-card-border/50">
                {people.map((item, index) => (
                  <tr key={item.id} className="hover:bg-card/30 transition-colors">
                    <td className="p-4 text-foreground/50">{index + 1}</td>
                    <td className="p-4 font-bold text-foreground">{item.fullName}</td>
                    <td className="p-4 text-foreground/70">{item.profession}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                        ${item.status === 'ishsiz' ? 'bg-danger/10 text-danger border border-danger/20' : 
                          item.status === 'band' ? 'bg-safe/10 text-safe border border-safe/20' : 
                          'bg-warning/10 text-warning border border-warning/20'}`}
                      >
                        {item.status === 'ishsiz' ? (lang === 'uz' ? "Ishsiz" : "Безработный") : 
                         item.status === 'band' ? (lang === 'uz' ? "Ishga joylashtirildi" : "Трудоустроен") : 
                         (lang === 'uz' ? "O'qishga yuborildi" : "Учится")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {item.status !== 'band' && (
                          <button onClick={() => handleUpdateStatus(item.id, 'band')} title={lang === 'uz' ? "Ishga joylash" : "Трудоустроить"} className="p-1.5 text-safe bg-safe/10 hover:bg-safe/20 rounded-md transition-colors border border-safe/20">
                            <Briefcase className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== "o'qishda" && (
                          <button onClick={() => handleUpdateStatus(item.id, "o'qishda")} title={lang === 'uz' ? "O'qishga yuborish" : "Отправить на учебу"} className="p-1.5 text-warning bg-warning/10 hover:bg-warning/20 rounded-md transition-colors border border-warning/20">
                            <GraduationCap className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== 'ishsiz' && (
                          <button onClick={() => handleUpdateStatus(item.id, 'ishsiz')} title={lang === 'uz' ? "Ishsiz sifatida belgilash" : "Отметить как безработного"} className="p-1.5 text-danger bg-danger/10 hover:bg-danger/20 rounded-md transition-colors border border-danger/20">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-card/30 border-b border-card-border/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {lang === 'uz' ? "Ro'yxatga olish" : "Регистрация безработного"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "F.I.O" : "Ф.И.О Гражданина"}</label>
                <input required type="text" value={newPerson.fullName} onChange={(e) => setNewPerson({...newPerson, fullName: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Mutaxassisligi yoki Qiziqishi" : "Специальность или Интересы"}</label>
                <input required type="text" value={newPerson.profession} onChange={(e) => setNewPerson({...newPerson, profession: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 bg-card border border-card-border text-foreground rounded-xl hover:bg-card-border transition-colors text-sm font-bold">
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {lang === 'uz' ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
