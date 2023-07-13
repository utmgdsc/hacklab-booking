import common from './common';

const { logger } = common;
logger.info('App is starting..');
logger.info('Connecting to database...');
common.db
    .$connect()
    .then(async () => {
        logger.info('Connected to database.');
        logger.info('Initializing api routes...');
        // TODO its currently 3am and this is the only way I can get the types to work for now. I will make this better later, trust me.
        if (false) {
            await import('./types/express.d');
        }
        await import('./api');
        logger.info('Initialized api.');

        logger.info('App started!');
    })
    .catch((e: Error) => {
        logger.error('Failed to connect to database.');
        logger.error(`${e.name}\n${e.message}\n${e.stack}`);
        process.exit(1);
    });
