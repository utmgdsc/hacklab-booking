import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}
