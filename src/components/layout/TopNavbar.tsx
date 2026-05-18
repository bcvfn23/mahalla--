"use client";

import { Bell, Search, Sun, Moon, Mail, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import AddYouthModal from "@/components/modals/AddYouthModal";
import { toast } from "sonner";

export default function TopNavbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [isDark, setIsDark] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  
  const pathNameSegment = pathname === '/' ? 'Dashboard' : pathname.split('/').pop();
  const formattedPathName = pathNameSegment ? pathNameSegment.charAt(0).toUpperCase() + pathNameSegment.slice(1) : '';

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Theme Initialization
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
    }
    
    // Listen for changes from profile page
    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem("theme");
      setIsDark(updatedTheme !== "light");
      if (updatedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    };
    
    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("themeChanged"));
    toast.success(lang === 'uz' ? (newTheme === "light" ? "Yorug' mavzu faollashdi" : "Qorong'u mavzu faollashdi") : (newTheme === "light" ? "Светлая тема активирована" : "Темная тема активирована"));
  };

  return (
    <>
      <header className="h-16 shrink-0 border-b border-card-border bg-card flex items-center justify-between px-6 relative z-40">
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <span>{t("global.app_name")}</span>
          <span>›</span>
          <span className="font-semibold text-foreground">{formattedPathName}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex bg-background rounded-full p-1 border border-card-border">
            <button 
              onClick={() => setLang('uz')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'uz' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${lang === 'ru' ? 'bg-primary text-white' : 'text-foreground/50 hover:text-foreground'}`}
            >
              RU
            </button>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="flex items-center justify-center px-4 py-1.5 rounded-full bg-safe/10 border border-safe/20 text-safe text-xs font-mono font-medium shadow-[0_0_10px_rgba(16,185,129,0.1)] w-[100px]">
              <span className="w-2 h-2 rounded-full bg-safe mr-2 animate-pulse"></span>
              {time || "00:00:00"}
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-warning hover:bg-warning/10 rounded-full transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-card-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between p-4 border-b border-card-border/50">
                    <h3 className="text-sm font-bold text-foreground">{lang === 'uz' ? "Bildirishnomalar" : "Уведомления"}</h3>
                    <button className="px-3 py-1 bg-background border border-card-border rounded-full text-[10px] font-bold text-foreground/70 hover:text-foreground transition-colors">
                      {lang === 'uz' ? "Hammasini o'chirish" : "Очистить все"}
                    </button>
                  </div>
                  
                  {/* Mock Notification Item */}
                  <div className="p-4 border-b border-card-border/50 hover:bg-background/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary mt-1">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {lang === 'uz' ? "Yangi xavf aniqlandi" : "Обнаружен новый риск"}
                        </h4>
                        <p className="text-xs text-foreground/60 mt-1 leading-relaxed">
                          {lang === 'uz' ? "Chilonzor tumanida tungi vaqtda jinoyatchilik ehtimoli oshdi." : "В Чиланзарском районе возросла вероятность ночной преступности."}
                        </p>
                        <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">
                          {lang === 'uz' ? "Hoziroq" : "Только что"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            <button className="p-2 text-foreground/60 hover:text-foreground hover:bg-background/80 rounded-full transition-colors">
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
