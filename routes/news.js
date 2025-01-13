import { Router } from "express";

const router = Router();
import { getNews } from "../controller/newsController.js";
import { verifyAccessToken } from "../middleware/middleware.js";

router.get("/news", verifyAccessToken, getNews);

export default router;
