
import { Enterprise, Device, DeviceLocation } from '../../backend/types.ts';

const API_BASE = 'http://localhost:3001/api';

export class ApiService {
  static async fetchEnterprises(): Promise<Enterprise[]> {
    const res = await fetch(`${API_BASE}/enterprises`);
    return res.json();
  }

  static async fetchDevices(): Promise<Device[]> {
    const res = await fetch(`${API_BASE}/devices`);
    return res.json();
  }

  static async fetchLiveLocations(): Promise<Record<string, DeviceLocation>> {
    const res = await fetch(`${API_BASE}/locations/live`);
    return res.json();
  }

  static async fetchDeviceHistory(deviceId: string): Promise<DeviceLocation[]> {
    const res = await fetch(`${API_BASE}/devices/${deviceId}/history`);
    return res.json();
  }

  static async fetchSimulationStatus(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/simulation/status`);
    const data = await res.json();
    return data.active;
  }

  static async toggleSimulation(): Promise<boolean> {
    const res = await fetch(`${API_BASE}/simulation/toggle`, { method: 'POST' });
    const data = await res.json();
    return data.active;
  }

  static async resetSystem() {
    await fetch(`${API_BASE}/system/reset`, { method: 'POST' });
    window.location.reload();
  }

  static async addEnterprise(ent: Enterprise) {
    await fetch(`${API_BASE}/enterprises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ent)
    });
  }

  static async addDevice(dev: Device) {
    await fetch(`${API_BASE}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dev)
    });
  }
}
