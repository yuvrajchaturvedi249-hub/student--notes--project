const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/upload', noteController.uploadNote); // /api/notes/upload
router.get('/all', noteController.getAllNotes);      // /api/notes/all

module.exports = router;