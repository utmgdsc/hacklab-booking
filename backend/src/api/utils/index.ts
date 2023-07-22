import { AccountRole } from '@prisma/client';
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import ModelResponse, {
  ModelResponseSuccess,
} from '../../types/ModelResponse';

export const routeNotImplemented: RequestHandler = (req: Request, res: Response) => {
  res.statusCode = 501;
  res.json({ message: 'Not implemented' });
};

export const sendResponse = <T extends object>(res: Response, model: ModelResponse<T>) => {
  res.statusCode = model.status;
  if ((<ModelResponseSuccess<T>>model).data) {
    res.json((model as ModelResponseSuccess<T>).data);
    return;
  } else {
    res.json(model);
    return;
  }
};

export enum PermissionLevel {
  student = 0,
  staff = 1,
  approver = 2,
  tcard = 3,
  admin = 4,
}

export const permissionMiddleware = (level: PermissionLevel) => (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role == AccountRole.admin || level === PermissionLevel.student) {
    next();
    return;
  }
  if (req.user.role === AccountRole.student) {
    res.statusCode = 403;
    res.json({ message: 'Insufficient permissions.' });
    return;
  }
  if (
    level == PermissionLevel.staff ||
        (req.user.role === AccountRole.approver && level === PermissionLevel.approver) ||
        (level === PermissionLevel.tcard && req.user.role === AccountRole.tcard)
  ) {
    next();
    return;
  }
  res.statusCode = 403;
  res.json({ message: 'Insufficient permissions.' });
};

export const checkRequiredFields = (requiredFields: string[]) => (req: Request, res: Response, next: NextFunction) => {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.statusCode = 400;
      res.json({ message: `Missing required field: ${field}` });
      return;
    }
  }
  next();
};

export const checkUuidMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i.test(req.params.id)) {
    res.statusCode = 400;
    res.json({ status: 400, message: 'Invalid id.' });
    return;
  }
  next();
};
