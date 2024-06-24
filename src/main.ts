import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { createServer, proxy } from 'aws-serverless-express';

const expressApp = express();
let server: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors(); // Enable CORS if needed
  await app.init();
  server = createServer(expressApp);
}

bootstrap();

export const handler = (event: any, context: any) => {
  return proxy(server, event, context);
};
