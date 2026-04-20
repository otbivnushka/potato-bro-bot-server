import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { setupSwagger } from './utils/swagger.util';
import { Logger } from 'logger';
import { LOGGER } from './logger/logger.token';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<Logger>(LOGGER);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  setupSwagger(app);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  logger.serverStart(+port);

  process.on('SIGINT', async () => {
    logger.serverShutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.serverShutdown();
    process.exit(0);
  });
}
bootstrap();
