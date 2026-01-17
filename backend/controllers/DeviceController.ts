
import db from '../database/db.ts';
import { Enterprise, Device, DeviceLocation } from '../types.ts';

export const getEnterprises = (): Enterprise[] => {
  return db.prepare('SELECT * FROM enterprises').all() as Enterprise[];
};

export const getDevices = (): Device[] => {
  return db.prepare('SELECT * FROM devices').all() as Device[];
};

export const getDeviceHistory = (deviceId: string): DeviceLocation[] => {
  return db.prepare(`
    SELECT * FROM locations 
    WHERE device_id = ? 
    ORDER BY timestamp DESC 
    LIMIT 50
  `).all(deviceId) as DeviceLocation[];
};

export const getLiveLocations = (): Record<string, DeviceLocation> => {
  const rows = db.prepare(`
    SELECT l.* FROM locations l
    INNER JOIN (
      SELECT device_id, MAX(id) as max_id
      FROM locations
      GROUP BY device_id
    ) latest ON l.id = latest.max_id
  `).all() as DeviceLocation[];

  const result: Record<string, DeviceLocation> = {};
  rows.forEach(row => {
    result[row.device_id] = row;
  });
  return result;
};

export const addEnterprise = (ent: Enterprise) => {
  return db.prepare('INSERT INTO enterprises (id, name, email, password) VALUES (?, ?, ?, ?)').run(
    ent.id, ent.name, ent.email, ent.password
  );
};

export const addDevice = (dev: Device) => {
  return db.prepare('INSERT INTO devices (device_id, alias, imei, enterprise_id, status) VALUES (?, ?, ?, ?, ?)').run(
    dev.device_id, dev.alias, dev.imei, dev.enterprise_id, dev.status
  );
};
