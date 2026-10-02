import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Mail, User, ShieldCheck, Send, CheckCircle, Headphones, Sparkles 
} from 'lucide-react';

export default function Contact() {
  const [activeModalContact, setActiveModalContact] = useState(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const coordinators = [
    {
      role: 'Head of the Department',
      title: 'HOD – AI&DS',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Faculty Convener',
      color: 'border-cyber-purple text-cyber-purple',
      type: 'faculty'
    },
    {
      role: 'Student Coordinator',
      title: 'Bharathasan',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Student Lead',
      color: 'border-cyber-cyan text-cyber-cyan',
      type: 'student'
    },
    {
      role: 'Student Coordinator',
      title: 'Kesavaprasath',
      department: 'Department of Artificial Intelligence and Data Science',
      badge: 'Student Lead',
      color: 'border-cyber-cyan text-cyber-cyan',
      type: 'student'
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
    <section id="contact" className="relative py-24 bg-space-900/60 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-[160px] pointer-events-none"></div>

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

          <p className="text-slate-400 text-sm sm:text-base">
            Reach out to our organizing committee for registration queries, event guidelines, or campus assistance.
          </p>
        </div>

        {/* Coordinators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {coordinators.map((c, idx) => (
            <div 
              key={idx}
              className="cyber-glass rounded-2xl p-6 sm:p-7 border border-slate-800 hover:border-cyber-cyan/40 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-space-950 border border-slate-700 flex items-center justify-center text-cyber-cyan group-hover:border-cyber-cyan group-hover:scale-110 transition-all">
                    <User className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border bg-space-950/70 ${c.color}`}>
                    {c.badge}
                  </span>
                </div>

                {/* Coordinator Name & Title */}
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  {c.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-tech text-white mt-1 mb-2 group-hover:text-cyber-cyan transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {c.department}
                </p>
              </div>

              {/* Call & WhatsApp Placeholders */}
              <div className="space-y-2 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveModalContact({ name: c.title, role: c.role, action: 'Call' })}
                  className="w-full py-2.5 px-4 rounded-xl cyber-glass border border-cyber-cyan/40 hover:border-cyber-cyan text-cyber-cyan hover:text-white text-xs font-mono font-medium transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Coordinator</span>
                </button>

                <button
                  onClick={() => setActiveModalContact({ name: c.title, role: c.role, action: 'WhatsApp' })}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-400 text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Query</span>
                </button>
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

      {/* Coordinator Contact Action Modal */}
      {activeModalContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-space-900 border border-cyber-cyan/40 rounded-3xl p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 rounded-2xl bg-cyber-cyan/15 text-cyber-cyan mx-auto mb-3 flex items-center justify-center">
              {activeModalContact.action === 'Call' ? <Phone className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </div>

            <h4 className="text-xl font-bold font-tech text-white">
              {activeModalContact.action} {activeModalContact.name}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1 mb-4">
              {activeModalContact.role} • AI & DS Department
            </p>

            <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300 leading-relaxed text-left space-y-2 mb-6">
              <p className="font-semibold text-cyber-cyan">Official Line Instructions:</p>
              <p>
                Student coordinator lines are open between <strong>08:30 AM to 06:00 PM</strong> for symposium assistance.
              </p>
              <p className="text-[11px] text-slate-400">
                (Official phone numbers will be activated on the live college domain or pre-printed on the registration confirmations to preserve student privacy).
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setActiveModalContact(null)}
                className="w-full py-2.5 rounded-xl bg-space-800 text-slate-200 hover:text-white font-mono text-xs transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
