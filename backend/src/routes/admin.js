// Step 12 — Admin Routes
// Endpoints for /api/admin

import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    createSchedule,
    getAllSchedules,
    getAllHouses,
    getAllButchers
} from '../controllers/adminController.js';
import { getAdvancedReports } from '../controllers/reportsController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require token AND admin role
router.use(verifyToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/reports', getAdvancedReports);
router.get('/users', getAllUsers);
router.post('/schedules', createSchedule);
router.get('/schedules', getAllSchedules);
router.get('/houses', getAllHouses);
router.get('/butchers', getAllButchers);

export default router;
