import React, { useState, useEffect } from 'react';
import { 
  X, Lock, ShieldCheck, Download, Search, CheckCircle2, Clock, 
  AlertCircle, AlertOctagon, Eye, ExternalLink, RefreshCw, KeyRound 
} from 'lucide-react';
import { 
  verifyOrganizerKey, 
  getProtectedRegistrations, 
  setProtectedRegistrationStatus, 
  getProtectedScreenshot, 
  exportProtectedCSV,
  STATUS_VALUES 
} from '../services/organizerService';

export default function OrganizerModal({ isOpen, onClose }) {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeScreenshot, setActiveScreenshot] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState('');

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setPasskey('');
      setIsAuthenticated(false);
      setAuthError('');
      setActiveScreenshot(null);
      setNotification('');
    }
  }, [isOpen]);

  const handleAuthenticate = (e) => {
    e.preventDefault();
    if (verifyOrganizerKey(passkey)) {
      setIsAuthenticated(true);
      setAuthError('');
      loadRegistrations(passkey);
    } else {
      setAuthError('Invalid Organizer Access Key. Access Denied.');
    }
  };

  const loadRegistrations = (key) => {
    try {
      const records = getProtectedRegistrations(key);
      setRegistrations(records);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleStatusChange = async (regId, newStatus) => {
    try {
      setIsUpdating(true);
      setProtectedRegistrationStatus(regId, newStatus, `Status updated by organizer at ${new Date().toLocaleTimeString()}`, passkey);
      loadRegistrations(passkey);
      showNotice(`Updated ${regId} to ${newStatus}`);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewScreenshot = async (regId) => {
    try {
      const item = await getProtectedScreenshot(regId, passkey);
      if (item && item.data_url) {
        setActiveScreenshot({
          regId,
          url: item.data_url,
          filename: item.filename || 'payment_receipt.png',
          file_type: item.file_type || 'image/png',
          file_size: item.file_size || 0
        });
      } else {
        alert(`No digital screenshot attachment stored for ${regId} yet.`);
      }
    } catch (err) {
      alert(`Screenshot retrieval failed: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    try {
      exportProtectedCSV(passkey);
      showNotice('CSV export generated successfully.');
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  if (!isOpen) return null;

  // Filtered registrations
  const filtered = registrations.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term || 
      (r.registration_id && r.registration_id.toLowerCase().includes(term)) ||
      (r.full_name && r.full_name.toLowerCase().includes(term)) ||
      (r.email && r.email.toLowerCase().includes(term)) ||
      (r.phone && r.phone.toLowerCase().includes(term)) ||
      (r.utr && r.utr.toLowerCase().includes(term)) ||
      (r.event && r.event.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-space-950/90 backdrop-blur-xl animate-fade-in text-slate-100 font-sans">
      
      {/* Modal Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-space-900 border border-cyber-cyan/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] z-10 max-h-[92vh] overflow-y-auto flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl sm:text-2xl font-black font-tech text-white uppercase tracking-wider">
                  ORGANIZER PORTAL
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold uppercase">
                  Protected
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Department of AI & DS • CHRONYX 2026 Registration Management
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          
          /* ================================================================ */
          /* AUTHENTICATION PROMPT                                            */
          /* ================================================================ */
          <div className="my-auto py-12 text-center max-w-md mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-space-950 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <h4 className="text-xl font-bold font-tech text-white mb-2 uppercase">
              Organizer Passkey Required
            </h4>

            <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
              Enter your authorized organizer secret key to access participant details, verify UTR payments, and export registration data.
            </p>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter Organizer Access Key..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 focus:border-cyber-cyan rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 font-mono focus:outline-none"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-rose-400 text-xs font-mono flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform"
              >
                Authorize Access
              </button>

              <p className="text-[10px] font-mono text-slate-500 pt-2">
                Authorized symposium coordinators only. Configurable via environment variables.
              </p>
            </form>
          </div>

        ) : (

          /* ================================================================ */
          /* ORGANIZER DASHBOARD                                              */
          /* ================================================================ */
          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            
            {/* Notification Banner */}
            {notification && (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
                <span>{notification}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            {/* Controls Bar: Search, Status Filter, Export CSV */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-space-950/80 p-3 rounded-2xl border border-slate-800">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, name, email, phone, UTR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-space-900 border border-slate-800 focus:border-cyber-cyan rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-space-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                >
                  <option value="ALL">All ({registrations.length})</option>
                  <option value={STATUS_VALUES.VERIFICATION_PENDING}>Pending</option>
                  <option value={STATUS_VALUES.CONFIRMED}>Confirmed</option>
                  <option value={STATUS_VALUES.SUBMITTED}>Submitted</option>
                  <option value={STATUS_VALUES.REJECTED}>Rejected</option>
                </select>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-space-950 font-bold font-tech text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md hover:scale-105 transition-transform shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV ({registrations.length})</span>
              </button>

              {/* Lock Session */}
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-2 rounded-xl bg-space-900 hover:bg-space-850 text-slate-400 hover:text-white text-xs font-mono border border-slate-800 transition-colors"
                title="Lock Session"
              >
                <Lock className="w-3.5 h-3.5 inline mr-1" />
                Lock
              </button>
            </div>

            {/* Registrations Table */}
            <div className="flex-1 overflow-x-auto rounded-2xl border border-slate-800 bg-space-950/60 max-h-[55vh]">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-space-950 sticky top-0 border-b border-slate-800 text-[10px] uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Participant</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">College & Dept</th>
                    <th className="p-3">Event(s)</th>
                    <th className="p-3">UTR</th>
                    <th className="p-3">Proof</th>
                    <th className="p-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filtered.length > 0 ? (
                    filtered.map((r) => (
                      <tr key={r.registration_id} className="hover:bg-space-900/60 transition-colors">
                        
                        {/* ID */}
                        <td className="p-3 font-bold text-cyber-cyan whitespace-nowrap">
                          {r.registration_id}
                        </td>

                        {/* Name & Year */}
                        <td className="p-3 whitespace-nowrap">
                          <span className="font-bold text-white block">{r.full_name}</span>
                          <span className="text-[10px] text-slate-500">{r.year}</span>
                        </td>

                        {/* Contact */}
                        <td className="p-3 text-[11px] whitespace-nowrap">
                          <span className="block text-slate-200">{r.email}</span>
                          <span className="text-slate-400">{r.phone}</span>
                        </td>

                        {/* College */}
                        <td className="p-3 max-w-[180px] truncate" title={`${r.college} • ${r.department}`}>
                          <span className="text-slate-200 block truncate">{r.college}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{r.department}</span>
                        </td>

                        {/* Events */}
                        <td className="p-3 max-w-[160px] truncate" title={r.event}>
                          <span className="text-cyber-purple font-semibold">{r.event}</span>
                          {r.team_members && r.team_members.length > 0 && (
                            <span className="text-[10px] text-slate-500 block">
                              +{r.team_members.length} team members
                            </span>
                          )}
                        </td>

                        {/* UTR */}
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-amber-300 font-bold">
                            {r.utr || 'N/A'}
                          </span>
                        </td>

                        {/* Screenshot action */}
                        <td className="p-3 whitespace-nowrap">
                          <button
                            onClick={() => handleViewScreenshot(r.registration_id)}
                            className="px-2 py-1 rounded bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-[11px] flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </td>

                        {/* Status Change Dropdown */}
                        <td className="p-3 whitespace-nowrap">
                          <select
                            value={r.status}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(r.registration_id, e.target.value)}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold border focus:outline-none ${
                              r.status === STATUS_VALUES.CONFIRMED 
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                : r.status === STATUS_VALUES.REJECTED
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                                : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <option value={STATUS_VALUES.VERIFICATION_PENDING}>Verification Pending</option>
                            <option value={STATUS_VALUES.CONFIRMED}>Confirmed</option>
                            <option value={STATUS_VALUES.SUBMITTED}>Submitted</option>
                            <option value={STATUS_VALUES.REJECTED}>Rejected</option>
                          </select>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                        No registrations match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span>Showing {filtered.length} of {registrations.length} registrations</span>
              <span className="text-slate-500">Press Esc or Close to exit</span>
            </div>

          </div>
        )}

      </div>

      {/* Screenshot Preview Sub-modal */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-space-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-space-900 border border-cyber-cyan/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h4 className="font-tech font-bold text-white text-base">
                  Payment Screenshot Proof
                </h4>
                <p className="text-xs font-mono text-cyber-cyan">
                  Registration: {activeScreenshot.regId} • {activeScreenshot.filename}
                </p>
              </div>
              <button
                onClick={() => setActiveScreenshot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-space-950 max-h-[60vh] flex items-center justify-center mb-4">
              <img
                src={activeScreenshot.url}
                alt="Payment Screenshot"
                className="max-h-[58vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setActiveScreenshot(null)}
                className="px-4 py-2 rounded-xl bg-space-800 text-slate-200 text-xs font-mono hover:text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
