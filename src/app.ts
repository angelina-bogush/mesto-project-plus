import express, { Response } from 'express';
import mongoose from 'mongoose';
import { MONGO_URL, PORT } from './constants';
import routes from './routes/index';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { validateLogin, validateCreateUser } from 'validator';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log('Подключение к MongoDB успешно');
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth)
app.use(routes)


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
