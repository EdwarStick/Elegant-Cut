const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

// Public routes
router.get('/', reviewController.getReviews);
router.post('/', reviewController.createReview);

// Admin routes
router.get('/admin/all', reviewController.getAllReviewsAdmin);
router.patch('/admin/:id/status', reviewController.updateReviewStatus);
router.delete('/admin/:id', reviewController.deleteReview);

module.exports = router;

