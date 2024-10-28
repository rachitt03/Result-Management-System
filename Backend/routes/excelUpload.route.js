import express from "express";
import { updateClass, uploadResult, uploadStudent } from "../controllers/excelUpload.controller.js";
import uploads from "../middlewares/mutler.js";

//we get router from express
const router = express.Router();

router.route("/excel/uploadresult").post(uploads,uploadResult);
router.route("/excel/uploadstudent").post(uploads,uploadStudent);
router.route("/excel/updateclass").post(uploads,updateClass);

export default router;
