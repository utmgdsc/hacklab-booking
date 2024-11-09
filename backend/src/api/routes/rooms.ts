import { Router } from 'express';
import roomsModel from '../../models/roomsModel';
import { checkRequiredFields, PermissionLevel, permissionMiddleware, sendResponse } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await roomsModel.getRooms());
});
router.get('/:room', async (req, res) => {
  sendResponse(res, await roomsModel.getRoom(req.params.room, req.user));
});
router.post(
  '/create',
  permissionMiddleware(PermissionLevel.admin),
  checkRequiredFields(['friendlyName', 'room']),
  async (req, res) => {
    if (req.body.capacity && isNaN(parseInt(req.body.capacity))) {
      sendResponse(res, {
        status: 400,
        message: 'Invalid capacity.',
      });
      return;
    }
    sendResponse(res, await roomsModel.createRoom(req.user, req.body.friendlyName, req.body.capacity, req.body.room));
  },
);
router.get('/:room/blockeddates', async (req, res) => {
  const startDate = req.query.start_date ? new Date(req.query.start_date as string) : new Date();
  // In a week
  const endDate = req.query.end_date
    ? new Date(req.query.end_date as string)
    : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    sendResponse(res, {
      status: 400,
      message: 'Invalid date format.',
    });
    return;
  }
  sendResponse(res, await roomsModel.getBlockedDates(req.params.room, startDate, endDate));
});

router.put(
  '/:rooms/grantaccess',
  permissionMiddleware(PermissionLevel.tcard),
  checkRequiredFields(['utorid']),
  async (req, res) => {
    sendResponse(res, await roomsModel.grantAccess(req.user, req.params.rooms, req.body.utorid));
  },
);
router.put(
  '/:rooms/revokeaccess',
  permissionMiddleware(PermissionLevel.tcard),
  checkRequiredFields(['utorid']),
  async (req, res) => {
    sendResponse(res, await roomsModel.revokeAccess(req.user, req.params.rooms, req.body.utorid));
  },
);

router.put(
  '/:rooms/addapprover',
  permissionMiddleware(PermissionLevel.admin),
  checkRequiredFields(['utorid']),
  async (req, res) => {
    sendResponse(res, await roomsModel.addApprover(req.params.rooms, req.body.utorid));
  },
);

router.put(
  '/:rooms/removeapprover',
  permissionMiddleware(PermissionLevel.admin),
  checkRequiredFields(['utorid']),
  async (req, res) => {
    sendResponse(res, await roomsModel.removeApprover(req.params.rooms, req.body.utorid));
  },
);

router.put('/:rooms/update', permissionMiddleware(PermissionLevel.admin), async (req, res) => {
  const { friendlyName, capacity, needAccess, description, roomRules, requestLimit } = req.body;
  if (
    (capacity !== undefined && isNaN(parseInt(capacity))) ||
    capacity === null ||
    capacity < 0 ||
    (needAccess !== undefined && typeof needAccess !== 'boolean') ||
    (description !== undefined && typeof description !== 'string') ||
    (roomRules !== undefined && typeof roomRules !== 'string') ||
    (requestLimit !== undefined && isNaN(parseInt(requestLimit)))
  ) {
    sendResponse(res, {
      status: 400,
      message: 'Invalid request.',
    });
    return;
  }
  sendResponse(
    res,
    await roomsModel.setSettings(req.params.rooms, {
      friendlyName,
      capacity,
      needAccess,
      description,
      roomRules,
      requestLimit,
    }),
  );
});

export default router;
