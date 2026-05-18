"use client";

import { TrendingUp, Activity } from "lucide-react";

export default function PredictionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            ИИ-Прогнозирование
          </h1>
          <p className="text-sm text-foreground/60 mt-1">Предиктивные модели вероятности правонарушений</p>
        </div>
      </div>
      
      <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center">
        <Activity className="h-16 w-16 text-primary/30 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-foreground mb-2">Модуль прогнозирования загружается</h2>
        <p className="text-foreground/60 max-w-md">
          Система предиктивной аналитики находится в стадии калибровки на исторических данных. 
          Этот раздел будет активирован после завершения обучения ИИ-модели.
        </p>
      </div>
    </div>
  );
}
