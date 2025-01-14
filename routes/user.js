import { Router } from "express";
import {
  getUser,
  postUser,
  putUser,
  deleteUser,
  silentRefresh,
  checkAuth,
} from "../controller/userController.js";
const router = Router();

router.get("/user", getUser);
router.post("/user/refresh", silentRefresh);
router.get("/check", checkAuth);
router.post("/user", postUser);
router.put("/user", putUser);
router.delete("/user", deleteUser);

export default router;
