import express from "express";
import { addClass, addResult, addStudents, classDashboard, dashboard, deleteClass, deleteResult, deleteStudents, getClass, getResults, getStudents, resultDashboard, studentDashboard, subjectByClassId } from "../controllers/dashboard.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

//we get router from express
const router = express.Router();

router.route("/").get(dashboard , isAuthenticated);
router.route("/classes").get(classDashboard,isAuthenticated);
router.route("/students").get(studentDashboard, isAuthenticated);
router.route("/results").get(resultDashboard, isAuthenticated);

//Now bari hai getClass , getStudents , getResults
router.route("/getclasses").get(getClass);
router.route("/getstudents").get(getStudents);
router.route("/getresults").get(getResults);

//Now turn of addClass , addStudents , addResult
router.route("/addclasses").post(addClass);
router.route("/addstudents").post(addStudents);
router.route("/addresults").post(addResult);
router.route("/addresults/:cid").get(subjectByClassId);

//Now turn of deleteResult , deleteClass, deleteStudent
router.route("/deleteclasses/:cid").delete(deleteClass , isAuthenticated);
router.route("/deletestudents/:sid").delete(deleteStudents, isAuthenticated);
router.route("/deleteresults/:rid").delete(deleteResult, isAuthenticated);

export default router;

