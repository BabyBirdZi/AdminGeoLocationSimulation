
import { Router } from 'express';
import * as DeviceController from '../controllers/DeviceController.ts';
import { simulationService } from '../services/SimulationService.ts';
import db from '../database/db.ts';

export const apiRouter = Router();

apiRouter.get('/enterprises', (req, res) => {
  res.json(DeviceController.getEnterprises());
});

apiRouter.get('/devices', (req, res) => {
  res.json(DeviceController.getDevices());
});

apiRouter.get('/locations/live', (req, res) => {
  res.json(DeviceController.getLiveLocations());
});

apiRouter.get('/devices/:id/history', (req, res) => {
  res.json(DeviceController.getDeviceHistory(req.params.id));
});

apiRouter.post('/enterprises', (req, res) => {
  DeviceController.addEnterprise(req.body);
  res.status(201).json({ success: true });
});

apiRouter.post('/devices', (req, res) => {
  DeviceController.addDevice(req.body);
  res.status(201).json({ success: true });
});

apiRouter.get('/simulation/status', (req, res) => {
  res.json({ active: simulationService.getIsActive() });
});

apiRouter.post('/simulation/toggle', (req, res) => {
  const active = simulationService.toggleSimulation();
  res.json({ active });
});

apiRouter.post('/system/reset', (req, res) => {
  db.exec('DELETE FROM locations; DELETE FROM devices; DELETE FROM enterprises;');
  // Re-seed could be called here
  res.json({ success: true });
});
