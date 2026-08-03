import 'dotenv/config';
import http from 'http';
import app from './app.js';
import sequelize from './config/database.js';
import './models/index.js';
import { runMigrations } from './migrations/index.js';
import { initRealtime } from './realtime/socket.js';
import { validateRuntimeEnv } from './config/runtime.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateRuntimeEnv();
    await sequelize.authenticate();
    console.log('MySQL connected successfully');

    await runMigrations();
    console.log('Database migrations are up to date');

    const httpServer = http.createServer(app);
    initRealtime(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Realtime server ready');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
