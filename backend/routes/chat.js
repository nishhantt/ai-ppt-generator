const express = require('express');
const router = express.Router();
const { 
  generatePresentation, 
  getConversation, 
  deleteConversation 
} = require('../controllers/aiController');

// POST: Generate presentation from user message
router.post('/generate', generatePresentation);

// GET: Get conversation history by session ID
router.get('/conversation/:sessionId', getConversation);

// DELETE: Delete conversation by session ID
router.delete('/conversation/:sessionId', deleteConversation);

module.exports = router;