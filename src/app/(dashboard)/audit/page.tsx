"use client";

import { useI18n } from "@/lib/i18n";
import React, { Fragment, useEffect, useState } from "react";
import { 
  ClipboardList, 
  Search, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface AuditLogItem {
  id: string;
  userId: string | null;
  action: string;
  details: any;
  ipAddress: string | null;
  createdAt: string;
  user: {
    username: string;
    name: string;
    role: string;
  } | null;
}

export default function AuditPage() {
  const { t, lang } = useI18n();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit?page=${page}&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLogs(data.items);
          setTotalPages(data.totalPages);
          setTotalItems(data.total);
        }
      } else {
        toast.error(lang === "uz" ? "Audit jurnallarini yuklab bo'lmadi" : "Не удалось загрузить журналы аудита");
      }
    } catch (e) {
      console.error(e);
      toast.error(lang === "uz" ? "Kutilmagan xatolik yuz berdi" : "Произошла непредвиденная ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "login":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-safe/10 text-safe border border-safe/20 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" /> LOGIN
          </span>
        );
      case "logout":
      case "logout_all":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-foreground/10 text-foreground/70 border border-foreground/20 flex items-center gap-1 w-fit">
            <User className="w-3 h-3" /> LOGOUT
          </span>
        );
      case "AI_REQUEST":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 w-fit">
            <Activity className="w-3 h-3" /> AI PROMPT
          </span>
        );
      case "security_alert":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 flex items-center gap-1 w-fit animate-pulse">
            <ShieldAlert className="w-3 h-3" /> SECURITY ALERT
          </span>
        );
      case "security_warning":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-warning/10 text-warning border border-warning/20 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> IP SHIFT
          </span>
        );
      case "create_youth_profile":
      case "update_youth_profile":
      case "delete_youth_profile":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1 w-fit">
            <Terminal className="w-3 h-3" /> YOUTH CRUD
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20 w-fit">
            {action.toUpperCase()}
          </span>
        );
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      (log.user?.name || "").toLowerCase().includes(term) ||
      (log.user?.username || "").toLowerCase().includes(term) ||
      (log.ipAddress || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            XAVFSIZLIK VA AUDIT
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            {lang === "uz" ? "Audit va Tizim Jurnallari" : "Аудит и Системные Логи"}
          </h1>
          <p className="text-xs text-foreground/60 mt-1">
            {lang === "uz" 
              ? "Tizimdagi barcha faolliklar va xavfsizlik hodisalarini kuzatish jurnali." 
              : "Журнал для мониторинга всей активности пользователей и событий безопасности в системе."}
          </p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-background border border-card-border rounded-xl text-xs font-bold text-foreground transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? "animate-spin" : ""}`} />
          {lang === "uz" ? "Yangilash" : "Обновить"}
        </button>
      </div>

      {/* Filter and stats banner */}
      <div className="glass-panel p-4 rounded-2xl border border-card-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder={lang === "uz" ? "Jurnallarni qidirish..." : "Поиск логов..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-card-border rounded-xl pl-10 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
        </div>

        <div className="text-xs text-foreground/50 font-semibold">
          {lang === "uz" 
            ? `Jami hodisalar: ${totalItems}` 
            : `Всего событий: ${totalItems}`}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-2xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border/50 text-[10px] font-bold uppercase tracking-wider text-foreground/40 bg-card/25">
                <th className="px-6 py-4">{lang === "uz" ? "Sana va Vaqt" : "Дата и время"}</th>
                <th className="px-6 py-4">{lang === "uz" ? "Foydalanuvchi" : "Пользователь"}</th>
                <th className="px-6 py-4">{lang === "uz" ? "Amal" : "Действие"}</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">{lang === "uz" ? "Batafsil" : "Детали"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/30 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-foreground/40 font-bold">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                    {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-foreground/40 font-bold">
                    {lang === "uz" ? "Hech qanday jurnal topilmadi" : "Логи не найдены"}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedRow === log.id;
                  return (
                    <Fragment key={log.id}>
                      <tr className={`hover:bg-card/20 transition-colors ${isExpanded ? "bg-card/10" : ""}`}>
                        <td className="px-6 py-4 font-mono text-[11px] text-foreground/75">
                          {new Date(log.createdAt).toLocaleString(lang === "uz" ? "uz-UZ" : "ru-RU")}
                        </td>
                        <td className="px-6 py-4">
                          {log.user ? (
                            <div>
                              <strong className="text-foreground font-bold">{log.user.name}</strong>
                              <span className="text-[10px] text-foreground/40 ml-1.5 font-mono">(@{log.user.username})</span>
                              <div className="text-[9px] text-primary/70 uppercase tracking-widest font-black mt-0.5">{log.user.role}</div>
                            </div>
                          ) : (
                            <span className="text-foreground/40 italic">System / Guest</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="px-6 py-4 font-mono text-foreground/80">
                          {log.ipAddress || "127.0.0.1"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                            className="p-1.5 hover:bg-card border border-transparent hover:border-card-border rounded-lg text-primary hover:text-primary-hover transition-all inline-flex items-center gap-1 cursor-pointer"
                            title="Toggle JSON details"
                          >
                            {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-card/5">
                          <td colSpan={5} className="px-6 py-4 border-l-2 border-primary">
                            <div className="bg-[#02050c] border border-card-border/50 rounded-xl p-4 font-mono text-[11px] text-cyan-400 overflow-x-auto max-w-full">
                              <pre>{JSON.stringify(log.details, null, 2)}</pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-card-border/50 flex items-center justify-between bg-card/10">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-background border border-card-border rounded-lg text-xs font-bold text-foreground/75 hover:text-foreground disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {lang === "uz" ? "Oldingi" : "Назад"}
            </button>

            <span className="text-xs text-foreground/50 font-bold">
              {lang === "uz" ? `${page} / ${totalPages} sahifa` : `Страница ${page} из ${totalPages}`}
            </span>

            <button
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-background border border-card-border rounded-lg text-xs font-bold text-foreground/75 hover:text-foreground disabled:opacity-40 transition-all cursor-pointer"
            >
              {lang === "uz" ? "Keyingi" : "Вперед"}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
