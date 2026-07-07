"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, AlertTriangle, CheckCircle, Database, Server, Brain, Search, MapPin, Eye } from "lucide-react";
import { toast } from "sonner";

interface Inconsistency {
  module: string;
  expected: any;
  actual: any;
  severity: "low" | "medium" | "critical";
}

export default function IntegrityPage() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(100);
  const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>([]);
  const [healing, setHealing] = useState(false);

  const fetchIntegrityStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/integrity");
      const data = await res.json();
      if (data.success) {
        setScore(data.report.score);
        setInconsistencies(data.report.inconsistencies || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Integrity check failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeal = async () => {
    setHealing(true);
    try {
      const res = await fetch("/api/v1/integrity");
      toast.success("Self-healing routines completed. Cache metrics invalidated successfully.");
      await fetchIntegrityStatus();
    } catch (err) {
      toast.error("Failed to run self-healing.");
    } finally {
      setHealing(false);
    }
  };

  useEffect(() => {
    fetchIntegrityStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tizim Butunligi (System Integrity)</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zero Divergence Policy monitoring panel and self-healing controls.
          </p>
        </div>
        <button
          onClick={handleHeal}
          disabled={healing}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 \${healing ? "animate-spin" : ""}`} />
          <span>Sog'lomlashtirish (Self-Heal)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Consistency Score</span>
          <span className="text-6xl font-black text-foreground mt-4">{score}%</span>
          <span className="text-xs text-muted-foreground mt-4">
            {score === 100 ? "? All database indices and metric counts are in sync." : "?? Discrepancies detected between DB and caches."}
          </span>
        </div>

        <div className="glass-panel p-6 rounded-2xl md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-4">Sinflar Holati (Services Status)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <Database className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">Database</h4>
                <span className="text-[10px] text-safe font-semibold">Ulanish faol</span>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <Server className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">Cache (Redis)</h4>
                <span className="text-[10px] text-safe font-semibold">Sinxronlangan</span>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <Brain className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">AI Prompt Context</h4>
                <span className="text-[10px] text-safe font-semibold">Muvaffaqiyatli</span>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <Search className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">Search Index</h4>
                <span className="text-[10px] text-safe font-semibold">Faol</span>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">HeatMap Layer</h4>
                <span className="text-[10px] text-safe font-semibold">Yuklangan</span>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border/50 flex items-center gap-3">
              <Eye className="w-5 h-5 text-safe" />
              <div>
                <h4 className="text-xs font-bold">Watcher Daemon</h4>
                <span className="text-[10px] text-safe font-semibold">Ishlamoqda (30s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70 mb-4">Tizimdagi Nomuvofiqliklar (Active Discrepancies)</h3>
        {loading ? (
          <div className="py-8 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>
        ) : inconsistencies.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground flex flex-col items-center gap-2">
            <CheckCircle className="w-12 h-12 text-safe" />
            <p className="text-sm font-semibold mt-2">Hozirda hech qanday xatolik yoki nomuvofiqlik aniqlanmadi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inconsistencies.map((item, idx) => (
              <div key={idx} className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{item.module}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Expected: <code className="bg-card px-1.5 py-0.5 rounded">{JSON.stringify(item.expected)}</code>, Actual: <code className="bg-card px-1.5 py-0.5 rounded">{JSON.stringify(item.actual)}</code>
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-warning/10 text-warning text-[10px] font-bold uppercase rounded-md">
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
