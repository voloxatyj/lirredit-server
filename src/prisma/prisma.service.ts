import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log(`
               ################################################################
                  🚀[database]: Create connection to lireddit DB successfully
               ################################################################`);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
