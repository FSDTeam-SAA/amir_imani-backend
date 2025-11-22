import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ✅ Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://yourfrontenddomain.com'], // your frontend URL(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you're using cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
