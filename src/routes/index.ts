import { Request, Response, Router, NextFunction } from 'express';
import NotFoundError from '../errors/NotFoundError';
import userRouter from './user';
import cardsRouter from './cards';

const routes = Router();
routes.use('/users', userRouter);
routes.use('/cards', cardsRouter);
routes.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError('Страница не найдена')));
export default routes;
