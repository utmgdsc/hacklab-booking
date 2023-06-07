import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
} from 'express';

export const routeNotImplemented: RequestHandler = (req: Request, res: Response, next: NextFunction | undefined) => {
  res.statusCode = 501;
  res.json({ message: 'Not implemented' });
};