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

router.get("/keywords/default", getDefaultKeywords);
router.post("/keywords/default", postDefaultKeywords);

router.use(verifyAccessToken);

router.get("/keywords", getKeywords);
router.post("/keywords", postKeywords);
router.delete("/keywords", deleteKeywords);

export default router;
