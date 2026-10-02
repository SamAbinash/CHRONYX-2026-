import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import EventsSection from './components/EventsSection';
import Schedule from './components/Schedule';
import Venue from './components/Venue';
import Contact from './components/Contact';
import RegistrationForm from './components/RegistrationForm';
import CheckStatus from './components/CheckStatus';
import Footer from './components/Footer';
import EventModal from './components/EventModal';
import PassModal from './components/PassModal';
import OrganizerDashboard from './pages/OrganizerDashboard';
import NeuralBackground from './components/NeuralBackground';
import { Ticket, Search } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [modalEvent, setModalEvent] = useState(null);
  const [preSelectedEvent, setPreSelectedEvent] = useState(null);
  const [activePassRegistration, setActivePassRegistration] = useState(null);
  const [activeStatusQuery, setActiveStatusQuery] = useState('');
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window === 'undefined') return 'public';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (
      path === '/admin' || 
      path === '/organizer' || 
      hash === '#/admin' || 
      hash === '#/organizer' || 
      hash === '#admin'
    ) {
      return 'admin';
    }
    return 'public';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/admin' || 
        path === '/organizer' || 
        hash === '#/admin' || 
        hash === '#/organizer' || 
        hash === '#admin'
      ) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('public');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route) => {
    if (route === 'admin') {
      try {
        window.history.pushState({}, '', '/admin');
      } catch (e) {
        window.location.hash = '/admin';
      }
      setCurrentRoute('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {
        window.location.hash = '';
      }
      setCurrentRoute('public');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Global discrete shortcut for symposium organizers: Ctrl+Shift+O or Ctrl+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'O' || e.key === 'o' || e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo(currentRoute === 'admin' ? 'public' : 'admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoute]);

  // Smooth scroll handler
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When clicking register on an event card or modal
  const handleRegisterEvent = (eventName) => {
    setPreSelectedEvent(eventName);
    scrollToSection('register');
  };

  // When registration succeeds
  const handleRegistrationSuccess = (newReg) => {
    // Allows opening PassModal or reviewing details
  };

  const handleNavigateStatus = (regId) => {
    setActiveStatusQuery(regId);
    scrollToSection('status');
  };

  // Scroll spy to update active navbar item
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'events', 'schedule', 'venue', 'contact', 'register', 'status'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (currentRoute === 'admin') {
    return <OrganizerDashboard onNavigateHome={() => navigateTo('public')} />;
  }

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col relative selection:bg-cyber-cyan selection:text-space-950">
      
      {/* Background Interactive Synaptic Neural Network */}
      <NeuralBackground />

      {/* Top Fixed Navbar */}
      <Navbar 
        onNavigate={scrollToSection} 
        activeSection={activeSection} 
      />

      {/* Main Content Sections */}
      <main className="flex-grow relative z-10">
        
        {/* Hero Section with Live Countdown and AI Core */}
        <Hero
          onExploreEvents={() => scrollToSection('events')}
          onRegisterNow={() => scrollToSection('register')}
          onCheckStatus={() => scrollToSection('status')}
        />

        {/* About Section */}
        <About
          onExploreEvents={() => scrollToSection('events')}
        />

        {/* Events Lineup (9 Tech + 1 Non-Tech) */}
        <EventsSection
          onOpenDetails={(event) => setModalEvent(event)}
          onRegisterEvent={handleRegisterEvent}
        />

        {/* Schedule Timeline */}
        <Schedule />

        {/* Venue Information */}
        <Venue />

        {/* Coordinators Contact Information */}
        <Contact />

        {/* Full Registration & Payment Form */}
        <RegistrationForm
          preSelectedEvent={preSelectedEvent}
          onRegistrationSuccess={handleRegistrationSuccess}
          onNavigateHome={() => scrollToSection('home')}
          onNavigateStatus={handleNavigateStatus}
        />

        {/* Check Registration Status Terminal */}
        <CheckStatus
          activeSearchQuery={activeStatusQuery}
          onViewPass={(reg) => setActivePassRegistration(reg)}
        />

      </main>

      {/* Footer */}
      <Footer 
        onNavigate={scrollToSection} 
        onOpenOrganizer={() => navigateTo('admin')}
      />

      {/* Floating Action Button (Mobile & Desktop Quick Access) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2.5 print:hidden">
        <button
          onClick={() => scrollToSection('status')}
          className="p-3 rounded-2xl cyber-glass border border-cyber-cyan/40 text-cyber-cyan hover:text-white hover:bg-cyber-cyan/20 transition-all shadow-lg shadow-cyber-cyan/10 hover:scale-110 flex items-center justify-center group"
          title="Check Status"
        >
          <Search className="w-5 h-5" />
          <span className="hidden group-hover:inline-block ml-2 text-xs font-mono font-bold pr-1">
            Status
          </span>
        </button>

        <button
          onClick={() => scrollToSection('register')}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple text-space-950 shadow-xl shadow-cyber-cyan/30 hover:shadow-cyber-cyan/60 hover:scale-110 transition-all flex items-center justify-center group"
          title="Register Pass"
        >
          <Ticket className="w-5 h-5" />
          <span className="hidden group-hover:inline-block ml-2 text-xs font-tech font-black tracking-wider uppercase pr-1">
            REGISTER PASS
          </span>
        </button>
      </div>

      {/* Event Details Modal */}
      {modalEvent && (
        <EventModal
          event={modalEvent}
          onClose={() => setModalEvent(null)}
          onRegisterEvent={handleRegisterEvent}
        />
      )}

      {/* Delegate Pass Confirmation / Download Modal */}
      {activePassRegistration && (
        <PassModal
          registration={activePassRegistration}
          onClose={() => setActivePassRegistration(null)}
        />
      )}



    </div>
  );
}
