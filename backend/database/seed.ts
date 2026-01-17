
import db from './db.ts';
import { INITIAL_ENTERPRISES, INITIAL_DEVICES, REGIONAL_COORDINATES } from '../constants.ts';

export const seedDatabase = () => {
  console.log("🌱 Seeding SQLite database...");

  const insertEnterprise = db.prepare('INSERT OR IGNORE INTO enterprises (id, name, email, password) VALUES (?, ?, ?, ?)');
  const insertDevice = db.prepare('INSERT OR IGNORE INTO devices (device_id, alias, imei, enterprise_id, status) VALUES (?, ?, ?, ?, ?)');
  const insertLocation = db.prepare('INSERT INTO locations (device_id, latitude, longitude, speed, altitude, direction, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)');

  const transaction = db.transaction(() => {
    // 1. Seed Enterprises
    INITIAL_ENTERPRISES.forEach(ent => {
      const slug = ent.name.split(' ')[0].toLowerCase();
      insertEnterprise.run(ent.id, ent.name, `${slug}@track.tn`, `${slug}123`);
    });

    // 2. Seed Devices
    INITIAL_DEVICES.forEach(dev => {
      insertDevice.run(dev.device_id, dev.alias, dev.imei, dev.enterprise_id, dev.status);
      
      // 3. Initial Location
      const coords = REGIONAL_COORDINATES[dev.enterprise_id] || [36.8065, 10.1815];
      insertLocation.run(
        dev.device_id, 
        coords[0], 
        coords[1], 
        0, 
        15, 
        0, 
        new Date().toISOString()
      );
    });
  });

  transaction();
  console.log("✅ Database seeded successfully.");
};

// Fix for line 42: Property 'argv' does not exist on type 'Process'.
// Use type assertion to safely check for the argv array when running in a Node environment.
if (typeof process !== 'undefined' && Array.isArray((process as any).argv) && (process as any).argv[1]?.endsWith('seed.ts')) {
  seedDatabase();
}
