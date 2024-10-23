import express from 'express';
import { createRecord } from '../controllers/recordController.js';

const router = express.Router();

// 定义 POST 路由来创建新记录
router.post('/', createRecord);

export default router;