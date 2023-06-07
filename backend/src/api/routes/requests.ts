import { Router } from 'express';
import { routeNotImplemented } from '../utils';

const router = Router();

router.get('/', routeNotImplemented);
router.post('/create', routeNotImplemented);
router.get('/:id', routeNotImplemented);
router.delete('/:id', routeNotImplemented);
router.put('/:id', routeNotImplemented);

export default router;