import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import connectRedis from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger('Server Instance');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const __prod__ = configService.get('ENVIRONMENT') === 'production';

  /*REDIS*/
  const RedisStore = connectRedis(session);
  const redisDB: string = configService.get('REDIS_DB');
  const redisHost: string = configService.get('REDIS_HOST');
  const redisPort: number = configService.get('REDIS_PORT');
  const url = `${redisDB}://${redisHost}:${redisPort}`;
  const redisClient = createClient({ url, legacyMode: true });
  await redisClient
    .connect()
    .then(() =>
      logger.log(`
                    ##################################################
                        🚀[REDIS]: Connected to Redis successfully
                    ##################################################
    `),
    )
    .catch((err) => logger.error(`Could not establish a connection with redis. ${err}`));

  /*SESSIONS*/
  const session_secret: string = configService.get('SESSION_SECRET');
  const cookie_name: string = configService.get('COOKIE_NAME');

  app.use(
    session({
      name: cookie_name,
      store: new RedisStore({ client: redisClient as any, disableTouch: true, disableTTL: true }),
      secret: session_secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: true,
        httpOnly: !__prod__,
        maxAge: 86400000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  /*SWAGGER*/
  const config = new DocumentBuilder()
    .addCookieAuth()
    .setTitle('LirRedit')
    .setDescription('The LirRedit API Documentation')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Log Env
  logger.log(`
                        #######################################
                           🚀[Environment Mode]: ${configService.get('ENVIRONMENT')}
                        #######################################
    `);

  // start server
  await app.listen(configService.get('PORT'), () => {
    logger.log(`
          ############################################################################
                  🚀[server]: Server is up and running @ ${configService.get(
    'PROTOCOL',
  )}://${configService.get('HOST')}:${configService.get('PORT')}
          ############################################################################
    `);
  });
}
bootstrap();
