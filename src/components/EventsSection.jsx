import React, { useState, useMemo } from 'react';
import { EVENTS_DATA } from '../data/eventsData';
import EventCard from './EventCard';
import EventFilter from './EventFilter';
import { Cpu } from 'lucide-react';

export default function EventsSection({ onOpenDetails, onRegisterEvent }) {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for filters
  const counts = useMemo(() => {
    return {
      all: EVENTS_DATA.length,
      technical: EVENTS_DATA.filter(e => e.category === 'Technical').length,
      nonTechnical: EVENTS_DATA.filter(e => e.category === 'Non-Technical').length,
    };
  }, []);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter(event => {
      // Category check
      const matchesCategory = 
        currentFilter === 'all' ||
        (currentFilter === 'technical' && event.category === 'Technical') ||
        (currentFilter === 'non-technical' && event.category === 'Non-Technical');

      // Search check
      const matchesSearch = 
        searchQuery.trim() === '' ||
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [currentFilter, searchQuery]);

  return (
    <section id="events" className="relative py-24 bg-space-950">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Futuristic Typography */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Competitive Arenas</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            CHRONYX <span className="cyber-gradient-text">EVENTS</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            {counts.technical} Technical Events and {counts.nonTechnical} Non-Technical Events. Select any event to review details or register.
          </p>
        </div>

        {/* Filter Component */}
        <EventFilter
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={counts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onOpenDetails={onOpenDetails}
                onRegisterEvent={onRegisterEvent}
              />
            ))}
          </div>
        ) : (
          <div className="cyber-glass rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-800">
            <p className="text-slate-400 text-sm mb-4">No events found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setCurrentFilter('all'); }}
              className="px-4 py-2 rounded-xl bg-cyber-cyan text-space-950 font-bold text-xs uppercase font-mono"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
