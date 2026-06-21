"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const mahallaCoords: Record<string, { lat: number, lng: number }> = {
  "guliston": { lat: 40.489, lng: 68.784 },
  "do'stlik": { lat: 40.495, lng: 68.790 },
  "navro'z": { lat: 40.482, lng: 68.775 },
  "shirin": { lat: 40.485, lng: 68.795 },
  "oqdaryo": { lat: 40.498, lng: 68.765 },
  "yangiyer": { lat: 40.478, lng: 68.805 },
};

// Sirdaryo / Guliston fallback hotspots
const fallbackHotspots = [
  { id: "fb1", lat: 40.489, lng: 68.784, intensity: 'high', title: 'Очаг краж', district: 'Гулистан' },
  { id: "fb2", lat: 40.495, lng: 68.790, intensity: 'medium', title: 'Хулиганство', district: 'Дустлик' },
  { id: "fb3", lat: 40.482, lng: 68.775, intensity: 'high', title: 'Угоны авто', district: 'Навруз' },
];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Check initial theme from documentElement
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    const handleThemeChange = () => {
      const isLightNow = document.documentElement.classList.contains("light");
      setTheme(isLightNow ? "light" : "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    // Fetch live incidents from database and map to coordinates
    const fetchLiveIncidents = async () => {
      try {
        const res = await fetch("/api/incidents");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.items) {
            const mapped = data.items.map((inc: any, index: number) => {
              const locationStr = (inc.locationUz || "").toLowerCase();
              let coords = { lat: 40.489 + (index * 0.003 - 0.005), lng: 68.784 + (index * 0.004 - 0.006) };
              let districtName = "Guliston";
              
              for (const [key, val] of Object.entries(mahallaCoords)) {
                if (locationStr.includes(key)) {
                  coords = val;
                  districtName = key.charAt(0).toUpperCase() + key.slice(1);
                  break;
                }
              }
              
              return {
                id: inc.id,
                lat: coords.lat,
                lng: coords.lng,
                intensity: inc.severity === "high" ? "high" : inc.severity === "medium" ? "medium" : "low",
                title: inc.typeUz || inc.name,
                district: districtName
              };
            });
            setHotspots(mapped.length > 0 ? mapped : fallbackHotspots);
          }
        }
      } catch (err) {
        console.error("Map fetch incidents error:", err);
        setHotspots(fallbackHotspots);
      }
    };

    fetchLiveIncidents();

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  if (!mounted) {
    return <div className="w-full h-[600px] bg-card/50 animate-pulse rounded-2xl flex items-center justify-center">
      <span className="text-primary font-medium tracking-widest animate-bounce">Инициализация ИИ-Карты...</span>
    </div>;
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-card-border shadow-[0_0_30px_rgba(15,23,42,0.8)] relative z-0">
      <MapContainer 
        center={[40.489, 68.784]} // Guliston center
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dynamic theme tiles switcher (CartoDB Light Matter vs CartoDB Dark Matter) */}
        <TileLayer
          key={theme}
          url={theme === "light"
            ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"}
        />
        
        {hotspots.map((spot) => {
          const color = spot.intensity === 'high' ? '#ef4444' : spot.intensity === 'medium' ? '#f59e0b' : '#10b981';
          const radius = spot.intensity === 'high' ? 30 : spot.intensity === 'medium' ? 20 : 12;
          
          return (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lng]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.4,
                color: color,
                weight: 2
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-sm text-gray-900">{spot.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">Район/Махалля: {spot.district}</p>
                  <div className={`mt-2 text-xs font-medium px-2 py-1 rounded inline-block ${
                    spot.intensity === 'high' ? 'bg-red-100 text-red-800' :
                    spot.intensity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    Риск: {spot.intensity === 'high' ? 'Критический' : spot.intensity === 'medium' ? 'Средний' : 'Низкий'}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
