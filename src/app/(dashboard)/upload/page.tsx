"use client";

import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Загрузка данных</h1>
        <p className="text-sm text-foreground/60 mt-1">Загрузите Excel или CSV файл со статистикой для автоматического ИИ-анализа</p>
      </div>

      <div 
        className={`glass-panel mt-8 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center py-24 px-6 text-center
          ${isDragging ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(14,165,233,0.2)]' : 'border-card-border hover:border-primary/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="h-20 w-20 bg-card rounded-full flex items-center justify-center mb-6 shadow-lg border border-white/5">
              <UploadCloud className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Перетащите файл сюда</h3>
            <p className="text-foreground/50 text-sm mb-6 max-w-sm">
              Поддерживаются файлы форматов .xlsx, .xls, .csv. Размер файла не должен превышать 50 MB.
            </p>
            <label className="cursor-pointer">
              <span className="px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(14,165,233,0.3)] inline-block">
                Выбрать файл на компьютере
              </span>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </>
        ) : (
          <>
            <div className="h-20 w-20 bg-safe/20 rounded-full flex items-center justify-center mb-6 shadow-lg border border-safe/30">
              <FileSpreadsheet className="h-10 w-10 text-safe" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{file.name}</h3>
            <p className="text-foreground/50 text-sm mb-6">
              Размер: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex gap-4">
              <button 
                className="px-6 py-3 text-sm font-medium text-foreground bg-card border border-card-border rounded-xl hover:bg-card/80 transition-all"
                onClick={() => setFile(null)}
              >
                Отменить
              </button>
              <button className="px-6 py-3 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2 glow-safe">
                <CheckCircle2 className="h-5 w-5" />
                Начать обработку ИИ
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 p-6 bg-warning/5 border border-warning/20 rounded-2xl">
        <h4 className="text-sm font-semibold text-warning mb-2">Требования к структуре данных</h4>
        <p className="text-xs text-foreground/70 leading-relaxed">
          Файл должен содержать столбцы: "Район", "Тип преступления", "Дата", "Широта", "Долгота", "Описание". 
          Система автоматически нормализует данные и выявит отсутствующие значения. 
          После загрузки ИИ-модуль проведет анализ на аномалии в течение нескольких минут.
        </p>
      </div>
    </div>
  );
}
