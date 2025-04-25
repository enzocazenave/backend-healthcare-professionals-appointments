import swaggerUi from 'swagger-ui-express';

import express from 'express';
import YAML from 'yamljs';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load('./swagger.yaml'), { customSiteTitle: 'Healthcare Professionals Appointments API' }));

export default app;