"use client";

import { useI18n } from "@/lib/i18n";
import { X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export default function AddYouthModal({ isOpen, onClose, editData }: Props) {
  const { t, lang } = useI18n();
  const [formData, setFormData] = useState({
    ism: "",
    familiya: "",
    jshshir: "",
    pasport: "",
    yil: "",
    jins: "",
    maktab: "",
    telefon: "",
    davomat: "",
    mahalla: "",
    xavf: "",
    izoh: ""
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Set initial data if editing
  useEffect(() => {
    if (isOpen && editData) {
      setFormData(editData);
    } else if (isOpen && !editData) {
      setFormData({ ism: "", familiya: "", jshshir: "", pasport: "", yil: "", jins: "", maktab: "", telefon: "", davomat: "", mahalla: "", xavf: "", izoh: "" });
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Save to localStorage
    const existingStr = localStorage.getItem("youthList");
    let existingList = existingStr ? JSON.parse(existingStr) : [];
    
    if (editData) {
      existingList = existingList.map((item: any) => item.id === editData.id ? { ...formData, id: editData.id, createdAt: item.createdAt } : item);
      toast.success(lang === 'uz' ? "Muvaffaqiyatli yangilandi!" : "Успешно обновлено!");
    } else {
      const newEntry = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      existingList = [newEntry, ...existingList];
      toast.success(lang === 'uz' ? "Muvaffaqiyatli saqlandi!" : "Успешно сохранено!");
    }
    
    localStorage.setItem("youthList", JSON.stringify(existingList));
    
    // Dispatch custom event so the youth page can refresh
    window.dispatchEvent(new Event("youthAdded"));
    
    setFormData({ ism: "", familiya: "", jshshir: "", pasport: "", yil: "", jins: "", maktab: "", telefon: "", davomat: "", mahalla: "", xavf: "", izoh: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-card border border-card-border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              {lang === 'uz' ? "YANGI YOZUV" : "НОВАЯ ЗАПИСЬ"}
            </h3>
            <h2 className="text-xl font-bold text-foreground">{lang === 'uz' ? "Yangi yosh qo'shish" : "Добавить новую молодежь"}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-foreground/50 hover:text-foreground hover:bg-card/80 rounded-xl transition-colors border border-transparent hover:border-card-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body & Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Ism *" : "Имя *"}</label>
                <input name="ism" value={formData.ism} onChange={handleChange} required minLength={2} type="text" placeholder={lang === 'uz' ? "Jasur" : "Жасур"} className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Familiya *" : "Фамилия *"}</label>
                <input name="familiya" value={formData.familiya} onChange={handleChange} required minLength={2} type="text" placeholder={lang === 'uz' ? "Toshmatov" : "Тошматов"} className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "JSHSHIR (14 xonali) *" : "ПИНФЛ (14 цифр) *"}</label>
                <input name="jshshir" value={formData.jshshir} onChange={handleChange} required pattern="\d{14}" title={lang === 'uz' ? "14 ta raqam bo'lishi kerak" : "Должно быть 14 цифр"} type="text" placeholder="12345678901234" className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Pasport seriya va raqam *" : "Серия и номер паспорта *"}</label>
                <input 
                  name="pasport" value={formData.pasport} onChange={handleChange}
                  required 
                  pattern="[A-Z]{2}\d{7}" 
                  title={lang === 'uz' ? "Masalan: AB1234567 (faqat katta harflar)" : "Например: AB1234567 (только заглавные)"} 
                  type="text" 
                  placeholder="AB1234567" 
                  className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors uppercase" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Tug'ilgan yil *" : "Год рождения *"}</label>
                <input name="yil" value={formData.yil} onChange={handleChange} required type="number" min="1950" max="2026" placeholder="2005" className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Jins *" : "Пол *"}</label>
                <select name="jins" value={formData.jins} onChange={handleChange} required className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="">{lang === 'uz' ? "Tanlang" : "Выберите"}</option>
                  <option value={lang === 'uz' ? "Erkak" : "Мужчина"}>{lang === 'uz' ? "Erkak" : "Мужчина"}</option>
                  <option value={lang === 'uz' ? "Ayol" : "Женщина"}>{lang === 'uz' ? "Ayol" : "Женщина"}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Ta'lim muassasasi *" : "Учебное заведение *"}</label>
              <input name="maktab" value={formData.maktab} onChange={handleChange} required type="text" placeholder={lang === 'uz' ? "Maktab yoki universitet nomi" : "Название школы или университета"} className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Telefon *" : "Телефон *"}</label>
                <input name="telefon" value={formData.telefon} onChange={handleChange} required type="tel" pattern="^\+998\d{9}$" title={lang === 'uz' ? "+998901234567 formatida" : "В формате +998901234567"} placeholder="+998 90 000 00 00" className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Davomat (%) *" : "Посещаемость (%) *"}</label>
                <input name="davomat" value={formData.davomat} onChange={handleChange} required type="number" min="0" max="100" placeholder="85" className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Mahalla *" : "Махалля *"}</label>
                <select name="mahalla" value={formData.mahalla} onChange={handleChange} required className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="">{lang === 'uz' ? "Tanlang" : "Выберите"}</option>
                  <option value={lang === 'uz' ? "Abay mahallasi" : "махалля Абай"}>{lang === 'uz' ? "Abay mahallasi" : "махалля Абай"}</option>
                  <option value={lang === 'uz' ? "Dilbuloq mahallasi" : "махалля Дилбулок"}>{lang === 'uz' ? "Dilbuloq mahallasi" : "махалля Дилбулок"}</option>
                  <option value={lang === 'uz' ? "Oqtepa mahallasi" : "махалля Октепа"}>{lang === 'uz' ? "Oqtepa mahallasi" : "махалля Октепа"}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Xavf darajasi *" : "Уровень риска *"}</label>
                <div className="relative">
                  <select name="xavf" value={formData.xavf} onChange={handleChange} required className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 pl-10 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                    <option value="">{lang === 'uz' ? "Tanlang" : "Выберите"}</option>
                    <option value={lang === 'uz' ? "Past xavf" : "Низкий риск"}>{lang === 'uz' ? "Past xavf" : "Низкий риск"}</option>
                    <option value={lang === 'uz' ? "O'rta xavf" : "Средний риск"}>{lang === 'uz' ? "O'rta xavf" : "Средний риск"}</option>
                    <option value={lang === 'uz' ? "Yuqori xavf" : "Высокий риск"}>{lang === 'uz' ? "Yuqori xavf" : "Высокий риск"}</option>
                  </select>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm ${formData.xavf === (lang === 'uz' ? 'Yuqori xavf' : 'Высокий риск') ? 'bg-danger' : formData.xavf === (lang === 'uz' ? "O'rta xavf" : "Средний риск") ? 'bg-warning' : 'bg-safe'}`}></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">{lang === 'uz' ? "Izoh" : "Примечание"}</label>
              <input name="izoh" value={formData.izoh} onChange={handleChange} type="text" placeholder={lang === 'uz' ? "Qo'shimcha ma'lumot..." : "Дополнительная информация..."} className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-transparent border border-card-border rounded-xl text-sm font-bold text-white hover:bg-card transition-colors"
            >
              {lang === 'uz' ? "Bekor qilish" : "Отмена"}
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
              <Save className="w-4 h-4" />
              {lang === 'uz' ? "Saqlash" : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
