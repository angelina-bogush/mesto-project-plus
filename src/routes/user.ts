import { Router } from 'express';
import { findUserInfo, getUserById, getUsers, updateAvatar, updateUser } from '../controllers/user';
import { validateUserId, validateUpdateUser, validateUpdateAvatar } from 'validator';

const router = Router();
router.get('', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.get('/me', findUserInfo);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
