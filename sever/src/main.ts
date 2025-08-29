import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodFilter } from './customize/zodConfigMessage';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //- pipe zod global
  app.useGlobalPipes(new ZodValidationPipe());

  //- config message zod
  app.useGlobalFilters(new ZodFilter());

  //- config cors
  app.enableCors({
    origin: true, //- domain client
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 9000);
}
bootstrap();
