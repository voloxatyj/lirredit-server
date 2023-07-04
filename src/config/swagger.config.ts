import { DocumentBuilder } from '@nestjs/swagger';

export const swagger_config = new DocumentBuilder()
  .addCookieAuth()
  .setTitle('LirRedit')
  .setDescription('The LirRedit API Documentation')
  .setVersion('0.0.1')
  .build();
