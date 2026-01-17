
import Database from 'better-sqlite3';

/**
 * DATABASE ENGINE
 * This file manages the physical connection to tracking.db.
 */
const dbPath = 'tracking.db';
const db = new Database(dbPath);

// Performance & Integrity Settings
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL'); // Faster concurrent writes for the simulation

/**
 * SINGLE SOURCE OF TRUTH: SCHEMA
 * We define the tables and indexes here. 
 * Indices on device_id and timestamp are CRITICAL for map performance.
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS enterprises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS devices (
    device_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL,
    imei TEXT UNIQUE,
    enterprise_id TEXT,
    status TEXT DEFAULT 'online',
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT,
    latitude REAL,
    longitude REAL,
    speed REAL,
    altitude REAL,
    direction REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
  );

  -- Optimization Indexes
  CREATE INDEX IF NOT EXISTS idx_locations_device_id ON locations(device_id);
  CREATE INDEX IF NOT EXISTS idx_locations_timestamp ON locations(timestamp);
`);

export default db;
