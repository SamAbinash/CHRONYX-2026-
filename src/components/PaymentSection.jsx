import React, { useState } from 'react';
import { 
  Upload, CheckCircle2, AlertCircle, Image as ImageIcon, X, CreditCard, ShieldAlert 
} from 'lucide-react';

export default function PaymentSection({
  utrNumber,
  setUtrNumber,
  paymentScreenshot,
  setPaymentScreenshot,
  errors,
  setErrors
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

  return (
    <div className="pt-6 border-t border-slate-800">
      
      {/* Payment Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black font-tech text-white uppercase tracking-wider">
            PAYMENT
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Scan the official UPI QR to complete payment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-6">
        
        {/* Left Column: Clearly Visible QR Placeholder Box */}
        <div className="md:col-span-5 cyber-glass rounded-2xl p-6 border border-cyber-cyan/30 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
          
          {/* Futuristic Placeholder Box */}
          <div className="w-full max-w-[240px] aspect-square rounded-2xl bg-space-950/90 border-2 border-dashed border-cyber-cyan/50 p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.15)] relative">
            
            <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan mb-4">
              <CreditCard className="w-6 h-6 animate-pulse" />
            </div>

            <p className="font-tech font-bold text-xs sm:text-sm text-white tracking-wider uppercase leading-snug px-2">
              OFFICIAL UPI QR WILL BE ADDED HERE
            </p>

            <span className="text-[10px] font-mono text-slate-500 mt-2 block">
              Official QR Placeholder
            </span>

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan"></div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 mt-4 max-w-xs">
            Scan using your preferred UPI app once the official QR code is issued.
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
              Please upload a clear screenshot of your successful payment.
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
