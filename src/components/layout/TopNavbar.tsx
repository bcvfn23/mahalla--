"use client";

import { Search, Bell, Activity } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-card-border bg-card/40 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Поиск
          </label>
          <div className="relative w-full md:w-1/3">
            <Search
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-foreground/50 ml-2"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block h-full w-full border-0 bg-transparent py-0 pl-10 pr-0 text-foreground focus:ring-0 sm:text-sm placeholder-foreground/40 outline-none"
              placeholder="Поиск по районам, преступлениям..."
              type="search"
              name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-safe/30 bg-safe/10">
            <Activity className="h-4 w-4 text-safe animate-pulse" />
            <span className="text-xs font-medium text-safe">Мониторинг активен</span>
          </div>
          
          <button type="button" className="-m-2.5 p-2.5 text-foreground/50 hover:text-foreground relative">
            <span className="sr-only">Уведомления</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-danger"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
