import express from 'express';
import accounts from './accounts';
import groups from './groups';
import requests from './requests';
import rooms from './rooms';

const router = express.Router();

router.use('/accounts', accounts);
router.use('/groups', groups);
router.use('/rooms', rooms);
router.use('/requests', requests);

export default router;
