import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Clock, AlertOctagon, User, Mail, Phone, School, 
  BookOpen, Calendar, CreditCard, Image as ImageIcon, Download, 
  ExternalLink, ShieldCheck, Printer, Save, Sparkles, Layers 
} from 'lucide-react';
import { getRegistrationScreenshotSecure, STATUS_VALUES } from '../../services/registrationService';

export default function RegistrationDetailModal({ 
  registration, 
  onClose, 
  onStatusUpdate 
}) {
  const [selectedStatus, setSelectedStatus] = useState(registration?.status || STATUS_VALUES.VERIFICATION_PENDING);
  const [remarks, setRemarks] = useState(registration?.remarks || '');
  const [screenshot, setScreenshot] = useState(null);
  const [loadingScreenshot, setLoadingScreenshot] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    if (registration) {
      setSelectedStatus(registration.status);
      setRemarks(registration.remarks || '');
      loadScreenshot(registration.registration_id || registration.regId);
    }
  }, [registration]);

  const loadScreenshot = async (regId) => {
    try {
      setLoadingScreenshot(true);
      const data = await getRegistrationScreenshotSecure(regId);
      setScreenshot(data || null);
    } catch (e) {
      console.warn('Failed to load screenshot attachment', e);
      setScreenshot(null);
    } finally {
      setLoadingScreenshot(false);
    }
  };

  if (!registration) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(registration.registration_id || registration.regId, selectedStatus, remarks);
      }
      setSuccessNotice('Status updated and saved successfully.');
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const statusColors = {
    [STATUS_VALUES.CONFIRMED]: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
    [STATUS_VALUES.VERIFICATION_PENDING]: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
    [STATUS_VALUES.REJECTED]: 'text-rose-400 bg-rose-500/15 border-rose-500/40',
    [STATUS_VALUES.SUBMITTED]: 'text-cyber-cyan bg-cyber-cyan/15 border-cyber-cyan/40',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-space-950/85 backdrop-blur-xl animate-fade-in text-slate-100">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-space-900 border border-cyber-cyan/35 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] z-10 max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:max-h-none print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-black mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 flex items-center justify-center print:hidden">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block print:text-gray-600">
                Participant Record Details
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-tech text-white print:text-black">
                {registration.full_name || registration.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-850 transition-colors"
              title="Print Record"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-space-850 transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fade-in">
            <span>{successNotice}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        {/* Primary Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-2xl bg-space-950 border border-slate-800 print:bg-white print:border-2 print:border-black mb-6">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block print:text-gray-600">
              Registration ID
            </span>
            <span className="text-xl font-black font-tech text-cyber-cyan print:text-black">
              {registration.registration_id || registration.regId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block print:text-gray-600">
              Created Date
            </span>
            <span className="text-xs font-mono text-slate-300 print:text-black">
              {new Date(registration.created_at || Date.now()).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true
              })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1 print:text-gray-600">
              Current Status
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${statusColors[registration.status] || 'text-slate-300'}`}>
              {registration.status}
            </span>
          </div>
        </div>

        {/* 2-Column Participant & Institution Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono mb-6">
          
          {/* Column 1: Academic & Contact */}
          <div className="space-y-3 p-4 rounded-2xl bg-space-950/70 border border-slate-800">
            <h4 className="text-xs font-bold uppercase font-tech text-cyber-cyan flex items-center space-x-1.5 border-b border-slate-800 pb-2">
              <User className="w-3.5 h-3.5" />
              <span>Participant Information</span>
            </h4>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Email Address</span>
              <a href={`mailto:${registration.email}`} className="text-white hover:text-cyber-cyan transition-colors underline truncate block">
                {registration.email}
              </a>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Phone / WhatsApp</span>
              <a href={`tel:${registration.phone || registration.mobile}`} className="text-white hover:text-cyber-cyan transition-colors truncate block">
                {registration.phone || registration.mobile}
              </a>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">College / Institution</span>
              <span className="text-slate-200 font-semibold block">{registration.college}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Department & Year</span>
              <span className="text-slate-200 block">{registration.department} • {registration.year}</span>
            </div>
          </div>

          {/* Column 2: Event & Team */}
          <div className="space-y-3 p-4 rounded-2xl bg-space-950/70 border border-slate-800">
            <h4 className="text-xs font-bold uppercase font-tech text-cyber-purple flex items-center space-x-1.5 border-b border-slate-800 pb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Event & Team Participation</span>
            </h4>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase mb-1">Selected Event(s)</span>
              <span className="px-2.5 py-1 rounded-lg bg-cyber-purple/15 border border-cyber-purple/40 text-purple-300 font-bold inline-block">
                {registration.event}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase mb-1">Team Members / Notes</span>
              {Array.isArray(registration.team_members) && registration.team_members.length > 0 ? (
                <div className="space-y-1">
                  {registration.team_members.map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-space-900 border border-slate-800 text-[11px] text-slate-300">
                      {typeof m === 'string' ? m : (
                        <div>
                          <span className="text-white font-bold">{m.name}</span>
                          {m.notes && <span className="text-slate-400 block text-[10px]">{m.notes}</span>}
                          {m.email && <span className="text-slate-400 block text-[10px]">{m.email}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic">Individual Registration (No team members listed)</span>
              )}
            </div>
          </div>

        </div>

        {/* Payment Verification Box (UTR & Screenshot) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-space-950 border border-cyber-cyan/30 mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-cyber-cyan">
              <CreditCard className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase font-tech">Payment Verification Details</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              CONFIDENTIAL • ORGANIZER ONLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            
            {/* Left: UTR and Notes */}
            <div className="md:col-span-6 space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Transaction ID / UTR</span>
                <span className="text-base font-bold text-amber-300 px-3 py-1 rounded bg-space-900 border border-slate-700 inline-block mt-0.5 tracking-wider">
                  {registration.utr || registration.utrNumber || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Screenshot Status</span>
                <span className="text-slate-200">
                  {registration.payment_screenshot?.filename 
                    ? `Attached: ${registration.payment_screenshot.filename}`
                    : 'Pending or stored in local buffer'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase mb-1">Organizer Remarks</span>
                <textarea
                  rows={2}
                  placeholder="Add verification notes, reconciliation ID, or reason for rejection..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-space-900 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none font-mono"
                ></textarea>
              </div>
            </div>

            {/* Right: Uploaded Payment Screenshot Proof */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-3 rounded-xl bg-space-900 border border-slate-800 min-h-[160px]">
              <span className="text-[10px] font-mono text-slate-400 uppercase mb-2 block w-full text-left">
                Payment Screenshot Proof:
              </span>

              {loadingScreenshot ? (
                <div className="py-6 text-center text-xs text-slate-400 font-mono">
                  Loading screenshot attachment...
                </div>
              ) : screenshot && screenshot.data_url ? (
                <div className="relative group w-full text-center">
                  <img
                    src={screenshot.data_url}
                    alt="Payment Receipt"
                    onClick={() => setIsZoomed(true)}
                    className="max-h-36 mx-auto rounded-lg border border-slate-700 cursor-pointer object-contain hover:scale-[1.02] transition-transform shadow-md"
                  />
                  <div className="mt-2 flex items-center justify-center space-x-3 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => setIsZoomed(true)}
                      className="text-cyber-cyan hover:underline flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Click to Zoom</span>
                    </button>
                    <a
                      href={screenshot.data_url}
                      download={`CHRONYX_Payment_${registration.registration_id || 'receipt'}.png`}
                      className="text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-xs font-mono">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-600" />
                  <p>No digital screenshot file found in local database.</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    (Verify via UTR against bank account statement)
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Status Change Selector & Action Footer */}
        <div className="pt-4 border-t border-slate-800 print:hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Change Status:</span>
            
            {/* Pending */}
            <button
              type="button"
              onClick={() => setSelectedStatus(STATUS_VALUES.VERIFICATION_PENDING)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedStatus === STATUS_VALUES.VERIFICATION_PENDING
                  ? 'bg-amber-500/25 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-space-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Pending
            </button>

            {/* Confirmed */}
            <button
              type="button"
              onClick={() => setSelectedStatus(STATUS_VALUES.CONFIRMED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedStatus === STATUS_VALUES.CONFIRMED
                  ? 'bg-emerald-500/25 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-space-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Confirmed
            </button>

            {/* Rejected */}
            <button
              type="button"
              onClick={() => setSelectedStatus(STATUS_VALUES.REJECTED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                selectedStatus === STATUS_VALUES.REJECTED
                  ? 'bg-rose-500/25 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-space-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Rejected
            </button>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-space-850 hover:bg-space-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs uppercase tracking-wider shadow-lg shadow-cyber-cyan/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Updated Status'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Zoom Modal for Payment Screenshot */}
      {isZoomed && screenshot && (
        <div 
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-space-950/95 backdrop-blur-md"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-2xl w-full p-2 bg-space-900 rounded-2xl border border-cyber-cyan/50 shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-cyber-cyan">
                Screenshot Proof • {registration.registration_id}
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={screenshot.data_url}
              alt="Payment Screenshot Full"
              className="max-h-[75vh] w-auto mx-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
