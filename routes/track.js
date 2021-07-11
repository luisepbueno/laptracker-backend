const express = require('express');

const router = express.Router();
const trackController = require('../controllers/track');

router.get('/', trackController.getTracks);
router.get('/:trackId', trackController.getTrack);
router.post('/', trackController.addTrack);
router.delete('/:trackId', trackController.deleteTrack);

module.exports = router;
