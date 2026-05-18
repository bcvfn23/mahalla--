"use client";

import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  MapPin,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const crimeData = [
  { name: 'Янв', value: 400, risk: 240 },
  { name: 'Фев', value: 300, risk: 139 },
  { name: 'Мар', value: 200, risk: 980 },
  { name: 'Апр', value: 278, risk: 390 },
  { name: 'Май', value: 189, risk: 480 },
  { name: 'Июн', value: 239, risk: 380 },
  { name: 'Июл', value: 349, risk: 430 },
];

const districtData = [
  { name: 'Юнусабадский', crimes: 120, severity: 'high' },
  { name: 'Алмазарский', crimes: 98, severity: 'medium' },
  { name: 'Мирзо-Улугбекский', crimes: 86, severity: 'medium' },
  { name: 'Чиланзарский', crimes: 145, severity: 'high' },
  { name: 'Мирабадский', crimes: 45, severity: 'low' },
];

const kpiCards = [
  {
    title: "Всего инцидентов",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: ShieldAlert,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Индекс безопасности",
    value: "84/100",
    change: "+2.4%",
    trend: "up",
    icon: Activity,
    color: "text-safe",
    bg: "bg-safe/10",
  },
  {
    title: "Опасные районы",
    value: "4",
    change: "-1",
    trend: "down",
    icon: MapPin,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    title: "Активные патрули",
    value: "128",
    change: "+14",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Обзор системы</h1>
        <p className="text-sm text-foreground/60 mt-1">Аналитика преступности в реальном времени (Г. Ташкент)</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <card.icon className={`h-24 w-24 ${card.color}`} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground/70">{card.title}</p>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-foreground">{card.value}</h3>
                <span className={`flex items-center text-xs font-medium ${card.trend === 'up' && card.color === 'text-warning' ? 'text-danger' : card.trend === 'down' ? 'text-safe' : 'text-primary'}`}>
                  {card.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {card.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Динамика преступности</h2>
            <select className="bg-card border border-card-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none">
              <option>Текущий год</option>
              <option>Прошлый год</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(51, 65, 85, 0.5)', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="value" name="Инциденты" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="risk" name="Уровень риска" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Chart / List */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Топ районов по риску</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {districtData.sort((a, b) => b.crimes - a.crimes).map((district, i) => (
              <div key={district.name} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-card-border/50 hover:bg-card/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${district.severity === 'high' ? 'bg-danger/20 text-danger border border-danger/30' : 
                      district.severity === 'medium' ? 'bg-warning/20 text-warning border border-warning/30' : 
                      'bg-safe/20 text-safe border border-safe/30'}`}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{district.name}</p>
                    <p className="text-xs text-foreground/50">{district.crimes} инцидентов</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium
                  ${district.severity === 'high' ? 'text-danger bg-danger/10' : 
                    district.severity === 'medium' ? 'text-warning bg-warning/10' : 
                    'text-safe bg-safe/10'}`}
                >
                  {district.severity === 'high' ? 'Критично' : district.severity === 'medium' ? 'Внимание' : 'Норма'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
