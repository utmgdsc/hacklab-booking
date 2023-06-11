import { Router } from 'express';
import {
  checkRequiredFields,
  checkUuidMiddleware,
  routeNotImplemented,
  sendResponse,
} from '../utils';
import groupsModel from '../../models/groupsModel';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await groupsModel.getGroups(req.user));
});
router.post('/create', checkRequiredFields(['name']), async (req, res) => {
  sendResponse(res, await groupsModel.createGroup(req.body.name, req.user));
});
router.use('/:id', checkUuidMiddleware);
router.get('/:id',  async (req, res) => {
  sendResponse(res, await groupsModel.getGroup(req.params.id, req.user));
});
router.post('/:id/changerole', checkRequiredFields(['role', 'utorid']), async (req, res) => {
  sendResponse(res, await groupsModel.changeRole(req.params.id, req.body.role, req.body.utorid, req.user));
});
router.post('/:id/invite', checkRequiredFields(['utorid']), async (req, res) => {
  sendResponse(res, await groupsModel.invite(req.params.id, req.body.utorid, req.user));
});
router.post('/:id/invite/accept', async (req, res) => {
  sendResponse(res, await groupsModel.acceptInvite(req.params.id, req.user));
});
router.post('/:id/invite/reject', async (req, res) => {
  sendResponse(res, await groupsModel.rejectInvite(req.params.id, req.user));
});
router.post('/:id/remove', async (req, res) => {
  sendResponse(res, await groupsModel.removeMember(req.params.id, req.body.utorid, req.user));
});
router.delete('/:id', async (req, res) => {
  sendResponse(res, await groupsModel.deleteGroup(req.params.id, req.user));
});
export default router;