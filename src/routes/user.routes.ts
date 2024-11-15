import express from "express";
import UserController from "../controllers/users.controller.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.post("/login", UserController.createUser);
router.put("/update", UserController.updateUser);
router.get("/fetch", validateToken, UserController.fetchUser);

export default router;
