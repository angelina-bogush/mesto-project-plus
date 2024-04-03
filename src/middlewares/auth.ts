import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import NotAuthError from "errors/NotAuthError";
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return next(new NotAuthError("Авторизуйтесь для выполнения"));
  }
  req.user = payload;
  next()
}
export default auth;

