import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env, allowedOrigins } from './config/env.js';
import router from './routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000 }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Saven InfraOps API running on http://localhost:${env.PORT}/api/health`);
});

export default app;
