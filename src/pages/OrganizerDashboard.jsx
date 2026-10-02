import React, { useState, useMemo } from 'react';
import { 
  Users, CheckCircle2, Clock, AlertOctagon, Download, Search, 
  RefreshCw, Eye, ArrowLeft, LogOut, ShieldCheck, Cpu 
} from 'lucide-react';
import { 
  getAuthenticatedAdmin, 
  logoutAdmin 
} from '../services/adminAuthService';
import { 
  getStoredRegistrations, 
  updateRegistrationStatusDirect, 
  downloadRegistrationsCSV, 
  getExpectedOrganizerKey,
  STATUS_VALUES 
} from '../services/registrationService';
import { EVENTS_DATA } from '../data/eventsData';
import AdminLogin from '../components/admin/AdminLogin';
import RegistrationDetailModal from '../components/admin/RegistrationDetailModal';

export default function OrganizerDashboard({ onNavigateHome }) {
  const [adminUser, setAdminUser] = useState(() => getAuthenticatedAdmin());
  const [registrations, setRegistrations] = useState(() => getStoredRegistrations());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [collegeFilter, setCollegeFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [refreshNotice, setRefreshNotice] = useState('');

  // Reload registrations from storage
  const loadData = () => {
    const data = getStoredRegistrations();
    setRegistrations(data);
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminUser(null);
  };

  const handleStatusUpdate = async (regId, newStatus, remarks) => {
    const updated = updateRegistrationStatusDirect(regId, newStatus, remarks);
    loadData();
    if (selectedRecord && (selectedRecord.registration_id === regId || selectedRecord.regId === regId)) {
      setSelectedRecord(updated);
    }
    return true;
  };

  const handleExportCSV = () => {
    try {
      downloadRegistrationsCSV(getExpectedOrganizerKey());
      setRefreshNotice('CSV Export downloaded successfully.');
      setTimeout(() => setRefreshNotice(''), 3000);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleRefresh = () => {
    loadData();
    setRefreshNotice('Data refreshed from local database.');
    setTimeout(() => setRefreshNotice(''), 3000);
  };

  // Distinct colleges for filter
  const distinctColleges = useMemo(() => {
    const set = new Set();
    registrations.forEach(r => {
      if (r.college && r.college.trim()) {
        set.add(r.college.trim());
      }
    });
    return Array.from(set);
  }, [registrations]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter(r => r.status === STATUS_VALUES.VERIFICATION_PENDING).length;
    const confirmed = registrations.filter(r => r.status === STATUS_VALUES.CONFIRMED).length;
    const rejected = registrations.filter(r => r.status === STATUS_VALUES.REJECTED).length;

    return { total, pending, confirmed, rejected };
  }, [registrations]);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

      // Event filter
      if (eventFilter !== 'ALL') {
        const evString = String(r.event || '').toLowerCase();
        if (!evString.includes(eventFilter.toLowerCase())) return false;
      }

      // College filter
      if (collegeFilter !== 'ALL') {
        if ((r.college || '').trim().toLowerCase() !== collegeFilter.toLowerCase()) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesId = (r.registration_id || r.regId || '').toLowerCase().includes(term);
        const matchesName = (r.full_name || r.name || '').toLowerCase().includes(term);
        const matchesUtr = (r.utr || r.utrNumber || '').toLowerCase().includes(term);
        const matchesEmail = (r.email || '').toLowerCase().includes(term);

        if (!matchesId && !matchesName && !matchesUtr && !matchesEmail) return false;
      }

      return true;
    });
  }, [registrations, statusFilter, eventFilter, collegeFilter, searchTerm]);

  // If not logged in, show protected login screen
  if (!adminUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => setAdminUser(user)}
        onBackToSite={onNavigateHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-space-950">
      
      {/* Background Decor */}
      <div className="fixed inset-0 bg-grid-cyber opacity-25 pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-space-950/90 backdrop-blur-xl border-b border-cyber-cyan/20 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-space-900 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-tech text-lg sm:text-xl font-black text-white tracking-wider">
                  CHRONYX<span className="text-cyber-cyan">.26</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 uppercase tracking-widest font-bold">
                  ORGANIZER DASHBOARD
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Department of AI & DS • Jaya Sakthi Engineering College
              </p>
            </div>
          </div>

          {/* Right Header Navigation & Admin Profile */}
          <div className="flex items-center space-x-3">
            
            {/* Admin Email Badge */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-space-900 border border-slate-800 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
              <span className="truncate max-w-[180px]">{adminUser.email}</span>
            </div>

            {/* Back to Public Website */}
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl cyber-glass border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white text-xs font-mono transition-all"
              title="Return to Public Symposium Website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Website</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 text-xs font-mono transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* Refresh Notification Banner */}
        {refreshNotice && (
          <div className="px-4 py-2.5 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono flex items-center justify-between animate-fade-in shadow-md">
            <span>{refreshNotice}</span>
            <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
          </div>
        )}

        {/* ================================================================ */}
        {/* KPI STAT CARDS                                                   */}
        {/* ================================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Registrations */}
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`cyber-glass rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
              statusFilter === 'ALL' ? 'border-cyber-cyan shadow-[0_0_25px_rgba(0,240,255,0.2)]' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Total Registrations</span>
              <div className="w-8 h-8 rounded-lg bg-cyber-cyan/15 text-cyber-cyan flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-tech text-white">
              {stats.total}
            </div>
            <span className="text-[10px] font-mono text-cyber-cyan mt-1 block">
              ● All categories enrolled
            </span>
          </div>

          {/* Card 2: Payment Verification Pending */}
          <div 
            onClick={() => setStatusFilter(STATUS_VALUES.VERIFICATION_PENDING)}
            className={`cyber-glass rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
              statusFilter === STATUS_VALUES.VERIFICATION_PENDING ? 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.2)]' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Verification Pending</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-tech text-amber-400">
              {stats.pending}
            </div>
            <span className="text-[10px] font-mono text-amber-300/80 mt-1 block">
              ● Awaiting UTR check
            </span>
          </div>

          {/* Card 3: Confirmed */}
          <div 
            onClick={() => setStatusFilter(STATUS_VALUES.CONFIRMED)}
            className={`cyber-glass rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
              statusFilter === STATUS_VALUES.CONFIRMED ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.2)]' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Confirmed</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-tech text-emerald-400">
              {stats.confirmed}
            </div>
            <span className="text-[10px] font-mono text-emerald-300/80 mt-1 block">
              ● Delegate passes active
            </span>
          </div>

          {/* Card 4: Rejected */}
          <div 
            onClick={() => setStatusFilter(STATUS_VALUES.REJECTED)}
            className={`cyber-glass rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all duration-300 group hover:scale-[1.02] ${
              statusFilter === STATUS_VALUES.REJECTED ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.2)]' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400">Rejected</span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black font-tech text-rose-400">
              {stats.rejected}
            </div>
            <span className="text-[10px] font-mono text-rose-300/80 mt-1 block">
              ● Mismatched UTR / proofs
            </span>
          </div>

        </div>

        {/* ================================================================ */}
        {/* FILTERS & SEARCH CONTROL PANEL                                   */}
        {/* ================================================================ */}
        <div className="cyber-glass rounded-2xl p-4 sm:p-5 border border-cyber-cyan/30 shadow-xl space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID, participant name, UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
              />
            </div>

            {/* Filter by Event */}
            <div className="lg:col-span-3">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none"
              >
                <option value="ALL">All Events (10)</option>
                {EVENTS_DATA.map(ev => (
                  <option key={ev.id} value={ev.name}>{ev.name} ({ev.category})</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="lg:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value={STATUS_VALUES.VERIFICATION_PENDING}>Verification Pending</option>
                <option value={STATUS_VALUES.CONFIRMED}>Confirmed</option>
                <option value={STATUS_VALUES.SUBMITTED}>Submitted</option>
                <option value={STATUS_VALUES.REJECTED}>Rejected</option>
              </select>
            </div>

            {/* Filter by College */}
            <div className="lg:col-span-3">
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none truncate"
              >
                <option value="ALL">All Colleges</option>
                {distinctColleges.map((col, i) => (
                  <option key={i} value={col}>{col}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Action Row: Export CSV, Refresh, Filter Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="text-slate-400">
              Showing <strong className="text-white font-tech">{filteredRegistrations.length}</strong> of {registrations.length} registrations
              {(searchTerm || statusFilter !== 'ALL' || eventFilter !== 'ALL' || collegeFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                    setEventFilter('ALL');
                    setCollegeFilter('ALL');
                  }}
                  className="ml-3 text-cyber-cyan hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="px-3.5 py-2 rounded-xl bg-space-900 border border-slate-700 hover:border-cyber-cyan text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
                title="Reload registrations from database"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-space-950 font-bold font-tech uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

        </div>

        {/* ================================================================ */}
        {/* DESKTOP / TABLET REGISTRATION TABLE                             */}
        {/* ================================================================ */}
        <div className="hidden sm:block cyber-glass rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-space-950/95 border-b border-slate-800 text-[10px] uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="p-3.5">Registration ID</th>
                  <th className="p-3.5">Participant Name</th>
                  <th className="p-3.5">College</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Year</th>
                  <th className="p-3.5">Selected Event</th>
                  <th className="p-3.5">UTR</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => {
                    const statusBadgeColors = {
                      [STATUS_VALUES.CONFIRMED]: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
                      [STATUS_VALUES.VERIFICATION_PENDING]: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
                      [STATUS_VALUES.REJECTED]: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
                      [STATUS_VALUES.SUBMITTED]: 'bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan',
                    };

                    return (
                      <tr key={r.registration_id || r.regId} className="hover:bg-space-900/60 transition-colors">
                        
                        {/* 1. Registration ID */}
                        <td className="p-3.5 font-bold font-tech text-cyber-cyan whitespace-nowrap">
                          {r.registration_id || r.regId}
                        </td>

                        {/* 2. Participant Name */}
                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          {r.full_name || r.name}
                        </td>

                        {/* 3. College */}
                        <td className="p-3.5 max-w-[170px] truncate" title={r.college}>
                          {r.college}
                        </td>

                        {/* 4. Department */}
                        <td className="p-3.5 max-w-[140px] truncate" title={r.department}>
                          {r.department}
                        </td>

                        {/* 5. Year */}
                        <td className="p-3.5 whitespace-nowrap text-slate-400">
                          {r.year}
                        </td>

                        {/* 6. Selected Event */}
                        <td className="p-3.5 max-w-[150px] truncate" title={r.event}>
                          <span className="text-cyber-purple font-semibold">{r.event}</span>
                        </td>

                        {/* 7. UTR */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-space-950 border border-slate-700 text-amber-300 font-bold">
                            {r.utr || r.utrNumber || 'N/A'}
                          </span>
                        </td>

                        {/* 8. Status */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBadgeColors[r.status] || 'text-slate-300'}`}>
                            {r.status}
                          </span>
                        </td>

                        {/* 9. Created Date */}
                        <td className="p-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          }) : '—'}
                        </td>

                        {/* 10. Actions */}
                        <td className="p-3.5 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan hover:text-white font-mono text-xs transition-all flex items-center space-x-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-500 font-mono">
                      No registrations matched your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RESPONSIVE MOBILE CARDS VIEW (Under 640px)                       */}
        {/* ================================================================ */}
        <div className="sm:hidden space-y-4">
          {filteredRegistrations.length > 0 ? (
            filteredRegistrations.map((r) => {
              const statusBadgeColors = {
                [STATUS_VALUES.CONFIRMED]: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
                [STATUS_VALUES.VERIFICATION_PENDING]: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
                [STATUS_VALUES.REJECTED]: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
                [STATUS_VALUES.SUBMITTED]: 'bg-cyber-cyan/15 border-cyber-cyan/40 text-cyber-cyan',
              };

              return (
                <div 
                  key={r.registration_id || r.regId}
                  className="cyber-glass rounded-2xl p-4 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-tech font-bold text-cyber-cyan text-sm">
                      {r.registration_id || r.regId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeColors[r.status] || 'text-slate-300'}`}>
                      {r.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-base font-tech">
                      {r.full_name || r.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {r.college} • {r.department} ({r.year})
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-space-950 border border-slate-800 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Event:</span>
                      <span className="text-cyber-purple font-semibold truncate max-w-[180px]">{r.event}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">UTR:</span>
                      <span className="text-amber-300 font-bold">{r.utr || r.utrNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="text-slate-400 text-[11px]">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRecord(r)}
                    className="w-full py-2.5 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details & Verify</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="cyber-glass rounded-2xl p-8 text-center text-slate-500 text-xs font-mono border border-slate-800">
              No registrations found.
            </div>
          )}
        </div>

      </main>

      {/* Registration Details & Verification Modal */}
      {selectedRecord && (
        <RegistrationDetailModal
          registration={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

    </div>
  );
}
