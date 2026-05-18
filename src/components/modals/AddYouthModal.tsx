"use client";

import { useI18n } from "@/lib/i18n";
import { X, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddYouthModal({ isOpen, onClose }: Props) {
  const { t, lang } = useI18n();

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[#0b1228] border border-card-border rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              YANGI YOZUV
            </h3>
            <h2 className="text-xl font-bold text-white">Yangi yosh qo'shish</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-foreground/50 hover:text-white hover:bg-card/80 rounded-xl transition-colors border border-transparent hover:border-card-border"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body & Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            // Mock successful save
            toast.success(lang === 'uz' ? "Muvaffaqiyatli saqlandi!" : "Успешно сохранено!");
            onClose();
          }}
        >
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Ism *</label>
                <input required minLength={2} type="text" placeholder="Jasur" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Familiya *</label>
                <input required minLength={2} type="text" placeholder="Toshmatov" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">JSHSHIR (14 xonali) *</label>
                <input required pattern="\d{14}" title="14 ta raqam bo'lishi kerak" type="text" placeholder="12345678901234" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Pasport seriya va raqam *</label>
                <input 
                  required 
                  pattern="[A-Z]{2}\d{7}" 
                  title="Masalan: AB1234567 (faqat katta harflar)" 
                  type="text" 
                  placeholder="AB1234567" 
                  className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors uppercase" 
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Tug'ilgan yil *</label>
                <input required type="number" min="1950" max="2026" placeholder="2005" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Jins *</label>
                <select required className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="">Tanlang</option>
                  <option value="erkak">Erkak</option>
                  <option value="ayol">Ayol</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Ta'lim muassasasi *</label>
              <input required type="text" placeholder="Maktab yoki universitet nomi" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Telefon *</label>
                <input required type="tel" pattern="^\+998\d{9}$" title="+998901234567 formatida" placeholder="+998 90 000 00 00" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Davomat (%) *</label>
                <input required type="number" min="0" max="100" placeholder="85" className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Mahalla *</label>
                <select required className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="">Tanlang</option>
                  <option value="abay">Abay mahallasi</option>
                  <option value="dilbuloq">Dilbuloq mahallasi</option>
                  <option value="oqtepa">Oqtepa mahallasi</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Xavf darajasi *</label>
                <div className="relative">
                  <select required className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                    <option value="">Tanlang</option>
                    <option value="past">Past xavf</option>
                    <option value="orta">O'rta xavf</option>
                    <option value="yuqori">Yuqori xavf</option>
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-sm bg-safe"></div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider mb-2">Izoh</label>
              <input type="text" placeholder="Qo'shimcha ma'lumot..." className="w-full bg-[#0d152e] border border-card-border/80 rounded-xl px-4 py-3 text-sm text-white placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-transparent border border-card-border rounded-xl text-sm font-bold text-white hover:bg-card transition-colors"
            >
              Bekor qilish
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
              <Save className="w-4 h-4" />
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
