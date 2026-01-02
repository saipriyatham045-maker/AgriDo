
import React, { useState } from 'react';
import { User, Smartphone, ArrowRight, ShieldCheck, Tractor, Users, KeyRound, ChevronLeft, Sprout, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  onLogin: (name: string, mobile: string, role: UserRole) => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [step, setStep] = useState<'login' | 'password'>('login');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FARMER);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && mobile.length === 10) {
      setStep('password');
    }
  };

  const handleVerifyPassword = async () => {
    if (!password) {
      alert("Please enter your password");
      return;
    }
    setIsLoading(true);
    // Secure verification simulation
    await new Promise(r => setTimeout(r, 1000));
    onLogin(name, mobile, selectedRole);
    setIsLoading(false);
  };

  const roles = [
    { id: UserRole.FARMER, label: 'Farmer', icon: Tractor },
    { id: UserRole.PROVIDER, label: 'Provider', icon: Users },
    { id: UserRole.ADMIN, label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-6xl w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-emerald-50">
        <div className="md:w-5/12 relative h-80 md:h-auto overflow-hidden bg-emerald-950">
          <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt="Farm landscape"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <h1 className="text-5xl font-black mb-4 tracking-tighter leading-none text-emerald-100">AgriDo</h1>
            <p className="text-emerald-50 opacity-90 text-lg font-bold uppercase tracking-widest">Secure Rural Finance</p>
          </div>
        </div>

        <div className="md:w-7/12 p-12 md:p-16 flex flex-col justify-center bg-white">
          {step === 'login' ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Access Portal</h2>
              <form onSubmit={handleInitialSubmit} className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                        selectedRole === role.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-50 bg-slate-50 hover:border-emerald-100'
                      }`}
                    >
                      <role.icon className={selectedRole === role.id ? 'text-emerald-600' : 'text-slate-300'} />
                      <span className="text-[10px] font-black uppercase tracking-widest mt-3">{role.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  <input required placeholder="Full Legal Name" className="w-full px-7 py-5 rounded-2xl bg-slate-50 font-black text-slate-900 outline-none focus:bg-white border-2 border-transparent focus:border-emerald-600 transition-all" value={name} onChange={e => setName(e.target.value)} />
                  <input required type="tel" maxLength={10} placeholder="10-Digit Mobile Number" className="w-full px-7 py-5 rounded-2xl bg-slate-50 font-black tracking-widest outline-none focus:bg-white border-2 border-transparent focus:border-emerald-600 transition-all" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} />
                </div>
                <button type="submit" className="w-full bg-emerald-900 text-white font-black py-6 rounded-[2rem] flex items-center justify-center space-x-3 uppercase tracking-widest text-sm shadow-xl hover:bg-emerald-800 transition-all">
                  <span>Authorize Identity</span>
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep('login')} className="flex items-center space-x-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-10 hover:translate-x-[-4px] transition-transform">
                <ChevronLeft size={16} /><span>Return to Identity</span>
              </button>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-8">Secure Passkey</h2>
              <div className="space-y-6">
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter Password"
                    className="w-full px-7 py-5 rounded-2xl bg-slate-50 font-black outline-none border-2 border-transparent focus:border-emerald-600 text-xl tracking-widest transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock size={20} />
                  </div>
                </div>
                <label className="flex items-center space-x-3 cursor-pointer group select-none">
                  <input 
                    type="checkbox" 
                    checked={showPassword} 
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-5 h-5 accent-emerald-600 rounded border-slate-200"
                  />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Show Password</span>
                </label>
                <button onClick={handleVerifyPassword} disabled={isLoading} className="w-full bg-emerald-900 text-white font-black py-6 rounded-[2rem] flex items-center justify-center space-x-3 uppercase tracking-widest text-sm shadow-2xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><span>Log In Securely</span><ShieldCheck size={20} /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
