import { Router } from 'express';
import { checkRequiredFields, routeNotImplemented, sendResponse } from '../utils';
import groupsModel from '../../models/groupsModel';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await groupsModel.getGroups(req.user));
});
router.post('/create', checkRequiredFields(['name']), async (req, res) => {
  sendResponse(res, await groupsModel.createGroup(req.body.name, req.user));
});
router.use('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || !isFinite(id)) {
    res.statusCode = 400;
    res.json({ message: 'Invalid group ID.' });
    return;
  }
  next();
});
router.get('/:id',  async (req, res) => {
  sendResponse(res, await groupsModel.getGroup(parseInt(req.params.id), req.user));
});
router.post('/:id/changerole', checkRequiredFields(['role', 'utorid']), async (req, res) => {
  sendResponse(res, await groupsModel.changeRole(parseInt(req.params.id), req.body.role, req.body.utorid, req.user));
});
router.post('/:id/invite', checkRequiredFields(['utorid']), async (req, res) => {
  sendResponse(res, await groupsModel.invite(parseInt(req.params.id), req.body.utorid, req.user));
});
router.post('/:id/invite/accept', async (req, res) => {
  sendResponse(res, await groupsModel.acceptInvite(parseInt(req.params.id), req.user));
});
router.post('/:id/invite/reject', async (req, res) => {
  sendResponse(res, await groupsModel.rejectInvite(parseInt(req.params.id), req.user));
});
router.post('/:id/remove', async (req, res) => {
  sendResponse(res, await groupsModel.removeMember(parseInt(req.params.id), req.body.utorid, req.user));
});
router.delete('/:id', async (req, res) => {
  sendResponse(res, await groupsModel.deleteGroup(parseInt(req.params.id), req.user));
});
export default router;