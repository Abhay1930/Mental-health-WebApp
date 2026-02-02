const express = require('express');
const wellnessController = require('../controllers/wellnessController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, wellnessController.addWellnessEntry);
router.get('/history', authMiddleware, wellnessController.getWellnessHistory);
router.get('/summary', authMiddleware, wellnessController.getWellnessSummary);

module.exports = router;
