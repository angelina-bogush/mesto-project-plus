import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Card from '../models/cards';
import { IRequest } from '../types';
import { REQUEST_SUCCESS } from '../constants';
import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';
import ForbiddenError from '../errors/ForbiddenError';

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = Card.create({
      name,
      link,
      owner: req.user?._id,
    });
    return res.status(REQUEST_SUCCESS).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error && error.name === 'ValidationError') {
      return next(new ValidationError('Некорректные данные при создании карточки'));
    }
    return next(error);
  }
};
export const getCards = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(REQUEST_SUCCESS).send({ data: cards });
  } catch (err) {
    return next(err);
  }
};

export const deleteCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(new NotFoundError('Карточка не найдена.'));
    }
    if (String(card.owner) !== req.user?._id) {
      return next(
        new ForbiddenError('Нет прав для удаления данной карточки'),
      );
    }
    return card.remove()
      .then(() => res.status(REQUEST_SUCCESS).send({ data: card }))
      .catch((err) => next(err));
  } catch (err) {
    return next(err);
  }
};
export const likeCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
    return res.status(REQUEST_SUCCESS).send({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new ValidationError('Переданы некорректные данные при постановке лайка'));
    }
    return next(err);
  }
};
export const dislikeCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );
    if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
    return res.status(REQUEST_SUCCESS).send({ data: card });
  } catch (err) {
    if (err instanceof mongoose.Error && (err.name === 'ValidationError' || err.name === 'CastError')) {
      return next(new ValidationError('Переданы некорректные данные при постановке лайка'));
    }
    return next(err);
  }
};
