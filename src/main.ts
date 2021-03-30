import 'reflect-metadata';
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { Container as OrmContainer } from 'typeorm-typedi-extensions';
import dotenv from 'dotenv';
import { getLogger } from 'log4js';
import { createConnection, useContainer as useOrmContainer } from 'typeorm';
import path from 'path';

async function bootstrap() {
  dotenv.config();

  const logger = getLogger('Application');
  logger.level = process.env.LOG_LEVEL || 'error';

  logger.info('Initializing the IoC container.');
  useContainer(Container);
  useOrmContainer(OrmContainer);

  logger.info('Initializing the connection to database.');
  await createConnection();

  logger.info('Initializing the web server.');

  const app = express();
  useExpressServer(app, {
    controllers: [path.join(__dirname, './**/*.controller.js')],
    routePrefix: '/api',
    classTransformer: true,
    validation: true,
  });

  app.listen(process.env.PORT, () => {
    logger.info(`Web server started at ${process.env.PORT} port.`);
  });
}

bootstrap();

process.on('unhandledRejection', () => {
  process.exit(3);
});
