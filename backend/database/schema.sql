
-- GEOTRACK SQLITE SCHEMA

CREATE TABLE enterprises (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE devices (
    device_id TEXT PRIMARY KEY,
    alias TEXT NOT NULL,
    imei TEXT UNIQUE,
    enterprise_id TEXT,
    status TEXT DEFAULT 'online',
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id) ON DELETE CASCADE
);

CREATE TABLE locations (
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

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_locations_device ON locations(device_id);
CREATE INDEX idx_locations_time ON locations(timestamp);
