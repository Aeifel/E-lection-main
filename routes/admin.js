var express = require('express');
const router = express.Router();
const {authenticateToken} = require('../utils/Jauth');
const {isAdminAuth} = require("../middlewares/adminAuth");

const {createElection, acceptRequest, rejectRequest, openElection, closeElection, getCreatedElections, getAwaitingRequests} = require('../controllers/admin');

router.post('/createElection', authenticateToken, createElection);

router.post('/openElection', authenticateToken, isAdminAuth, openElection);

router.post('/closeElection', authenticateToken, isAdminAuth, closeElection);

router.post('/acceptRequest', authenticateToken, isAdminAuth, acceptRequest);

router.post('/rejectRequest', authenticateToken, isAdminAuth, rejectRequest);

router.get('/createdElections', authenticateToken, getCreatedElections);

router.get('/awaitingRequests', authenticateToken, getAwaitingRequests);

module.exports = router;
