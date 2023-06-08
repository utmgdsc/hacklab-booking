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

router.get('/', (req, res) => {
  res.statusCode = 200;
  res.json({
    name: req.user.name,
    utorid: req.user.utorid,
    email: req.user.email,
    role: req.user.role,
    theme: req.user.theme,
  });
});
router.post('/changetheme', checkRequiredFields(['theme']), async (req, res) => {
  sendResponse(res, await accountsModel.changeTheme(req.user, req.body.theme));
});
router.get('/:utorid', permissionMiddleware(PermissionLevel.staff), async (req, res) => {
  sendResponse(res, await accountsModel.getUser(req.params.utorid));
});

router.put('/:utorid/changerole', permissionMiddleware(PermissionLevel.admin), checkRequiredFields(['role']), async (req, res) => {
  sendResponse(res, await accountsModel.changeRole(req.params.utorid, req.body.role));
});

export default router;