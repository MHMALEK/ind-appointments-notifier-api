import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const getAppPort = (app) => {
  const configService: ConfigService = app.get(ConfigService);
  const appPort = configService.get('PORT');
  return appPort;
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  await app.listen(getAppPort(app));
}
bootstrap();
