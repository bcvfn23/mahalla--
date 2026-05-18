"use client";

import dynamic from "next/dynamic";
import { Map, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n";

// Dynamically import MapComponent to prevent SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/ui/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-card/50 animate-pulse rounded-2xl flex items-center justify-center">
      <span className="text-primary font-medium tracking-widest animate-bounce">Инициализация ИИ-Карты...</span>
    </div>
  ),
});

export default function HeatmapPage() {
  const { lang } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            {lang === 'uz' ? "Interaktiv Heatmap" : "Интерактивный Heatmap"}
          </h1>
          <p className="text-foreground/60 mt-1">
            {lang === 'uz' ? "Jinoyat o'choqlari va insidentlar zichligini vizualizatsiya qilish" : "Визуализация очагов преступности и плотности инцидентов"}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-card-border rounded-lg p-1">
          <button className="px-3 py-1.5 text-xs font-medium rounded bg-primary/20 text-primary">
            {lang === 'uz' ? "Issiqlik xaritasi" : "Тепловая карта"}
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded text-foreground/60 hover:text-foreground">
            {lang === 'uz' ? "Klasterlar" : "Кластеры"}
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border-l-2 border-l-danger">
          <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">
            {lang === 'uz' ? "Kritik hududlar" : "Критические зоны"}
          </p>
          <div className="text-2xl font-bold text-foreground">2</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border-l-2 border-l-warning">
          <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">
            {lang === 'uz' ? "Diqqat zonalari" : "Зоны внимания"}
          </p>
          <div className="text-2xl font-bold text-foreground">5</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border-l-2 border-l-safe">
          <p className="text-xs text-foreground/60 uppercase tracking-wider mb-1">
            {lang === 'uz' ? "Xavfsiz hududlar" : "Безопасные районы"}
          </p>
          <div className="text-2xl font-bold text-foreground">4</div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* Map UI Overlay Controls */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <div className="glass-panel p-2 rounded-lg flex flex-col gap-2">
            <button className="p-2 bg-card/80 hover:bg-card rounded text-foreground/80 hover:text-primary transition-colors" title={lang === 'uz' ? "Qatlamlar" : "Слои"}>
              <Layers className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* The Map */}
        <MapComponent />
      </div>
    </div>
  );
}
