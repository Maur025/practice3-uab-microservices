import app from './app.js';
import env from './config/env.js';
import sequelize from './config/sequelize.js';

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MariaDB establecida correctamente');

    app.listen(env.port, () => {
      console.log(`erp-people corriendo en puerto ${env.port}`);
      console.log(`Swagger: http://localhost:${env.port}/api/docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
