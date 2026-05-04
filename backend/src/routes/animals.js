// Step 9 — Animal Routes
// Endpoints for /api/animals

import express from 'express';
import {
    getAnimals,
    getAnimalsSummary,
    getAnimalById,
    getAnimalHissas,
    addAnimal,
    updateAnimalStatus
} from '../controllers/animalController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/summary', getAnimalsSummary);
router.get('/', getAnimals);
router.get('/:id', getAnimalById);
router.get('/:id/hissas', getAnimalHissas);

// Protected Admin routes
router.post('/', verifyToken, requireAdmin, addAnimal);
router.patch('/:id/status', verifyToken, requireAdmin, updateAnimalStatus);

export default router;
