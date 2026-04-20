import { Global, Module } from '@nestjs/common';
import { Logger } from 'logger';
import { LOGGER } from './logger.token';

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: () => new Logger(),
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}
