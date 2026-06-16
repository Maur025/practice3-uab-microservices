import app from './app.js';
import env from './config/env.js';

app.listen(env.port, () => {
  console.log(`erp-gateway corriendo en puerto ${env.port}`);
  console.log(`Swagger: http://localhost:${env.port}/api/docs`);
  console.log(`People service: ${env.peopleServiceUrl}`);
});
