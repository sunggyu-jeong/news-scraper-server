import { Router } from 'express';
import { getNews } from '../controller/newsController';
import { verifyAccessToken } from '../middleware/index';

const router = Router();

router.get('/news', verifyAccessToken, getNews);

export default router;
