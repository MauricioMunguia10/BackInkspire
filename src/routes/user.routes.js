import express from "express";
import { createUser, getUsers, searchUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/register", createUser);
router.post("/login", searchUser);

export default router;
