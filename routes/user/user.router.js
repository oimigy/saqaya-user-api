import {Router} from "express";
import * as userController from "./controller/user.controller.js";

const router = Router();

router.get("/:hash", userController.getUser);

router.post("/", userController.signUp);

export default router;