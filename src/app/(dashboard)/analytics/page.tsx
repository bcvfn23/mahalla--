"use client";

import { BrainCircuit, AlertTriangle, Lightbulb, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            AI Аналитика (Mock)
          </h1>
          <p className="text-sm text-foreground/60 mt-1">Детальный анализ районов и генерация ИИ-рекомендаций</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Экспорт отчета
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-bold text-foreground">Анализ: Юнусабадский район</h2>
            <div className="px-3 py-1 bg-danger/20 border border-danger/30 text-danger rounded-full text-xs font-bold uppercase tracking-wider">
              Риск: Высокий
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-card/40 border border-card-border rounded-xl">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <BrainCircuit className="h-4 w-4 text-primary" />
                Выводы ИИ
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                <li>Обнаружен рост краж на 15% за последние 2 недели.</li>
                <li>Повторяющиеся инциденты возле станции метро "Шахристан".</li>
                <li>Повышенная ночная активность (23:00 - 04:00).</li>
              </ul>
            </div>

            <div className="p-4 bg-safe/10 border border-safe/20 rounded-xl">
              <h3 className="text-sm font-semibold text-safe flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4" />
                Рекомендации
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
                <li>Увеличить количество пеших патрулей в районе станции метро.</li>
                <li>Установить дополнительные камеры видеонаблюдения на неосвещенных улицах.</li>
                <li>Провести профилактические беседы с населением.</li>
              </ul>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
              <h3 className="text-sm font-semibold text-warning flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" />
                Прогноз на следующий месяц
              </h3>
              <p className="text-sm text-foreground/70">
                При сохранении текущей тенденции и отсутствии превентивных мер, риск совершения правонарушений может возрасти еще на 12%.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Global AI Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl"
        >
          <h2 className="text-lg font-bold text-foreground mb-6">Глобальные тренды города</h2>
          
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-primary/30">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(14,165,233,0.8)]"></div>
              <h3 className="text-sm font-semibold text-foreground">Снижение уличной преступности</h3>
              <p className="text-xs text-foreground/60 mt-1">В центральных районах наблюдается спад уличной преступности на 8% благодаря новой системе освещения.</p>
            </div>
            
            <div className="relative pl-6 border-l-2 border-warning/30">
              <div className="absolute w-3 h-3 bg-warning rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
              <h3 className="text-sm font-semibold text-foreground">Аномалия: Мошенничество</h3>
              <p className="text-xs text-foreground/60 mt-1">ИИ выявил паттерн кибер-мошенничества, ориентированного на пенсионеров в спальных районах.</p>
            </div>
            
            <div className="relative pl-6 border-l-2 border-danger/30">
              <div className="absolute w-3 h-3 bg-danger rounded-full -left-[7px] top-1 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <h3 className="text-sm font-semibold text-foreground">Сезонный всплеск</h3>
              <p className="text-xs text-foreground/60 mt-1">Ожидается рост имущественных преступлений в связи с началом летнего сезона отпусков.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
