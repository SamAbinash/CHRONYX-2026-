import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVENTS_DATA } from '../data/eventsData';
import PaymentSection from './PaymentSection';
import { createRegistration } from '../services/registrationService';
import {
  Ticket, User, Layers, Users, Plus, Trash2,
  CheckCircle2, AlertCircle, ArrowRight, Printer, ArrowLeft, Clock,
  Store, Sparkles
} from 'lucide-react';

export default function RegistrationForm({
  preSelectedEvent,
  onRegistrationSuccess,
  onNavigateHome,
  onNavigateStatus
}) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    department: '',
    year: 'III Year',
    registrationType: 'individual', // 'individual' or 'team'
    selectedCategory: 'all', // 'all', 'technical', 'non-technical'
    selectedEvents: [],
    bookStall: false, // Optional Stall Booking (+₹150 / team)
    isTeam: false,
    teamName: '',
    teamMembers: [],
    flexibleMemberDetails: '',
    declarationConfirmed: false
  });

  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Sync preSelectedEvent if passed from EventCard or Modal
  useEffect(() => {
    if (preSelectedEvent) {
      setFormData(prev => {
        if (!prev.selectedEvents.includes(preSelectedEvent)) {
          return {
            ...prev,
            selectedEvents: [...prev.selectedEvents, preSelectedEvent]
          };
        }
        return prev;
      });
      // Scroll to registration form
      const el = document.getElementById('register');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [preSelectedEvent]);

  // Calculate dynamic fees based on official requirements
  const feeBreakdown = (() => {
    const hasEsports = formData.selectedEvents.some(e => e.toLowerCase() === 'e-sports');
    const otherEvents = formData.selectedEvents.filter(e => e.toLowerCase() !== 'e-sports');
    const hasOtherEvents = otherEvents.length > 0;
    const isTeam = formData.registrationType === 'team';

    let mainFee = 0;
    let mainLabel = '';

    // If symposium events selected, or default before event selection
    if (hasOtherEvents || (!hasEsports && formData.selectedEvents.length === 0)) {
      if (isTeam) {
        mainFee = 350;
        mainLabel = 'Team Registration (Max 4 members)';
      } else {
        mainFee = 100;
        mainLabel = 'Individual Registration (1 person)';
      }
    }

    const esportsFee = hasEsports ? 50 : 0;
    const stallFee = formData.bookStall ? 150 : 0;
    const total = mainFee + esportsFee + stallFee;

    return {
      registrationType: formData.registrationType,
      isTeam,
      hasOtherEvents,
      hasEsports,
      mainFee,
      mainLabel,
      esportsFee,
      hasStall: formData.bookStall,
      stallFee,
      total
    };
  })();

  // Event selection toggle
  const toggleEvent = (eventName) => {
    setFormData(prev => {
      const exists = prev.selectedEvents.includes(eventName);
      const updated = exists
        ? prev.selectedEvents.filter(e => e !== eventName)
        : [...prev.selectedEvents, eventName];
      return { ...prev, selectedEvents: updated };
    });
    if (errors.selectedEvents) {
      setErrors(prev => ({ ...prev, selectedEvents: null }));
    }
  };

  // Switch Registration Type
  const handleRegistrationTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      registrationType: type,
      isTeam: type === 'team' || prev.teamMembers.length > 0 || prev.teamName.trim().length > 0
    }));
  };

  // Team member handlers: 1 leader (primary) + up to 3 teammates = 4 members maximum
  const MAX_ADDITIONAL_MEMBERS = 3;

  const handleAddMember = () => {
    if (formData.teamMembers.length >= MAX_ADDITIONAL_MEMBERS) {
      setErrors(prev => ({
        ...prev,
        teamMembers: 'Maximum 4 members allowed per team (1 Team Leader + 3 Teammates).'
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      isTeam: true,
      teamMembers: [...prev.teamMembers, { name: '', email: '', mobile: '' }]
    }));
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, teamMembers: updated }));
  };

  const handleRemoveMember = (index) => {
    const updated = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      teamMembers: updated,
      isTeam: prev.registrationType === 'team' || updated.length > 0 || prev.teamName.trim().length > 0
    }));
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid Email Address is required.';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      newErrors.mobile = 'Valid 10-digit mobile number is required.';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College / Institution name is required.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department name is required.';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'Year of Study is required.';
    }

    if (formData.selectedEvents.length === 0) {
      newErrors.selectedEvents = 'Please select at least one event.';
    }

    // Team Size Validation: max 4 members total (1 leader + 3 teammates)
    if (formData.teamMembers.length > MAX_ADDITIONAL_MEMBERS) {
      newErrors.teamMembers = 'Team size cannot exceed 4 members in total (1 Team Leader + 3 Teammates).';
    }

    // If Team Registration, ensure added teammate names are filled
    if (formData.registrationType === 'team' && formData.teamMembers.length > 0) {
      const hasEmptyName = formData.teamMembers.some(m => !m.name || !m.name.trim());
      if (hasEmptyName) {
        newErrors.teamMembers = 'Please enter names for all added teammates, or remove extra teammate slots.';
      }
    }

    // E-Sports requires 4 players total (1 leader + 3 teammates)
    const hasEsports = formData.selectedEvents.some(e => e.toLowerCase() === 'e-sports');
    if (hasEsports) {
      if (formData.teamMembers.length < 3) {
        newErrors.teamMembers = 'E-Sports tournament requires a team of 4 players (1 Team Leader + 3 Teammates). Please add all 3 teammate details.';
      }
    }

    if (!utrNumber.trim() || utrNumber.length < 6) {
      newErrors.utrNumber = 'Transaction ID / UTR is required (minimum 6 characters).';
    }

    if (!paymentScreenshot) {
      newErrors.paymentScreenshot = 'Please upload a clear screenshot of your successful payment.';
    }

    if (!formData.declarationConfirmed) {
      newErrors.declaration = 'You must confirm that the information provided is correct.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const errorField = document.querySelector('.border-rose-500, .text-rose-400');
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Create and persist registration record with verified data structure
      const newRecord = await createRegistration({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        college: formData.college,
        department: formData.department,
        year: formData.year,
        selectedEvents: formData.selectedEvents,
        teamMembers: formData.teamMembers.filter(m => m.name && m.name.trim() !== ''),
        flexibleMemberDetails: formData.flexibleMemberDetails,
        utr: utrNumber,
        screenshotFile: paymentScreenshot,
        amount: feeBreakdown.total,
        registrationType: formData.registrationType,
        bookStall: formData.bookStall
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmittedData(newRecord);
        if (onRegistrationSuccess) {
          onRegistrationSuccess(newRecord);
        }
      }, 500);
    } catch (err) {
      console.error('Registration submission failed:', err);
      setIsSubmitting(false);
      setErrors({ form: 'An error occurred while saving your registration. Please try again.' });
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      college: '',
      department: '',
      year: 'III Year',
      registrationType: 'individual',
      selectedCategory: 'all',
      selectedEvents: [],
      bookStall: false,
      isTeam: false,
      teamName: '',
      teamMembers: [],
      flexibleMemberDetails: '',
      declarationConfirmed: false
    });
    setUtrNumber('');
    setPaymentScreenshot(null);
    setErrors({});
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Filter events for selection step
  const technicalEvents = EVENTS_DATA.filter(e => e.category === 'Technical');
  const nonTechnicalEvents = EVENTS_DATA.filter(e => e.category === 'Non-Technical');
  const hasEsportsSelected = formData.selectedEvents.some(e => e.toLowerCase() === 'e-sports');
  const showTeamSection = formData.registrationType === 'team' || hasEsportsSelected;

  return (
    <section id="register" className="relative py-24 bg-space-950 overflow-hidden">

      {/* Background Cyber Accents */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Ticket className="w-3.5 h-3.5" />
            <span>Official Portal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            CHRONYX <span className="cyber-gradient-text">REGISTRATION</span>
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm font-mono">
            Register your pass for the AI & Data Science Symposium on <strong>10-10-2026</strong>.
          </p>
        </div>

        {/* Global Error Banner */}
        {errors.form && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-mono flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* ================================================================ */}
        {/* REGISTRATION CONFIRMATION SCREEN (When submitted)                */}
        {/* ================================================================ */}
        {submittedData ? (
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-cyber-cyan/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] text-center animate-fade-in relative overflow-hidden">

            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block text-[11px] font-mono text-cyber-cyan uppercase tracking-widest mb-1 font-bold">
              Registration Received
            </span>

            <h3 className="text-2xl sm:text-3xl font-black font-tech text-white uppercase tracking-wider mb-2">
              Registration Pass Generated
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto font-mono mb-6">
              Your registration has been recorded successfully. Please save your unique Registration ID for status verification.
            </p>

            {/* Generated Unique ID Badge */}
            <div className="inline-flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-space-950 border border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.2)] mb-8 min-w-[280px]">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1">
                Unique Registration ID
              </span>
              <span className="text-2xl sm:text-3xl font-black font-tech text-cyber-cyan tracking-widest">
                {submittedData.regId}
              </span>
              <span className="text-[10px] font-mono text-amber-300 mt-2 flex items-center space-x-1">
                <Clock className="w-3 h-3 shrink-0" />
                <span>Status: Payment Verification Pending</span>
              </span>
            </div>

            {/* Registration Summary Card (Printable) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-space-950/80 border border-slate-800 text-left space-y-3 mb-8 max-w-xl mx-auto print:border-black print:text-black">

              {/* Participant Name */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-black">
                <span className="text-xs font-mono text-slate-400 uppercase print:text-gray-600">
                  Participant Name
                </span>
                <span className="text-base sm:text-lg font-bold text-white print:text-black font-tech">
                  {submittedData.name}
                </span>
              </div>

              {/* Institution & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Institution</span>
                  <span className="text-slate-200 font-semibold print:text-black">{submittedData.college}</span>
                </div>
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Department & Year</span>
                  <span className="text-slate-200 font-semibold print:text-black">{submittedData.department} • {submittedData.year}</span>
                </div>
              </div>

              {/* Registration Type & Fee Paid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-slate-800 print:border-black">
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Registration Type</span>
                  <span className="text-cyber-cyan font-bold capitalize print:text-black">
                    {submittedData.registration_type === 'team' ? 'Team (Max 4)' : 'Individual'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Stall Booking</span>
                  <span className="text-slate-200 font-semibold print:text-black">
                    {submittedData.stall_booking ? 'Yes (₹150)' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Amount Paid</span>
                  <span className="text-white font-bold text-sm print:text-black">
                    ₹{submittedData.amount || 0}
                  </span>
                </div>
              </div>

              {/* Selected Events */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 print:text-gray-600">
                  Selected Event(s)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {submittedData.events.map((ev, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-semibold print:border-black print:text-black"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team Members if any */}
              {submittedData.teamMembers && submittedData.teamMembers.length > 0 && (
                <div className="pt-2 border-t border-slate-800 print:border-black text-xs font-mono">
                  <span className="text-slate-400 block mb-1 print:text-gray-600">
                    Team Members ({submittedData.teamName || 'Team'}):
                  </span>
                  <ul className="space-y-0.5 text-slate-300 print:text-black">
                    {submittedData.teamMembers.map((m, idx) => (
                      <li key={idx}>• {m.name} {m.mobile ? `(${m.mobile})` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Event Date & Venue Reminder */}
              <div className="pt-2 border-t border-slate-800 print:border-black text-[11px] font-mono text-slate-400 print:text-black">
                Date: <strong>10-10-2026</strong> | Starting Time: <strong>9:00 A.M</strong> | Venue: <strong>College Campus</strong>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
              <button
                onClick={handlePrintReceipt}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyber-cyan/30 hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Save Registration Details</span>
              </button>

              {onNavigateStatus && (
                <button
                  onClick={() => onNavigateStatus(submittedData.regId)}
                  className="px-5 py-3 rounded-xl cyber-glass border border-slate-700 hover:border-cyber-cyan text-white text-xs font-mono transition-colors flex items-center space-x-1.5"
                >
                  <Clock className="w-4 h-4 text-cyber-cyan" />
                  <span>Check Verification Status</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (onNavigateHome) onNavigateHome();
                  else handleResetForm();
                }}
                className="px-5 py-3 rounded-xl bg-space-900 border border-slate-700 hover:bg-space-800 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>

          </div>

        ) : (

          /* ================================================================ */
          /* REGISTRATION FORM                                                */
          /* ================================================================ */
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative">

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* STEP 1: PARTICIPANT DETAILS */}
              <div>
                <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-800">
                  <User className="w-5 h-5 text-cyber-cyan" />
                  <h3 className="font-tech text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                    1. Participant Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: null });
                      }}
                      className={`w-full bg-space-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
                      }`}
                    />
                    {errors.fullName && <p className="text-rose-400 text-xs font-mono mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={`w-full bg-space-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
                      }`}
                    />
                    {errors.email && <p className="text-rose-400 text-xs font-mono mt-1">{errors.email}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      Mobile / WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, mobile: val });
                        if (errors.mobile) setErrors({ ...errors, mobile: null });
                      }}
                      className={`w-full bg-space-950 border rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.mobile ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
                      }`}
                    />
                    {errors.mobile && <p className="text-rose-400 text-xs font-mono mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Year of Study */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      Year of Study <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-space-950 border border-slate-800 focus:border-cyber-cyan rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="I Year">I Year</option>
                      <option value="II Year">II Year</option>
                      <option value="III Year">III Year</option>
                      <option value="IV Year">IV Year</option>
                    </select>
                  </div>

                  {/* College */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      College / Institution <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter college name"
                      value={formData.college}
                      onChange={(e) => {
                        setFormData({ ...formData, college: e.target.value });
                        if (errors.college) setErrors({ ...errors, college: null });
                      }}
                      className={`w-full bg-space-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.college ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
                      }`}
                    />
                    {errors.college && <p className="text-rose-400 text-xs font-mono mt-1">{errors.college}</p>}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-slate-300 mb-1.5">
                      Department <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artificial Intelligence & Data Science"
                      value={formData.department}
                      onChange={(e) => {
                        setFormData({ ...formData, department: e.target.value });
                        if (errors.department) setErrors({ ...errors, department: null });
                      }}
                      className={`w-full bg-space-950 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        errors.department ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
                      }`}
                    />
                    {errors.department && <p className="text-rose-400 text-xs font-mono mt-1">{errors.department}</p>}
                  </div>

                </div>
              </div>

              {/* STEP 2: REGISTRATION TYPE & EVENT SELECTION */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-cyber-purple" />
                    <h3 className="font-tech text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                      2. Registration Type & Event Selection
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyber-cyan">
                    Selected: {formData.selectedEvents.length} Event(s)
                  </span>
                </div>

                {/* Registration Type Selector */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-slate-300 uppercase font-bold tracking-wider block mb-2">
                    Select Registration Type <span className="text-rose-400">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Individual Registration */}
                    <button
                      type="button"
                      onClick={() => handleRegistrationTypeChange('individual')}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        formData.registrationType === 'individual'
                          ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-xs font-mono uppercase font-bold text-cyber-cyan flex items-center space-x-1.5">
                          <User className="w-4 h-4" />
                          <span>Individual Registration</span>
                        </span>
                        <span className="text-sm font-black font-tech text-cyber-cyan">₹100 / person</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Standard individual pass for 1 person across symposium events.
                      </p>
                    </button>

                    {/* Team Registration */}
                    <button
                      type="button"
                      onClick={() => handleRegistrationTypeChange('team')}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        formData.registrationType === 'team'
                          ? 'bg-cyber-purple/20 border-cyber-purple shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="text-xs font-mono uppercase font-bold text-purple-300 flex items-center space-x-1.5">
                          <Users className="w-4 h-4" />
                          <span>Team Registration</span>
                        </span>
                        <span className="text-sm font-black font-tech text-purple-300">₹350 / team</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Maximum 4 members per team (1 Team Leader + up to 3 Teammates).
                      </p>
                    </button>

                  </div>
                </div>

                {errors.selectedEvents && (
                  <p className="text-rose-400 text-xs font-mono mb-3 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.selectedEvents}
                  </p>
                )}

                {/* Technical Events */}
                <div className="mb-4">
                  <span className="text-[11px] font-mono text-cyber-cyan uppercase font-bold tracking-wider block mb-2">
                    Technical Events
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {technicalEvents.map(ev => {
                      const isSelected = formData.selectedEvents.includes(ev.name);
                      return (
                        <button
                          type="button"
                          key={ev.id}
                          onClick={() => toggleEvent(ev.name)}
                          className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                              : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="overflow-hidden pr-2">
                            <p className="text-xs font-bold font-tech truncate">{ev.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Technical</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-cyber-cyan border-cyber-cyan text-space-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Non-Technical Event (E-Sports) */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-cyber-purple uppercase font-bold tracking-wider block mb-2">
                    Non-Technical Event
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {nonTechnicalEvents.map(ev => {
                      const isSelected = formData.selectedEvents.includes(ev.name);
                      const isEsports = ev.id === 'e-sports' || ev.name.toLowerCase().includes('e-sports');
                      return (
                        <button
                          type="button"
                          key={ev.id}
                          onClick={() => toggleEvent(ev.name)}
                          className={`p-3.5 rounded-xl text-left border transition-all flex items-start justify-between ${
                            isSelected
                              ? 'bg-cyber-purple/20 border-cyber-purple shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white'
                              : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="overflow-hidden pr-2">
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              <p className="text-xs font-bold font-tech">{ev.name}</p>
                              {isEsports && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  ₹50 / team
                                </span>
                              )}
                              {isEsports && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>Cash Prizes Available</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-purple-300 font-mono mt-1">Non-Technical Event • Team size: 4 players</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                            isSelected ? 'bg-cyber-purple border-cyber-purple text-space-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stall Booking Addon Box (Separate Optional Selection: ₹150 / team) */}
                <div className="mb-6 p-4 rounded-2xl bg-space-950/90 border border-cyber-cyan/30 hover:border-cyber-cyan/50 transition-all">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bookStall}
                      onChange={(e) => setFormData({ ...formData, bookStall: e.target.checked })}
                      className="w-4 h-4 mt-1 rounded bg-space-900 border-slate-700 text-cyber-cyan focus:ring-cyber-cyan focus:ring-offset-space-950 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Store className="w-4 h-4 text-cyber-cyan" />
                          <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                            Book a Project / Product Stall
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                            Separate Optional Selection
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-black font-tech text-cyber-cyan">
                          ₹150 / team
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">
                        Dedicated stall at the campus venue. Stall payment is completely separate from the main registration fee (not included in the ₹350 team registration fee).
                      </p>
                    </div>
                  </label>
                </div>

                {/* Selected Events Summary */}
                {formData.selectedEvents.length > 0 && (
                  <div className="p-4 rounded-2xl bg-space-950/80 border border-slate-800 space-y-3 mb-6">
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                      Selected Event(s)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedEvents.map((eventName, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-semibold"
                        >
                          <span>{eventName}</span>
                          <button
                            type="button"
                            onClick={() => toggleEvent(eventName)}
                            className="text-slate-400 hover:text-white p-0.5"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team / Member Details (Shown for Team Registration or E-Sports) */}
                {showTeamSection ? (
                  <div className="p-5 rounded-2xl bg-space-950/80 border border-slate-800 space-y-4">

                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-mono uppercase text-slate-200 font-bold flex items-center space-x-1.5">
                          <Users className="w-4 h-4 text-cyber-cyan" />
                          <span>Team Details (Maximum 4 Members)</span>
                        </span>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          1 Team Leader + up to 3 Teammates (Total 4 members maximum).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddMember}
                        disabled={formData.teamMembers.length >= MAX_ADDITIONAL_MEMBERS}
                        className="px-3 py-1.5 rounded-lg border border-dashed border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan text-xs font-mono flex items-center space-x-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {formData.teamMembers.length >= MAX_ADDITIONAL_MEMBERS
                            ? 'Max 4 Members Reached'
                            : 'Add Teammate'}
                        </span>
                      </button>
                    </div>

                    {/* Member #1: Team Leader from Step 1 */}
                    <div className="p-3 rounded-xl bg-space-900/80 border border-cyber-cyan/30 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold text-[10px] uppercase">
                          Member #1 (Leader)
                        </span>
                        <span className="text-white font-semibold">
                          {formData.fullName || 'Leader name entered in Step 1'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formData.mobile ? `+91 ${formData.mobile}` : 'Contact in Step 1'}
                      </span>
                    </div>

                    {/* Optional Team Name */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Team Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Team Alpha / Neural Squad"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        className="w-full bg-space-900 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    {/* Additional Teammate Input Fields (Members 2 to 4) */}
                    {formData.teamMembers.length > 0 && (
                      <div className="space-y-2.5">
                        {formData.teamMembers.map((member, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-space-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyber-cyan shrink-0">
                              Member #{idx + 2}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="Member Full Name *"
                              value={member.name}
                              onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                              className="w-full sm:flex-1 bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                            />
                            <input
                              type="email"
                              placeholder="Email (optional)"
                              value={member.email}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              className="w-full sm:flex-1 bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                            />
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="Mobile (optional)"
                              value={member.mobile}
                              onChange={(e) => handleMemberChange(idx, 'mobile', e.target.value.replace(/\D/g, ''))}
                              className="w-full sm:w-32 bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1.5 shrink-0"
                              title="Remove Teammate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.teamMembers && (
                      <p className="text-rose-400 text-xs font-mono flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                        <span>{errors.teamMembers}</span>
                      </p>
                    )}

                    {/* Flexible Member Details Text Area */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Additional Member / Participation Notes (Flexible)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Provide any additional notes or team details here..."
                        value={formData.flexibleMemberDetails}
                        onChange={(e) => setFormData({ ...formData, flexibleMemberDetails: e.target.value })}
                        className="w-full bg-space-900 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                      ></textarea>
                    </div>

                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-space-950/60 border border-slate-800 text-slate-400 text-xs font-mono flex items-center justify-between">
                    <span>
                      Individual Registration selected: Pass issued for 1 person (Member #1).
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRegistrationTypeChange('team')}
                      className="text-cyber-cyan hover:underline ml-2 shrink-0 font-bold"
                    >
                      Switch to Team (₹350)
                    </button>
                  </div>
                )}

              </div>

              {/* STEP 3: PAYMENT WITH LIVE FEE BREAKDOWN */}
              <PaymentSection
                utrNumber={utrNumber}
                setUtrNumber={setUtrNumber}
                paymentScreenshot={paymentScreenshot}
                setPaymentScreenshot={setPaymentScreenshot}
                errors={errors}
                setErrors={setErrors}
                feeBreakdown={feeBreakdown}
              />

              {/* STEP 4: DECLARATION */}
              <div className="pt-4 border-t border-slate-800">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationConfirmed}
                    onChange={(e) => {
                      setFormData({ ...formData, declarationConfirmed: e.target.checked });
                      if (errors.declaration) setErrors({ ...errors, declaration: null });
                    }}
                    className="w-4 h-4 mt-0.5 rounded bg-space-950 border-slate-700 text-cyber-cyan focus:ring-cyber-cyan focus:ring-offset-space-950"
                  />
                  <span className="text-xs text-slate-300 font-mono leading-relaxed">
                    I confirm that the details provided are correct and match my official college records. I have verified the transaction reference number (UTR) and attached valid proof of payment.
                  </span>
                </label>
                {errors.declaration && (
                  <p className="text-rose-400 text-xs font-mono mt-1.5">{errors.declaration}</p>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyber-cyan via-sky-400 to-cyber-purple text-space-950 font-bold font-tech text-sm sm:text-base uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span className="font-mono">Processing Registration...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Pay ₹{feeBreakdown.total}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </section>
  );
}
