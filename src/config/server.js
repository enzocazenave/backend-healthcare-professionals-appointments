import express from 'express';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

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
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  setRoutes() {

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