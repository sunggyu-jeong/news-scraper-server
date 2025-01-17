import { Router } from "express";
import {
  deleteKeywords,
  getDefaultKeywords,
  getKeywords,
  postDefaultKeywords,
  postKeywords,
} from "../controller/KeywordController.js";
import { verifyAccessToken } from "../middleware/middleware.js";

const router = Router();

router.use(verifyAccessToken);

router.get("/keywords", getKeywords);
router.post("/keywords", postKeywords);
router.delete("/keywords", deleteKeywords);
router.get("/keywords/default", getDefaultKeywords);
router.post("/keywords/default", postDefaultKeywords);

export default router;
