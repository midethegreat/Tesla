
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Layers, History, ArrowLeftRight, PlusCircle, ArrowUpCircle, Award, Users, 
  Settings as SettingsIcon, LifeBuoy, LogOut, Bell, ChevronDown, ChevronLeft, ChevronRight, 
  Copy as CopyIcon, AlertTriangle, Wallet, ArrowUpRight, User, Ticket, Percent, Star, Zap, 
  MousePointer2, Briefcase, RefreshCw, Clock, Ban, CheckCircle2, Check, Link as LinkIcon, 
  TrendingUp, Home, UserPlus, ExternalLink, Camera, Calendar, Lock, ShieldCheck, Loader2, 
  Megaphone, Send, UserCircle2, FolderOpen, DollarSign, Trophy, ArrowUpFromLine, 
  CircleDollarSign, X, Upload, Fingerprint
} from 'lucide-react';
import { INVESTMENT_PLANS } from '../constants';
import { InvestmentPlan } from '../types';
import { api } from '../api';

interface DashboardProps {
  onLogout: () => void;
  user: any;
  setUser: (user: any) => void;
}

type TabType = 'dashboard' | 'all-schemas' | 'logs' | 'transactions' | 'add-money' | 'withdraw' | 'ranking' | 'referral' | 'settings' | 'support' | 'notifications' | 'kyc-verify' | 'reset-password' | 'schema-preview';

const WALLET_ADDRESSES = {
  'BTC': 'bc1qtwpjzek0287rwf7czvsrc8x8tnnxk87hymcvvk',
  'ETH (ERC20)': '0x4dFdE34c560637496A5825003fE71B3D0a571a1a',
  'USDT (TRC20)': 'TWWRQmKytJjxMZSbD9gpdU9jKsB5Dzy7xp'
};

const BADGES = [
  { title: "Tesla Investment Beginner", condition: "By signing up to the account", id: 1 },
  { title: "Tesla Investment", condition: "By earning $30 from the site", id: 2 }
];

const BadgeCard: React.FC<{ title: string; condition: string }> = ({ title, condition }) => (
  <div className="w-full bg-[#1c1c1c]/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.3em]">ranking-badge</span>
    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight max-w-[240px]">{title}</h3>
    <div className="bg-[#2a2a2a]/60 border border-white/10 rounded-full px-6 py-3.5 shadow-inner">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{condition}</span>
    </div>
  </div>
);

const SchemaCard: React.FC<{ plan: InvestmentPlan; onInvest: (plan: InvestmentPlan) => void }> = ({ plan, onInvest }) => (
  <div className={`relative w-full rounded-[1.5rem] overflow-hidden border transition-all duration-500 flex flex-col glass-card group ${plan.isHot ? 'border-amber-500/30 bg-[#1a140d]/80' : 'border-white/5 bg-[#0d0d0d]/80'}`}>
    <div className="relative h-28 flex flex-col justify-center px-6 overflow-hidden flex-shrink-0">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
        <img src="https://png.pngtree.com/png-vector/20240201/ourmid/pngtree-gold-nugget-with-shadow-and-rough-edges-isolated-on-transparent-background-png-image_11586548.png" alt="" className="w-full h-full object-contain" />
      </div>
      <h3 className="text-2xl font-black tracking-tight uppercase text-white relative z-10">{plan.name}</h3>
      <div className="flex items-center gap-2 mt-1 relative z-10">
        <span className="bg-white/10 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">{plan.returnLabel}</span>
      </div>
    </div>
    <div className="px-6 py-6 space-y-4 flex-grow flex flex-col">
      {[
        { label: 'Investment', val: `$${plan.minInvestment}-$${plan.maxInvestment}`, icon: <MousePointer2 size={12} /> },
        { label: 'Capital Back', val: plan.capitalBack ? 'Yes' : 'No', icon: <Briefcase size={12} /> },
        { label: 'Return Type', val: plan.returnType, icon: <RefreshCw size={12} /> },
        { label: 'Periods', val: `${plan.periods} Times`, icon: <Clock size={12} /> },
      ].map((item, i) => (
        <div key={i} className="flex justify-between items-center text-[11px] font-medium">
          <div className="flex items-center gap-3 text-gray-400 uppercase tracking-wider">{item.icon}{item.label}</div>
          <div className="text-amber-500 font-bold">{item.val}</div>
        </div>
      ))}
      <div className="pt-6 mt-auto flex flex-col items-center gap-3">
        <button onClick={() => onInvest(plan)} className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition">
          <CheckCircle2 size={14} fill="currentColor" className="text-amber-500" /> Invest Now
        </button>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user, setUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [copied, setCopied] = useState(false);
  const [isKycWarningVisible, setKycWarningVisible] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const lastKycWarningTimeRef = useRef<number>(0);
  
  const [profileData, setProfileData] = useState(user?.profile || {});
  const [saveLoading, setSaveLoading] = useState(false);
  const [depositStep, setDepositStep] = useState<'entry' | 'payment'>('entry');
  const [selectedToken, setSelectedToken] = useState<keyof typeof WALLET_ADDRESSES | ''>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [addressCopied, setAddressCopied] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'amount' | 'address'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState<string>('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setProfileDropdownOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setNotificationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (id: TabType) => {
    setProfileDropdownOpen(false);
    setNotificationOpen(false);
    
    const now = Date.now();
    const cooldownPeriod = 5 * 60 * 1000;
    if (!user.kycVerified && (now - lastKycWarningTimeRef.current > cooldownPeriod)) {
      setKycWarningVisible(false);
      setTimeout(() => { setKycWarningVisible(true); lastKycWarningTimeRef.current = Date.now(); }, 10);
    }
    setActiveTab(id);
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const result = await api.updateProfile(profileData);
      setUser(result.user);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const referralId = user.id?.slice(0, 8) || 'TeslaUser';
  const referralUrl = `https://investwithtsla.web.app/register.html?invite=${referralId}`;

  const renderDashboardHome = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-32 lg:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
         <div className="lg:col-span-7">
            <div className="glass-card bg-[#141414] border border-white/5 rounded-[2.5rem] p-1 shadow-2xl h-full flex flex-col">
              <div className="bg-gradient-to-br from-[#ffd700] via-[#ffcc00] to-[#ffa500] p-10 rounded-[2.3rem] space-y-4 relative overflow-hidden">
                <span className="text-black font-black text-6xl block tracking-tighter">${user.balance}</span>
                <div className="flex items-center gap-2 text-black/60">
                  <Wallet size={18} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Available Balance</span>
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row gap-4">
                <button onClick={() => handleTabChange('add-money')} className="flex-grow py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] transition">Deposit Now</button>
                <button onClick={() => handleTabChange('all-schemas')} className="flex-grow py-4 rounded-full bg-white/5 text-gray-400 font-black uppercase text-[11px] tracking-widest border border-white/10 flex items-center justify-center gap-3 transition hover:bg-white/10"><ArrowUpRight size={16} /> Invest</button>
              </div>
            </div>
         </div>
         <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 flex items-center justify-between group hover:border-amber-500/20 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20"><Award size={24} /></div>
                <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tier Level</h4><p className="text-sm font-black text-amber-500 uppercase tracking-tight">Tesla Beginner</p></div>
              </div>
            </div>
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-4">
               <div className="flex justify-between items-center"><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Invite Friends</h4></div>
               <div className="flex items-center gap-3 bg-black/40 rounded-2xl px-5 py-4 border border-white/5 hover:border-white/20 transition overflow-hidden">
                  <LinkIcon size={14} className="text-gray-600" />
                  <span className="text-[11px] font-bold text-gray-500 truncate flex-grow">{referralUrl}</span>
                  <button onClick={() => { navigator.clipboard.writeText(referralUrl); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="text-gray-400">{copied ? <Check size={16} /> : <CopyIcon size={16} />}</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardHome();
      case 'all-schemas': return <div className="space-y-10 animate-in fade-in max-w-7xl mx-auto pb-28 px-2 md:px-0"><h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Investment Plans</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">{INVESTMENT_PLANS.map(plan => (<SchemaCard key={plan.id} plan={plan} onInvest={() => {setSelectedPlan(plan); setInvestAmount(plan.minInvestment.toString()); setActiveTab('schema-preview');}} />))}</div></div>;
      case 'settings': return <div className="space-y-12 animate-in fade-in max-w-7xl mx-auto pb-32"><div className="glass-card bg-[#141414]/60 p-12 rounded-[2.5rem] space-y-12"><h3 className="text-2xl font-black uppercase tracking-tight">Profile Settings</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'First Name', name: 'firstName', value: user.firstName, readOnly: true },
          { label: 'Last Name', name: 'lastName', value: user.lastName, readOnly: true },
          { label: 'Email', value: user.email, readOnly: true },
          { label: 'Username', name: 'username', value: profileData.username, onChange: (e:any)=>setProfileData({...profileData, username: e.target.value}) },
          { label: 'Phone', name: 'phone', value: profileData.phone, onChange: (e:any)=>setProfileData({...profileData, phone: e.target.value}) },
          { label: 'Address', name: 'address', value: profileData.address, onChange: (e:any)=>setProfileData({...profileData, address: e.target.value}) },
        ].map((f, i) => (
          <div key={i} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{f.label}</label>
            <input value={f.value} onChange={f.onChange} readOnly={f.readOnly} className={`w-full bg-[#1c1c1c] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white ${f.readOnly ? 'opacity-50 cursor-not-allowed' : ''}`} />
          </div>
        ))}
      </div><button onClick={handleSaveProfile} disabled={saveLoading} className="px-12 py-5 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff4500] text-white font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3">{saveLoading ? <Loader2 className="animate-spin" size={18} /> : "Save Profile"}</button></div></div>;
      default: return renderDashboardHome();
    }
  };

  const isSubPage = activeTab === 'kyc-verify' || activeTab === 'reset-password' || activeTab === 'schema-preview' || activeTab === 'ranking';

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-display overflow-hidden">
      <style>{`@keyframes kycProgress { 0% { width: 0%; } 100% { width: 100%; } } .animate-kyc-timer { animation: kycProgress 5s linear forwards; }`}</style>
      
      {isKycWarningVisible && !user.kycVerified && (
        <div className="fixed top-24 right-12 z-[200] w-[420px] animate-in slide-in-from-right duration-500">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-black/5 p-6 flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 flex-shrink-0"><AlertTriangle size={24} /></div>
             <div className="flex-grow space-y-1"><h4 className="text-[12px] font-black text-gray-800 uppercase tracking-widest">warning</h4><p className="text-[14px] text-gray-500 font-bold">Your account is unverified with KYC.</p></div>
             <button onClick={() => setKycWarningVisible(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
             <div className="absolute bottom-0 left-0 h-[4px] bg-amber-500/10 w-full"><div className="h-full bg-amber-500 animate-kyc-timer"></div></div>
          </div>
        </div>
      )}

      <aside className={`bg-[#0d0d0d] border-r border-white/5 hidden lg:flex flex-col transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-24'}`}>
        <div className="p-6 h-24 flex items-center justify-between">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" alt="Tesla" className={`h-6 tesla-red-filter ${!sidebarOpen ? 'opacity-0 scale-0 w-0' : 'opacity-100'}`} />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-2 bg-white/5 rounded-xl"><ChevronLeft size={20} className={!sidebarOpen ? 'rotate-180' : ''} /></button>
        </div>
        <nav className="flex-grow px-4 py-4 space-y-2">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'all-schemas', name: 'Plans', icon: <Layers size={18} /> },
            { id: 'settings', name: 'Settings', icon: <SettingsIcon size={18} /> }
          ].map((item, idx) => (
            <button key={idx} onClick={() => handleTabChange(item.id as TabType)} className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.2rem] transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' : 'text-gray-500 hover:bg-white/5'}`}>
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5"><button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 text-gray-500 hover:text-red-500 transition-all"><LogOut size={18} />{sidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>}</button></div>
      </aside>

      <div className="flex-grow flex flex-col h-full relative overflow-hidden">
        <header className="h-24 border-b border-white/5 px-8 flex items-center justify-between bg-[#0d0d0d]/80 backdrop-blur-3xl relative z-40">
          <div className="flex items-center gap-4">
            {isSubPage && <button onClick={() => handleTabChange('dashboard')} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition border border-white/5"><ChevronLeft size={20} /></button>}
            <h2 className="text-[13px] font-black uppercase tracking-[0.2em] text-white">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-6 relative">
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setNotificationOpen(!notificationOpen)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 relative border border-white/5 group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d0d0d]"></span>
              </button>
              {notificationOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-80 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300"><h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Notifications</h3><div className="w-full h-[1px] bg-white/5 mb-6"></div><div className="bg-[#242424]/60 border border-white/5 rounded-2xl p-8 flex items-center justify-center"><span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No Notification Found!</span></div></div>}
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center border border-white/20 overflow-hidden shadow-xl shadow-orange-500/20 active:scale-95 transition-transform">
                {profileData.avatar ? <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" /> : <User size={20} className="text-white brightness-0 invert" />}
              </button>
              {profileDropdownOpen && <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-4 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300"><div className="space-y-1"><button onClick={() => handleTabChange('settings')} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all"><SettingsIcon size={18} className="text-gray-500" /><span className="text-sm font-bold uppercase tracking-widest">Settings</span></button><button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-red-500/10 text-red-500 mt-3 pt-3 border-t border-white/5"><LogOut size={18} /><span className="text-sm font-bold uppercase tracking-widest">Logout</span></button></div></div>}
            </div>
          </div>
        </header>
        
        <main className="flex-grow overflow-y-auto p-12 relative z-0 custom-scrollbar scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
