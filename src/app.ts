import express, { Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { IRequest, IError } from './types';
import { MONGO_URL, PORT, SERVER_ERROR } from './constants';
import routes from './routes/index';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { validateLogin, validateCreateUser } from './validator/validator';
import { loggerError, loggerRequest } from './middlewares/logger';

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log('Подключение к MongoDB успешно');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });
app.use(loggerRequest);
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use(routes);
app.use(loggerError);
app.use(errors());
app.use((err: IError, req: IRequest, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR } = err;
  res.status(statusCode).send({ message: statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : err.message });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
