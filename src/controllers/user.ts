
import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { IRequest } from '../types';
import { REQUEST_SUCCESS, VALIDATION_ERROR, DATA_NOT_FOUND, SERVER_ERROR } from '../constants';
import ValidationError from 'errors/ValidationError';
import NotFoundError from 'errors/NotFoundError';
import { ForbiddenError } from 'errors/ForbiddenError';
import NotAuthError from 'errors/NotAuthError';

export const createUser = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(REQUEST_SUCCESS).send({ email: user.email, id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError("'Переданы некорректные данные при создании пользователя'"))
      }
      if (err.code === 11000) {
        return next(new ForbiddenError('Пользователь с таким email уже существует'))
      }
      next(err)
    });
};

export const getUsers = (req: IRequest, res: Response, next: NextFunction) => {
  User.find({})
    .then((user) => res.status(REQUEST_SUCCESS).send({ data: user }))
    .catch(next);
};

export const getUserById = (req: IRequest, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { return next(new NotFoundError('Пользователь не найден')) }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при поиске'))
      }
      next(err)
    });
};
export const updateUser = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {  return next(new NotFoundError('Пользователь не найден')); }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
     next(err);
    });
};
export const updateAvatar = (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {  return next(new NotFoundError('Пользователь не найден')); }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};
export const login = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'secret_code', { expiresIn: '7d' });
    res.cookie("jwt", token, { httpOnly: true });
    res.status(REQUEST_SUCCESS).send({ message: 'Токен отправлен в cookie' })
  } catch (err) {
    if (err instanceof NotAuthError) {
      next(new NotAuthError('Неправильная почта или пароль'))
    } else {
      next(err)
    }
  }
}
export const findUserInfo = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (!user) { return next(new NotFoundError('Пользователь не найден')); }
      return res.status(REQUEST_SUCCESS).send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};
