import express from "express";
import {
  changePwdUser,
  createUser,
  deleteUser,
  getUsers,
  recoverUser,
  searchUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/login", searchUser);
router.post("/recovery", recoverUser);
router.post("/changePwd", changePwdUser);
router.delete("/:id", deleteUser);

export default router;
