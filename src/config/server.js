import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.EXPRESS_SERVER_PORT || 3000;
    this.server = http.createServer(this.app);
  }

  setDefaultMiddlwares() {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load('./src/docs/swagger.yaml'), { customSiteTitle: 'Healthcare Professionals Appointments API' }));
  }

  start() {
    this.setDefaultMiddlwares();

    this.server.listen(this.port, () => {
      console.log(`🚀 EXPRESS SERVER RUNNING ON PORT: ${this.port}`);
    });
  }
}

export default Server;