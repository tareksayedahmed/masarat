const express = require('express');
const router = express.Router();
const { getBranches, getCarModels, getFleet, getFleetCarById, getUsers, getUserById } = require('../controllers/dataController');

// Public routes for general data
router.get('/branches', getBranches);
router.get('/carmodels', getCarModels);
router.get('/fleet', getFleet);
router.get('/fleet/:id', getFleetCarById);

// Protected/Admin routes for sensitive data
// Add auth middleware here when ready
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

module.exports = router;
