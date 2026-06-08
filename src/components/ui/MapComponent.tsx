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

// Mock hotspot data for Tashkent
const hotspots = [
  { id: 1, lat: 41.311081, lng: 69.240562, intensity: 'high', title: 'Очаг краж', district: 'Шайхантахурский' },
  { id: 2, lat: 41.364536, lng: 69.284451, intensity: 'medium', title: 'Хулиганство', district: 'Юнусабадский' },
  { id: 3, lat: 41.282837, lng: 69.208170, intensity: 'high', title: 'Угоны авто', district: 'Чиланзарский' },
  { id: 4, lat: 41.296561, lng: 69.274352, intensity: 'low', title: 'Мелкие кражи', district: 'Мирабадский' },
];

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

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
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  if (!mounted) {
    return <div className="w-full h-[600px] bg-card/50 animate-pulse rounded-2xl flex items-center justify-center">
      <span className="text-primary font-medium tracking-widest animate-bounce">Инициализация ИИ-Карты...</span>
    </div>;
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-card-border shadow-[0_0_30px_rgba(15,23,42,0.8)] relative z-0">
      <MapContainer 
        center={[41.311081, 69.240562]} // Tashkent center
        zoom={12} 
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
                  <p className="text-xs text-gray-600 mt-1">Район: {spot.district}</p>
                  <div className="mt-2 text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded inline-block">
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
