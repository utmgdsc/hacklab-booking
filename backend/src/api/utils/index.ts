import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from 'express';
import ModelResponse, {
  ModelResponseError,
  ModelResponseSuccess,
} from '../../types/ModelResponse';

export const routeNotImplemented: RequestHandler = (req: Request, res: Response, next: NextFunction | undefined) => {
  res.statusCode = 501;
  res.json({ message: 'Not implemented' });
};


export const sendResponse = <T>(res: Response, model: ModelResponse<T>) => {
  res.statusCode = model.status;
  if ((<ModelResponseSuccess<T>>model).data) {
    res.json((model as ModelResponseSuccess<T>).data);
    return;
  } else {
    res.json(model);
    return;
  }
};
