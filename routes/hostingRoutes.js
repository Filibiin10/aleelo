import express from 'express';
import {
  addHostingPackageHandler,
  addHostingAllowanceHandler,
  getHostingPackageDetailsHandler,
  getStackUserHostingDetailsHandler
} from '../controllers/hostingController.js';

const router = express.Router();

router.post('/add-package', addHostingPackageHandler);
router.post('/add-allowance', addHostingAllowanceHandler);
router.get('/package/:packageId', getHostingPackageDetailsHandler);
router.get('/stack-user/:stackUserId/packages', getStackUserHostingDetailsHandler);


export default router;
