const express = require('express');
const multer = require('multer');
const resumeController = require('../modules/resume/resume.controller');

const router = express.Router();

// Sabse simple storage config: memory storage use karenge (temporarily) taaki path ka panga khatam ho
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('resume'), resumeController.upload);
router.get('/:id/status', resumeController.getStatus);

module.exports = router;
