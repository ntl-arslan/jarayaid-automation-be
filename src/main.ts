import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // allow all origins; you can replace '*' with specific domains for security
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if you want to allow cookies/auth headers
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
