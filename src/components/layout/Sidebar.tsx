"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
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
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang } = useI18n();
  const [youthCount, setYouthCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const data = localStorage.getItem("youthList");
      if (data) {
        setYouthCount(JSON.parse(data).length);
      } else {
        setYouthCount(0);
      }
    };
    updateCount();
    window.addEventListener("youthAdded", updateCount);
    return () => window.removeEventListener("youthAdded", updateCount);
  }, []);

  const navigation = {
    asosiy: [
      { name: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "nav.yoshlar", href: "/yoshlar", icon: Users, badge: youthCount.toString() },
      { name: "nav.xarita", href: "/xarita", icon: Map },
      { name: "nav.faollik", href: "/faollik", icon: Activity },
    ],
    boshqaruv: [
      { name: "nav.rejalar", href: "/rejalar", icon: ClipboardList },
      { name: "nav.kalendar", href: "/kalendar", icon: Calendar },
      { name: "nav.statistika", href: "/statistika", icon: LineChart },
      { name: "nav.ai_tahlil", href: "/ai-tahlil", icon: BrainCircuit },
      { name: "nav.integratsiyalar", href: "/integratsiyalar", icon: LinkIcon },
    ],
    hisob: [
      { name: "nav.profil", href: "/profil", icon: User },
    ]
  };

  const renderNavSection = (items: any[], titleKey: string) => (
    <div className="mb-6">
      <h3 className="px-6 mb-3 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
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
                  : "text-foreground/60 hover:bg-background/80 hover:text-foreground",
                "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    isActive ? "text-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : "text-foreground/40 group-hover:text-foreground/80",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-all"
                  )}
                  aria-hidden="true"
                />
                {t(item.name)}
              </div>
              {item.badge && (
                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-[260px] flex-col bg-card border-r border-card-border overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="flex h-[88px] shrink-0 items-center gap-3 px-6 mb-4 mt-2">
        <div className="w-12 h-12 rounded-xl border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden bg-card">
          <Image src="/logo.png" alt="Safe Mahalla AI Logo" width={48} height={48} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground leading-tight">{t("global.app_name")}</h1>
          <p className="text-[11px] text-foreground/50 mt-0.5">{t("global.version")}</p>
        </div>
      </div>

      <div className="flex-1">
        {renderNavSection(navigation.asosiy, "section.asosiy")}
        {renderNavSection(navigation.boshqaruv, "section.boshqaruv")}
        {renderNavSection(navigation.hisob, "section.hisob")}
      </div>
      
      {/* User profile mini widget */}
      <div className="p-4 mt-auto">
        <div className="p-3 bg-background rounded-xl border border-card-border flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="font-bold text-primary">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{lang === 'uz' ? "Tizim Boshqaruvchisi" : "Системный администратор"}</p>
            <p className="text-[11px] text-foreground/50 truncate">👑 {lang === 'uz' ? "Admin" : "Админ"}</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem("userRole");
            router.push("/");
          }}
          className="w-full mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("nav.chiqish")}
        </button>
      </div>
    </div>
  );
}
