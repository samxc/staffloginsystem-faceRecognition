const express = require('express');
const FaceDataset = require('../controllers/FaceDataset');
const router = express.Router();

router.post('/post-face', FaceDataset.postFace);
router.get('/check-face', FaceDataset.checkFace);

module.exports = router;
