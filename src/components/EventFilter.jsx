import React from 'react';
import { Search, Layers, Cpu, Gamepad2 } from 'lucide-react';

export default function EventFilter({ 
  currentFilter, 
  onFilterChange, 
  counts, 
  searchQuery, 
  onSearchChange 
}) {
  const filterTabs = [
    { id: 'all', label: 'All Events', count: counts.all, icon: Layers },
    { id: 'technical', label: 'Technical', count: counts.technical, icon: Cpu },
    { id: 'non-technical', label: 'Non-Technical', count: counts.nonTechnical, icon: Gamepad2 },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
      
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-space-900/90 border border-slate-800 cyber-glass">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-tech font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-space-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isActive ? 'bg-space-950 text-cyber-cyan' : 'bg-space-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search event name or topic..."
          className="w-full bg-space-900/90 border border-slate-800 focus:border-cyber-cyan rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-cyan transition-all"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
          >
            Clear
          </button>
        )}
      </div>

    </div>
  );
}
