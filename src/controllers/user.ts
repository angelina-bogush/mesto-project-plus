import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DublicateError from '../errors/DublicateError';
import User from '../models/user';
import { IRequest } from '../types';
import { REQUEST_SUCCESS } from '../constants';
import ValidationError from '../errors/ValidationError';
import NotFoundError from '../errors/NotFoundError';

export const createUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = bcrypt.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hash });
    await user.save();
    return res.status(REQUEST_SUCCESS).send({ email: user.email, id: user._id });
  } catch (err) {
    if (err instanceof mongoose.Error && err.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    }
    if (err instanceof mongoose.Error && err.message.startsWith('E11000')) {
      return next(new DublicateError('Пользователь с таким email уже существует'));
    }
    return next(err);
  }
};

export const getUsers = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(REQUEST_SUCCESS).send({ data: users });
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) { return next(new NotFoundError('Пользователь не найден')); }
    return res.status(REQUEST_SUCCESS).send({ data: user });
  } catch (err) {
    if (err instanceof mongoose.Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new ValidationError('Переданы некорректные данные при поиске'));
    }
    return next(err);
  }
};
export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) { return next(new NotFoundError('Пользователь не найден')); }
    return res.status(REQUEST_SUCCESS).send({ data: updatedUser });
  } catch (err) {
    if (err instanceof mongoose.Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
    }
    return next(err);
  }
};
export const updateAvatar = async (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedUser) { return next(new NotFoundError('Пользователь не найден')); }
    return res.status(REQUEST_SUCCESS).send({ data: updatedUser });
  } catch (err) {
    if (err instanceof mongoose.Error && err.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
    }
    return next(err);
  }
};
export const login = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'secret_code', { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });
    return res.status(REQUEST_SUCCESS).send({ message: 'Токен отправлен в cookie' });
  } catch (err) {
    return next(err);
  }
};
export const findUserInfo = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userMe = await User.findById(req.user?._id);
    if (!userMe) { return next(new NotFoundError('Пользователь не найден')); }
    return res.status(REQUEST_SUCCESS).send({ data: userMe });
  } catch (err) {
    return next(err);
  }
};
