import express from 'express';
import { ENV } from '../config/env.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/env', (req, res) => {
  res.json({
    NODE_ENV: ENV.NODE_ENV,
    DATABASE_URL: ENV.DATABASE_URL ? 'SET' : 'NOT SET',
    API_URL: ENV.API_URL,
    JWT_SECRET: ENV.JWT_SECRET ? 'SET' : 'NOT SET',
    PORT: ENV.PORT
  });
});

router.get('/test-token', (req, res) => {
  const testToken = generateToken(1, 'faculty');
  res.json({
    tokenGenerated: 'SUCCESS',
    sampleToken: testToken
  });
});

export default router;
