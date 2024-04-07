import { Response, NextFunction } from 'express';
import Card from '../models/cards';
import { IRequest } from '../types';
import { REQUEST_SUCCESS } from '../constants';
import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';
import { ForbiddenError } from '../errors/ForbiddenError';

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user?._id,
  })
    .then((card) => res.status(REQUEST_SUCCESS).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании карточки'));
      }
      next();
    });
};
export const getCards = (req: IRequest, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(REQUEST_SUCCESS).send({ data: cards }))
    .catch(next);
};

export const deleteCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Карточка не найдена."));
      }
      if (String(card.owner) !== req.user?._id) {
        return next(
          new ForbiddenError("Нет прав для удаления данной карточки")
        );
      }
      card.remove()
        .then(() => res.status(REQUEST_SUCCESS).send({ data: card }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при удалении карточки'));
      }
      next(err);
    });
};
export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при постановке лайка'));
      }
      next();
    });
};
export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) { return next(new NotFoundError('Карточка пользователя не найдена')); }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при постановке лайка'));
      }
      next();
    });
};
