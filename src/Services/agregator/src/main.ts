import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from "@nestjs/microservices";

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  const app = await NestFactory.createMicroservice(AppModule, {
    options: {
      url: "nats://localhost:4222",
    },
    transport: Transport.NATS,
  });
  app.listen(() => console.log("Microservice is listening"));

}
bootstrap();
