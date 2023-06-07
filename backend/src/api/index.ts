import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import logger from '../common/logger';
import { sendResponse } from './utils';
import db from '../common/db';

const port = process.env.PORT || 3000;
const app = express();
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  try {
    next();
  } catch (e) {
    logger.error(e);
    let message = 'Internal server error.';
    if (process.env.NODE_ENV === 'development') {
      message += `\n${e}`;
    }
    sendResponse(res, {
      status: 500,
      message,
    });
  }
});
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  if (!req.headers.utorid || !req.headers.http_mail || !req.headers.http_cn) {
    sendResponse(res, {
      status: 401,
      message: 'Missing Shibboleth headers.',
    });
    return;
  }
  req.user = await db.user.upsert({
    where: { utorid: req.header('utorid') },
    update: { email: req.header('http_mail') as string },
    create: {
      utorid: req.header('utorid') as string,
      email: req.header('http_mail') as string,
      name: req.header('http_cn') as string,
    },
  });
  next();

});


app.use(routes);

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}.`);
});

