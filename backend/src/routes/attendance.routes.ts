import { Router } from 'express';
import { createService, getServices, markAttendance, getAttendanceForService } from '../controllers/attendance.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/services', getServices);
router.get('/services/:serviceId', getAttendanceForService);
router.get('/', getAttendanceForService);

// Admin only routes
router.post('/services', requireAdmin, createService);
router.post('/mark', requireAdmin, markAttendance);

export default router;
