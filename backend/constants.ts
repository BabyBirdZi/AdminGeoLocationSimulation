
export const TUNISIA_CENTER: [number, number] = [36.8065, 10.1815];
export const UPDATE_INTERVAL_MS = 3000;
export const MAX_HISTORY_POINTS = 50;

export const INITIAL_ENTERPRISES = [
  { id: 'ent_001', name: 'SELO Logistics - Tunis' },
  { id: 'ent_002', name: 'Alpha Security - Sfax' },
  { id: 'ent_003', name: 'Bizerte Maritime Services' },
  { id: 'ent_004', name: 'Sousse Tourist Transport' },
  { id: 'ent_005', name: 'Gabes Industrial Pipeline' },
  { id: 'ent_006', name: 'Djerba Island Patrol' },
  { id: 'ent_007', name: 'Sahara Oil & Gas Tech' }
];

export const INITIAL_DEVICES = [
  { device_id: '87008047', alias: 'TRUCK-TUN-01', imei: '8654180520811', enterprise_id: 'ent_001', status: 'online' as const },
  { device_id: '87008048', alias: 'TRUCK-TUN-02', imei: '8654180520812', enterprise_id: 'ent_001', status: 'online' as const },
  { device_id: '87009001', alias: 'GUARD-SFAX-01', imei: '8654180520901', enterprise_id: 'ent_002', status: 'online' as const },
  { device_id: '87009002', alias: 'GUARD-SFAX-02', imei: '8654180520902', enterprise_id: 'ent_002', status: 'offline' as const },
  { device_id: '87007001', alias: 'MARINE-BIZ-01', imei: '8654180520701', enterprise_id: 'ent_003', status: 'online' as const },
  { device_id: '87007002', alias: 'MARINE-BIZ-02', imei: '8654180520702', enterprise_id: 'ent_003', status: 'online' as const },
  { device_id: '87004001', alias: 'TOUR-SOU-01', imei: '8654180520401', enterprise_id: 'ent_004', status: 'online' as const },
  { device_id: '87004002', alias: 'TOUR-SOU-02', imei: '8654180520402', enterprise_id: 'ent_004', status: 'online' as const },
  { device_id: '87004003', alias: 'TOUR-SOU-03', imei: '8654180520403', enterprise_id: 'ent_004', status: 'offline' as const },
  { device_id: '87005001', alias: 'PIPE-GAB-01', imei: '8654180520501', enterprise_id: 'ent_005', status: 'online' as const },
  { device_id: '87005002', alias: 'PIPE-GAB-02', imei: '8654180520502', enterprise_id: 'ent_005', status: 'online' as const },
  { device_id: '87006001', alias: 'DJERBA-PATROL-01', imei: '8654180520601', enterprise_id: 'ent_006', status: 'online' as const },
  { device_id: '87006002', alias: 'DJERBA-PATROL-02', imei: '8654180520602', enterprise_id: 'ent_006', status: 'online' as const },
  { device_id: '87001001', alias: 'RIG-SAHARA-01', imei: '8654180520101', enterprise_id: 'ent_007', status: 'online' as const },
  { device_id: '87001002', alias: 'RIG-SAHARA-02', imei: '8654180520102', enterprise_id: 'ent_007', status: 'online' as const },
  { device_id: '87001003', alias: 'VAN-SAHARA-SUP', imei: '8654180520103', enterprise_id: 'ent_007', status: 'offline' as const },
];

export const REGIONAL_COORDINATES: Record<string, [number, number]> = {
  'ent_001': [36.8065, 10.1815],
  'ent_002': [34.7406, 10.7603],
  'ent_003': [37.2744, 9.8739],
  'ent_004': [35.8256, 10.6369],
  'ent_005': [33.8815, 10.0982],
  'ent_006': [33.8076, 10.8451],
  'ent_007': [32.9211, 10.4509],
};
