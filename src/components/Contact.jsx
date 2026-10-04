import React, { useState } from 'react';
import {
  Phone, MessageSquare, User, ShieldCheck, Send, CheckCircle, Headphones, Sparkles
} from 'lucide-react';

export default function Contact() {
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const coordinators = [
    {
      role: 'Student Coordinator',
      title: 'Bharathasan',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Student Lead',
      color: 'border-cyber-cyan text-cyber-cyan',
      phone: '7200226208',
      whatsapp: '7200226208'
    },
    {
      role: 'Student Coordinator',
      title: 'Kesavaprasath',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Student Lead',
      color: 'border-cyber-cyan text-cyber-cyan',
      phone: '9585605199',
      whatsapp: '9585605199'
    },
    {
      role: 'Student Coordinator',
      title: 'Sam Abinash',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Student Lead',
      color: 'border-cyber-cyan text-cyber-cyan',
      phone: '9342049991',
      whatsapp: '9342049991'
    }
  ];

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-24 bg-transparent overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-600/8 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full cyber-glass border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-4">
            <Headphones className="w-3.5 h-3.5" />
            <span>Connect & Support</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-tech tracking-tight text-white mb-4 uppercase">
            Symposium <span className="cyber-gradient-text">Coordinators</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base mb-3">
            Reach out to our student coordinators for registration queries, event guidelines, or campus assistance.
          </p>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-space-950/80 border border-cyber-purple/40 text-cyber-purple text-xs font-mono">
            <User className="w-3.5 h-3.5 text-cyber-purple" />
            <span>Faculty Convener: HOD – AI&DS</span>
          </div>
        </div>

        {/* Coordinators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {coordinators.map((c, idx) => (
            <div
              key={idx}
              className="cyber-glass rounded-2xl p-6 sm:p-7 border border-slate-800/80 hover:border-cyber-cyan/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent group-hover:via-cyber-cyan transition-colors"></div>

              <div>
                {/* Badge & Telemetry */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-space-950 border border-slate-700 flex items-center justify-center text-cyber-cyan group-hover:border-cyber-cyan group-hover:scale-110 transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border bg-space-950/70 ${c.color}`}>
                      {c.badge}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">COMMS // 0{idx + 1}</span>
                  </div>
                </div>

                {/* Coordinator Name & Title */}
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  {c.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-tech text-white mt-1 mb-2 group-hover:text-cyber-cyan transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {c.department}
                </p>

                {/* Direct Phone Number Display */}
                <div className="flex items-center space-x-2 text-xs font-mono text-cyber-cyan mb-6 bg-space-950/60 px-3 py-2 rounded-xl border border-slate-800">
                  <Phone className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                  <span>+91 {c.phone}</span>
                </div>
              </div>

              {/* Call & WhatsApp Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                <a
                  href={`tel:+91${c.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl cyber-glass border border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan hover:text-white text-xs font-mono font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Coordinator</span>
                </a>

                <a
                  href={`https://wa.me/91${c.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-400 text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Query</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Help & Direct Message Box */}
        <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-slate-800 max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            <div className="md:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber-cyan font-semibold">
                Have a Quick Question?
              </span>
              <h3 className="text-2xl font-bold font-tech text-white">
                Official Helpdesk Support
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Send your queries regarding event rules, team eligibility, on-spot accommodation, or registration fee confirmation.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300 pt-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-cyber-purple" />
                  <span>Faculty Convener: HOD – AI&DS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyber-cyan" />
                  <span>Organized by AI & DS Department</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyber-purple" />
                  <span>Jaya Sakthi Engineering College</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              {inquirySent ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 animate-bounce" />
                  <h4 className="text-lg font-bold font-tech text-white">Inquiry Received</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    The student coordinator desk will contact you via email/WhatsApp shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full bg-space-950 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full bg-space-950 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject (e.g. Datathon Eligibility)"
                    value={inquiryForm.subject}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                    className="w-full bg-space-950 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="Type your message or inquiry here..."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full bg-space-950 border border-slate-800 focus:border-cyber-cyan rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-blue text-space-950 font-bold font-tech text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Coordinators</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
