import { Router } from 'express';
import { routeNotImplemented } from '../utils';

const router = Router();

router.get('/', routeNotImplemented);
router.get('/:id', routeNotImplemented);
router.post('/create', routeNotImplemented);
router.post('/:id/changerole', routeNotImplemented);
router.post('/:id/invite', routeNotImplemented);
router.post('/:id/invite/accept', routeNotImplemented);
router.post('/:id/invite/reject', routeNotImplemented);
router.post('/:id/remove', routeNotImplemented);
router.delete('/:id', routeNotImplemented);
export default router;