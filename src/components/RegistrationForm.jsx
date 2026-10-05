import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EVENTS_DATA } from '../data/eventsData';
import PaymentSection from './PaymentSection';
import { createRegistration } from '../services/registrationService';
import {
  Ticket, User, Layers, Users, Plus, Trash2,
  CheckCircle2, AlertCircle, ArrowRight, Printer, ArrowLeft, Clock,
  Store, Sparkles, Cpu, Gamepad2, Award
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
    selectedEvents: [],
    bookStall: false,
    foodPreference: 'Veg', // 'Veg' or 'Non-Veg' (complimentary, ₹0)
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

  const isEsportsSelected = formData.selectedEvents.includes('E-Sports');
  const isProjectExpoSelected = formData.selectedEvents.includes('Project Expo');
  const otherSymposiumEvents = formData.selectedEvents.filter(
    e => e !== 'E-Sports' && e !== 'Project Expo'
  );
  const hasOtherEvents = otherSymposiumEvents.length > 0;

  // Selected normal events with their configurations
  const selectedNormalEvents = EVENTS_DATA.filter(
    e => formData.selectedEvents.includes(e.name) && e.name !== 'E-Sports' && e.name !== 'Project Expo'
  );

  // Maximum allowed team members across selected normal events
  const maxNormalAllowed = selectedNormalEvents.length > 0
    ? Math.max(...selectedNormalEvents.map(e => e.maxMembers || 1))
    : 1;

  // Minimum required team members across selected normal events
  const minNormalRequired = selectedNormalEvents.length > 0
    ? Math.max(...selectedNormalEvents.map(e => e.minMembers || 1))
    : 1;

  // Overall maximum allowed members based on selected events
  const maxAllowedTotalMembers = isEsportsSelected
    ? 4
    : isProjectExpoSelected && !isEsportsSelected
    ? 2
    : selectedNormalEvents.length > 0
    ? maxNormalAllowed
    : 4;

  const isTeam = formData.teamMembers.length > 0 || isEsportsSelected || isProjectExpoSelected || formData.registrationType === 'team';
  const participantCount = isTeam ? (1 + formData.teamMembers.length) : 1;

  // Calculate dynamic fees based on official requirements:
  // 1. Individual registration: 1 person = ₹100
  // 2. Normal team/group registration: Each participant costs ₹100 (2 = ₹200, 3 = ₹300, 4 = ₹400)
  // 3. Special event pricing:
  //    - E-Sports: ₹400 per 4-member team total
  //    - Project Expo: ₹200 per 2-member team
  //    - Stall: ₹150 (separate optional add-on)
  //    - Food: ₹0 (complimentary)
  // 4. Avoid duplicate charging:
  //    - E-Sports must remain ₹400 total, not ₹100 × 4 + ₹400
  //    - Project Expo must remain ₹200 total, not ₹100 × 2 + ₹200
  //    - Stall adds ₹150 separately
  const feeBreakdown = (() => {
    let normalFee = 0;
    let normalLabel = '';
    let hasNormalFee = false;

    const esportsTeamFee = isEsportsSelected ? 400 : 0;
    const esportsCharge = 0;
    const esportsFee = isEsportsSelected ? 400 : 0;
    const projectExpoFee = isProjectExpoSelected ? 200 : 0;
    const stallFee = formData.bookStall ? 150 : 0;

    if (!isEsportsSelected && !isProjectExpoSelected) {
      // Normal symposium registration
      hasNormalFee = true;
      normalFee = participantCount * 100;
      if (participantCount === 1) {
        normalLabel = isTeam ? 'Team Registration (1 Member @ ₹100)' : 'Individual Registration (1 Person)';
      } else {
        normalLabel = `Team Registration (${participantCount} Members @ ₹100 each)`;
      }
    } else {
      // Special events are selected. E-Sports is ₹400 total, Project Expo is ₹200 total.
      // Normal fee is set to 0 to prevent duplicate charging.
      hasNormalFee = false;
      normalFee = 0;
    }

    const total = normalFee + esportsFee + projectExpoFee + stallFee;
    const registrationType = isTeam ? 'team' : 'individual';

    return {
      registrationType,
      isTeam,
      participantCount,
      hasGeneralEvents: hasNormalFee,
      generalFee: normalFee,
      normalLabel,
      hasProjectExpo: isProjectExpoSelected,
      projectExpoFee,
      hasEsports: isEsportsSelected,
      esportsTeamFee,
      esportsCharge,
      esportsFee,
      hasStall: formData.bookStall,
      stallFee,
      total
    };
  })();

  // Sync preSelectedEvent if passed from EventCard or Modal
  useEffect(() => {
    if (preSelectedEvent) {
      setFormData(prev => {
        if (!prev.selectedEvents.includes(preSelectedEvent)) {
          const updatedEvents = [...prev.selectedEvents, preSelectedEvent];
          let updatedMembers = [...prev.teamMembers];
          let updatedType = prev.registrationType;

          if (preSelectedEvent === 'E-Sports') {
            updatedType = 'team';
            while (updatedMembers.length < 3) {
              updatedMembers.push({ name: '', foodPreference: 'Veg' });
            }
            if (updatedMembers.length > 3) {
              updatedMembers = updatedMembers.slice(0, 3);
            }
          } else if (preSelectedEvent === 'Project Expo') {
            updatedType = 'team';
            if (!updatedEvents.includes('E-Sports') && updatedMembers.length < 1) {
              updatedMembers.push({ name: '', email: '', mobile: '', foodPreference: 'Veg' });
            }
          }

          return {
            ...prev,
            registrationType: updatedType,
            selectedEvents: updatedEvents,
            teamMembers: updatedMembers
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

  // Individual pass selection handler
  const handleSelectIndividual = () => {
    const remainingEvents = formData.selectedEvents.filter(
      e => e !== 'E-Sports' && e !== 'Project Expo'
    );
    setFormData(prev => ({
      ...prev,
      registrationType: 'individual',
      selectedEvents: remainingEvents,
      teamMembers: []
    }));
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  // Switch Registration Type (Individual vs Team)
  const handleRegistrationTypeChange = (type) => {
    if (type === 'individual') {
      handleSelectIndividual();
    } else {
      setFormData(prev => {
        let updatedMembers = [...prev.teamMembers];
        if (updatedMembers.length === 0) {
          updatedMembers = [{ name: '', email: '', mobile: '' }];
        }
        return {
          ...prev,
          registrationType: 'team',
          teamMembers: updatedMembers
        };
      });
    }
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  // Event selection toggle
  const toggleEvent = (eventName) => {
    setFormData(prev => {
      const exists = prev.selectedEvents.includes(eventName);
      const updatedEvents = exists
        ? prev.selectedEvents.filter(e => e !== eventName)
        : [...prev.selectedEvents, eventName];

      let updatedMembers = [...prev.teamMembers];
      let updatedType = prev.registrationType;

      if (!exists) {
        if (eventName === 'E-Sports') {
          updatedType = 'team';
          while (updatedMembers.length < 3) {
            updatedMembers.push({ name: '', foodPreference: 'Veg' });
          }
          if (updatedMembers.length > 3) {
            updatedMembers = updatedMembers.slice(0, 3);
          }
          updatedMembers = updatedMembers.map(m => ({
            name: m.name || '',
            foodPreference: m.foodPreference || 'Veg'
          }));
        } else if (eventName === 'Project Expo') {
          updatedType = 'team';
          if (!updatedEvents.includes('E-Sports') && updatedMembers.length < 1) {
            updatedMembers.push({ name: '', email: '', mobile: '', foodPreference: 'Veg' });
          }
        }
      }

      return {
        ...prev,
        registrationType: updatedType,
        selectedEvents: updatedEvents,
        teamMembers: updatedMembers
      };
    });
    if (errors.selectedEvents) {
      setErrors(prev => ({ ...prev, selectedEvents: null }));
    }
  };

  // When E-Sports is active, ensure exactly 3 teammates with valid foodPreference
  useEffect(() => {
    if (isEsportsSelected) {
      setFormData(prev => {
        let members = [...prev.teamMembers];
        let changed = false;
        while (members.length < 3) {
          members.push({ name: '', foodPreference: 'Veg' });
          changed = true;
        }
        if (members.length > 3) {
          members = members.slice(0, 3);
          changed = true;
        }
        members = members.map(m => {
          if (!m.foodPreference) {
            changed = true;
            return { ...m, foodPreference: 'Veg' };
          }
          return m;
        });
        if (changed || prev.registrationType !== 'team') {
          return {
            ...prev,
            registrationType: 'team',
            teamMembers: members
          };
        }
        return prev;
      });
    }
  }, [isEsportsSelected]);

  // Team member handlers
  const handleAddMember = () => {
    if (isEsportsSelected && formData.teamMembers.length >= 3) {
      setErrors(prev => ({
        ...prev,
        teamMembers: 'E-Sports tournament requires exactly 4 players (1 Team Leader + 3 Teammates).'
      }));
      return;
    }
    if (isProjectExpoSelected && !isEsportsSelected && formData.teamMembers.length >= 1) {
      setErrors(prev => ({
        ...prev,
        teamMembers: 'Project Expo requires exactly 2 members (1 Team Leader + 1 Teammate).'
      }));
      return;
    }
    if (formData.teamMembers.length + 1 >= maxAllowedTotalMembers) {
      setErrors(prev => ({
        ...prev,
        teamMembers: `Maximum ${maxAllowedTotalMembers} members allowed for the selected event(s).`
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      registrationType: 'team',
      teamMembers: [...prev.teamMembers, { name: '', foodPreference: 'Veg', email: '', mobile: '' }]
    }));
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, teamMembers: updated }));
    if (errors.teamMembers) {
      setErrors(prev => ({ ...prev, teamMembers: null }));
    }
  };

  const handleRemoveMember = (index) => {
    if (isEsportsSelected && formData.teamMembers.length <= 3) {
      setErrors(prev => ({
        ...prev,
        teamMembers: 'E-Sports tournament requires exactly 4 players (1 Team Leader + 3 Teammates).'
      }));
      return;
    }
    if (isProjectExpoSelected && !isEsportsSelected && formData.teamMembers.length <= 1) {
      setErrors(prev => ({
        ...prev,
        teamMembers: 'Project Expo requires exactly 2 members (1 Team Leader + 1 Teammate).'
      }));
      return;
    }
    const updated = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      teamMembers: updated
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

    if (formData.selectedEvents.length === 0 && !formData.bookStall) {
      newErrors.selectedEvents = 'Please select at least one event or stall booking.';
    }

    // Food Preference validation
    if (!formData.foodPreference || !['Veg', 'Non-Veg'].includes(formData.foodPreference)) {
      newErrors.foodPreference = 'Please select food preference (Veg or Non-Veg).';
    }

    // E-Sports requires exactly 4 members total (1 leader + 3 teammates)
    if (isEsportsSelected) {
      if (formData.teamMembers.length !== 3) {
        newErrors.teamMembers = 'E-Sports tournament requires a team of exactly 4 players (1 Team Leader + 3 Teammates). Please provide details for all 3 teammates.';
      } else if (formData.teamMembers.some(m => !m.name || !m.name.trim())) {
        newErrors.teamMembers = 'Please enter full names for all 3 E-Sports teammates.';
      } else if (formData.teamMembers.some(m => !m.foodPreference || !['Veg', 'Non-Veg'].includes(m.foodPreference))) {
        newErrors.teamMembers = 'Please select food preference (Veg or Non-Veg) for all teammates.';
      }
    }

    // Project Expo requires exactly 2 members total (1 leader + 1 teammate)
    if (isProjectExpoSelected && !isEsportsSelected) {
      if (formData.teamMembers.length !== 1) {
        newErrors.teamMembers = 'Project Expo requires a team of exactly 2 members (1 Team Leader + 1 Teammate). Please provide 1 teammate details.';
      } else if (formData.teamMembers.some(m => !m.name || !m.name.trim())) {
        newErrors.teamMembers = 'Please enter the full name for your Project Expo teammate.';
      }
    }

    // Normal team registration validation (neither E-Sports nor Project Expo)
    if (!isEsportsSelected && !isProjectExpoSelected) {
      const teamRequiredEvents = selectedNormalEvents.filter(e => (e.minMembers || 1) > 1);
      if (teamRequiredEvents.length > 0 && formData.teamMembers.length === 0) {
        const reqMin = teamRequiredEvents[0].minMembers;
        newErrors.teamMembers = `${teamRequiredEvents.map(e => e.name).join(', ')} requires a team of at least ${reqMin} members. Please click 'Add Teammate (+₹100)' to add teammates.`;
      } else if (formData.teamMembers.length > 0) {
        if (formData.teamMembers.some(m => !m.name || !m.name.trim())) {
          newErrors.teamMembers = 'Please enter names for all added teammates, or remove empty teammate slots.';
        }
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
        teamMembers: formData.teamMembers
          .filter(m => m.name && m.name.trim() !== '')
          .map(m => ({
            name: m.name.trim(),
            foodPreference: m.foodPreference || 'Veg',
            food_preference: m.foodPreference || 'Veg',
            ...(m.email ? { email: m.email.trim() } : {}),
            ...(m.mobile ? { mobile: m.mobile.trim() } : {})
          })),
        teamName: formData.teamName,
        foodPreference: formData.foodPreference,
        flexibleMemberDetails: formData.flexibleMemberDetails,
        utr: utrNumber,
        screenshotFile: paymentScreenshot,
        amount: feeBreakdown.total,
        registrationType: feeBreakdown.registrationType,
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
      selectedEvents: [],
      bookStall: false,
      foodPreference: 'Veg',
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
  const showTeamSection = isEsportsSelected || isProjectExpoSelected || maxNormalAllowed > 1 || formData.teamMembers.length > 0;

  return (
    <section id="register" className="relative py-24 bg-transparent overflow-hidden">

      {/* Background Cyber Accents */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-rose-600/8 rounded-full blur-[150px] pointer-events-none"></div>

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
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-cyber-cyan/50 shadow-[0_0_60px_rgba(0,240,255,0.25)] text-center animate-fade-in relative overflow-hidden hud-scanline">

            {/* Corner HUD Brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan pointer-events-none"></div>

            {/* Confirmation Telemetry Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/90 pb-2 mb-6 border-b border-emerald-500/20">
              <span className="tracking-widest uppercase flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AUTH_RECORD_CONFIRMED // SYMPOSIUM PASS GENERATED</span>
              </span>
              <span className="text-slate-500 font-mono">STATUS: 200_OK</span>
            </div>

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
            <div className="p-5 sm:p-6 rounded-2xl bg-space-950/80 border border-slate-800 text-left space-y-3.5 mb-8 max-w-xl mx-auto print:border-black print:text-black">

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

              {/* Registration Type, Food Preference & Fee Paid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono pt-2 border-t border-slate-800 print:border-black">
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Registration Type</span>
                  <span className="text-cyber-cyan font-bold capitalize print:text-black">
                    {submittedData.registration_type === 'team'
                      ? `Team Registration (${(submittedData.teamMembers?.length || 0) + 1} Members)`
                      : 'Individual Registration (1 Person)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Food Preference</span>
                  <span className="text-emerald-400 font-semibold print:text-black">
                    {submittedData.food_preference || submittedData.foodPreference || 'Veg'} (Included)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block print:text-gray-600">Amount Paid</span>
                  <span className="text-white font-bold text-sm print:text-black">
                    ₹{submittedData.amount || 0}
                  </span>
                </div>
              </div>

              {/* Stall Booking Status */}
              {submittedData.stall_booking && (
                <div className="text-xs font-mono pt-1 text-slate-300 print:text-black">
                  <span className="text-slate-400">Stall Booking: </span>
                  <span className="text-sky-400 font-bold">Yes (Dedicated Venue Stall Booked)</span>
                </div>
              )}

              {/* Selected Events */}
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 print:text-gray-600">
                  Selected Event(s)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {submittedData.events && submittedData.events.map((ev, i) => (
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

              {/* Provision Badges */}
              <div className="pt-2 border-t border-slate-800 print:border-black grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-space-900 border border-cyber-cyan/30 text-cyber-cyan flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>Certificate Provided</span>
                </div>
                <div className="p-2 rounded-lg bg-space-900 border border-cyber-purple/30 text-purple-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Food Provided</span>
                </div>
              </div>

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
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-cyber-cyan/35 shadow-[0_0_60px_rgba(0,240,255,0.18)] relative overflow-hidden">

            {/* Corner HUD Brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan pointer-events-none"></div>

            {/* Terminal Header Telemetry Bar */}
            <div className="flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-3 mb-6 border-b border-cyber-cyan/20">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                <span className="tracking-widest uppercase">REGISTRATION CONSOLE // SYSTEM_NODE: CHX-2026</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-400">
                <span className="hidden sm:inline">GRID_REF: #SEC-AUTH-01</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
            </div>

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

                {/* Registration Options: Individual, E-Sports, Project Expo, Stall Booking */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-mono text-slate-300 uppercase font-bold tracking-wider">
                      Registration Options & Featured Add-ons <span className="text-rose-400">*</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Select individual pass, featured events, or stall
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                    {/* Option 1: Individual Registration */}
                    <button
                      type="button"
                      onClick={handleSelectIndividual}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                        !isEsportsSelected && !isProjectExpoSelected && formData.teamMembers.length === 0
                          ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.25)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="text-xs font-mono uppercase font-bold text-cyber-cyan flex items-center space-x-1.5">
                            <User className="w-4 h-4" />
                            <span>Individual Registration</span>
                          </span>
                          <span className="text-sm font-black font-tech text-cyber-cyan">₹100</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-semibold">
                            ₹100 / person
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                          Standard symposium pass for 1 person across events. Used for normal individual event participation.
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className={!isEsportsSelected && !isProjectExpoSelected && formData.teamMembers.length === 0 ? 'text-cyber-cyan font-bold' : 'text-slate-500'}>
                          {!isEsportsSelected && !isProjectExpoSelected && formData.teamMembers.length === 0 ? '✓ Selected (1 Person)' : 'Click to Select'}
                        </span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          !isEsportsSelected && !isProjectExpoSelected && formData.teamMembers.length === 0
                            ? 'bg-cyber-cyan border-cyber-cyan text-space-950'
                            : 'border-slate-700'
                        }`}>
                          {!isEsportsSelected && !isProjectExpoSelected && formData.teamMembers.length === 0 && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Option 2: E-Sports */}
                    <button
                      type="button"
                      onClick={() => toggleEvent('E-Sports')}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                        isEsportsSelected
                          ? 'bg-cyber-purple/25 border-cyber-purple shadow-[0_0_25px_rgba(168,85,247,0.35)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="text-xs font-mono uppercase font-bold text-cyber-purple flex items-center space-x-1.5">
                            <Gamepad2 className="w-4 h-4" />
                            <span>E-Sports</span>
                          </span>
                          <span className="text-sm font-black font-tech text-cyber-purple">₹400 / team</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-purple/20 text-purple-300 border border-cyber-purple/40 font-semibold">
                            Team Event • 4 Members
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Cash Prizes Available</span>
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                          Competitive Free Fire BR arena tournament. Requires exactly 4 registered players (₹400 total).
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className={isEsportsSelected ? 'text-cyber-purple font-bold' : 'text-slate-500'}>
                          {isEsportsSelected ? '✓ Selected (4 Members Required)' : 'Click to Select'}
                        </span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isEsportsSelected ? 'bg-cyber-purple border-cyber-purple text-space-950' : 'border-slate-700'
                        }`}>
                          {isEsportsSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Option 3: Project Expo */}
                    <button
                      type="button"
                      onClick={() => toggleEvent('Project Expo')}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                        isProjectExpoSelected
                          ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_25px_rgba(0,240,255,0.3)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="text-xs font-mono uppercase font-bold text-cyber-cyan flex items-center space-x-1.5">
                            <Cpu className="w-4 h-4" />
                            <span>Project Expo</span>
                          </span>
                          <span className="text-sm font-black font-tech text-cyber-cyan">₹200 / team</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-semibold">
                            Team Event • 2 Members
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                          Demonstrate working prototypes, models, and innovative solutions. Requires exactly 2 members (₹200 total).
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className={isProjectExpoSelected ? 'text-cyber-cyan font-bold' : 'text-slate-500'}>
                          {isProjectExpoSelected ? '✓ Selected (2 Members Required)' : 'Click to Select'}
                        </span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isProjectExpoSelected ? 'bg-cyber-cyan border-cyber-cyan text-space-950' : 'border-slate-700'
                        }`}>
                          {isProjectExpoSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Option 4: Stall Booking */}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bookStall: !prev.bookStall }))}
                      className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                        formData.bookStall
                          ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.3)] text-white'
                          : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="text-xs font-mono uppercase font-bold text-sky-400 flex items-center space-x-1.5">
                            <Store className="w-4 h-4" />
                            <span>Stall Booking</span>
                          </span>
                          <span className="text-sm font-black font-tech text-sky-400">₹150 / stall</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold">
                            Optional Add-on
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                          Dedicated stall at the campus venue. Completely separate booking, not treated as an event or team registration.
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                        <span className={formData.bookStall ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                          {formData.bookStall ? '✓ Booked (+₹150 to total)' : 'Click to Add Stall'}
                        </span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          formData.bookStall ? 'bg-sky-400 border-sky-400 text-space-950' : 'border-slate-700'
                        }`}>
                          {formData.bookStall && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                  </div>
                </div>

                {errors.selectedEvents && (
                  <p className="text-rose-400 text-xs font-mono mb-3 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    {errors.selectedEvents}
                  </p>
                )}

                {/* General Symposium Events - Technical */}
                <div className="mb-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-cyber-cyan uppercase font-bold tracking-wider">
                      Technical Events (General Symposium Events)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Select any to participate
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {technicalEvents.map(ev => {
                      const isSelected = formData.selectedEvents.includes(ev.name);
                      const isExpo = ev.id === 'project-expo';
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
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <p className="text-xs font-bold font-tech truncate">{ev.name}</p>
                              {isExpo && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30">
                                  ₹200
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {ev.memberCount || 'Technical'}
                            </p>
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

                {/* Non-Technical Events */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-cyber-purple uppercase font-bold tracking-wider block mb-2">
                    Non-Technical Events
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {nonTechnicalEvents.map(ev => {
                      const isSelected = formData.selectedEvents.includes(ev.name);
                      const isEsports = ev.id === 'e-sports' || ev.name.toLowerCase().includes('e-sports');
                      return (
                        <button
                          type="button"
                          key={ev.id}
                          onClick={() => toggleEvent(ev.name)}
                          className={`p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyber-purple/20 border-cyber-purple shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white'
                              : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="overflow-hidden pr-2">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <p className="text-xs font-bold font-tech truncate">{ev.name}</p>
                              {isEsports && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyber-purple/20 text-purple-300 border border-cyber-purple/40">
                                  ₹400
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-purple-300 font-mono">
                              {ev.memberCount || 'Non-Technical'}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-cyber-purple border-cyber-purple text-space-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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

              </div>

              {/* STEP 3: FOOD PREFERENCE (COMPLIMENTARY) */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-tech text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                      {isEsportsSelected ? '3. Team Leader Food Preference' : '3. Food Preference'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                    Complimentary • ₹0 (Included)
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono mb-3">
                  {isEsportsSelected
                    ? 'Select food preference for Player 1 (Team Leader). Teammate food preferences (Players 2, 3, 4) are individually selected in Step 4 below:'
                    : 'Food and lunch refreshments are provided for all registered participants. Please select your preference below:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Vegetarian */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foodPreference: 'Veg' })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.foodPreference === 'Veg'
                        ? 'bg-emerald-500/15 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] text-white'
                        : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-300"></span>
                        <span className="text-sm font-bold font-tech uppercase tracking-wider text-emerald-300">
                          Vegetarian (Veg)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Full vegetarian meal & refreshments
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      formData.foodPreference === 'Veg' ? 'bg-emerald-400 border-emerald-400 text-space-950' : 'border-slate-700'
                    }`}>
                      {formData.foodPreference === 'Veg' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Non-Vegetarian */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, foodPreference: 'Non-Veg' })}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      formData.foodPreference === 'Non-Veg'
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-white'
                        : 'bg-space-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300"></span>
                        <span className="text-sm font-bold font-tech uppercase tracking-wider text-amber-300">
                          Non-Vegetarian (Non-Veg)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">
                        Full non-vegetarian meal & refreshments
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                      formData.foodPreference === 'Non-Veg' ? 'bg-amber-400 border-amber-400 text-space-950' : 'border-slate-700'
                    }`}>
                      {formData.foodPreference === 'Non-Veg' && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                </div>
                {errors.foodPreference && (
                  <p className="text-rose-400 text-xs font-mono mt-2 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span>{errors.foodPreference}</span>
                  </p>
                )}
              </div>

              {/* STEP 4: TEAM / MEMBER DETAILS (DYNAMIC BASED ON EVENTS & PARTICIPANTS) */}
              {showTeamSection ? (
                <div className="p-5 rounded-2xl bg-space-950/80 border border-slate-800 space-y-4">

                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-mono uppercase text-slate-200 font-bold flex items-center space-x-1.5">
                        <Users className="w-4 h-4 text-cyber-cyan" />
                        <span>Team Details</span>
                      </span>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {isEsportsSelected
                          ? 'E-Sports tournament requires exactly 4 players (1 Team Leader + 3 Teammates).'
                          : isProjectExpoSelected
                          ? 'Project Expo requires exactly 2 members (1 Team Leader + 1 Teammate).'
                          : selectedNormalEvents.length > 0
                          ? `Selected event allows ${minNormalRequired === maxNormalAllowed ? maxNormalAllowed : `${minNormalRequired} to ${maxNormalAllowed}`} members (${participantCount} registered @ ₹100 each = ₹${participantCount * 100}).`
                          : `Team registration: ${participantCount} members (₹100 per member = ₹${participantCount * 100}).`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMember}
                      disabled={
                        (isEsportsSelected && formData.teamMembers.length >= 3) ||
                        (isProjectExpoSelected && !isEsportsSelected && formData.teamMembers.length >= 1) ||
                        formData.teamMembers.length + 1 >= maxAllowedTotalMembers
                      }
                      className="px-3 py-1.5 rounded-lg border border-dashed border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan text-xs font-mono flex items-center space-x-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {isEsportsSelected
                          ? 'Team Limit: 4 Players'
                          : isProjectExpoSelected && !isEsportsSelected
                          ? 'Team Limit: 2 Members'
                          : formData.teamMembers.length + 1 >= maxAllowedTotalMembers
                          ? `Max ${maxAllowedTotalMembers} Members Reached`
                          : 'Add Teammate (+₹100)'}
                      </span>
                    </button>
                  </div>

                  {/* Member #1: Team Leader from Step 1 */}
                  <div className="p-3.5 rounded-xl bg-space-900/80 border border-cyber-cyan/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold text-[10px] uppercase">
                        {isEsportsSelected ? 'Player #1 (Team Leader)' : 'Member #1 (Leader)'}
                      </span>
                      <span className="text-white font-semibold">
                        {formData.fullName || 'Leader name entered in Step 1'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span className="text-slate-400">
                        {formData.mobile ? `+91 ${formData.mobile}` : 'Contact in Step 1'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        formData.foodPreference === 'Veg'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        Food: {formData.foodPreference || 'Veg'}
                      </span>
                    </div>
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
                    <div className="space-y-3">
                      {formData.teamMembers.map((member, idx) => {
                        const playerNum = idx + 2;
                        if (isEsportsSelected) {
                          const currentFood = member.foodPreference || 'Veg';
                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-space-900/70 border border-slate-800/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-colors hover:border-slate-700"
                            >
                              <div className="flex items-center justify-between sm:justify-start space-x-2 shrink-0">
                                <span className="text-xs font-mono font-bold text-cyber-purple px-2 py-0.5 rounded bg-cyber-purple/15 border border-cyber-purple/30">
                                  Player #{playerNum}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 sm:hidden">
                                  Food: {currentFood}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  required
                                  placeholder={`Player #${playerNum} Full Name *`}
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                  className="w-full bg-space-950 border border-slate-800 focus:border-cyber-purple rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyber-purple transition-all"
                                />
                              </div>

                              {/* Food Preference Selector: Veg / Non-Veg */}
                              <div className="flex items-center space-x-1.5 shrink-0 bg-space-950 p-1 rounded-lg border border-slate-800 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => handleMemberChange(idx, 'foodPreference', 'Veg')}
                                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 ${
                                    currentFood === 'Veg'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                  }`}
                                  title={`Select Vegetarian for Player #${playerNum}`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${currentFood === 'Veg' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                  <span>Veg</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMemberChange(idx, 'foodPreference', 'Non-Veg')}
                                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all flex items-center space-x-1.5 ${
                                    currentFood === 'Non-Veg'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                                  }`}
                                  title={`Select Non-Vegetarian for Player #${playerNum}`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${currentFood === 'Non-Veg' ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
                                  <span>Non-Veg</span>
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // Normal non-esports team members (Project Expo, etc.)
                        return (
                          <div key={idx} className="p-3 rounded-xl bg-space-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyber-cyan shrink-0">
                              Member #{playerNum}
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
                              value={member.email || ''}
                              onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                              className="w-full sm:flex-1 bg-space-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                            />
                            <input
                              type="tel"
                              maxLength={10}
                              placeholder="Mobile (optional)"
                              value={member.mobile || ''}
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
                        );
                      })}
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
                <div className="p-4 rounded-2xl bg-space-950/60 border border-slate-800 text-slate-400 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-cyber-cyan shrink-0" />
                    <span>
                      Individual registration active: 1 person (Member #1). Fee: ₹100.
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Team selection unfolds dynamically when team events are selected above.
                  </span>
                </div>
              )}

              {/* STEP 5: PAYMENT WITH LIVE FEE BREAKDOWN */}
              <PaymentSection
                utrNumber={utrNumber}
                setUtrNumber={setUtrNumber}
                paymentScreenshot={paymentScreenshot}
                setPaymentScreenshot={setPaymentScreenshot}
                errors={errors}
                setErrors={setErrors}
                feeBreakdown={feeBreakdown}
              />

              {/* STEP 6: DECLARATION */}
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
