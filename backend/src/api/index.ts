import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import logger from '../common/logger';
import { sendResponse } from './utils';
import accountsModel from '../models/accountsModel';
import { User } from '@prisma/client';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

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
  logger.debug('Shibboleth headers:');
  logger.debug(JSON.stringify(req.headers));
  if (!req.headers.utorid || !req.headers.http_mail || !req.headers.http_cn) {
    sendResponse(res, {
      status: 401,
      message: 'Missing Shibboleth headers.',
    });
    return;
  }
  const data = (await accountsModel.upsertUser({
    utorid: req.headers.utorid as string,
    email: req.headers.http_mail as string,
    name: req.headers.http_cn as string,
  }));
  if (data.status !== 200) {
    sendResponse(res, data);
    return;
  }
  req.user = data.data as User;
  logger.debug(req.user);
  next();
});


app.use(routes);

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}.`);
});
