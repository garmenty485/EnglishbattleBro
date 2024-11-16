import express from 'express';
import { createRecord, getUserRecords } from '../controllers/recordController.js';

const router = express.Router();

router.post('/', createRecord);
router.get('/user/:googleId', getUserRecords);

export default router;