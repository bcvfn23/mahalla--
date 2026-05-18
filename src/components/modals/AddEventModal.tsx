"use client";

import { useI18n } from "@/lib/i18n";
import { X, Save, Calendar as CalendarIcon, Type, AlignLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
  selectedDate: string;
}

export default function AddEventModal({ isOpen, onClose, onSave, selectedDate }: Props) {
  const { t, lang } = useI18n();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("muddat");
  const [desc, setDesc] = useState("");

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: Date.now(),
      date: parseInt(selectedDate.split("-")[2]),
      title,
      type,
      desc
    });
    toast.success(lang === 'uz' ? "Tadbir qo'shildi!" : "Событие добавлено!");
    setTitle("");
    setDesc("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-card border border-card-border rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              YANGI TADBIR
            </h3>
            <h2 className="text-xl font-bold text-foreground">Tadbir qo'shish</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-foreground/50 hover:text-foreground hover:bg-card/80 rounded-xl transition-colors border border-transparent hover:border-card-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Tanlangan sana</label>
            <div className="text-primary font-bold text-lg">
              {selectedDate}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Tadbir nomi *</label>
            <input 
              required 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Masalan: Yig'ilish, Tadbir..." 
              className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Turi</label>
            <div className="relative">
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="muddat">⏰ Muddat</option>
                <option value="uchrashuv">👥 Uchrashuv</option>
                <option value="tadbir">🎉 Tadbir</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Izoh (Ixtiyoriy)</label>
            <textarea 
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Qo'shimcha ma'lumot..." 
              className="w-full bg-background border border-card-border/80 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none" 
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 bg-card border border-card-border/80 text-foreground rounded-xl text-sm font-bold hover:bg-card/80 transition-colors"
            >
              Bekor qilish
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-gradient-to-r from-primary to-[#06b6d4] hover:opacity-90 text-foreground rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
