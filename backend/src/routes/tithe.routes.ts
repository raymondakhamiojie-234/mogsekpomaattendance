import { Router } from 'express';
import { recordTithe, getTithes } from '../controllers/tithe.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getTithes);

// Admin only routes
router.post('/', requireAdmin, recordTithe);

export default router;
