"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const regions = [
  { id: 1, cx: 30, cy: 30 },
  { id: 2, cx: 70, cy: 40 },
  { id: 3, cx: 50, cy: 70 },
  { id: 4, cx: 20, cy: 80 },
  { id: 5, cx: 80, cy: 85 },
];

export default function LiveHeatmap() {
  const [activeRegion, setActiveRegion] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRegion(regions[Math.floor(Math.random() * regions.length)].id);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square max-h-[300px] bg-card/20 rounded-2xl border border-card-border overflow-hidden flex items-center justify-center p-6 shadow-lg backdrop-blur-sm">
      <svg className="w-full h-full" viewBox="0 0 100 100" overflow="visible">
        {/* Draw connections */}
        {regions.map((r1, i) =>
          regions.slice(i + 1).map((r2) => (
            <line
              key={`${r1.id}-${r2.id}`}
              x1={r1.cx}
              y1={r1.cy}
              x2={r2.cx}
              y2={r2.cy}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary/20"
            />
          ))
        )}
        
        {/* Draw nodes */}
        {regions.map((r) => {
          const isActive = r.id === activeRegion;
          return (
            <g key={r.id}>
              {isActive && (
                <motion.circle
                  initial={{ r: 2, opacity: 0.8 }}
                  animate={{ r: 15, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  cx={r.cx}
                  cy={r.cy}
                  fill="currentColor"
                  className="text-danger"
                />
              )}
              <circle
                cx={r.cx}
                cy={r.cy}
                r={isActive ? 4 : 2}
                fill="currentColor"
                className={isActive ? "text-danger" : "text-primary"}
                style={{ transition: "all 0.3s ease" }}
              />
            </g>
          );
        })}
      </svg>
      
      <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur border border-card-border rounded-lg p-3 text-xs text-left shadow-2xl">
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-foreground">Interactive Heatmap</span>
          <span className="text-[10px] text-danger animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-danger"></span> Live
          </span>
        </div>
        <p className="text-foreground/60 text-[10px]">
          Hududlardagi risklarni real vaqt rejimida baholash va klasterlash. 
        </p>
      </div>
    </div>
  );
}
