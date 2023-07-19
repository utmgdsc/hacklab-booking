import common from './common';

const { logger } = common;
logger.info('App is starting..');
logger.info('Connecting to database...');
common.db
  .$connect()
  .then(async () => {
    logger.info('Connected to database.');
    logger.info('Initializing api routes...');
    await import('./api');
    logger.info('Initialized api.');

    logger.info('App started!');
  })
  .catch((e: Error) => {
    logger.error('Failed to connect to database.');
    logger.error(`${e.name}\n${e.message}\n${e.stack}`);
    process.exit(1);
  });
