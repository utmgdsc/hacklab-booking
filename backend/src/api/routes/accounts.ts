import { Router } from 'express';
import accountsModel from '../../models/accountsModel';
import { checkRequiredFields, PermissionLevel, permissionMiddleware, sendResponse } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  sendResponse(res, await accountsModel.getUser(req.user.utorid, req.user));
});
router.post('/changetheme', checkRequiredFields(['theme']), async (req, res) => {
  sendResponse(res, await accountsModel.changeTheme(req.user, req.body.theme));
});

router.put('/webhooks', checkRequiredFields(['webhooks']), async (req, res) => {
  sendResponse(res, await accountsModel.updateWebhooks(req.user, req.body.webhooks));
});

router.put('/webhooks/discord', checkRequiredFields(['webhook']), async (req, res) => {
  sendResponse(res, await accountsModel.updateDiscordWebhook(req.user, req.body.webhook));
});

router.put('/webhooks/slack', checkRequiredFields(['webhook']), async (req, res) => {
  sendResponse(res, await accountsModel.updateSlackWebhook(req.user, req.body.webhook));
});
router.get('/approvers', async (req, res) => {
  sendResponse(res, await accountsModel.getApprovers());
});
router.get('/:utorid', permissionMiddleware(PermissionLevel.staff), async (req, res) => {
  sendResponse(res, await accountsModel.getUser(req.params.utorid, req.user));
});

router.put(
  '/:utorid/changerole',
  permissionMiddleware(PermissionLevel.admin),
  checkRequiredFields(['role']),
  async (req, res) => {
    sendResponse(res, await accountsModel.changeRole(req.params.utorid, req.body.role));
  },
);

export default router;
