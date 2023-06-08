import common from './common';
const { logger } = common;
logger.info('App is starting..');
logger.info('Connecting to database...');
common.db.$connect().then(async () => {
  logger.info('Connected to database.');
  logger.info('Initializing api routes...');
  await import('./api');
  logger.info('Initialized api.');

  logger.info('App started!');
}).catch((e) => {
  logger.error('Failed to connect to database.');
  logger.error(e);
  process.exit(1);
});
