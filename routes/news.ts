import { Router } from 'express';
import { getNews } from '../controller/newsController.js';
import { verifyAccessToken } from '../middleware/index.js';

const router = Router();

router.get('/news', verifyAccessToken, getNews);

export default router;
