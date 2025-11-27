import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS
	app.enableCors({
		origin: '*', // allow all origins; you can replace '*' with specific domains for security
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true, // if you want to allow cookies/auth headers
	});
	 app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error for extra props
      transform: true, // auto-transform payload to DTO types
    }),
  );

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
