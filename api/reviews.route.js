import express from "express";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

// Search for all reviews for a dining hall
router.route("/").get(ReviewsCtrl.apiGetReviews)
                .post(ReviewsCtrl.apiAddReview);


export default router;