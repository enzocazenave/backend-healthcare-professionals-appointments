import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Healthcare Professionals Appointments',
      version: '1.0.0',
      description: 'Backend for healthcare professionals appointments',
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;