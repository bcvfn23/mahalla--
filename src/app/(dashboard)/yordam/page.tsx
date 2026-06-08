"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { HeartHandshake, Plus, X, CheckCircle, Clock } from "lucide-react";

export default function YordamPage() {
  const { lang } = useI18n();
  const [people, setPeople] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ fullName: "", notebookType: "temir", helpType: "" });

  useEffect(() => {
    const data = localStorage.getItem("yordamList");
    if (data) {
      setPeople(JSON.parse(data));
    } else {
      const initial = [
        { id: 1, fullName: "Rahimova Oydin", notebookType: "ayol", helpType: "Moddiy yordam", status: "kutmoqda" },
        { id: 2, fullName: "Tursunov Azamat", notebookType: "yoshlar", helpType: "O'quv kursi to'lovi", status: "hal_etildi" },
      ];
      setPeople(initial);
      localStorage.setItem("yordamList", JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerson.fullName || !newPerson.helpType) return;

    const person = {
      id: Date.now(),
      fullName: newPerson.fullName,
      notebookType: newPerson.notebookType,
      helpType: newPerson.helpType,
      status: "kutmoqda"
    };

    const updated = [person, ...people];
    setPeople(updated);
    localStorage.setItem("yordamList", JSON.stringify(updated));
    setNewPerson({ fullName: "", notebookType: "temir", helpType: "" });
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: number) => {
    const updated = people.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === 'kutmoqda' ? 'hal_etildi' : 'kutmoqda' };
      }
      return p;
    });
    setPeople(updated);
    localStorage.setItem("yordamList", JSON.stringify(updated));
  };

  const getNotebookName = (type: string) => {
    if (type === 'temir') return lang === 'uz' ? "Temir daftar" : "Железная тетрадь";
    if (type === 'ayol') return lang === 'uz' ? "Ayollar daftari" : "Женская тетрадь";
    if (type === 'yoshlar') return lang === 'uz' ? "Yoshlar daftari" : "Молодежная тетрадь";
    return type;
  };

  const kutmoqdaCount = people.filter(p => p.status === 'kutmoqda').length;
  const halCount = people.filter(p => p.status === 'hal_etildi').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            Mahalla Raisi Paneli
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Ijtimoiy Yordam (Daftarlar)" : "Соц. Помощь (Тетради)"}
          </h1>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-safe text-white rounded-lg hover:bg-safe/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          <Plus className="w-4 h-4" />
          {lang === 'uz' ? "Ro'yxatga kiritish" : "Добавить в список"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-warning">
          <div className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">{lang === 'uz' ? "Yordam kutmoqda" : "Ожидают помощи"}</div>
          <div className="text-3xl font-black text-foreground">{kutmoqdaCount}</div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-safe">
          <div className="text-sm text-foreground/50 font-bold mb-2 uppercase tracking-wider">{lang === 'uz' ? "Yordam ko'rsatildi" : "Помощь оказана"}</div>
          <div className="text-3xl font-black text-foreground">{halCount}</div>
        </div>
      </div>

      {people.length === 0 ? (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 border border-card-border shadow-lg">
            <HeartHandshake className="w-8 h-8 text-safe/50" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {lang === 'uz' ? "Yordam ko'rsatish ro'yxati bo'sh" : "Список для оказания помощи пуст"}
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
                  <th className="p-4 font-bold">{lang === 'uz' ? "Daftar turi" : "Тип тетради"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Yordam turi" : "Вид помощи"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Status" : "Статус"}</th>
                  <th className="p-4 font-bold">{lang === 'uz' ? "Amal" : "Действие"}</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-card-border/50">
                {people.map((item, index) => (
                  <tr key={item.id} className="hover:bg-card/30 transition-colors">
                    <td className="p-4 text-foreground/50">{index + 1}</td>
                    <td className="p-4 font-bold text-foreground">{item.fullName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider
                        ${item.notebookType === 'temir' ? 'bg-danger/10 text-danger border border-danger/20' : 
                          item.notebookType === 'ayol' ? 'bg-primary/10 text-primary border border-primary/20' : 
                          'bg-warning/10 text-warning border border-warning/20'}`}
                      >
                        {getNotebookName(item.notebookType)}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/70">{item.helpType}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${item.status === 'hal_etildi' ? 'text-safe' : 'text-warning'}`}>
                        {item.status === 'hal_etildi' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {item.status === 'hal_etildi' ? (lang === 'uz' ? "Hal etildi" : "Помощь оказана") : (lang === 'uz' ? "Kutmoqda" : "Ожидает")}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                          item.status === 'kutmoqda' 
                            ? 'bg-safe/10 text-safe border-safe/20 hover:bg-safe/20' 
                            : 'bg-card text-foreground/50 border-card-border hover:text-foreground'
                        }`}
                      >
                        {item.status === 'kutmoqda' ? (lang === 'uz' ? "Bajarildi" : "Отметить оказанной") : (lang === 'uz' ? "Bekor qilish" : "Отменить")}
                      </button>
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
                <Plus className="w-5 h-5 text-safe" />
                {lang === 'uz' ? "Ro'yxatga kiritish" : "Добавление в список"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "F.I.O" : "Ф.И.О Гражданина"}</label>
                <input required type="text" value={newPerson.fullName} onChange={(e) => setNewPerson({...newPerson, fullName: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-safe/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Daftar turi" : "Тип тетради"}</label>
                <select value={newPerson.notebookType} onChange={(e) => setNewPerson({...newPerson, notebookType: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-safe/50 transition-colors appearance-none">
                  <option value="temir">{lang === 'uz' ? "Temir daftar" : "Железная тетрадь"}</option>
                  <option value="ayol">{lang === 'uz' ? "Ayollar daftari" : "Женская тетрадь"}</option>
                  <option value="yoshlar">{lang === 'uz' ? "Yoshlar daftari" : "Молодежная тетрадь"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Kerakli yordam" : "Какая помощь нужна?"}</label>
                <input required type="text" value={newPerson.helpType} onChange={(e) => setNewPerson({...newPerson, helpType: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-safe/50 transition-colors" placeholder={lang === 'uz' ? "Masalan: Moddiy yordam" : "Например: Выплата субсидии"} />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 bg-card border border-card-border text-foreground rounded-xl hover:bg-card-border transition-colors text-sm font-bold">
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button type="submit" className="px-6 py-3 bg-safe text-white rounded-xl hover:bg-safe/90 transition-all text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
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
