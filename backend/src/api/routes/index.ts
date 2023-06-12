import express from 'express';
import accounts from './accounts';
import groups from './groups';
import rooms from './rooms';
import requests from './requests';

const router = express.Router();

router.use('/accounts', accounts);
router.use('/groups', groups);
router.use('/rooms', rooms);
router.use('/requests', requests);

export default router;
