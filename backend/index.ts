
import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/apiRoutes.ts';
import { simulationService } from './services/SimulationService.ts';

export const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Fix: Cast middleware to any to resolve compatibility issues between connect and express types
app.use(cors() as any);
app.use(express.json() as any);

// Routes
// Fix: Cast apiRouter to any to ensure it matches expected RequestHandler overload
app.use('/api', apiRouter as any);

// Start Simulation Engine (Internal Node Service)
if (process.env.VERCEL !== '1') {
  simulationService.startSimulation();
}

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`
    GEOTRACK BACKEND STARTED
    ------------------------
    API URL: http://localhost:${PORT}/api
    Database: SQLite (tracking.db)
    Simulation: ACTIVE
    `);
  });
}
