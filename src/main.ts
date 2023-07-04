/* eslint-disable indent */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import session from 'express-session';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appConfig } from './config/app.config';
import { SwaggerModule } from '@nestjs/swagger';
import { swagger_config } from './config/swagger.config';
import { RedisStore, redisClient } from './config/redis.config';

async function bootstrap() {
  const logger = new Logger('Server Instance');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const {
    client_protocol,
    client_host,
    client_port,
    session_secret,
    cookie_name,
    environment,
    protocol,
    host,
    port,
  } = appConfig();

  app.enableCors({
    origin: [`${client_protocol}://${client_host}:${client_port}`],
    credentials: true,
  });
  app.use(cookieParser());

  const __prod__ = environment === 'production';

  /* SESSIONS */
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

  /* SWAGGER */
  const document = SwaggerModule.createDocument(app, swagger_config);
  SwaggerModule.setup('api', app, document);

  /* LOG MODE */
  logger.log(`
                        #######################################
                           🚀[Environment Mode]: ${environment}
                        #######################################
    `);

  /* START SERVER */
  await app.listen(port, () => {
    logger.log(`
          ############################################################################
                  🚀[server]: Server is up and running @ ${protocol}://${host}:${port}
          ############################################################################
    `);
  });
}
bootstrap();
