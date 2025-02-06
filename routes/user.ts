import { Router } from 'express';
import {
  postUser,
  putUser,
  deleteUser,
  silentRefresh,
  checkAuth,
  postLogin,
} from '../controller/userController.js';
const router = Router();

router.post('/user/login', postLogin);
router.post('/user/refresh', silentRefresh);
router.get('/check', checkAuth);
router.post('/user', postUser);
router.put('/user', putUser);
router.delete('/user', deleteUser);

export default router;
