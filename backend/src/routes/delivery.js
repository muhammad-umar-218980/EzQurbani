// Step 13 — Delivery Routes
// Endpoints for /api/delivery

import express from 'express';
import {
    createDelivery,
    trackDelivery,
    updateDeliveryStatus,
    getAllDeliveries,
    getAllAgents,
    createMeatPackage
} from '../controllers/deliveryController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin-only routes
router.get('/agents', verifyToken, requireAdmin, getAllAgents);
router.post('/package', verifyToken, requireAdmin, createMeatPackage);
router.post('/', verifyToken, requireAdmin, createDelivery);
router.get('/', verifyToken, requireAdmin, getAllDeliveries);
router.patch('/:id/status', verifyToken, requireAdmin, updateDeliveryStatus);

// Customer-accessible routes
router.get('/track/:booking_id', verifyToken, trackDelivery);

export default router;
