const express = require('express');

const router = express.Router();
const lapController = require('../controllers/lap-set');

router.get('/', lapController.getLapSets);
router.get('/:lapSetId', lapController.getLapSet);
router.post('/', lapController.addLapSet);

module.exports = router;
