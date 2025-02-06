import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { isEmpty } from '../comm/utils.js';
import { NextFunction, Request, Response } from 'express';

config();

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log('>>>>>>>> JWT Verify Start', req.headers.authorization);
    if (
      isEmpty(req.headers.authorization) ||
      !req?.headers?.authorization?.startsWith('Bearer ')
    ) {
      throw new Error(
        "Bearer access token doesn't exist or is not in Bearer format."
      );
    }
    jwt.verify(
      req.headers.authorization.split(' ')[1] || 'Bearer ',
      process.env.ACCESS_TOKEN_SECRET_KEY as string
    );
    return next();
  } catch (error) {
    console.log('>>>>>>>> JWT Verify Error:', error);
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage =
        error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError'
          ? `JWT Verify Error: ${error.name}`
          : "JWT Verify Error: access token doesn't exist";
    } else {
      console.error('크롤링 중 알 수 없는 오류 발생:', error);
      errorMessage = '크롤링 중 알 수 없는 오류 발생';
    }

    next({
      status: 403,
      message: '유효하지 않은 세션입니다.',
      messageDev: errorMessage,
    });
  }
};
