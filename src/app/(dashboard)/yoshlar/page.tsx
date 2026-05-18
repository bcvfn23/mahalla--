"use client";

import { useI18n } from "@/lib/i18n";
import { Search, Filter, Download, FileText, Database, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function YoshlarPage() {
  const { t, lang } = useI18n();
  const [youthList, setYouthList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadYouth = () => {
    const data = localStorage.getItem("youthList");
    if (data) {
      setYouthList(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadYouth();
    window.addEventListener("youthAdded", loadYouth);
    return () => window.removeEventListener("youthAdded", loadYouth);
  }, []);

  const filteredList = youthList.filter(y =>
    y.ism.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.familiya.toLowerCase().includes(searchTerm.toLowerCase()) ||
    y.jshshir.includes(searchTerm) ||
    y.pasport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">YAGONA MARKAZIY BAZA</h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Yoshlar ro'yxati" : "Список молодежи"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === 'uz' ? `Jami ${youthList.length} ta yoshlar topildi` : `Всего найдено ${youthList.length} молодых людей`}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-full text-warning text-xs font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]">
          <Database className="w-3 h-3" />
          <span>Live DB Syncing</span>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'uz' ? "Ism, maktab yoki ID bo'yicha qidirish..." : "Поиск по имени, школе или ID..."}
              className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <select className="bg-background border border-card-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none">
              <option>{lang === 'uz' ? "Barcha darajalar" : "Все уровни"}</option>
              <option>{lang === 'uz' ? "Yuqori xavf" : "Высокий риск"}</option>
              <option>{lang === 'uz' ? "O'rta xavf" : "Средний риск"}</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-safe/10 text-safe border border-safe/20 rounded-xl hover:bg-safe/20 transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              Eksport
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-card-border rounded-xl hover:bg-card/80 transition-all text-sm font-medium">
              <FileText className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        {filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-t border-card-border border-dashed">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-4 border border-card-border shadow-lg">
              <Search className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {lang === 'uz' ? "Natija topilmadi" : "Результаты не найдены"}
            </h3>
            <p className="text-sm text-foreground/50 max-w-sm">
              {lang === 'uz' ? "Qidiruv so'zini o'zgartiring yoki filterni tozalang." : "Измените поисковой запрос или очистите фильтры."}
            </p>
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
                </tr>
              </thead>
              <tbody>
                {filteredList.map((y) => (
                  <tr key={y.id} className="border-b border-card-border/50 hover:bg-card/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {y.ism.charAt(0)}{y.familiya.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{y.ism} {y.familiya}</div>
                          <div className="text-xs text-foreground/60">{y.maktab}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-foreground">{y.pasport}</div>
                      <div className="text-xs text-foreground/50">{y.jshshir}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-foreground">{y.telefon}</div>
                      <div className="text-xs text-foreground/50">{y.mahalla}</div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold bg-opacity-10 border-opacity-20
                        ${y.xavf === 'Yuqori xavf' ? 'bg-danger text-danger border-danger' : 
                          y.xavf === 'O'rta xavf' ? 'bg-warning text-warning border-warning' 
                          'bg-safe text-safe border-safe'}"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${y.xavf === 'Yuqori xavf' ? 'bg-danger' : y.xavf === "O'rta xavf" ? 'bg-warning' : 'bg-safe'}`}></span>
                        {y.xavf}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div >
  );
}
