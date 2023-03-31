import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Server Instance');
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

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
