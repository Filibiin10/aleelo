import express from 'express';
import {
  registerDomainHandler,
  transferDomainHandler,
  getAccountBalanceHandler,
  searchDomainHandler,
  getPackageTypesHandler,
  mockAddDomainHandler,
  renewDomainHandler
} from '../controllers/domainController.js';

const router = express.Router();

router.post('/register', registerDomainHandler);
router.post('/transfer', transferDomainHandler);
router.get('/balance', getAccountBalanceHandler);
router.get('/search/:domain', searchDomainHandler);
router.get('/package-types', getPackageTypesHandler);
router.post('/mock/add-domain/', mockAddDomainHandler);
router.post('/renew', renewDomainHandler);

export default router;
