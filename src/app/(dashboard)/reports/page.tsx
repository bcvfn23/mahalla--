"use client";

import { FileText, Download, Clock } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    { id: 1, title: "Сводный отчет по городу (Май 2026)", date: "17.05.2026", size: "2.4 MB" },
    { id: 2, title: "Анализ зон повышенного риска", date: "15.05.2026", size: "1.8 MB" },
    { id: 3, title: "Эффективность патрулирования", date: "10.05.2026", size: "3.1 MB" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Сгенерированные Отчеты
          </h1>
          <p className="text-sm text-foreground/60 mt-1">Официальные документы и ИИ-сводки для руководства</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 glow-safe">
          <FileText className="h-4 w-4" />
          Сгенерировать новый
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card/60 border-b border-card-border">
              <th className="p-4 text-sm font-semibold text-foreground/70">Название отчета</th>
              <th className="p-4 text-sm font-semibold text-foreground/70">Дата генерации</th>
              <th className="p-4 text-sm font-semibold text-foreground/70">Размер</th>
              <th className="p-4 text-sm font-semibold text-foreground/70 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-card-border/50 hover:bg-card/40 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-foreground">{report.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-foreground/70 text-sm">
                    <Clock className="h-4 w-4" />
                    {report.date}
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground/70">{report.size}</td>
                <td className="p-4 text-right">
                  <button className="p-2 text-foreground/60 hover:text-primary bg-card/50 hover:bg-card rounded-lg transition-colors border border-card-border inline-flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span className="text-xs font-medium px-1">Скачать PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
