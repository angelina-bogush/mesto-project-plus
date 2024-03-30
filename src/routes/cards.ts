import { getCards, deleteCard, createCard, likeCard, dislikeCard } from "../controllers/cards";
import { Router } from "express";

const router = Router()
router.get('/', getCards)
router.delete('/:cardId', deleteCard)
router.post('/', createCard)
router.put('/:cardId/likes', likeCard)
router.delete('/:cardId/likes', dislikeCard)

export default router