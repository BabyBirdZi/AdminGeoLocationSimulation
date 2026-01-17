
import React, { useState } from 'react';
import { ApiService } from '../services/ApiService.ts';
import { UserSession } from '../../backend/types.ts';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Check Hardcoded Admin
      if (email === 'admin@track.tn' && password === 'admin123') {
        onLogin({ role: 'admin', email });
        return;
      }

      // 2. Check Database for Enterprise users
      const enterprises = await ApiService.fetchEnterprises();
      const user = enterprises.find(ent => ent.email === email && ent.password === password);

      if (user) {
        onLogin({ role: 'enterprise', enterpriseId: user.id, email });
      } else {
        setError('Invalid credentials. Admin: admin@track.tn / admin123. Enterprise e.g.: selo@track.tn / selo123');
      }
    } catch (err) {
      setError('System authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">GeoTrack Pro</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Multi-Tenant Tracking Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Login Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="user@track.tn"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-2">
               <svg className="h-4 w-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-red-400 text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 px-4 rounded-xl shadow-xl shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 uppercase tracking-widest text-sm"
          >
            {isLoading ? 'Authenticating...' : 'Enter Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
            Enterprise Secured Access
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
