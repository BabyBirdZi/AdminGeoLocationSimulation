
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar.tsx';
import MapView from './MapView.tsx';
import GeminiInsights from './GeminiInsights.tsx';
import { ApiService } from '../services/ApiService.ts';
import { Enterprise, Device, DeviceLocation, UserSession } from '../../backend/types.ts';

interface DashboardProps {
  session: UserSession;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ session, onLogout, isDarkMode, toggleTheme }) => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [locations, setLocations] = useState<Record<string, DeviceLocation>>({});
  const [history, setHistory] = useState<Record<string, DeviceLocation[]>>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSimulationActive, setIsSimulationActive] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [entData, devData, simStatus, locData] = await Promise.all([
        ApiService.fetchEnterprises(),
        ApiService.fetchDevices(),
        ApiService.fetchSimulationStatus(),
        ApiService.fetchLiveLocations()
      ]);

      let filteredEnts = entData;
      let filteredDevs = devData;

      if (session.role === 'enterprise' && session.enterpriseId) {
        filteredEnts = entData.filter(e => e.id === session.enterpriseId);
        filteredDevs = devData.filter(d => d.enterprise_id === session.enterpriseId);
      }

      setEnterprises(filteredEnts);
      setDevices(filteredDevs);
      setIsSimulationActive(simStatus);
      setLocations(locData);

      if (selectedDeviceId) {
        const historyData = await ApiService.fetchDeviceHistory(selectedDeviceId);
        setHistory(prev => ({ ...prev, [selectedDeviceId]: historyData }));
      }
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, [selectedDeviceId, session]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleSimulation = async () => {
    const newStatus = await ApiService.toggleSimulation();
    setIsSimulationActive(newStatus);
  };

  const handleReset = async () => {
    if (confirm("Reset System: This will clear the mock database and restart. Continue?")) {
      await ApiService.resetSystem();
    }
  };

  const handleDeviceClick = useCallback((id: string | null) => {
    setSelectedDeviceId(id);
    if (id === null) {
      setSearchQuery('');
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.toLowerCase();
    const found = devices.find(d => 
      d.device_id.includes(q) || d.alias.toLowerCase().includes(q)
    );
    if (found) setSelectedDeviceId(found.device_id);
  };

  const filteredDevices = devices.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar 
        session={session}
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        enterprises={enterprises}
        devices={devices}
        locations={locations}
        selectedDeviceId={selectedDeviceId}
        onDeviceClick={handleDeviceClick}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={handleReset}
        onRefresh={fetchData}
      />

      <div className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        {/* Floating Header UI */}
        <header className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap gap-4 items-center pointer-events-none">
          {/* Search Box */}
          <form 
            onSubmit={handleSearch} 
            className="flex-1 min-w-[300px] max-w-xl pointer-events-auto bg-white/95 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-1.5 flex items-center group"
          >
            <div className="pl-4 text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder={`Search ${session.role === 'admin' ? 'Global Fleet' : 'Company Fleet'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-slate-900 dark:text-white px-4 py-2 focus:outline-none text-sm font-bold"
            />
            
            {/* Sync / Refresh Button */}
            <button 
              type="button" 
              onClick={fetchData}
              title="Refresh Database Data"
              className={`p-2.5 mr-1 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${isSyncing ? 'animate-spin text-blue-500' : ''}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
              Search
            </button>
          </form>

          {/* Global View Button (Only visible during selection) */}
          {selectedDeviceId && (
            <button 
              onClick={() => handleDeviceClick(null)}
              className="pointer-events-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 hover:-translate-y-1 transition-all active:scale-95 border border-slate-700 dark:border-slate-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest">Global View</span>
            </button>
          )}

          {/* Simulation & Status Indicators */}
          <div className="flex items-center gap-4 pointer-events-auto ml-auto">
             <div className="flex items-center gap-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
               <div className={`w-3 h-3 rounded-full ${isSimulationActive ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                 {isSimulationActive ? 'Simulating' : 'Paused'}
               </span>
               {session.role === 'admin' && (
                  <button 
                    onClick={toggleSimulation}
                    className={`text-[9px] py-1 px-3 rounded-lg font-black uppercase border transition-all ${
                      isSimulationActive ? 'border-red-200 text-red-600 bg-red-50' : 'border-green-200 text-green-600 bg-green-50'
                    }`}
                  >
                    {isSimulationActive ? 'Stop' : 'Start'}
                  </button>
               )}
             </div>
          </div>
        </header>

        <div className="flex-1 w-full relative">
          <MapView 
            devices={filteredDevices}
            enterprises={enterprises}
            locations={locations}
            history={history}
            selectedDeviceId={selectedDeviceId} 
            onMarkerClick={(id) => handleDeviceClick(id)}
            isDarkMode={isDarkMode}
            isSidebarOpen={isSidebarOpen}
          />
        </div>

        {selectedDeviceId && (
          <div className="absolute bottom-6 right-6 z-[1000] w-full max-w-sm pointer-events-auto">
             <GeminiInsights 
               device={devices.find(d => d.device_id === selectedDeviceId)!}
               history={history[selectedDeviceId] || []}
               enterprise={enterprises.find(e => e.id === devices.find(d => d.device_id === selectedDeviceId)!.enterprise_id)!}
               isDarkMode={isDarkMode}
               onClose={() => handleDeviceClick(null)}
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
