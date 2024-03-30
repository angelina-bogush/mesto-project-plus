import { Request, Response, Router } from 'express'
import userRouter from './user'
import cardsRouter from './cards'

const routes = Router()
routes.use('/users', userRouter)
routes.use('/cards', cardsRouter)
routes.use((req: Request, res: Response) => res.status(404).send({ message: 'Page Not Found' }));
export default routes