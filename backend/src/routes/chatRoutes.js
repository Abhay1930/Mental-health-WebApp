const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, chatController.chat);
router.get('/history', authMiddleware, chatController.getChatHistory);
router.delete('/history', authMiddleware, chatController.clearChatHistory);

module.exports = router;
