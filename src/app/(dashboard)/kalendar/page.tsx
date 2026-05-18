"use client";

import { useI18n } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, Mailbox, X } from "lucide-react";
import { useState } from "react";
import AddEventModal from "@/components/modals/AddEventModal";
import { toast } from "sonner";

export default function KalendarPage() {
  const { t, lang } = useI18n();

  const days = ["DU", "SE", "CHO", "PA", "JU", "SHA", "YA"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(18);
  const [events, setEvents] = useState<any[]>([]);

  const selectedDateString = `2026-05-${selectedDay.toString().padStart(2, '0')}`;
  const dayEvents = events.filter(e => e.date === selectedDay);

  const handleAddEvent = (eventData: any) => {
    setEvents([...events, eventData]);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success("Tadbir o'chirildi");
  };

  const getEventStyle = (type: string) => {
    switch(type) {
      case 'muddat': return { border: 'border-danger/50 text-danger', icon: '⏰', name: 'Muddat' };
      case 'uchrashuv': return { border: 'border-primary/50 text-primary', icon: '👥', name: 'Uchrashuv' };
      case 'tadbir': return { border: 'border-safe/50 text-safe', icon: '🎉', name: 'Tadbir' };
      default: return { border: 'border-foreground/20 text-foreground', icon: '📌', name: 'Tadbir' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {lang === 'uz' ? "Tadbirlar Kalendari" : "Календарь мероприятий"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <button className="p-2 rounded-full bg-card hover:bg-card/80 border border-card-border transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground">May 2026</h2>
            <button className="p-2 rounded-full bg-card hover:bg-card/80 border border-card-border transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-4">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-foreground/40">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {/* Empty slots for start of month */}
            <div className="h-16"></div>
            <div className="h-16"></div>
            <div className="h-16"></div>
            <div className="h-16"></div>
            
            {dates.map((date) => {
              const hasEvent = events.some(e => e.date === date);
              return (
                <div 
                  key={date} 
                  onClick={() => setSelectedDay(date)}
                  className={`h-16 rounded-xl flex items-start p-2 transition-colors cursor-pointer border relative ${
                    date === selectedDay 
                      ? 'bg-primary/20 border-primary text-primary font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                      : 'bg-card/30 hover:bg-card border-card-border/50 text-foreground'
                  }`}
                >
                  {date}
                  {hasEvent && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-card-border/50">
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#0b2b4d] text-primary"><div className="w-2 h-2 bg-primary rounded-full"/>Uchrashuv</span>
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#0b3323] text-safe"><div className="w-2 h-2 bg-safe rounded-full"/>Tadbir</span>
             <span className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded bg-[#3b1219] text-danger"><div className="w-2 h-2 bg-danger rounded-full"/>Muddat</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/50">
            <h2 className="text-lg font-bold text-foreground">{selectedDay} May 2026</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              + {lang === 'uz' ? "Tadbir" : "Событие"}
            </button>
          </div>
          
          {dayEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
               <Mailbox className="w-12 h-12 text-primary mb-4" />
               <p>{lang === 'uz' ? "Bu kunda tadbir yo'q" : "В этот день событий нет"}</p>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {dayEvents.map(ev => {
                const style = getEventStyle(ev.type);
                return (
                  <div key={ev.id} className={`p-4 rounded-xl border border-l-4 bg-[#0d152e] relative group ${style.border}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">{style.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-wider">{style.name}</span>
                      <button 
                        onClick={() => handleDelete(ev.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-card/50 hover:bg-danger hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <h3 className="text-foreground font-bold mb-1">{ev.title}</h3>
                    {ev.desc && (
                      <p className="text-xs text-foreground/50">{ev.desc}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AddEventModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddEvent}
        selectedDate={selectedDateString}
      />
    </div>
  );
}
