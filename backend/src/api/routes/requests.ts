import { Router } from 'express';
import {
  checkRequiredFields,
  checkUuidMiddleware,
  PermissionLevel,
  permissionMiddleware,
  sendResponse,
} from '../utils';
import requestsModel from '../../models/requestsModel';
import { RequestStatus } from '@prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await requestsModel.getRequests(req.body, req.user));
});
router.post(
  '/create',
  checkRequiredFields(['title', 'description', 'roomName', 'groupId', 'startDate', 'endDate']),
  async (req, res) => {
    sendResponse(
      res,
      await requestsModel.createRequest(
        {
          title: req.body.title,
          description: req.body.description,
          roomName: req.body.roomName,
          groupId: req.body.groupId,
          endDate: req.body.endDate,
          startDate: req.body.startDate,
          approvers: req.body.approvers,
        },
        req.user,
      ),
    );
  },
);
router.use('/:id', checkUuidMiddleware);
router.get('/:id', async (req, res) => {
  sendResponse(res, await requestsModel.getRequest(req.params.id, req.user));
});
router.delete('/:id', async (req, res) => {
  sendResponse(res, await requestsModel.setRequestStatus(req.params.id, req.user, RequestStatus.cancelled));
});
router.put('/:id/approve', permissionMiddleware(PermissionLevel.approver), async (req, res) => {
  sendResponse(res, await requestsModel.approveRequest(req.params.id, req.body.reason));
});
router.put('/:id/deny', permissionMiddleware(PermissionLevel.staff), async (req, res) => {
  sendResponse(
    res,
    await requestsModel.setRequestStatus(req.params.id, req.user, RequestStatus.denied, req.body.reason),
  );
});

router.put('/:id/cancel', permissionMiddleware(PermissionLevel.approver), async (req, res) => {
  sendResponse(res, await requestsModel.setRequestStatus(req.params.id, req.user, RequestStatus.cancelled));
});

router.put('/:id', async (req, res) => {
  sendResponse(
    res,
    await requestsModel.updateRequest(
      {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        roomName: req.body.roomName,
        groupId: req.body.groupId,
        endDate: req.body.endDate,
        startDate: req.body.startDate,
        approvers: req.body.approvers,
      },
      req.user,
    ),
  );
});

export default router;
