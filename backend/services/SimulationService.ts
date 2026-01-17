
import db from '../database/db.ts';
import * as DeviceController from '../controllers/DeviceController.ts';
import { UPDATE_INTERVAL_MS } from '../constants.ts';

class SimulationService {
  private intervalId: any = null;
  private isActive: boolean = true;

  public startSimulation() {
    if (this.intervalId) return;
    this.isActive = true;
    
    console.log("🛰️ Telemetry Simulation Engine Started");

    this.intervalId = setInterval(() => {
      if (!this.isActive) return;

      const now = new Date().toISOString();
      const devices = DeviceController.getDevices();
      const latestLocations = DeviceController.getLiveLocations();

      const insertLoc = db.prepare(`
        INSERT INTO locations (device_id, latitude, longitude, speed, altitude, direction, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      devices.forEach(device => {
        if (device.status === 'online') {
          const current = latestLocations[device.device_id];
          if (!current) return;

          // Physics-based movement jitter
          const latNudge = (Math.random() - 0.5) * 0.0015;
          const lngNudge = (Math.random() - 0.5) * 0.0015;
          const newSpeed = Math.max(0, Math.min(120, current.speed + (Math.random() - 0.5) * 10));

          insertLoc.run(
            device.device_id,
            current.latitude + latNudge,
            current.longitude + lngNudge,
            newSpeed,
            current.altitude + (Math.random() - 0.5) * 2,
            (current.direction + (Math.random() - 0.5) * 10 + 360) % 360,
            now
          );
        }
      });
    }, UPDATE_INTERVAL_MS);
  }

  public toggleSimulation() {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  public getIsActive() {
    return this.isActive;
  }
}

export const simulationService = new SimulationService();
