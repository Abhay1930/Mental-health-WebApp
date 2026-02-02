const express = require('express');
const router = express.Router();
const auth = require('../src/middleware/authMiddleware');
const analyticsController = require('../src/controllers/analyticsController');

router.get('/history', auth, analyticsController.getMoodHistory);
router.get('/summary', auth, analyticsController.getSummary);

module.exports = router;
