import express from "express";
import SchoolsCtrl from "./schools.controller.js";

const router = express.Router();

router.route("/").get(SchoolsCtrl.apiGetSchools); //get all the schools
router.route("/search").get(SchoolsCtrl.apiGetSchoolsByName); //get school by name

export default router;