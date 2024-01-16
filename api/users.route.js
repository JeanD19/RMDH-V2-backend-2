import express from "express";
import UsersCtrl from "./users.controller.js";

const router = express.Router();

// Creates a user in our database
router.route("/sign-up").post(UsersCtrl.apiCreateUser);
router.route("/log-in").post(UsersCtrl.apiLogInUser);

export default router;