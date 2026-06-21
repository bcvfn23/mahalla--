"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Map,
  Activity,
  ClipboardList,
  Calendar,
  LineChart,
  BrainCircuit,
  Link as LinkIcon,
  User,
  LogOut,
  AlertTriangle,
  ShieldAlert,
  Inbox,
  HeartHandshake,
  Briefcase,
  Award,
  X
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useI18n();
  const { user, logout } = useAuth();
  const [youthCount, setYouthCount] = useState(0);
  const [incidentsCount, setIncidentsCount] = useState(0);
  const [appealsCount, setAppealsCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sync initial theme state from DOM classes
  useEffect(() => {
    const isCurrentlyLight = document.documentElement.classList.contains("light");
    setIsDark(!isCurrentlyLight);

    const handleThemeChange = () => {
      const updatedTheme = localStorage.getItem("theme");
      setIsDark(updatedTheme !== "light");
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("toggleLeftSidebar", handleToggle);
    window.addEventListener("closeLeftSidebar", handleClose);

    // Close when route changes
    handleClose();

    return () => {
      window.removeEventListener("toggleLeftSidebar", handleToggle);
      window.removeEventListener("closeLeftSidebar", handleClose);
    };
  }, [pathname]);


  useEffect(() => {
    const updateStats = async () => {
      try {
        const res = await fetch("/api/statistics");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setYouthCount(data.youthCount);
            setIncidentsCount(data.incidentsCount);
            setAppealsCount(data.appealsCount);
          }
        }
      } catch (e) {
        console.error("Failed to load statistics", e);
      }
    };

    updateStats();
    window.addEventListener("youthAdded", updateStats);
    window.addEventListener("incidentsChanged", updateStats);
    window.addEventListener("appealsChanged", updateStats);
    
    return () => {
      window.removeEventListener("youthAdded", updateStats);
      window.removeEventListener("incidentsChanged", updateStats);
      window.removeEventListener("appealsChanged", updateStats);
    };
  }, []);

  const role = user?.role || "admin";

  let asosiy: { name: string; href: string; icon: any; badge?: string }[] = [
    { name: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard }
  ];

  if (["admin", "uchastkavoy", "raisi", "yetakchi"].includes(role)) {
    asosiy.push({ name: "nav.yoshlar", href: "/yoshlar", icon: Users, badge: youthCount > 0 ? youthCount.toString() : undefined });
  }

  if (["admin", "uchastkavoy"].includes(role)) {
    asosiy.push({ name: "nav.xarita", href: "/xarita", icon: Map });
    asosiy.push({ name: "nav.faollik", href: "/faollik", icon: Activity });
    if (role === "uchastkavoy" || role === "admin") {
      asosiy.push({ name: "nav.huquqbuzarliklar", href: "/huquqbuzarliklar", icon: AlertTriangle, badge: incidentsCount > 0 ? incidentsCount.toString() : undefined });
      asosiy.push({ name: "nav.patrul", href: "/patrul", icon: ShieldAlert });
    }
  }

  let boshqaruv = [];

  if (["admin", "raisi", "yetakchi"].includes(role)) {
    boshqaruv.push({ name: "nav.rejalar", href: "/rejalar", icon: ClipboardList });
    boshqaruv.push({ name: "nav.kalendar", href: "/kalendar", icon: Calendar });
  }

  if (["admin", "raisi"].includes(role)) {
    boshqaruv.push({ name: "nav.statistika", href: "/statistika", icon: LineChart });
    boshqaruv.push({ name: "nav.murojaatlar", href: "/murojaatlar", icon: Inbox, badge: appealsCount > 0 ? appealsCount.toString() : undefined });
    boshqaruv.push({ name: "nav.yordam", href: "/yordam", icon: HeartHandshake });
  }

  if (["admin", "yetakchi"].includes(role)) {
    boshqaruv.push({ name: "nav.bandlik", href: "/bandlik", icon: Briefcase });
    boshqaruv.push({ name: "nav.tanlovlar", href: "/tanlovlar", icon: Award });
  }

  if (["admin", "uchastkavoy"].includes(role)) {
    boshqaruv.push({ name: "nav.ai_tahlil", href: "/ai-tahlil", icon: BrainCircuit });
  }

  if (role === "admin") {
    boshqaruv.push({ name: "nav.integratsiyalar", href: "/integratsiyalar", icon: LinkIcon });
    boshqaruv.push({ name: "nav.audit", href: "/audit", icon: ClipboardList });
  }

  const navigation = {
    asosiy,
    boshqaruv,
    hisob: [
      { name: "nav.profil", href: "/profil", icon: User },
    ]
  };

  const renderNavSection = (items: any[], titleKey: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="px-6 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
          {t(titleKey)}
        </h3>
        <div className="space-y-1 px-3">
          {items.map((item) => {
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_3px_0_0_0_var(--primary)]"
                    : isDark
                      ? "text-foreground/60 hover:bg-background/80 hover:text-foreground"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                )}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      isActive
                        ? "text-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]"
                        : isDark
                          ? "text-foreground/40 group-hover:text-foreground/80"
                          : "text-slate-400 group-hover:text-slate-700",
                      "mr-3 h-5 w-5 flex-shrink-0 transition-all"
                    )}
                    aria-hidden="true"
                  />
                  {t(item.name)}
                </div>
                {item.badge && (
                  <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Left Sidebar Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={cn(
        "flex h-full w-[260px] flex-col border-r shrink-0 transition-transform duration-300 z-50 overflow-hidden",
        isDark ? "bg-[#131a2d] border-card-border text-foreground" : "bg-white border-slate-200 text-slate-900",
        "fixed inset-y-0 left-0 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo & Close Button */}
        <div className="flex h-[76px] shrink-0 items-center justify-between px-6 mb-2 mt-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden",
              isDark ? "border-primary/30 bg-[#091024] shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "border-slate-200 bg-slate-50"
            )}>
              <Image src="/logo.png" alt="Yoshlar Qalqoni AI Logo" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{t("global.app_name")}</h1>
              <p className={cn("text-[10px] mt-0.5", isDark ? "text-foreground/50" : "text-slate-500")}>{t("global.version")}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className={cn(
              "p-1.5 rounded-lg lg:hidden transition-colors",
              isDark ? "text-foreground/50 hover:text-foreground hover:bg-background/80" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            )}
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area - Isolated scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          {renderNavSection(navigation.asosiy, "section.asosiy")}
          {renderNavSection(navigation.boshqaruv, "section.boshqaruv")}
          {renderNavSection(navigation.hisob, "section.hisob")}
        </div>

        {/* Live AI Status Widget - Fixed at bottom */}
        <div className={cn(
          "mx-4 my-2 p-2.5 border rounded-xl shrink-0 relative overflow-hidden group",
          isDark ? "bg-gradient-to-r from-primary/10 to-indigo-500/5 border-primary/20" : "bg-slate-50 border-slate-200"
        )}>
          <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06b6d4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06b6d4]"></span>
            </span>
            <div>
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", isDark ? "text-foreground/80" : "text-slate-700")}>AI Core Active</p>
              <p className="text-[8px] text-[#06b6d4] uppercase font-bold tracking-widest mt-0.5 font-mono">Gemini 3.5 Flash</p>
            </div>
          </div>
        </div>

        {/* User profile mini widget - Fixed at bottom */}
        <div className="p-4 shrink-0 border-t border-card-border/30">
          <div className={cn(
            "p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer group",
            isDark ? "bg-[#091024] border-card-border hover:border-primary/30" : "bg-slate-50 border-slate-200 hover:border-primary/30"
          )}>
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center border",
              isDark ? "bg-primary/10 border-primary/20 text-primary" : "bg-primary/10 border-primary/20 text-primary"
            )}>
              <span className="font-bold text-xs">{user?.avatar || "US"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.name || "Kuzatuvchi"}</p>
              <p className={cn("text-[10px] truncate uppercase tracking-widest", isDark ? "text-foreground/50" : "text-slate-500")}>{user?.role || "mehmon"}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-2.5 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t("nav.chiqish")}
          </button>
        </div>
      </div>
    </>
  );
}
