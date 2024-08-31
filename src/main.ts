import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypeOrmExceptionFilter } from './common/filters/typeorm.filter';
import { LoggerService } from './modules/logger/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

function setupSwagger(app) {
  const options = new DocumentBuilder()
    .setTitle('Documentação do Meter Genius')
    .setDescription(
      'O Swagger (aka OpenApi) é uma biblioteca muito conhecida no universo backend, estando disponível para diversas linguagens e frameworks. Ela gera um site interno no seu backend que descreve, com muitos detalhes, cada endpoint e estrutura de entidades presentes na sua aplicação.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3030', 'Local environment')
    .addTag('user')
    .addTag('user/roles')
    .addTag('supplier')
    .addTag('supplier-company')
    .addTag('function-level')
    .addTag('auth')
    .addTag('organ')
    .addTag('permission')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: ['http://localhost:3030'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new TypeOrmExceptionFilter(), new HttpExceptionFilter());

  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });

  app.useLogger(new LoggerService());

  app.setGlobalPrefix(
    configService.get<string>('GLOBAL_PREFIX', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  setupSwagger(app);

  const port = configService.get<number>('PORT') || 3030;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
