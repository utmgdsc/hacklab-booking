import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import logger from '../common/logger';

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

app.use(routes);

app.listen(port, () => {
  logger.info(`Server is listening on port ${  port  }.`);
});