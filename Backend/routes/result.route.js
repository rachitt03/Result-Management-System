import express from "express";
import { resultPage, getResult } from "../controllers/result.controller.js";

//we get router from express
const router = express.Router();

router.route("/postresult").post(resultPage);
router.route("/resultstudent").get(getResult);

export default router;