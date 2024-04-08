import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import NotAuthError from '../errors/NotAuthError';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  let payload;
  try {
    const tokenCookies = req.cookies.jwt;
    if (!tokenCookies) {
      return next(new NotAuthError('Необходима авторизация'));
    }
    const token = tokenCookies.replace('Bearer ', '');
    payload = jwt.verify(token, 'secret_code');
  } catch (err) {
    return next(new NotAuthError('Авторизуйтесь для выполнения запроса'));
  }
  req.user = payload;
  return next();
};
export default auth;
