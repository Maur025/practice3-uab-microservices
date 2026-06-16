import dotenv from 'dotenv';

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || process.env.SERVER_APP_PORT || '7800', 10),
  peopleServiceUrl: process.env.PEOPLE_SERVICE_URL || 'http://localhost:7802',
};

export default env;
