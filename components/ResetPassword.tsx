
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../api';

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
      await api.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-6 relative font-display">
      <div className="mb-8 z-10">
        <button onClick={onBack}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" alt="Tesla" className="h-12 tesla-red-filter hover:scale-105 transition" />
        </button>
      </div>

      <div className="w-full max-w-[800px] glass-card p-10 md:p-20 rounded-[2.5rem] border border-white/10 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight leading-tight text-white">
          Tesla Investment - Security Center
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-16">Reset your Password</p>

        {success ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold uppercase tracking-widest">
              Success! If an account exists, instructions have been sent to your inbox.
            </div>
            <button onClick={onBack} className="px-12 py-4 rounded-full bg-white/5 text-white font-black uppercase text-[10px] border border-white/10 transition">
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-10 text-left max-w-lg mx-auto">
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Enter your email address to receive a password reset link.</p>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</div>}

            <div className="space-y-2">
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#1c1c1c]/60 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:outline-none focus:border-amber-500/30 transition-all shadow-inner" />
            </div>

            <div className="pt-2 flex flex-col items-center space-y-10">
              <button disabled={loading} type="submit" className="w-full max-w-xs py-4 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Reset Link"}
              </button>
              <button type="button" onClick={onBack} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition">
                Return to <span className="text-white hover:underline">Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
