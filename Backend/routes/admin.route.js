import express from "express";
import { login, logout , registerAdmin} from "../controllers/admin.controller.js";

//we get router from express
const router = express.Router();

router.route("/register").post(registerAdmin)
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;