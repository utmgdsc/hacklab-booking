import { Router } from 'express';
import { routeNotImplemented } from '../utils';

const router = Router();

router.get('/:room', routeNotImplemented);
router.get('/:room/blockeddates', routeNotImplemented);
router.put('/:rooms/grantAccess', routeNotImplemented);
router.get('/:rooms/requests', routeNotImplemented);
export default router;