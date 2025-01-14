import { Router } from "express";
import {
  deleteKeywords,
  getDefaultKeywords,
  getKeywords,
  postDefaultKeywords,
  postKeywords,
} from "../controller/KeywordController.js";

const router = Router();

router.get("/keywords", getKeywords);
router.post("/keywords", postKeywords);
router.delete("/keywords", deleteKeywords);
router.get("/keywords/default", getDefaultKeywords);
router.post("/keywords/default", postDefaultKeywords);

export default router;
