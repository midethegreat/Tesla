
import React, { useState } from 'react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface ResetPasswordProps {
  onBack: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden font-display">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]">
          <path d="M0 500 Q 250 400 500 500 T 1000 500" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 550 Q 250 450 500 550 T 1000 550" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 600 Q 250 500 500 600 T 1000 600" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="fixed top-1/2 left-0 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 -z-10"></div>
      
      {/* Tesla Logo */}
      <div className="mb-8 z-10">
        <button onClick={onBack}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" 
            alt="Tesla" 
            className="h-12 tesla-red-filter transition-transform hover:scale-105" 
          />
        </button>
      </div>

      {/* Reset Card */}
      <div className="w-full max-w-[800px] glass-card p-10 md:p-20 rounded-[2.5rem] border border-white/10 z-10 text-center shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase text-white leading-tight">
          Tesla Investment - Best Place To Grow Your Money
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-16">
          Reset your Password
        </p>

        {success ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold uppercase tracking-widest">
              Success! Check your email for the reset link.
            </div>
            <button 
              onClick={onBack}
              className="px-12 py-4 rounded-full bg-white/5 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-10 text-left max-w-lg mx-auto">
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Enter your <span className="text-white font-bold italic">email</span> or <span className="text-white font-bold italic">username</span> to reset password.
            </p>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative group">
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  className="w-full bg-[#1c1c1c]/60 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:outline-none focus:border-amber-500/30 transition-all shadow-inner placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col items-center space-y-10">
              <button 
                disabled={loading}
                type="submit"
                className="w-full max-w-xs py-4 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-orange-500/40 hover:scale-105 transition transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Reset Link"}
              </button>
              
              <button 
                type="button"
                onClick={onBack}
                className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition flex items-center gap-2"
              >
                Already have an account? <span className="text-white hover:underline">Login</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-20 text-gray-800 text-[10px] font-bold uppercase tracking-[0.4em] opacity-20 pointer-events-none select-none">
        TESLA FINANCIAL ENCRYPTION
      </div>
    </div>
  );
};

export default ResetPassword;
