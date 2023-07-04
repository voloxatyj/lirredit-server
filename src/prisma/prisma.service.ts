import { INestApplication, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit {
  private logger = new Logger(PrismaService.name);

  constructor(private config: ConfigService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });
  }

  async onModuleInit() {
    try {
      const __prod__ = this.config.get('ENVIRONMENT') === 'production';

      if (!__prod__) {
        this.$on('error', (event) => {
          this.logger.error(event);
        });
        this.$on('warn', (event) => {
          this.logger.warn(event);
        });
        this.$on('info', (event) => {
          this.logger.verbose(event);
        });
        this.$on('query', (event) => {
          this.logger.log(event);
        });
      }

      await this.$connect();
      this.logger.log(`
               ##########################################################
                  🚀[database]: Create connection to  DB successfully
               ##########################################################`);
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
