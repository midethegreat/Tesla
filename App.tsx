
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InvestmentPlans from './components/InvestmentPlans';
import Calculator from './components/Calculator';
import Process from './components/Process';
import Stats from './components/Stats';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import { Sun, Heart } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'register' | 'login' | 'dashboard' | 'reset-password'>('landing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setView('dashboard');
      } else if (view === 'dashboard') {
        setView('landing');
      }
    });
    return () => unsubscribe();
  }, [view]);

  const goToRegister = () => {
    setView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLogin = () => {
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToResetPassword = () => {
    setView('reset-password');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('landing');
  };

  if (view === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (view === 'register') {
    return <Auth onBack={goToLanding} onLoginClick={goToLogin} />;
  }

  if (view === 'login') {
    return <Login onBack={goToLanding} onRegisterClick={goToRegister} onLoginSuccess={() => setView('dashboard')} onForgetPasswordClick={goToResetPassword} />;
  }

  if (view === 'reset-password') {
    return <ResetPassword onBack={goToLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#14120e] text-white selection:bg-amber-500/30 selection:text-amber-200 relative overflow-hidden font-display">
      {/* Background Animated Gold Accents */}
      <div className="fixed top-[10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/[0.08] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-[40%] left-[-10%] w-[400px] h-[400px] bg-orange-600/[0.06] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/[0.08] blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Realistic Gold Nugget Images for decoration */}
      <div className="fixed top-[12%] left-[8%] opacity-60 pointer-events-none hidden lg:block z-0">
        <img 
          src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" 
          alt="" 
          className="w-20" 
        />
      </div>
      <div className="fixed top-[45%] right-[10%] opacity-40 pointer-events-none hidden lg:block z-0">
        <img 
          src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" 
          alt="" 
          className="w-32" 
        />
      </div>
      <div className="fixed bottom-[20%] left-[15%] opacity-50 pointer-events-none hidden lg:block z-0">
        <img 
          src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" 
          alt="" 
          className="w-24" 
        />
      </div>

      <Navbar onRegisterClick={goToRegister} onLoginClick={goToLogin} />
      <main className="relative z-10">
        <Hero onRegisterClick={goToRegister} />
        
        <InvestmentPlans onInvestClick={goToRegister} />
        <Calculator onInvestClick={goToRegister} />
        <Process />
        <Stats />
        <FAQ />

        {/* Banner CTA Section */}
        <div className="bg-[#14120e] py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.03] to-transparent pointer-events-none"></div>
           
           <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
              <h2 className="text-xs md:text-5xl font-black font-display leading-tight uppercase tracking-tight text-white">
                We're a trusted community of over <span className="text-amber-400">4,000,000 users</span>. Join us with confidence and be part of a growing network dedicated to smart, secure investments.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                 <button 
                  onClick={goToRegister}
                  className="w-full sm:w-auto gradient-button px-10 py-4 rounded-full text-black font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-amber-500/40 hover:scale-105 transition transform active:scale-95 flex items-center justify-center gap-3">
                    <Sun size={18} strokeWidth={3} />
                    Join Us
                 </button>
                 <a 
                  href="https://t.me/Allyssabroker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 px-10 py-4 rounded-full text-white font-black uppercase text-[10px] tracking-widest transition active:scale-95 flex items-center justify-center gap-3"
                 >
                    <Heart size={18} className="fill-current" />
                    Contact Us
                 </a>
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
