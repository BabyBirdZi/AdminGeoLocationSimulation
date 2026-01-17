
export interface Enterprise {
  id: string;
  name: string;
  email: string;
  password?: string; 
}

export interface Device {
  device_id: string;
  alias: string;
  imei: string;
  enterprise_id: string;
  status: 'online' | 'offline';
}

export interface DeviceLocation {
  device_id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  direction: number;
  timestamp: string;
}

export type UserRole = 'admin' | 'enterprise';

export interface UserSession {
  role: UserRole;
  enterpriseId?: string;
  email: string;
}

export interface AppState {
  enterprises: Enterprise[];
  devices: Device[];
  locations: Record<string, DeviceLocation>;
  history: Record<string, DeviceLocation[]>;
}
