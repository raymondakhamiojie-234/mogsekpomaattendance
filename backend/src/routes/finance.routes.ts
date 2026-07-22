import { Router } from 'express';
import { getFinances, createFinance } from '../controllers/finance.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', requireAdmin, getFinances);
router.post('/', requireAdmin, createFinance);

export default router;
