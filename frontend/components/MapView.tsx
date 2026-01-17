
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Device, DeviceLocation, Enterprise } from '../../backend/types.ts';
import { TUNISIA_CENTER, REGIONAL_COORDINATES } from '../../backend/constants.ts';

// Marker Styling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createIcon = (status: 'online' | 'offline', isSelected: boolean) => {
  const color = status === 'online' ? '#22c55e' : '#ef4444';
  const size = isSelected ? 34 : 22;
  const border = isSelected ? '4px solid #fff' : '2px solid rgba(255,255,255,0.9)';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        background-color:${color};
        border:${border};
        border-radius:50%;
        box-shadow:${isSelected ? `0 0 35px ${color}` : '0 2px 10px rgba(0,0,0,0.5)'};
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${status === 'offline' ? '<div style="width:10px;height:2px;background:white;border-radius:1px;"></div>' : ''}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

interface MapViewProps {
  devices: Device[];
  enterprises: Enterprise[];
  locations: Record<string, DeviceLocation>;
  history: Record<string, DeviceLocation[]>;
  selectedDeviceId: string | null;
  onMarkerClick: (id: string) => void;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
}

const MapResizer: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    const container = map.getContainer();
    if (container) observer.observe(container);
    return () => observer.disconnect();
  }, [isSidebarOpen, map]);
  return null;
};

const MapController: React.FC<{ target: [number, number] | null }> = ({ target }) => {
  const map = useMap();
  useEffect(() => { 
    if (target) {
      map.flyTo(target, 14, { duration: 1.5 });
    } else {
      map.flyTo(TUNISIA_CENTER, 7, { duration: 1.5 });
    }
  }, [target, map]);
  return null;
};

const ZoomControls: React.FC = () => {
  const map = useMap();
  return (
    <div className="absolute top-24 left-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
        className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 w-11 h-11 rounded-xl shadow-2xl flex items-center justify-center text-slate-700 dark:text-white hover:bg-blue-600 hover:text-white transition-all font-black text-2xl"
      > + </button>
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
        className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 w-11 h-11 rounded-xl shadow-2xl flex items-center justify-center text-slate-700 dark:text-white hover:bg-blue-600 hover:text-white transition-all font-black text-2xl"
      > - </button>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({ devices, enterprises, locations, history, selectedDeviceId, onMarkerClick, isDarkMode, isSidebarOpen }) => {
  const selectedLocation = useMemo(() => {
    if (!selectedDeviceId) return null;
    const loc = locations[selectedDeviceId];
    if (loc) return [loc.latitude, loc.longitude] as [number, number];
    const device = devices.find(d => d.device_id === selectedDeviceId);
    if (device) return REGIONAL_COORDINATES[device.enterprise_id] || TUNISIA_CENTER;
    return null;
  }, [selectedDeviceId, locations, devices]);

  const historyPath = useMemo(() => {
    if (!selectedDeviceId) return [];
    return (history[selectedDeviceId] || []).map(h => [h.latitude, h.longitude] as [number, number]);
  }, [selectedDeviceId, history]);

  return (
    <MapContainer 
      center={TUNISIA_CENTER} 
      zoom={7} 
      zoomControl={false} 
      style={{ height: '100%', width: '100%', background: isDarkMode ? '#0f172a' : '#f1f5f9' }}
    >
      <TileLayer url={isDarkMode ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} />
      <MapResizer isSidebarOpen={isSidebarOpen} />
      <MapController target={selectedLocation} />
      <ZoomControls />
      
      {devices.map(device => {
        const loc = locations[device.device_id];
        const pos: [number, number] = loc 
          ? [loc.latitude, loc.longitude] 
          : (REGIONAL_COORDINATES[device.enterprise_id] || TUNISIA_CENTER);
          
        const enterprise = enterprises.find(e => e.id === device.enterprise_id);
        const isSelected = selectedDeviceId === device.device_id;

        return (
          <Marker 
            key={device.device_id} 
            position={pos} 
            icon={createIcon(device.status, isSelected)} 
            eventHandlers={{ click: () => onMarkerClick(device.device_id) }}
            zIndexOffset={isSelected ? 1000 : 200}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-black text-sm text-slate-900 dark:text-white uppercase">{device.alias}</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                   <div className="flex justify-between">
                    <span className="font-bold">Enterprise:</span>
                    <span>{enterprise?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">ID:</span>
                    <span className="font-mono">{device.device_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Coord:</span>
                    <span className="font-mono">{pos[0].toFixed(5)}, {pos[1].toFixed(5)}</span>
                  </div>
                  {loc && (
                    <div className="flex justify-between">
                      <span className="font-bold">Alt / Speed:</span>
                      <span>{Math.round(loc.altitude)}m / {Math.round(loc.speed)}km/h</span>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      {historyPath.length > 1 && <Polyline positions={historyPath} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8, dashArray: '10, 15' }} />}
    </MapContainer>
  );
};

export default MapView;
