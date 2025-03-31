import express from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import YAML from 'yamljs';

import authRoutes from '../routes/auth.routes.js'
import userRoutes from '../routes/user.routes.js'  
import appointmentRoutes from '../routes/appointment.routes.js'
import specialtyRoutes from '../routes/specialty.routes.js'

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.EXPRESS_SERVER_PORT || 3000;
    this.server = http.createServer(this.app);
  }

  setDefaultMiddlwares() {
    this.app.use(cors({}));
    this.app.use(express.json());
    this.app.use(morgan('dev'));
    this.app.use(cookieParser())
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load('./src/docs/swagger.yaml')));
  }

  setRoutes() {
    this.app.use('/auth', authRoutes);
    this.app.use('/user', userRoutes);
    this.app.use('/appointment', appointmentRoutes);
    this.app.use('/specialty', specialtyRoutes);
  }

  start() {
    this.setDefaultMiddlwares();
    this.setRoutes();

    this.server.listen(this.port, () => {
      console.log(`🚀 EXPRESS SERVER RUNNING ON PORT: ${this.port}`);
    });
  }
}

export default Server;