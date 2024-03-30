import { Request, Response, Router } from 'express';
import { DATA_NOT_FOUND } from '../constants';
import userRouter from './user';
import cardsRouter from './cards';

const routes = Router();
routes.use('/users', userRouter);
routes.use('/cards', cardsRouter);
routes.use((req: Request, res: Response) => res.status(DATA_NOT_FOUND).send({ message: 'Page Not Found' }));
export default routes;
