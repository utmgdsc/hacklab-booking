import { Router } from 'express';
import {
  checkRequiredFields,
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
router.post('/create', checkRequiredFields(['title', 'description', 'roomName', 'groupId', 'startDate', 'endDates']), async (req, res) => {
  sendResponse(res, await requestsModel.createRequest({
    title: req.body.title,
    description: req.body.description,
    roomName: req.body.roomName,
    groupId: req.body.groupId,
    endDate: req.body.endDate,
    startDate: req.body.startDate,
    approvers: req.body.approvers,
  }, req.user));
});
router.use('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || !isFinite(id)) {
    sendResponse(res, {
      status: 400,
      message: 'Invalid id.',
    });
    return;
  }
  next();
});
router.get('/:id', async (req, res) => {
  sendResponse(res, await requestsModel.getRequest(parseInt(req.params.id), req.user));
});
router.delete('/:id', async (req, res) => {
  sendResponse(res, await requestsModel.setRequestStatus(parseInt(req.params.id), req.user, RequestStatus.cancelled));
});
router.put('/:id/approve', permissionMiddleware(PermissionLevel.approver), async (req, res) => {
  sendResponse(res, await requestsModel.approveRequest(parseInt(req.params.id)));
});
router.put('/:id/deny', permissionMiddleware(PermissionLevel.approver), async (req, res) => {
  sendResponse(res, await requestsModel.setRequestStatus(parseInt(req.params.id), req.user, RequestStatus.denied));
});
router.put('/:id', async (req, res) => {
  sendResponse(res, await requestsModel.updateRequest({
    id: parseInt(req.params.id),
    title: req.body.title,
    description: req.body.description,
    roomName: req.body.roomName,
    groupId: req.body.groupId,
    endDate: req.body.endDate,
    startDate: req.body.startDate,
    approvers: req.body.approvers,
  }, req.user));
});

export default router;