import express from 'express';
import { Response } from 'express';
import mongoose from "mongoose";
import { MONGO_URL, PORT } from './constants';
import routes from './routes/index'
import { IRequest } from './types';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL, {})
  .then(() => {
    console.log("Подключение к MongoDB успешно");
  })
  .catch((error) => {
    console.error("Ошибка подключения к MongoDB:", error);
  });
  app.use((req: IRequest, res: Response, next) => {
    req.user = { _id: "6605bc78f87520d286264f51" };

    next();
  });
app.use(routes)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})