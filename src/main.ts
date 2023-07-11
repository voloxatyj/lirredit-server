/* eslint-disable indent */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import { appConfig } from './config/app.config';
import { RedisStore, redisClient } from './config/redis.config';
import { swagger_config } from './config/swagger.config';

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

  app.useBodyParser('json', { limit: '10mb' });

  app.enableCors({
    origin: [`${client_protocol}://${client_host}:${client_port}`],
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('v1');
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

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
