import { Router } from 'express';
import {
  checkRequiredFields,
  PermissionLevel,
  permissionMiddleware,
  routeNotImplemented,
  sendResponse,
} from '../utils';
import roomsModel from '../../models/roomsModel';

const router = Router();

router.get('/:room', async (req, res) => {
  sendResponse(res, await roomsModel.getRoom(req.params.room, req.user));
});
router.get('/:room/blockeddates', async (req, res) => {
  const startDate = req.query.start_date ? new Date(req.query.start_date as string) : new Date();
  // In a week
  const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    sendResponse(res, {
      status: 400,
      message: 'Invalid date format.',
    });
    return;
  }
  sendResponse(res, await roomsModel.getBlockedDates(req.params.room, startDate, endDate));
});
router.put('/:rooms/grantAccess', permissionMiddleware(PermissionLevel.tcard), checkRequiredFields(['utorid']), async (req, res) => {
  sendResponse(res, await roomsModel.grantAccess(req.params.rooms, req.body.utorid));
});
router.get('/:rooms/requests', routeNotImplemented);
export default router;