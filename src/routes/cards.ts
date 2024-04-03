import { Router } from 'express';
import { getCards, deleteCard, createCard, likeCard, dislikeCard } from '../controllers/cards';
import { validateCardId, validateCreateCard } from 'validator';

const router = Router();
router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

export default router;
