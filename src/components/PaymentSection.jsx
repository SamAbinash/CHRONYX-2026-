import React, { useState } from 'react';
import {
  Upload, CheckCircle2, AlertCircle, Image as ImageIcon, X, CreditCard,
  Gamepad2, Store, Users, User, Cpu
} from 'lucide-react';

export default function PaymentSection({
  utrNumber,
  setUtrNumber,
  paymentScreenshot,
  setPaymentScreenshot,
  errors,
  setErrors,
  feeBreakdown
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      if (setErrors) {
        setErrors(prev => ({
          ...prev,
          paymentScreenshot: 'Invalid file format. Please upload a clear image screenshot (PNG, JPG, or WEBP).'
        }));
      }
      return;
    }

    if (setErrors) {
      setErrors(prev => ({ ...prev, paymentScreenshot: null }));
    }

    setPaymentScreenshot(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveFile = () => {
    setPaymentScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const totalAmount = feeBreakdown?.total || 0;

  return (
    <div className="pt-6 border-t border-slate-800">

      {/* Payment Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/35 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl sm:text-2xl font-black font-tech text-white uppercase tracking-wider">
              PAYMENT TERMINAL
            </h3>
            <span className="hidden sm:inline-block text-[10px] font-mono text-cyber-cyan border border-cyber-cyan/30 px-2 py-0.5 rounded-full uppercase bg-cyber-cyan/10">
              SECURE GATEWAY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Scan the official UPI QR to complete payment of <span className="text-cyber-cyan font-bold font-tech">₹{totalAmount}</span>.
          </p>
        </div>
      </div>

      {/* Fee Breakdown & Summary Box */}
      {feeBreakdown && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-space-950/95 border border-cyber-cyan/35 shadow-[0_0_30px_rgba(0,240,255,0.1)] relative overflow-hidden hud-scanline">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-cyber-cyan" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Payment Summary
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyber-cyan border border-cyber-cyan/30 px-2.5 py-0.5 rounded-full uppercase bg-cyber-cyan/10">
              {feeBreakdown.isTeam
                ? `Team (${feeBreakdown.participantCount || 1} ${feeBreakdown.participantCount === 1 ? 'Member' : 'Members'})`
                : 'Individual (1 Person)'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {feeBreakdown.hasGeneralEvents && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  {feeBreakdown.isTeam ? (
                    <Users className="w-3.5 h-3.5 text-cyber-purple shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                  )}
                  <span>{feeBreakdown.normalLabel || 'General Symposium Events Pass'}</span>
                </span>
                <span className="font-bold text-white">₹{feeBreakdown.generalFee}</span>
              </div>
            )}

            {feeBreakdown.hasProjectExpo && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                  <span>Project Expo (₹200 / team of 2)</span>
                </span>
                <span className="font-bold text-cyber-cyan">₹{feeBreakdown.projectExpoFee}</span>
              </div>
            )}

            {feeBreakdown.hasEsports && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyber-purple shrink-0" />
                  <span>E-Sports Tournament (₹400 / team of 4)</span>
                </span>
                <span className="font-bold text-cyber-purple">₹{feeBreakdown.esportsFee}</span>
              </div>
            )}

            {feeBreakdown.hasStall && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-2">
                  <Store className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                  <span>Stall Booking (Separate Optional Selection)</span>
                </span>
                <span className="font-bold text-cyber-cyan">₹{feeBreakdown.stallFee}</span>
              </div>
            )}

            <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-white">
                Total Payable Amount:
              </span>
              <span className="text-xl sm:text-2xl font-black font-tech text-cyber-cyan tracking-wider">
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-6">

        {/* Left Column: Official CHRONYX Payment QR Code */}
        <div className="md:col-span-5 cyber-glass rounded-2xl p-5 border border-cyber-cyan/40 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.12)]">

          {/* Telemetry Header */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyber-cyan/80 pb-2 mb-3 border-b border-cyber-cyan/20">
            <span className="tracking-wider">PAYMENT TERMINAL // SECURE GATEWAY</span>
            <span className="text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>

          {/* Futuristic QR Frame */}
          <div className="w-full max-w-[260px] rounded-2xl bg-space-950/95 border-2 border-cyber-cyan/50 p-3.5 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)] relative group">

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-cyan z-10 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-cyan z-10 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-cyan z-10 pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-cyan z-10 pointer-events-none"></div>

            {/* QR Image */}
            <div className="w-full overflow-hidden rounded-xl bg-black relative border border-slate-800">
              <img
                src="/qr/chronyx-payment-qr.jpeg"
                alt="CHRONYX 2026 Official Payment QR Code"
                className="w-full h-auto object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
                loading="eager"
              />
            </div>

            {/* Dynamic Payable Amount Badge */}
            <div className="mt-3 w-full py-2 px-3 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/35 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 text-[11px] font-semibold uppercase tracking-wider">
                Total Payable:
              </span>
              <span className="text-base font-black font-tech text-cyber-cyan tracking-wider">
                ₹{totalAmount}
              </span>
            </div>

            {/* Verified Coordinator UPI Telemetry */}
            <div className="mt-2 flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>UPI ID: 9585605199@pthdfc</span>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 mt-3.5 max-w-xs leading-relaxed">
            Scan using Google Pay, PhonePe, Paytm, or any UPI app to pay <span className="text-cyber-cyan font-bold font-tech">₹{totalAmount}</span>.
          </p>

        </div>

        {/* Right Column: UTR & Screenshot Upload Inputs */}
        <div className="md:col-span-7 space-y-5">

          {/* Transaction ID / UTR */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Transaction ID / UTR <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={30}
              placeholder="Enter 12-digit UTR or Transaction ID"
              value={utrNumber}
              onChange={(e) => {
                setUtrNumber(e.target.value);
                if (errors?.utrNumber && setErrors) {
                  setErrors(prev => ({ ...prev, utrNumber: null }));
                }
              }}
              className={`w-full bg-space-950 border rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                errors?.utrNumber
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-800 focus:border-cyber-cyan focus:ring-cyber-cyan'
              }`}
            />
            {errors?.utrNumber && (
              <p className="text-rose-400 text-xs font-mono mt-1.5 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{errors.utrNumber}</span>
              </p>
            )}
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Locate the 12-digit reference number from your payment application receipt.
            </p>
          </div>

          {/* Payment Screenshot Upload */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Payment Screenshot <span className="text-rose-400">*</span>
            </label>

            <p className="text-xs text-slate-400 font-mono mb-2">
              Please upload a clear screenshot of your successful payment of ₹{totalAmount}.
            </p>

            {!paymentScreenshot ? (
              <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-space-900/60 transition-all ${
                errors?.paymentScreenshot
                  ? 'border-rose-500/60 bg-rose-500/5'
                  : 'border-slate-700 hover:border-cyber-cyan/50 bg-space-950/60'
              }`}>
                <Upload className="w-8 h-8 text-cyber-cyan mb-2" />
                <span className="text-xs font-mono font-semibold text-slate-200">
                  Click to upload payment screenshot
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-1">
                  Supported formats: PNG, JPG, JPEG, WEBP
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-3.5 rounded-2xl bg-space-950 border border-cyber-cyan/40 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Payment Screenshot Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-mono text-white font-semibold truncate">
                      {paymentScreenshot.name}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center mt-0.5">
                      <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />
                      <span>File attached successfully</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-space-900 transition-colors shrink-0 ml-2"
                  title="Remove screenshot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors?.paymentScreenshot && (
              <p className="text-rose-400 text-xs font-mono mt-1.5 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                <span>{errors.paymentScreenshot}</span>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
