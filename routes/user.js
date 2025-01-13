const express = require("express");
const {
  getUser,
  postUser,
  putUser,
  deleteUser,
} = require("../controller/userController");
const router = express.Router();

router.get("/user", getUser);
router.post("/user", postUser);
router.put("/user", putUser);
router.delete("/user", deleteUser);

module.exports = router;
