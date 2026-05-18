"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
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
  const { t } = useI18n();

  const navigation = {
    asosiy: [
      { name: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "nav.yoshlar", href: "/yoshlar", icon: Users, badge: "0" },
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
                  ? "bg-primary/10 text-white shadow-[inset_3px_0_0_0_var(--primary)]"
                  : "text-foreground/60 hover:bg-card/80 hover:text-white",
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
    <div className="flex h-full w-[260px] flex-col bg-[#060b17] border-r border-card-border overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="flex h-[88px] shrink-0 items-center gap-3 px-6 mb-4 mt-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
          <span className="text-lg font-bold text-white tracking-wider">YR</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">{t("global.app_name")}</h1>
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
        <div className="p-3 bg-card rounded-xl border border-card-border flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30">
            <span className="font-bold text-indigo-400">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Tizim Boshqaruvchisi</p>
            <p className="text-[11px] text-foreground/50 truncate">👑 Admin</p>
          </div>
        </div>
        
        <button className="w-full mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          {t("nav.chiqish")}
        </button>
      </div>
    </div>
  );
}
