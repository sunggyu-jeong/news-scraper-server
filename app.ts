import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {
  json,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import helmet from 'helmet';
import sequelize from './public/database/models/index';
import automail from './routes/automail';
import keyword from './routes/keyword';
import news from './routes/news';
import user from './routes/user';

dotenv.config();

sequelize
  .sync({ alter:true })
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Error connecting to the database:', err));

const app = express()
  .use(json())
  .use(helmet())
  .use(
    cors({
      origin: [
        'https://news-scraper.pages.dev',
        'http://localhost:8080',
      ],
      credentials: true,
    })
  )
  .use(cookieParser() as any)
  .use('/api', Router().use(news).use(user).use(keyword).use(automail))
  .use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", 'ws://192.168.0.33:8080'],
        },
      },
    })
  )
  .use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 에러 발생:', err);

    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || '서버 내부 오류 발생',
      messageDev: err.messageDev || '알 수 없는 오류 발생',
    });
  });

export default app;
