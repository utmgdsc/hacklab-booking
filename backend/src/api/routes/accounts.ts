import { Router } from 'express';
import { routeNotImplemented } from '../utils';

const router = Router();

router.get('/', routeNotImplemented);
router.get('/:utorid', routeNotImplemented);
router.delete('/:id', routeNotImplemented);
router.put('/:utorid/changerole', routeNotImplemented);
router.post('/changetheme', routeNotImplemented);

export default router;