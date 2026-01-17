
import React, { useState } from 'react';
import { Enterprise, Device, DeviceLocation, UserSession } from '../../backend/types.ts';
import { ApiService } from '../services/ApiService.ts';

interface SidebarProps {
  session: UserSession;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  enterprises: Enterprise[];
  devices: Device[];
  locations: Record<string, DeviceLocation>;
  selectedDeviceId: string | null;
  onDeviceClick: (id: string) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  statusFilter: 'all' | 'online' | 'offline';
  setStatusFilter: (filter: 'all' | 'online' | 'offline') => void;
  onReset: () => void;
  onRefresh: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  session, isOpen, setIsOpen, enterprises, devices, locations, selectedDeviceId, onDeviceClick, onLogout, isDarkMode, toggleTheme,
  statusFilter, setStatusFilter, onReset, onRefresh
}) => {
  const [expandedEnterprises, setExpandedEnterprises] = useState<Set<string>>(new Set(enterprises.map(e => e.id)));
  const [showMgmt, setShowMgmt] = useState(false);
  
  // Form states
  const [newEntName, setNewEntName] = useState('');
  const [newDevId, setNewDevId] = useState('');
  const [newDevAlias, setNewDevAlias] = useState('');
  const [targetEntId, setTargetEntId] = useState('');

  const toggleEnterprise = (id: string) => {
    const next = new Set(expandedEnterprises);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedEnterprises(next);
  };

  const handleAddEnterprise = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'ent_' + Math.random().toString(36).substr(2, 6);
    const slug = newEntName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
    await ApiService.addEnterprise({
      id,
      name: newEntName,
      email: `${slug}@track.tn`,
      password: `${slug}123`
    });
    setNewEntName('');
    onRefresh();
    alert(`Successfully Created: ${newEntName}\nLogin: ${slug}@track.tn\nPass: ${slug}123`);
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEntId) return alert("Please select a target company.");
    await ApiService.addDevice({
      device_id: newDevId,
      alias: newDevAlias,
      imei: '86' + Math.floor(Math.random() * 10000000000000),
      enterprise_id: targetEntId,
      status: 'online'
    });
    setNewDevId('');
    setNewDevAlias('');
    onRefresh();
  };

  const isAdmin = session.role === 'admin';

  return (
    <div className={`relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-[2000] ${isOpen ? 'w-80' : 'w-0'}`}>
      {/* Toggle Arrow */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-0 p-2.5 rounded-r-2xl text-slate-400 hover:text-blue-500 shadow-xl transition-all active:scale-75"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-500 ${isOpen ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tighter">
                <span className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-blue-500/30">
                  {isAdmin ? 'SYS' : 'FLEET'}
                </span>
                GEOTRACK
              </h2>
              <div className="flex items-center gap-1.5">
                <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-blue-500 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" title="Toggle Dark/Light">
                   {isDarkMode ? '🌙' : '☀️'}
                </button>
                {isAdmin && (
                  <button onClick={() => setShowMgmt(!showMgmt)} className={`p-2 rounded-xl transition-all ${showMgmt ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title="Fleet Management Console">
                    ⚙️
                  </button>
                )}
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/10" title="Logout">
                  🚪
                </button>
              </div>
            </div>

            {isAdmin && showMgmt ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-[0.2em]">Add Enterprise</h3>
                  <form onSubmit={handleAddEnterprise} className="space-y-3">
                    <input value={newEntName} onChange={e=>setNewEntName(e.target.value)} placeholder="Company Name" className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" required />
                    <button type="submit" className="w-full text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95">Save New Client</button>
                  </form>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase text-green-500 mb-4 tracking-[0.2em]">Add New Device</h3>
                  <form onSubmit={handleAddDevice} className="space-y-3">
                    <input value={newDevId} onChange={e=>setNewDevId(e.target.value)} placeholder="IMEI / Device ID" className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold" required />
                    <input value={newDevAlias} onChange={e=>setNewDevAlias(e.target.value)} placeholder="Alias (e.g. RADIOPOC-1)" className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold" required />
                    <select value={targetEntId} onChange={e=>setTargetEntId(e.target.value)} className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold">
                      <option value="">Assign to Enterprise...</option>
                      {enterprises.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <button type="submit" className="w-full text-[10px] bg-green-600 hover:bg-green-500 text-white font-black py-2.5 rounded-xl uppercase tracking-widest transition-all active:scale-95">Link Hardware</button>
                  </form>
                </div>
                <button onClick={onReset} className="w-full text-[9px] text-red-500 font-black uppercase tracking-widest py-3 border border-red-500/20 rounded-xl hover:bg-red-600 hover:text-white transition-all">Clear Storage & Reset</button>
              </div>
            ) : (
              <>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
                  {['all', 'online', 'offline'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f as any)}
                      className={`flex-1 text-[10px] py-2 rounded-lg font-black uppercase transition-all ${
                        statusFilter === f ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Active Units
                  </p>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">{devices.length} Units</span>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {enterprises.map(ent => {
              const entDevices = devices.filter(d => {
                if (statusFilter !== 'all' && d.status !== statusFilter) return false;
                return d.enterprise_id === ent.id;
              });
              if (entDevices.length === 0) return null;
              const isExpanded = expandedEnterprises.has(ent.id);
              return (
                <div key={ent.id} className="space-y-2">
                  <button onClick={() => toggleEnterprise(ent.id)} className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl group text-left transition-colors">
                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">{ent.name}</span>
                    <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isExpanded && (
                    <div className="ml-1 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 pl-3">
                      {entDevices.map(device => {
                        const isSelected = selectedDeviceId === device.device_id;
                        const loc = locations[device.device_id];
                        return (
                          <button 
                            key={device.device_id} 
                            onClick={() => onDeviceClick(device.device_id)} 
                            className={`w-full text-left p-4 rounded-2xl flex flex-col gap-1 transition-all border ${isSelected ? 'bg-blue-600 text-white shadow-2xl border-blue-400 scale-[1.02]' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent'}`}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${device.status === 'online' ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                              <div className="flex-1 truncate">
                                <p className="text-sm font-black uppercase tracking-tight leading-none mb-1">{device.alias}</p>
                                <p className={`text-[9px] font-mono font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>ID: {device.device_id}</p>
                              </div>
                            </div>
                            {loc && (
                              <div className={`mt-2 flex items-center justify-between text-[9px] font-mono leading-tight ${isSelected ? 'text-blue-100/70' : 'text-slate-400'}`}>
                                <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                                <span className="font-black bg-black/10 px-1.5 py-0.5 rounded">{Math.round(loc.speed)} km/h</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
