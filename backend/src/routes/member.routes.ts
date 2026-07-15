import { Router } from 'express';
import { createMember, getMembers, getMemberById, updateMember, deleteMember, getHierarchy, transferMember } from '../controllers/member.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Require login for all member routes

router.get('/', getMembers);
router.get('/hierarchy', getHierarchy);
router.get('/:id', getMemberById);

// Admin only routes
router.post('/', requireAdmin, createMember);
router.put('/:id', requireAdmin, updateMember);
router.delete('/:id', requireAdmin, deleteMember);
router.post('/:id/transfer', requireAdmin, transferMember);

export default router;
