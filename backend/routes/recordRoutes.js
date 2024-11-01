import express from 'express';
import { createRecord, deleteAllRecords } from '../controllers/recordController.js';

const router = express.Router();

router.post('/', createRecord);
//  router.get('/deleteAll', deleteAllRecords);

export default router;