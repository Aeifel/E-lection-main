var express = require('express');
const router = express.Router();
const {authenticateToken} = require('../utils/Jauth');

const {sendRequest, castVote, getEnrolledElections, getAllElectionsWithStatus, getMyRequests, getCandidates} = require('../controllers/voter');
 
router.post('/sendRequest', authenticateToken, sendRequest);

router.post('/castVote', authenticateToken, castVote);

router.get('/getEnrolledElections', authenticateToken, getEnrolledElections);

router.get('/getAllElections', authenticateToken, getAllElectionsWithStatus);

router.get('/getMyRequests', authenticateToken, getMyRequests);

router.post('/getCandidates', authenticateToken, getCandidates);

module.exports = router;
