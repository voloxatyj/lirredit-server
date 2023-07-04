import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { Logger } from '@nestjs/common';
import { appConfig } from './app.config';
import session from 'express-session';

const RedisStore = connectRedis(session);
const { redis_db, redis_host, redis_port } = appConfig();
const url = `${redis_db}://${redis_host}:${redis_port}`;
const redisClient = createClient({ url, legacyMode: true });

async function redis() {
  const logger = new Logger('Redis Instance');

  await redisClient
    .connect()
    .then(() =>
      logger.log(`
                    ################################################
                       🚀[REDIS]: Connected to Redis successfully
                    ################################################
`),
    )
    .catch(err => logger.error(`Could not establish a connection with redis. ${err}`));
}
redis();

export { RedisStore, redisClient };
