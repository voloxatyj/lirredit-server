import { registerAs } from '@nestjs/config';
import * as process from 'process';

export const appConfig = registerAs('app', () => ({
  host: process.env.HOST,
  port: parseInt(process.env.PORT, 10) || 5000,
  protocol: process.env.PROTOCOL,
  environment: process.env.ENVIRONMENT,
  database_url: process.env.DATABASE_URL,
  redis_db: process.env.REDIS_DB,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  session_secret: process.env.SESSION_SECRET,
  cookie_name: process.env.COOKIE_NAME,
  client_host: process.env.CLIENT_HOST,
  client_port: parseInt(process.env.CLIENT_PORT),
  client_protocol: process.env.CLIENT_PROTOCOL,
  display_users: parseInt(process.env.DISPLAY_USERS),
}));
