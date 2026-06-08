"use client";

import { useI18n } from "@/lib/i18n";
import { 
  Map as MapIcon, 
  ShieldAlert, 
  Navigation, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Compass, 
  RefreshCw, 
  Activity, 
  CornerDownRight,
  TrendingUp,
  Fuel,
  Timer,
  Zap,
  Users,
  AlertOctagon,
  FileText,
  ShieldCheck,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface Youth {
  id: string;
  ism: string;
  familiya: string;
  jshshir: string;
  pasport: string;
  yil: string;
  jins: string;
  maktab: string;
  telefon: string;
  davomat: string;
  mahalla: string;
  xavf: string;
  izoh: string;
  createdAt?: string;
}

interface PatrolRoute {
  id: number;
  nameUz: string;
  nameRu: string;
  districtUz: string;
  districtRu: string;
  risk: "high" | "medium" | "low";
  riskValue: number;
  recommendationUz: string;
  recommendationRu: string;
  status: "pending" | "completed";
  x: number;
  y: number;
}

interface DistrictData {
  id: string;
  nameUz: string;
  nameRu: string;
  area: string;
  population: string;
  sector: number;
  points: string;
  centerX: number;
  centerY: number;
  descriptionUz: string;
  descriptionRu: string;
}

interface PatrolUnit {
  id: string;
  nameUz: string;
  nameRu: string;
  type: "car" | "scooter" | "foot";
  x: number;
  y: number;
  battery: number;
  speed: number;
  signal: number;
  color: string;
  path: { x: number; y: number }[];
  pathProgress: number;
  statusUz: string;
  statusRu: string;
  activeTaskId?: string;
}

interface EmergencyAlert {
  id: string;
  titleUz: string;
  titleRu: string;
  mahalla: string;
  x: number;
  y: number;
  type: "school" | "loitering" | "preventive";
  status: "pending" | "dispatched" | "resolved";
}

interface JointReport {
  id: string;
  timestamp: string;
  inspectorName: string;
  leaderName: string;
  mahalla: string;
  descriptionUz: string;
  descriptionRu: string;
}

const districtsList: DistrictData[] = [
  {
    id: "sayxunobod",
    nameUz: "Sayxunobod tumani",
    nameRu: "Сайхунабадский район",
    area: "421.3 km²",
    population: "84,500",
    sector: 3,
    points: "80,50 320,50 240,180 80,180",
    centerX: 180,
    centerY: 115,
    descriptionUz: "Qishloq xo'jaligi va tomorqa klasterlari. Yoshlar bandligini ta'minlash dasturi doirasida monitoring olib borilmoqda.",
    descriptionRu: "Сельскохозяйственные и приусадебные кластеры. Ведется мониторинг по программе занятости молодежи."
  },
  {
    id: "sirdaryo",
    nameUz: "Sirdaryo tumani",
    nameRu: "Сырдарьинский район",
    area: "549.1 km²",
    population: "131,800",
    sector: 2,
    points: "320,50 580,50 420,180 240,180",
    centerX: 390,
    centerY: 115,
    descriptionUz: "Transport bog'lamalari va vokzal atrofi. Profilaktika inspektori tomonidan sektor nazorati olib borilmoqda.",
    descriptionRu: "Транспортные узлы и вокзальная зона. Проводится секторный контроль со стороны инспектора профилактики."
  },
  {
    id: "shirin",
    nameUz: "Shirin shahri",
    nameRu: "город Ширин",
    area: "14.8 km²",
    population: "18,900",
    sector: 4,
    points: "580,50 750,50 750,180 600,180 420,180",
    centerX: 620,
    centerY: 115,
    descriptionUz: "Energetiklar shahri. Jamoat tartibi barqaror. Voyaga yetmaganlar o'rtasida jinoyatchilik ko'rsatkichi eng past hudud.",
    descriptionRu: "Город энергетиков. Общественный порядок стабилен. Самый низкий уровень преступности среди несовершеннолетних."
  },
  {
    id: "guliston",
    nameUz: "Guliston shahri",
    nameRu: "город Гулистан",
    area: "32.8 km²",
    population: "124,100",
    sector: 1,
    points: "80,180 240,180 420,180 420,320 240,320 80,320",
    centerX: 250,
    centerY: 250,
    descriptionUz: "Viloyat markazi. PPX va Yoshlar Yetakchilari tomonidan tun-u kun doimiy reyd monitoring tizimi o'rnatilgan.",
    descriptionRu: "Областной центр. Установлена круглосуточная система мониторинга патрулей ППX и молодежных лидеров."
  },
  {
    id: "sardoba",
    nameUz: "Sardoba tumani",
    nameRu: "Сардобинский район",
    area: "518.6 km²",
    population: "56,400",
    sector: 2,
    points: "80,320 240,320 420,320 420,450 240,450",
    centerX: 250,
    centerY: 385,
    descriptionUz: "Qizil toifadagi yoshlar bilan tizimli xonadonbay suhbatlar rejalashtirilgan.",
    descriptionRu: "Запланированы систематические поквартирные обходы молодежи красной категории."
  },
  {
    id: "yangiyer",
    nameUz: "Yangiyer shahri",
    nameRu: "город Янгиер",
    area: "28.2 km²",
    population: "46,200",
    sector: 1,
    points: "420,320 600,180 750,320 600,450 420,450",
    centerX: 560,
    centerY: 350,
    descriptionUz: "Sanoat zonasi va oliy o'quv yurtlari hududi. Talabalar yotoqxonalari va jamoat joylarida patrul kuchaytirilgan.",
    descriptionRu: "Промзона и вузовский городок. Усилено патрулирование студенческих общежитий и общественных мест."
  }
];

// Key points for road networks on grid map
const NodeHQ = { x: 100, y: 380 };
const NodeA = { x: 250, y: 320 };
const NodeB = { x: 380, y: 220 };
const NodeC = { x: 500, y: 180 };
const NodeD = { x: 600, y: 280 };
const NodeE = { x: 450, y: 380 };
const NodeF = { x: 280, y: 440 };

export default function PatrulPage() {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [youthList, setYouthList] = useState<Youth[]>([]);
  const [routes, setRoutes] = useState<PatrolRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("guliston");
  
  // Interactive control settings
  const [isGenerating, setIsGenerating] = useState(true);
  const [genStep, setGenStep] = useState(0);
  const [isGpsOn, setIsGpsOn] = useState(false);
  const [mapOverlayMode, setMapOverlayMode] = useState<"vector" | "thermal" | "sector">("vector");
  
  // Custom route drawing mode
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawWaypoints, setDrawWaypoints] = useState<{ x: number; y: number }[]>([]);
  const [customRouteName, setCustomRouteName] = useState("");
  
  // Joint Reports State
  const [jointReports, setJointReports] = useState<JointReport[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    inspectorName: "",
    leaderName: "",
    mahalla: "",
    descriptionUz: "",
    descriptionRu: ""
  });

  // Animated Oscilloscope link signal
  const [tick, setTick] = useState(0);
  
  // Simulation Active State
  const [isSimActive, setIsSimActive] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);

  // Active simulated emergency alerts
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);

  // Telemetry status units
  const [units, setUnits] = useState<PatrolUnit[]>([
    {
      id: "ppx_cobalt",
      nameUz: "PPX Cobalt-099",
      nameRu: "ППX Cobalt-099",
      type: "car",
      x: NodeHQ.x,
      y: NodeHQ.y,
      battery: 89,
      speed: 45,
      signal: 98,
      color: "#06b6d4",
      path: [NodeHQ, NodeA, NodeB, NodeC, NodeD, NodeE, NodeF, NodeHQ],
      pathProgress: 0,
      statusUz: "Patrullik xizmatida",
      statusRu: "На патрулировании"
    },
    {
      id: "yetakchi_scooter",
      nameUz: "Yoshlar Yetakchisi (Skuter)",
      nameRu: "Молодежный лидер (Скутер)",
      type: "scooter",
      x: NodeHQ.x,
      y: NodeHQ.y,
      battery: 76,
      speed: 25,
      signal: 94,
      color: "#f5a623",
      path: [NodeHQ, NodeA, NodeB, NodeE, NodeF, NodeHQ],
      pathProgress: 0,
      statusUz: "MFYlarda xonadonbay o'rganish",
      statusRu: "Поквартирный обход в МСГ"
    },
    {
      id: "inspektor_foot",
      nameUz: "Profilaktika Inspektori",
      nameRu: "Инспектор Профилактики",
      type: "foot",
      x: NodeHQ.x,
      y: NodeHQ.y,
      battery: 100,
      speed: 6,
      signal: 99,
      color: "#10b981",
      path: [NodeHQ, NodeF, NodeE, NodeHQ],
      pathProgress: 0,
      statusUz: "Taqsimot punktida profilaktik suhbat",
      statusRu: "Профилактическая беседа"
    }
  ]);

  // Load baseline statistics and assets
  useEffect(() => {
    setMounted(true);
    loadTacticalRoutes();

    // Default Joint Reports
    const storedReports = localStorage.getItem("jointReports");
    if (storedReports) {
      setJointReports(JSON.parse(storedReports));
    } else {
      const defaultReports: JointReport[] = [
        {
          id: "r1",
          timestamp: "2026-05-20 14:12",
          inspectorName: "Kpt. Radjabov O.",
          leaderName: "S. Karimov",
          mahalla: "Guliston",
          descriptionUz: "Yoshlar bilan oilaviy nizolarni hal qilish va ishga joylashtirish bo'yicha profilaktik suhbat o'tkazildi.",
          descriptionRu: "Проведена профилактическая беседа по разрешению семейных конфликтов и трудоустройству молодежи."
        },
        {
          id: "r2",
          timestamp: "2026-05-20 11:34",
          inspectorName: "Ltn. Alimov R.",
          leaderName: "M. Usmonova",
          mahalla: "Do'stlik",
          descriptionUz: "4-maktabda dars qoldiruvchi 3 nafar voyaga yetmagan yoshlarning ota-onalari bilan tushuntirish ishlari olib borildi.",
          descriptionRu: "Проведена разъяснительная работа с родителями 3 несовершеннолетних учеников школы №4, пропускающих занятия."
        }
      ];
      setJointReports(defaultReports);
      localStorage.setItem("jointReports", JSON.stringify(defaultReports));
    }
  }, []);

  // Listen for youthAdded event to reload tactical routes
  useEffect(() => {
    const handleYouthAdded = () => {
      loadTacticalRoutes(true);
    };
    window.addEventListener("youthAdded", handleYouthAdded);
    return () => {
      window.removeEventListener("youthAdded", handleYouthAdded);
    };
  }, [lang]);

  // Simulation loop tick for positions and oscilloscope
  useEffect(() => {
    let animationFrameId: number;
    const updateTick = () => {
      setTick(prev => prev + 1);

      if (isSimActive) {
        setUnits(prevUnits => 
          prevUnits.map(unit => {
            if (unit.path.length < 2) return unit;

            // Increment progress based on speed and multiplier
            let progressInc = (unit.speed * simSpeed * 0.05);
            let nextProgress = unit.pathProgress + progressInc;
            
            // Check loop completion
            if (nextProgress >= 100) {
              nextProgress = 0;
            }

            // Interpolate position along multi-node path
            const segmentCount = unit.path.length - 1;
            const segmentLength = 100 / segmentCount;
            const activeSegment = Math.min(
              segmentCount - 1,
              Math.floor(nextProgress / segmentLength)
            );
            const segmentProgress = (nextProgress % segmentLength) / segmentLength;
            
            const startNode = unit.path[activeSegment];
            const endNode = unit.path[activeSegment + 1];

            const curX = startNode.x + (endNode.x - startNode.x) * segmentProgress;
            const curY = startNode.y + (endNode.y - startNode.y) * segmentProgress;

            // Simulate slight battery drainage
            const nextBattery = Math.max(10, unit.battery - (Math.random() > 0.98 ? 1 : 0));

            // Resolve dispatcher alerts if near target
            let statusUz = unit.statusUz;
            let statusRu = unit.statusRu;
            let activeTaskId = unit.activeTaskId;
            let currentSpeed = unit.speed;

            if (unit.activeTaskId) {
              const activeTask = activeAlerts.find(a => a.id === unit.activeTaskId);
              if (activeTask) {
                const distToAlert = Math.sqrt(
                  Math.pow(curX - activeTask.x, 2) + Math.pow(curY - activeTask.y, 2)
                );
                if (distToAlert < 15) {
                  // Arrived at destination, resolving incident
                  resolveAlert(unit.activeTaskId);
                  activeTaskId = undefined;
                  currentSpeed = unit.type === "car" ? 45 : unit.type === "scooter" ? 25 : 6;
                  statusUz = unit.type === "car" ? "Patrullik xizmatida" : unit.type === "scooter" ? "MFYlarda xonadonbay o'rganish" : "Taqsimot punktida profilaktik suhbat";
                  statusRu = unit.type === "car" ? "На патрулировании" : unit.type === "scooter" ? "Поквартирный обход в МСГ" : "Профилактическая беседа";
                }
              }
            }

            return {
              ...unit,
              x: curX,
              y: curY,
              battery: nextBattery,
              speed: currentSpeed,
              pathProgress: nextProgress,
              activeTaskId,
              statusUz,
              statusRu
            };
          })
        );
      }

      animationFrameId = requestAnimationFrame(updateTick);
    };

    animationFrameId = requestAnimationFrame(updateTick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSimActive, simSpeed, activeAlerts]);

  // Periodic random emergency alert spawn
  useEffect(() => {
    const alertTimer = setInterval(() => {
      if (!isSimActive) return;
      spawnRandomIncident();
    }, 24000);

    return () => clearInterval(alertTimer);
  }, [isSimActive]);

  // Generate & Blend Routes based on localStorage ("youthList")
  const loadTacticalRoutes = (showToast = false) => {
    setIsGenerating(true);
    setGenStep(0);
    
    // Base coordinates mapping for random generation
    const coordinateMap: { [key: string]: { x: number; y: number } } = {
      "guliston": { x: 280, y: 180 },
      "do'stlik": { x: 420, y: 220 },
      "navro'z": { x: 340, y: 130 },
      "shirin": { x: 620, y: 150 },
      "oqdaryo": { x: 500, y: 320 },
      "yangiyer": { x: 580, y: 260 },
    };

    const baseRoutes: PatrolRoute[] = [
      { 
        id: 1, 
        nameUz: "Dehqon bozori va vokzal atrofi reyd", 
        nameRu: "Рейд вокруг дехканского рынка и вокзала", 
        districtUz: "Guliston sh.", 
        districtRu: "г. Гулистан", 
        risk: "high", 
        riskValue: 85,
        recommendationUz: "Kechki soat 20:00 dan keyin patrulni kuchaytirish. AI tahliliga ko'ra bezorilik xavfi yuqori.", 
        recommendationRu: "Усилить патруль после 20:00. Анализ ИИ показывает высокий риск хулиганства.", 
        status: "pending",
        x: 280,
        y: 180
      },
      { 
        id: 2, 
        nameUz: "4-maktab va sport stadioni maydoni monitoringi", 
        nameRu: "Мониторинг школы №4 и территории спорткомплекса", 
        districtUz: "Sirdaryo t.", 
        districtRu: "Сырдарьинский р.", 
        risk: "medium", 
        riskValue: 48,
        recommendationUz: "Voyaga yetmaganlar guruh bo'lib to'planishining oldini olish uchun tungi nazorat.", 
        recommendationRu: "Ночной обход для предотвращения скопления групп несовершеннолетних.", 
        status: "completed",
        x: 420,
        y: 220
      },
      { 
        id: 3, 
        nameUz: "Sirdaryo daryosi sohili va sayilgoh", 
        nameRu: "Набережная реки Сырдарья и аллея", 
        districtUz: "Sayxunobod t.", 
        districtRu: "Сайхунабадский р.", 
        risk: "medium", 
        riskValue: 56,
        recommendationUz: "Taqiqlangan hududlarda cho'milish va tungi yurishlar bo'yicha profilaktika.", 
        recommendationRu: "Профилактические беседы касательно купания в запрещенных зонах и ночных прогулок.", 
        status: "pending",
        x: 340,
        y: 130
      }
    ];

    const stepInterval = setInterval(() => {
      setGenStep(prev => prev + 1);
    }, 400);

    setTimeout(() => {
      clearInterval(stepInterval);
      
      const stored = localStorage.getItem("youthList");
      let customYouth: Youth[] = [];
      if (stored) {
        customYouth = JSON.parse(stored);
        setYouthList(customYouth);
      }

      const finalRoutes = [...baseRoutes];

      // Add custom drawing routes from localStorage if available
      const storedCustomRoutes = localStorage.getItem("customPatrolRoutes");
      if (storedCustomRoutes) {
        const parsed: PatrolRoute[] = JSON.parse(storedCustomRoutes);
        finalRoutes.push(...parsed);
      }

      // Scan dynamic high risk youth profiles
      customYouth.forEach((youth, index) => {
        const isHigh = youth.xavf === "Yuqori xavf" || youth.xavf === "Высокий риск";
        const isMed = youth.xavf === "O'rta xavf" || youth.xavf === "Средний риск";
        
        if (isHigh || isMed) {
          const mahallaLower = youth.mahalla.toLowerCase().trim();
          const coords = coordinateMap[mahallaLower] || { 
            x: 200 + Math.floor(Math.random() * 400), 
            y: 100 + Math.floor(Math.random() * 250) 
          };

          const customId = 100 + index;
          finalRoutes.push({
            id: customId,
            nameUz: `${youth.ism} ${youth.familiya} yashash hududi - Mahalla nazorati`,
            nameRu: `Район проживания ${youth.ism} ${youth.familiya} - Контроль махалли`,
            districtUz: `${youth.mahalla} m.`,
            districtRu: `м. ${youth.mahalla}`,
            risk: isHigh ? "high" : "medium",
            riskValue: isHigh ? 92 : 64,
            recommendationUz: `AI tavsiyasi: Yoshlar yetakchisi bilan birgalikda oilaviy sharoitni o'rganish va profilaktik suhbat.`,
            recommendationRu: `Рекомендация ИИ: Обследование жилищных условий совместно с лидером молодежи и беседа.`,
            status: "pending",
            x: coords.x,
            y: coords.y
          });
        }
      });

      setRoutes(finalRoutes);
      setIsGenerating(false);
      
      const sorted = [...finalRoutes].sort((a, b) => b.riskValue - a.riskValue);
      if (sorted.length > 0) {
        setSelectedRouteId(sorted[0].id);
      }

      if (showToast) {
        toast.success(
          lang === 'uz' 
            ? `AI tizimi yangilandi! ${finalRoutes.length} ta optimal marshrut tuzildi.` 
            : `Система ИИ обновлена! Сформировано ${finalRoutes.length} оптимальных маршрутов.`
        );
      }
    }, 1200);
  };

  // Spawn dynamic localized incidents
  const spawnRandomIncident = () => {
    const randomDist = districtsList[Math.floor(Math.random() * districtsList.length)];
    const types: ("school" | "loitering" | "preventive")[] = ["school", "loitering", "preventive"];
    const activeType = types[Math.floor(Math.random() * types.length)];
    
    let titleUz = "";
    let titleRu = "";
    
    if (activeType === "school") {
      titleUz = "Dars qoldirish holati aniqlandi";
      titleRu = "Выявлен случай прогула занятий";
    } else if (activeType === "loitering") {
      titleUz = "Tungi bemaqsad yurish";
      titleRu = "Ночное бесцельное нахождение";
    } else {
      titleUz = "Profilaktik suhbat zaruriyati";
      titleRu = "Необходима профилактическая беседа";
    }

    const alertId = `alert-${Date.now()}`;
    const newAlert: EmergencyAlert = {
      id: alertId,
      titleUz,
      titleRu,
      mahalla: randomDist.nameUz,
      x: randomDist.centerX + (Math.random() * 40 - 20),
      y: randomDist.centerY + (Math.random() * 40 - 20),
      type: activeType,
      status: "pending"
    };

    setActiveAlerts(prev => [newAlert, ...prev].slice(0, 3));
    toast.error(
      lang === 'uz'
        ? `🚨 TEZKOR! ${randomDist.nameUz} hududida voqea aniqlandi: ${titleUz}!`
        : `🚨 СРОЧНО! Обнаружено событие в районе ${randomDist.nameRu}: ${titleRu}!`
    );
  };

  // Dispatch selected unit to emergency alert
  const dispatchUnit = (unitId: string, alertId: string) => {
    const targetAlert = activeAlerts.find(a => a.id === alertId);
    if (!targetAlert) return;

    setUnits(prevUnits => 
      prevUnits.map(unit => {
        if (unit.id === unitId) {
          // Calculate direct path to alert coordinate
          const detourPath = [
            { x: unit.x, y: unit.y },
            { x: targetAlert.x, y: targetAlert.y },
            NodeHQ // Return to base after dispatch
          ];
          
          return {
            ...unit,
            path: detourPath,
            pathProgress: 0,
            speed: unit.type === "car" ? 110 : unit.type === "scooter" ? 60 : 20,
            activeTaskId: alertId,
            statusUz: `Chaqiruv bo'yicha ketmoqda: ${targetAlert.titleUz}`,
            statusRu: `Выезжает по вызову: ${targetAlert.titleRu}`
          };
        }
        return unit;
      })
    );

    setActiveAlerts(prev => 
      prev.map(a => a.id === alertId ? { ...a, status: "dispatched" } : a)
    );

    toast.info(
      lang === 'uz'
        ? `Yo'naltirildi. Eng yaqin patrul yo'nalishi qayta hisoblandi.`
        : `Направлено. Маршрут ближайшего патруля изменен.`
    );
  };

  const resolveAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success(
      lang === 'uz'
        ? "Vazifa muvaffaqiyatli yakunlandi. Hudud nazorat ostiga olindi."
        : "Задача успешно выполнена. Территория взята под контроль."
    );
  };

  // Draw custom route handler
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawingMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 500);

    setDrawWaypoints(prev => [...prev, { x, y }]);
  };

  const saveCustomRoute = () => {
    if (drawWaypoints.length < 2) {
      toast.error(lang === 'uz' ? "Kamida 2 ta nuqta belgilashingiz kerak!" : "Необходимо указать минимум 2 точки!");
      return;
    }
    if (!customRouteName.trim()) {
      toast.error(lang === 'uz' ? "Marshrut nomini kiriting!" : "Введите название маршрута!");
      return;
    }

    const newCustomRoute: PatrolRoute = {
      id: Date.now(),
      nameUz: customRouteName,
      nameRu: customRouteName,
      districtUz: lang === 'uz' ? "Maxsus hudud" : "Спец. зона",
      districtRu: lang === 'uz' ? "Maxsus hudud" : "Спец. зона",
      risk: "medium",
      riskValue: 65,
      recommendationUz: "Operator tomonidan chizilgan maxsus taktik reyd va profilaktik nazorat.",
      recommendationRu: "Специальный тактический рейд и профилактический контроль, проложенный оператором.",
      status: "pending",
      x: drawWaypoints[drawWaypoints.length - 1].x,
      y: drawWaypoints[drawWaypoints.length - 1].y
    };

    const storedCustom = localStorage.getItem("customPatrolRoutes");
    const currentCustom: PatrolRoute[] = storedCustom ? JSON.parse(storedCustom) : [];
    const updated = [...currentCustom, newCustomRoute];
    localStorage.setItem("customPatrolRoutes", JSON.stringify(updated));

    // Update units path for Cobalt to take the new route
    setUnits(prev => 
      prev.map(u => u.id === "ppx_cobalt" ? { ...u, path: [NodeHQ, ...drawWaypoints, NodeHQ], pathProgress: 0 } : u)
    );

    toast.success(lang === 'uz' ? "Yangi taktik yo'nalish saqlandi va faollashtirildi!" : "Новый тактический маршрут сохранен и активирован!");
    setIsDrawingMode(false);
    setDrawWaypoints([]);
    setCustomRouteName("");
    loadTacticalRoutes();
  };

  // Add Joint Agency Report
  const saveJointReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.inspectorName || !newReport.leaderName || !newReport.mahalla || !newReport.descriptionUz) {
      toast.error(lang === 'uz' ? "Barcha maydonlarni to'ldiring!" : "Заполните все поля!");
      return;
    }

    const newRecord: JointReport = {
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      inspectorName: newReport.inspectorName,
      leaderName: newReport.leaderName,
      mahalla: newReport.mahalla,
      descriptionUz: newReport.descriptionUz,
      descriptionRu: newReport.descriptionRu || newReport.descriptionUz
    };

    const updated = [newRecord, ...jointReports];
    setJointReports(updated);
    localStorage.setItem("jointReports", JSON.stringify(updated));

    setIsReportModalOpen(false);
    setNewReport({
      inspectorName: "",
      leaderName: "",
      mahalla: "",
      descriptionUz: "",
      descriptionRu: ""
    });

    toast.success(lang === 'uz' ? "Qo'shma reyd hisoboti saqlandi!" : "Отчет о совместном рейде сохранен!");
  };

  // Calculate dynamic stats for selected district
  const getDistrictStats = (districtId: string) => {
    const list = youthList;
    const isMatch = (yMahalla: string) => {
      const m = yMahalla.toLowerCase().trim();
      if (districtId === "guliston") return m.includes("guliston") || m.includes("do'stlik") || m.includes("vokzal");
      if (districtId === "sirdaryo") return m.includes("sirdaryo") || m.includes("oqdaryo") || m.includes("boz");
      if (districtId === "sayxunobod") return m.includes("sayxunobod") || m.includes("navro'z") || m.includes("sohil");
      if (districtId === "shirin") return m.includes("shirin") || m.includes("nurafshon");
      if (districtId === "yangiyer") return m.includes("yangiyer") || m.includes("ma'rifat");
      if (districtId === "sardoba") return m.includes("sardoba") || m.includes("yurtdosh");
      return false;
    };

    const filtered = list.filter(y => isMatch(y.mahalla));
    
    const highRisk = filtered.filter(y => y.xavf === "Yuqori xavf" || y.xavf === "Высокий риск").length;
    const medRisk = filtered.filter(y => y.xavf === "O'rta xavf" || y.xavf === "Средний риск").length;
    const lowRisk = filtered.filter(y => y.xavf === "Kam xavf" || y.xavf === "Низкий риск" || y.xavf === "Kamroq xavf").length;

    const total = filtered.length;
    let riskPct = 15; // default base minimum
    if (total > 0) {
      riskPct = Math.min(95, Math.round(((highRisk * 3 + medRisk * 2 + lowRisk) / (total * 3)) * 100));
    }

    let calculatedRisk: "high" | "medium" | "low" = "low";
    if (riskPct > 65) calculatedRisk = "high";
    else if (riskPct > 35) calculatedRisk = "medium";

    return {
      total,
      highRisk,
      medRisk,
      lowRisk,
      riskPct,
      calculatedRisk
    };
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const selectedDistrict = districtsList.find(d => d.id === selectedDistrictId) || districtsList[0];
  const districtStats = getDistrictStats(selectedDistrictId);

  // Dynamic Radio Connection Waveform coordinates
  const getOscilloscopePath = () => {
    let d = `M 0 15`;
    for (let x = 0; x <= 160; x += 8) {
      const y = 15 + Math.sin((x + tick * 6) * 0.12) * 8;
      d += ` L ${x} ${y}`;
    }
    return d;
  };

  const getDistrictColor = (risk: "high" | "medium" | "low") => {
    if (risk === "high") return "stroke-danger fill-danger/5";
    if (risk === "medium") return "stroke-warning fill-warning/5";
    return "stroke-safe fill-safe/5";
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      
      {/* Dynamic Resource Optimization Dashboard (Government Presentation KPI Header) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 glass-panel border border-primary/10 rounded-2xl bg-gradient-to-r from-card/30 via-primary/5 to-card/30">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-foreground/45 uppercase tracking-widest font-mono">
              {lang === 'uz' ? "Yoqilg'i tejalishi" : "Экономия топлива"}
            </p>
            <p className="text-lg font-bold text-primary font-mono tracking-tight flex items-center gap-1">
              +28.4%
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-safe/10 border border-safe/20 flex items-center justify-center text-safe shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-foreground/45 uppercase tracking-widest font-mono">
              {lang === 'uz' ? "Vaqt optimizatsiyasi" : "Оптимизация времени"}
            </p>
            <p className="text-lg font-bold text-safe font-mono tracking-tight">
              42 min <span className="text-[10px] font-normal text-foreground/50">{lang === 'uz' ? "kunda" : "в день"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-foreground/45 uppercase tracking-widest font-mono">
              {lang === 'uz' ? "Sektor qamrovi" : "Охват секторов"}
            </p>
            <p className="text-lg font-bold text-warning font-mono tracking-tight">
              94.2%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-card-border/50 justify-between">
          <div>
            <p className="text-[9px] text-foreground/45 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse inline-block" />
              {lang === 'uz' ? "Radio chastota" : "Радиосвязь IIB"}
            </p>
            <p className="text-xs font-bold text-foreground/80 font-mono mt-0.5">148.225 MHz</p>
          </div>
          <svg className="w-20 h-8 text-primary" viewBox="0 0 160 30">
            <path d={getOscilloscopePath()} fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

      </div>

      {/* Main Administrative Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            {lang === 'uz' ? "SIRDARYO VILOYATI IIB VA YOSHLAR AGENTLIGI" : "УВД И АГЕНТСТВО МОЛОДЕЖИ СЫРДАРЬИ"}
          </h2>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MapIcon className="w-6 h-6 text-primary" />
            {lang === 'uz' ? "Taktik Patrul Nazorati" : "Управление тактическими патрулями"}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          
          {/* Map Modes Switcher */}
          <div className="bg-card/80 border border-card-border rounded-xl p-1 flex gap-1 text-[11px] font-bold">
            <button 
              onClick={() => setMapOverlayMode("vector")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${mapOverlayMode === 'vector' ? 'bg-primary text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {lang === 'uz' ? "Vektor" : "Вектор"}
            </button>
            <button 
              onClick={() => setMapOverlayMode("thermal")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${mapOverlayMode === 'thermal' ? 'bg-danger text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {lang === 'uz' ? "Xavf (Issiqlik)" : "Тепловизор"}
            </button>
            <button 
              onClick={() => setMapOverlayMode("sector")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${mapOverlayMode === 'sector' ? 'bg-safe text-white shadow-md' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {lang === 'uz' ? "Sektorlar" : "Сектора"}
            </button>
          </div>

          <button 
            onClick={() => setIsSimActive(!isSimActive)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border
              ${isSimActive 
                ? 'bg-safe/10 border-safe/30 text-safe hover:bg-safe/25' 
                : 'bg-danger/10 border-danger/30 text-danger hover:bg-danger/25'}`}
          >
            <span>{isSimActive ? (lang === 'uz' ? "Simulyatsiya Faol" : "Симуляция Активна") : (lang === 'uz' ? "Simulyatsiya To'xtatilgan" : "Симуляция на Паузе")}</span>
          </button>

          <button 
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border
              ${isDrawingMode 
                ? 'bg-primary/25 border-primary/50 text-foreground' 
                : 'bg-card border-card-border hover:bg-card-border/20 text-foreground'}`}
          >
            <span>{isDrawingMode ? (lang === 'uz' ? "Chizishni tugatish" : "Закончить черчение") : (lang === 'uz' ? "Yangi yo'nalish chizish" : "Чертить маршрут")}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Dynamic Vector map with interactive districts and units */}
        <div className="lg:col-span-2 glass-panel rounded-2xl border border-card-border/80 overflow-hidden flex flex-col h-[560px] relative select-none">
          
          {/* Tactical Background Grid */}
          <div className="absolute inset-0 bg-background z-0" />
          
          <svg className="absolute inset-0 w-full h-full z-10 opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.8" />
                <circle cx="40" cy="0" r="1" fill="rgba(6, 182, 212, 0.2)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tactical-grid)" />
          </svg>

          {/* Holographic scanning laser line */}
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-primary/5 to-transparent border-b border-primary/20 z-10 pointer-events-none blur-[1px]"
          />

          {/* Vector Map Elements Overlay */}
          <svg 
            className="absolute inset-0 w-full h-full z-20" 
            viewBox="0 0 800 500"
            onClick={handleMapClick}
          >
            {/* 1. Districts Boundaries (Yandex Maps interactive polygons) */}
            {districtsList.map(dist => {
              const isSelected = dist.id === selectedDistrictId;
              const stats = getDistrictStats(dist.id);
              
              // Color coding based on risk level
              let strokeColor = "rgba(16, 185, 129, 0.4)"; // Safe
              let fillColor = "rgba(16, 185, 129, 0.02)";
              if (stats.calculatedRisk === "high") {
                strokeColor = "rgba(239, 68, 68, 0.5)"; // High
                fillColor = mapOverlayMode === "thermal" ? "rgba(239, 68, 68, 0.16)" : "rgba(239, 68, 68, 0.04)";
              } else if (stats.calculatedRisk === "medium") {
                strokeColor = "rgba(245, 158, 11, 0.5)"; // Med
                fillColor = mapOverlayMode === "thermal" ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.03)";
              }

              // Sector boundary overlays
              if (mapOverlayMode === "sector") {
                if (dist.sector === 1) strokeColor = "rgba(6, 182, 212, 0.6)";
                if (dist.sector === 2) strokeColor = "rgba(168, 85, 247, 0.6)";
                if (dist.sector === 3) strokeColor = "rgba(249, 115, 22, 0.6)";
                if (dist.sector === 4) strokeColor = "rgba(236, 72, 153, 0.6)";
              }

              return (
                <g key={dist.id} className="cursor-pointer pointer-events-auto" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDistrictId(dist.id);
                }}>
                  {/* Glowing selection shadow */}
                  {isSelected && (
                    <polygon 
                      points={dist.points} 
                      className="transition-all duration-300 blur-[3px]"
                      fill="transparent"
                      stroke={stats.calculatedRisk === "high" ? "#ef4444" : stats.calculatedRisk === "medium" ? "#f5a623" : "#10b981"}
                      strokeWidth="5"
                    />
                  )}

                  {/* Primary interactive polygon */}
                  <polygon 
                    points={dist.points} 
                    className={`transition-all duration-300 ${isSelected ? 'stroke-[2px]' : 'stroke-[1px] hover:fill-white/[0.04]'}`}
                    fill={fillColor}
                    stroke={isSelected ? (stats.calculatedRisk === "high" ? "#ef4444" : stats.calculatedRisk === "medium" ? "#f5a623" : "#10b981") : strokeColor}
                  />

                  {/* District text marker */}
                  <text 
                    x={dist.centerX} 
                    y={dist.centerY} 
                    fill="rgba(255,255,255,0.3)" 
                    fontSize="9" 
                    fontWeight="bold" 
                    textAnchor="middle"
                    className="pointer-events-none uppercase tracking-wider font-mono select-none"
                  >
                    {lang === 'uz' ? dist.nameUz : dist.nameRu}
                  </text>
                </g>
              );
            })}

            {/* 2. Dotted Street/Route networks (patrol paths) */}
            <g opacity="0.15">
              <line x1={NodeHQ.x} y1={NodeHQ.y} x2={NodeA.x} y2={NodeA.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeA.x} y1={NodeA.y} x2={NodeB.x} y2={NodeB.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeB.x} y1={NodeB.y} x2={NodeC.x} y2={NodeC.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeC.x} y1={NodeC.y} x2={NodeD.x} y2={NodeD.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeD.x} y1={NodeD.y} x2={NodeE.x} y2={NodeE.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeE.x} y1={NodeE.y} x2={NodeF.x} y2={NodeF.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1={NodeF.x} y1={NodeF.y} x2={NodeHQ.x} y2={NodeHQ.y} stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>

            {/* 3. Render custom drawing path waypoints if drawing mode is active */}
            {isDrawingMode && drawWaypoints.length > 0 && (
              <g>
                <path 
                  d={`M ${drawWaypoints.map(w => `${w.x} ${w.y}`).join(' L ')}`} 
                  fill="none" 
                  stroke="#ec4899" 
                  strokeWidth="2.5" 
                  strokeDasharray="6 4"
                  className="animate-pulse" 
                />
                {drawWaypoints.map((w, idx) => (
                  <circle key={`draw-${idx}`} cx={w.x} cy={w.y} r="5" fill="#ec4899" stroke="#fff" strokeWidth="1.5" />
                ))}
              </g>
            )}

            {/* 4. Active Patrol Route glowing connection */}
            {selectedRoute && !isDrawingMode && (
              <g>
                <line 
                  x1={NodeHQ.x} 
                  y1={NodeHQ.y} 
                  x2={selectedRoute.x} 
                  y2={selectedRoute.y} 
                  stroke={selectedRoute.risk === 'high' ? 'var(--danger)' : 'var(--warning)'} 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  className="opacity-20 blur-[3px]"
                />
                <line 
                  x1={NodeHQ.x} 
                  y1={NodeHQ.y} 
                  x2={selectedRoute.x} 
                  y2={selectedRoute.y} 
                  stroke={selectedRoute.risk === 'high' ? 'var(--danger)' : 'var(--warning)'} 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                  strokeDasharray="8 6"
                  className="animate-[dash_20s_linear_infinite]"
                />
              </g>
            )}

            {/* 5. Central HQ base station */}
            <g transform={`translate(${NodeHQ.x}, ${NodeHQ.y})`}>
              <circle cx="0" cy="0" r="14" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="5" fill="#06b6d4" />
              <circle cx="0" cy="0" r="24" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-60 animate-[spin_30s_linear_infinite]" />
              <text x="18" y="4" fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="monospace">IIB HQ</text>
            </g>

            {/* 6. Active Emergency incident hotspots */}
            {activeAlerts.map(alert => (
              <g key={alert.id} transform={`translate(${alert.x}, ${alert.y})`}>
                <circle cx="0" cy="0" r="22" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="0" cy="0" r="10" fill="#ef4444" className="shadow-[0_0_10px_#ef4444]" />
                <AlertTriangle className="w-3.5 h-3.5 text-white absolute" style={{ transform: "translate(-7px, -7px)" }} />
              </g>
            ))}

            {/* 7. Live Patrol Fleet (Animated Cars, Scooters, Inspectors) */}
            {units.map(unit => {
              const rotation = tick * (unit.type === "scooter" ? 3 : 1.5);
              
              return (
                <g key={unit.id} transform={`translate(${unit.x}, ${unit.y})`} className="transition-all duration-75">
                  {/* Flashing light bars for PPX Cobalt */}
                  {unit.type === "car" && (
                    <circle cx="0" cy="0" r="15" fill="none" stroke={tick % 4 < 2 ? "#ef4444" : "#3b82f6"} strokeWidth="3" className="opacity-80 animate-pulse" />
                  )}

                  {/* Range pulse for inspector */}
                  {unit.type === "foot" && (
                    <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" className="animate-ping" style={{ animationDuration: '3s' }} />
                  )}

                  {/* Core icon dot */}
                  <circle 
                    cx="0" 
                    cy="0" 
                    r="6.5" 
                    fill={unit.color} 
                    stroke="#fff" 
                    strokeWidth="1.5" 
                    className="shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
                  
                  {/* Digital identification label */}
                  <text 
                    x="9" 
                    y="3" 
                    fill="#fff" 
                    fontSize="7.5" 
                    fontWeight="bold" 
                    fontFamily="monospace"
                    className="bg-card px-1 rounded border border-white/10 shadow-lg select-none"
                  >
                    {lang === 'uz' 
                      ? (unit.type === "car" ? "PPX" : unit.type === "scooter" ? "YT" : "INSP") 
                      : (unit.type === "car" ? "ППС" : unit.type === "scooter" ? "МЛ" : "ИНСП")}
                  </text>
                </g>
              );
            })}

          </svg>

          {/* Compass tape */}
          <div className="absolute top-4 right-4 z-30 glass-panel border border-card-border px-3 py-1.5 rounded-xl bg-card/90 flex items-center gap-2 text-[10px] font-mono text-foreground/75">
            <Compass className="w-3.5 h-3.5 text-primary animate-[spin_20s_linear_infinite]" />
            <span className="text-primary font-bold">HEADING 084° [ENE]</span>
          </div>

          {/* Info overlay of Sirdaryo Map */}
          <div className="absolute top-4 left-4 z-30 glass-panel border border-primary/20 p-3 rounded-xl bg-card/95 backdrop-blur-md max-w-xs shadow-2xl">
            <h3 className="text-xs font-bold text-foreground mb-0.5">{lang === 'uz' ? "Sirdaryo Raqamli Taktik Monitoringi" : "Цифровой мониторинг Сырдарьи"}</h3>
            <p className="text-[9px] text-foreground/45 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse inline-block" />
              {lang === 'uz' ? "IIB tezkor radiomuloqot navbatchiligi faol" : "Активна дежурная служба радиосвязи УВД"}
            </p>
          </div>

          {/* Interactive drawing mode prompt toolbar */}
          {isDrawingMode && (
            <div className="absolute bottom-4 left-4 right-4 z-30 glass-panel border border-pink-500/40 p-3 rounded-xl bg-card/95 flex items-center justify-between shadow-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">{lang === 'uz' ? "Taktik yo'nalish muharriri" : "Редактор тактических маршрутов"}</span>
                <span className="text-[9px] text-foreground/50">{lang === 'uz' ? "Xarita bo'ylab nuqtalar qo'ying va nom kiriting" : "Расставьте точки на карте и введите название"}</span>
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder={lang === 'uz' ? "Marshrut nomi..." : "Название маршрута..."} 
                  value={customRouteName} 
                  onChange={(e) => setCustomRouteName(e.target.value)}
                  className="bg-background/80 border border-card-border px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:border-pink-500/80" 
                />
                <button 
                  onClick={saveCustomRoute}
                  className="bg-pink-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-pink-600 cursor-pointer"
                >
                  {lang === 'uz' ? "Saqlash" : "Сохранить"}
                </button>
              </div>
            </div>
          )}

          {/* Coordinates readout bar */}
          <div className="absolute bottom-3 left-4 z-30 text-[9px] font-mono text-foreground/30 flex gap-4">
            <span>GRID ACTIVE [v4.1.2]</span>
            <span>HQ POS: [100.380]</span>
            <span>SELECTED DISTRICT: [{selectedDistrictId.toUpperCase()}]</span>
          </div>

        </div>

        {/* Right Panel: Double Column Dashboard Passport (Yandex Maps District Passport & Incidents logs) */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border/80 h-[560px] flex flex-col relative overflow-hidden">
          
          {/* AI calculations spinner overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.2)]"></div>
                  <Compass className="w-6 h-6 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight animate-pulse mb-1">
                  {lang === 'uz' ? "AI hudud tahlilini hisoblamoqda..." : "ИИ рассчитывает анализ районов..."}
                </h3>
                <div className="w-48 h-1 bg-card-border/50 rounded-full overflow-hidden mt-3 max-w-xs mx-auto">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="h-full bg-primary"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Tabs: Dynamic District Passport */}
          <div className="shrink-0 space-y-4 mb-4">
            <div className="flex justify-between items-start border-b border-card-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  {lang === 'uz' ? selectedDistrict.nameUz : selectedDistrict.nameRu}
                  <span className={`px-2 py-0.5 border rounded text-[9px] uppercase tracking-widest font-bold font-mono
                    ${districtStats.calculatedRisk === 'high' ? 'bg-danger/10 border-danger/30 text-danger' : districtStats.calculatedRisk === 'medium' ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-safe/10 border-safe/30 text-safe'}`}>
                    {lang === 'uz' ? `XAVF: ${districtStats.riskPct}%` : `РИСК: ${districtStats.riskPct}%`}
                  </span>
                </h3>
                <p className="text-[11px] text-foreground/50 mt-0.5 leading-relaxed">
                  {lang === 'uz' ? selectedDistrict.descriptionUz : selectedDistrict.descriptionRu}
                </p>
              </div>
            </div>

            {/* Micro Yandex Maps statistics readout */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background/40 border border-card-border/60 p-2 rounded-xl text-center">
                <span className="text-[9px] text-foreground/40 uppercase tracking-wider block font-mono">{lang === 'uz' ? "Maydoni" : "Площадь"}</span>
                <span className="text-xs font-bold text-foreground font-mono">{selectedDistrict.area}</span>
              </div>
              <div className="bg-background/40 border border-card-border/60 p-2 rounded-xl text-center">
                <span className="text-[9px] text-foreground/40 uppercase tracking-wider block font-mono">{lang === 'uz' ? "Aholisi" : "Население"}</span>
                <span className="text-xs font-bold text-foreground font-mono">{selectedDistrict.population}</span>
              </div>
              <div className="bg-background/40 border border-card-border/60 p-2 rounded-xl text-center">
                <span className="text-[9px] text-foreground/40 uppercase tracking-wider block font-mono">{lang === 'uz' ? "Sektor" : "Сектор"}</span>
                <span className="text-xs font-bold text-primary font-mono">{selectedDistrict.sector}-sektor</span>
              </div>
            </div>
          </div>

          {/* Middle Body Scroll Area: Spawns Dynamic incidents, Dispatcher panel & joint logs */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 custom-scrollbar">
            
            {/* 1. Dynamic Incidents dispatch cards (Emergency 102 Board) */}
            {activeAlerts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-danger uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <AlertOctagon className="w-3.5 h-3.5 text-danger animate-pulse" />
                  {lang === 'uz' ? "Tezkor IIB 102 chaqiruvlari" : "Срочные вызовы IIB 102"}
                </h4>
                
                {activeAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-danger/5 border border-danger/25 rounded-xl space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-foreground leading-tight">
                          {lang === 'uz' ? alert.titleUz : alert.titleRu}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-danger/20 text-danger border border-danger/30 rounded font-mono uppercase tracking-widest font-bold">
                          {lang === 'uz' ? "Chora kutilmoqda" : "Ожидание"}
                        </span>
                      </div>
                      <p className="text-[10px] text-foreground/50 mt-1">
                        📍 {alert.mahalla} hududi
                      </p>
                    </div>

                    <div className="flex gap-1.5 border-t border-danger/10 pt-2">
                      {units.map(unit => (
                        <button
                          key={unit.id}
                          disabled={unit.activeTaskId !== undefined}
                          onClick={() => dispatchUnit(unit.id, alert.id)}
                          className="flex-1 text-[9px] font-bold bg-card hover:bg-card-border/40 disabled:opacity-30 border border-card-border px-2 py-1.5 rounded-lg text-foreground transition-all cursor-pointer"
                        >
                          {unit.type === 'car' ? 'Cobalt' : unit.type === 'scooter' ? 'Skuter' : 'Insp.'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Registered Youth in Selected District */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {lang === 'uz' ? "Sistemadagi yoshlar toifalari" : "Категории молодежи на учете"}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-background/30 border border-danger/20 p-2.5 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[15px] font-extrabold text-danger font-mono">{districtStats.highRisk}</span>
                  <span className="text-[9px] text-foreground/45 uppercase mt-0.5">{lang === 'uz' ? "Qizil" : "Красный"}</span>
                </div>
                <div className="bg-background/30 border border-warning/20 p-2.5 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[15px] font-extrabold text-warning font-mono">{districtStats.medRisk}</span>
                  <span className="text-[9px] text-foreground/45 uppercase mt-0.5">{lang === 'uz' ? "Sariq" : "Желтый"}</span>
                </div>
                <div className="bg-background/30 border border-safe/20 p-2.5 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-[15px] font-extrabold text-safe font-mono">{districtStats.lowRisk}</span>
                  <span className="text-[9px] text-foreground/45 uppercase mt-0.5">{lang === 'uz' ? "Yashil" : "Зеленый"}</span>
                </div>
              </div>
            </div>

            {/* 3. Joint Agency Collaboration Log feed */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  {lang === 'uz' ? "Qo'shma bayonnomalar hisoboti" : "Протоколы совместных рейдов"}
                </h4>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-5 h-5 rounded bg-primary/10 border border-primary/20 text-primary flex items-center justify-center hover:bg-primary/20 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {jointReports.map(report => (
                  <div key={report.id} className="p-3 bg-card/30 border border-card-border/60 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] font-bold text-primary font-mono uppercase">
                        👨‍✈️ {report.inspectorName} | 👔 {report.leaderName}
                      </span>
                      <span className="text-[8px] font-mono text-foreground/35">{report.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-foreground/70 leading-relaxed pt-1 border-t border-card-border/30">
                      <span className="font-bold text-foreground">📍 Mfy {report.mahalla}:</span> {lang === 'uz' ? report.descriptionUz : report.descriptionRu}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* HUD Footer status indicator */}
          <div className="mt-4 pt-4 border-t border-card-border/50 shrink-0">
             <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl flex gap-2.5 items-center">
                <ShieldCheck className="w-4 h-4 text-safe shrink-0" />
                <p className="text-[9.5px] text-foreground/60 leading-relaxed font-semibold">
                  {lang === 'uz' 
                    ? "Hamkorlik tizimi orqali kiritilgan barcha qo'shma reydlar hisoboti viloyat hokimligi ma'lumotlar bazasiga yuboriladi." 
                    : "Все отчеты о совместных рейдах направляются в базу данных хокимията области."}
                </p>
             </div>
          </div>

        </div>

      </div>

      {/* Joint Report Creation Modal popup */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/85 dark:bg-[#070b1a]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md glass-panel p-6 rounded-2xl border border-primary/20 bg-card/95 dark:bg-[#090f23]/95 shadow-[0_0_30px_rgba(6,182,212,0.15)] space-y-4"
          >
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                {lang === 'uz' ? "Yangi qo'shma bayonnoma qo'shish" : "Добавить совместный протокол"}
              </h3>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="text-foreground/40 hover:text-foreground cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveJointReport} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider">{lang === 'uz' ? "Profilaktika inspektori" : "Инспектор"}</label>
                  <input 
                    type="text" 
                    placeholder="Ltn. Rahimov"
                    required
                    value={newReport.inspectorName}
                    onChange={(e) => setNewReport(prev => ({ ...prev, inspectorName: e.target.value }))}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider">{lang === 'uz' ? "Yoshlar Yetakchisi" : "Лидер молодежи"}</label>
                  <input 
                    type="text" 
                    placeholder="S. Aliyev"
                    required
                    value={newReport.leaderName}
                    onChange={(e) => setNewReport(prev => ({ ...prev, leaderName: e.target.value }))}
                    className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider">{lang === 'uz' ? "Mahalla (MFY)" : "Махалля"}</label>
                <input 
                  type="text" 
                  placeholder="Guliston"
                  required
                  value={newReport.mahalla}
                  onChange={(e) => setNewReport(prev => ({ ...prev, mahalla: e.target.value }))}
                  className="w-full bg-background border border-card-border px-3 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider">{lang === 'uz' ? "Amalga oshirilgan choralar (UZ)" : "Принятые меры (UZ)"}</label>
                <textarea 
                  rows={3}
                  placeholder="Profilaktik tushuntirish va suhbat..."
                  required
                  value={newReport.descriptionUz}
                  onChange={(e) => setNewReport(prev => ({ ...prev, descriptionUz: e.target.value }))}
                  className="w-full bg-background border border-card-border p-3 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-foreground/65 uppercase tracking-wider">{lang === 'uz' ? "Amalga oshirilgan choralar (RU)" : "Принятые меры (RU)"}</label>
                <textarea 
                  rows={3}
                  placeholder="Проведены профилактические меры..."
                  value={newReport.descriptionRu}
                  onChange={(e) => setNewReport(prev => ({ ...prev, descriptionRu: e.target.value }))}
                  className="w-full bg-background border border-card-border p-3 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-bold shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
              >
                {lang === 'uz' ? "Bayonnomani Saqlash" : "Сохранить протокол"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
