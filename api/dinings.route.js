import express from "express";
import DiningsCtrl from "./dinings.controller.js";

const router = express.Router();

// Search for all the dining halls for a school
router.route("/").get(DiningsCtrl.apiGetDinings);

export default router;