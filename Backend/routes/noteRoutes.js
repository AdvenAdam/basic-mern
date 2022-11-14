const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
router
    .route('/')
    .GET(noteController.getAllNotes)
    .POST(noteController.createNewNote)
    .PATCH(noteController.updateNote)
    .DELETE(noteController.deleteNote);

module.exports = router;
