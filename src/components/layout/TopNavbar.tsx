"use client";

import { Bell, Search, Sun, Mail, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import AddYouthModal from "@/components/modals/AddYouthModal";

export default function TopNavbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const pathNameSegment = pathname === '/' ? 'Dashboard' : pathname.split('/').pop();
  const formattedPathName = pathNameSegment ? pathNameSegment.charAt(0).toUpperCase() + pathNameSegment.slice(1) : '';

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-16 shrink-0 border-b border-card-border bg-[#091024] flex items-center justify-between px-6 relative z-40">
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <span>Mahalla Monitor</span>
          <span>›</span>
          <span className="font-semibold text-white">{formattedPathName}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex bg-[#131a2d] rounded-full p-1 border border-card-border">
            <button 
              onClick={() => setLang('uz')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'uz' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-white'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'ru' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-white'}`}
            >
              RU
            </button>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-safe/10 border border-safe/20 text-safe text-xs font-mono font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <span className="w-2 h-2 rounded-full bg-safe mr-2 animate-pulse"></span>
              14:55:22
            </div>
            
            <button className="p-2 text-warning hover:bg-warning/10 rounded-full transition-colors">
              <Sun className="h-5 w-5" />
            </button>

            {/* Notifications Trigger */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-warning hover:bg-warning/10 rounded-full transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-[#091024]"></span>
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-[#091024] border border-card-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-card-border/50">
                    <h3 className="text-sm font-bold text-white">{lang === 'uz' ? "Bildirishnomalar" : "Уведомления"}</h3>
                    <button className="px-3 py-1 bg-card border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-white transition-colors">
                      {lang === 'uz' ? "Hammasini o'chirish" : "Очистить все"}
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                    <Bell className="w-8 h-8 text-warning mb-3 opacity-50" />
                    <p className="text-sm font-bold text-white">{lang === 'uz' ? "Bildirishnoma yo'q" : "Нет уведомлений"}</p>
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 text-foreground/60 hover:text-white hover:bg-card/80 rounded-full transition-colors">
              <Mail className="h-5 w-5" />
            </button>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <Plus className="h-4 w-4" />
            {t("topbar.add_youth")}
          </button>
        </div>
      </header>

      {/* Modal is rendered outside the normal flow */}
      <AddYouthModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
