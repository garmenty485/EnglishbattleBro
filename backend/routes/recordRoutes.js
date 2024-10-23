import express from 'express';
import { createRecord, getBattleRecord } from '../controllers/recordController.js';

const router = express.Router();

router.post('/', createRecord);

export default router;