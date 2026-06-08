"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { CheckCircle, Plus, X, ArrowRight, ArrowLeft } from "lucide-react";
import { soundEngine } from "@/lib/audio";

export default function RejalarPage() {
  const { lang } = useI18n();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", desc: "" });
  
  // Drag and Drop States
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("tasksList");
    if (data) {
      setTasks(JSON.parse(data));
    } else {
      const initial = [
        { id: 1, title: "Sessiya yig'ilishi", desc: "Mahalla faollari bilan haftalik yig'ilish", status: "todo" },
        { id: 2, title: "Sumbula ko'chasi nazorati", desc: "Obodonlashtirish ishlari nazorati", status: "in_progress" },
      ];
      setTasks(initial);
      localStorage.setItem("tasksList", JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const task = {
      id: Date.now(),
      title: newTask.title,
      desc: newTask.desc,
      status: "todo"
    };

    const updated = [task, ...tasks];
    setTasks(updated);
    localStorage.setItem("tasksList", JSON.stringify(updated));
    setNewTask({ title: "", desc: "" });
    setIsAddModalOpen(false);
    soundEngine?.play("success");
  };

  const handleMove = (id: number, newStatus: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTasks(updated);
    localStorage.setItem("tasksList", JSON.stringify(updated));
    soundEngine?.play("success");
  };

  const handleDelete = (id: number) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem("tasksList", JSON.stringify(updated));
    soundEngine?.play("click");
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    soundEngine?.play("hover");
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    if (activeColumn !== column) {
      setActiveColumn(column);
    }
  };

  const handleDragLeave = () => {
    setActiveColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setActiveColumn(null);
    const idStr = e.dataTransfer.getData("text/plain") || (draggedId ? draggedId.toString() : "");
    if (!idStr) return;
    const id = parseInt(idStr);

    const task = tasks.find(t => t.id === id);
    if (task && task.status !== newStatus) {
      // Perform the move (will automatically trigger sound inside handleMove)
      handleMove(id, newStatus);
    } else {
      soundEngine?.play("click");
    }
    setDraggedId(null);
  };

  const todo = tasks.filter(t => t.status === 'todo');
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const done = tasks.filter(t => t.status === 'done');

  // Simple stats for graph mock
  const doneCount = done.length;
  const maxScale = Math.max(doneCount + 2, 5);

  const renderTask = (t: any) => (
    <div 
      key={t.id} 
      draggable="true"
      onDragStart={(e) => handleDragStart(e, t.id)}
      onDragEnd={() => setDraggedId(null)}
      className={`p-3 bg-card/80 border rounded-xl shadow-sm hover:border-primary/50 transition-colors group relative cursor-grab active:cursor-grabbing ${draggedId === t.id ? 'opacity-30 border-dashed border-primary/50 bg-primary/5' : 'border-card-border'}`}
    >
      <h4 className="text-sm font-bold text-foreground pr-6">{t.title}</h4>
      {t.desc && <p className="text-[11px] text-foreground/60 mt-1">{t.desc}</p>}
      
      <div className="flex gap-1 mt-3 justify-between items-center">
        <div className="flex gap-1">
          {t.status === 'todo' && <button onClick={() => handleMove(t.id, 'in_progress')} className="p-1 bg-warning/10 text-warning rounded hover:bg-warning/20"><ArrowRight className="w-3 h-3"/></button>}
          {t.status === 'in_progress' && (
            <>
              <button onClick={() => handleMove(t.id, 'todo')} className="p-1 bg-card border border-card-border text-foreground/50 rounded hover:text-foreground"><ArrowLeft className="w-3 h-3"/></button>
              <button onClick={() => handleMove(t.id, 'done')} className="p-1 bg-safe/10 text-safe rounded hover:bg-safe/20"><CheckCircle className="w-3 h-3"/></button>
            </>
          )}
          {t.status === 'done' && <button onClick={() => handleMove(t.id, 'in_progress')} className="p-1 bg-card border border-card-border text-foreground/50 rounded hover:text-foreground"><ArrowLeft className="w-3 h-3"/></button>}
        </div>
        <button onClick={() => handleDelete(t.id)} className="p-1 text-danger/50 hover:text-danger hover:bg-danger/10 rounded transition-colors opacity-0 group-hover:opacity-100">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            REJA BOSHQARUVI
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {lang === 'uz' ? "Faol rejalar markazi" : "Центр активных планов"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Tasks Synced</span>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Plus className="w-4 h-4" />
            {lang === 'uz' ? "Vazifa qo'shish" : "Добавить задачу"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kanban Board */}
        <div className="glass-panel p-6 rounded-2xl min-h-[500px] flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            YO'NALTIRILGAN ISHLANMALAR
          </h3>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-card-border/50">
            {lang === 'uz' ? "Kanban Reja Taxtasi" : "Канбан Доска Планов"}
          </h2>
          
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div 
              onDragOver={(e) => handleDragOver(e, 'todo')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'todo')}
              className={`rounded-xl p-3 border transition-all duration-200 flex flex-col min-h-[350px] ${activeColumn === 'todo' ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-background/50 border-card-border/50'}`}
            >
              <h4 className="text-xs font-bold text-foreground/70 uppercase mb-3 flex justify-between">
                {lang === 'uz' ? "Kutilmoqda" : "К выполнению"} <span className="bg-card px-1.5 py-0.5 rounded text-[10px]">{todo.length}</span>
              </h4>
              <div className="space-y-2 flex-1 min-h-[250px]">
                {todo.map(renderTask)}
              </div>
            </div>
            
            <div 
              onDragOver={(e) => handleDragOver(e, 'in_progress')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'in_progress')}
              className={`rounded-xl p-3 border transition-all duration-200 flex flex-col min-h-[350px] ${activeColumn === 'in_progress' ? 'border-warning/50 bg-warning/5 ring-1 ring-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-background/50 border-card-border/50'}`}
            >
              <h4 className="text-xs font-bold text-warning uppercase mb-3 flex justify-between">
                {lang === 'uz' ? "Jarayonda" : "В процессе"} <span className="bg-warning/10 px-1.5 py-0.5 rounded text-[10px]">{inProgress.length}</span>
              </h4>
              <div className="space-y-2 flex-1 min-h-[250px]">
                {inProgress.map(renderTask)}
              </div>
            </div>

            <div 
              onDragOver={(e) => handleDragOver(e, 'done')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'done')}
              className={`rounded-xl p-3 border transition-all duration-200 flex flex-col min-h-[350px] ${activeColumn === 'done' ? 'border-safe/50 bg-safe/5 ring-1 ring-safe/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-background/50 border-card-border/50'}`}
            >
              <h4 className="text-xs font-bold text-safe uppercase mb-3 flex justify-between">
                {lang === 'uz' ? "Yakunlandi" : "Готово"} <span className="bg-safe/10 px-1.5 py-0.5 rounded text-[10px]">{done.length}</span>
              </h4>
              <div className="space-y-2 flex-1 min-h-[250px]">
                {done.map(renderTask)}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Graph */}
        <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
            HAFTALIK AKTIVLIK
          </h3>
          <h2 className="text-lg font-bold text-foreground mb-6 pb-4 border-b border-card-border/50 flex justify-between items-center">
            {lang === 'uz' ? "Faollik grafigi" : "График активности"}
            <span className="text-xs text-safe font-normal bg-safe/10 px-2 py-1 rounded-full border border-safe/20">
              {doneCount} {lang === 'uz' ? "ta yakunlangan" : "завершено"}
            </span>
          </h2>
          
          <div className="relative h-64 mt-8 px-4">
             <div className="flex flex-col justify-between h-full text-xs text-foreground/40 border-l border-card-border/50 pl-2">
                <span>{maxScale}</span>
                <span>{Math.round(maxScale * 0.75)}</span>
                <span>{Math.round(maxScale * 0.5)}</span>
                <span>{Math.round(maxScale * 0.25)}</span>
                <span>0</span>
             </div>
             
             {/* Simple dynamic bar for the current week based on 'done' tasks */}
             <div className="absolute bottom-6 left-16 w-8 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm transition-all duration-1000" 
                  style={{ height: `${Math.min((doneCount / maxScale) * 100, 100)}%` }}>
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary">{doneCount}</div>
             </div>

             <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-foreground/40 pt-2 border-t border-card-border/50">
                <span>1-hafta</span>
                <span>2-hafta</span>
                <span>3-hafta</span>
                <span>4-hafta</span>
             </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-card-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-card/30 border-b border-card-border/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {lang === 'uz' ? "Yangi Vazifa" : "Новая задача"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-foreground/50 hover:text-foreground hover:bg-card/50 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Sarlavha" : "Заголовок"}</label>
                <input required type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/70 mb-2 uppercase tracking-wider">{lang === 'uz' ? "Qisqacha tavsif" : "Краткое описание"}</label>
                <textarea rows={3} value={newTask.desc} onChange={(e) => setNewTask({...newTask, desc: e.target.value})} className="w-full bg-background border border-card-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 bg-card border border-card-border text-foreground rounded-xl hover:bg-card-border transition-colors text-sm font-bold">
                  {lang === 'uz' ? "Bekor qilish" : "Отмена"}
                </button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-primary to-[#06b6d4] text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {lang === 'uz' ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
