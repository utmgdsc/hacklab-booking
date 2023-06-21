import { Router } from 'express';
import {
  checkRequiredFields,
  PermissionLevel,
  permissionMiddleware,
  routeNotImplemented,
  sendResponse,
} from '../utils';
import accountsModel from '../../models/accountsModel';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await accountsModel.getUser(req.user.utorid, req.user));
});
router.post('/changetheme', checkRequiredFields(['theme']), async (req, res) => {
  sendResponse(res, await accountsModel.changeTheme(req.user, req.body.theme));
});
router.get('/:utorid', permissionMiddleware(PermissionLevel.staff), async (req, res) => {
  sendResponse(res, await accountsModel.getUser(req.params.utorid, req.user));
});

router.put('/:utorid/changerole', permissionMiddleware(PermissionLevel.admin), checkRequiredFields(['role']), async (req, res) => {
  sendResponse(res, await accountsModel.changeRole(req.params.utorid, req.body.role));
});

router.get('approvers', async (req, res) => {
  sendResponse(res, await accountsModel.getApprovers());
});

export default router;