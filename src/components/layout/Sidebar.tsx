"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Map, 
  BrainCircuit, 
  TrendingUp, 
  FileText, 
  UploadCloud, 
  Bell, 
  Settings,
  ShieldAlert
} from "lucide-react";

const navigation = [
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Карта преступности", href: "/heatmap", icon: Map },
  { name: "Аналитика ИИ", href: "/analytics", icon: BrainCircuit },
  { name: "Прогнозы", href: "/predictions", icon: TrendingUp },
  { name: "Отчеты", href: "/reports", icon: FileText },
  { name: "Загрузка данных", href: "/upload", icon: UploadCloud },
];

const secondaryNavigation = [
  { name: "Уведомления", href: "/notifications", icon: Bell },
  { name: "Настройки", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card/40 backdrop-blur-md border-r border-card-border">
      <div className="flex h-16 shrink-0 items-center gap-2 px-6">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <span className="text-lg font-bold tracking-widest text-primary-foreground drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]">
          SAFE MAHALLA
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-primary/20 text-primary-foreground glow-safe border-l-2 border-primary"
                    : "text-foreground/70 hover:bg-card hover:text-foreground",
                  "group flex items-center px-3 py-3 text-sm font-medium rounded-r-md transition-all duration-300"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground/80",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-foreground/40">
            Система
          </h3>
          <div className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-primary/10 text-primary-foreground"
                      : "text-foreground/70 hover:bg-card hover:text-foreground",
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground/80",
                      "mr-3 h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-card-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
            <span className="text-sm font-bold text-primary">А</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Аналитик</p>
            <p className="text-xs text-foreground/50">МВД РУз</p>
          </div>
        </div>
      </div>
    </div>
  );
}
