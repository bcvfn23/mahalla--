"use client";

import { BrainCircuit, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function RightAISidebar() {
  const { t } = useI18n();

  return (
    <div className="w-80 bg-card/40 backdrop-blur-md border-l border-card-border p-4 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />
        <h2 className="text-lg font-bold text-foreground">{t("ai.title")}</h2>
      </div>

      <div className="space-y-4">
        {/* Insight Card 1 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl glass-panel border-l-4 border-l-danger"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-danger mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("ai.risk_title")}</p>
              <p className="text-xs text-foreground/70 mt-1">{t("ai.risk_desc")}</p>
            </div>
          </div>
        </motion.div>

        {/* Insight Card 2 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl glass-panel border-l-4 border-l-warning"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("ai.hotspot_title")}</p>
              <p className="text-xs text-foreground/70 mt-1">{t("ai.hotspot_desc")}</p>
            </div>
          </div>
        </motion.div>

        {/* Insight Card 3 */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl glass-panel border-l-4 border-l-safe"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-safe mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("ai.rec_title")}</p>
              <p className="text-xs text-foreground/70 mt-1">{t("ai.rec_desc")}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-auto pt-6">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-center text-primary font-medium">{t("ai.status")}</p>
        </div>
      </div>
    </div>
  );
}
