import swaggerUi from 'swagger-ui-express';

import express from 'express';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.load('./src/docs/swagger.yaml'), { customSiteTitle: 'Healthcare Professionals Appointments API' }));

export default app;