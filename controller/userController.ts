import { generateToken, verifyToken } from '../comm/jwt';
import { compareSync } from 'bcrypt';
import tbl_users from '../public/database/models/tbl_users';
import { isEmpty } from '../comm/utils';
import tbl_default_keywords from '../public/database/models/tbl_default_keywords';
import tbl_keywords from '../public/database/models/tbl_keywords';
import { Request, Response } from 'express';
import cookie from 'cookie';

export async function postLogin(req: Request, res: Response): Promise<void> {
  try {
    // ID로 유저 정보 조회
    const user = await tbl_users.findOne({
      where: { userId: req.body.userId },
      attributes: ['id', 'userId', 'password', 'createdAt'],
    });
    // 유저 정보가 존재하지 않는 경우 404 Not Found
    if (isEmpty(user)) {
      res.status(404).json({
        status: 404,
        message: '유저 정보를 찾을 수 없습니다.',
        messageDev: '유저 정보 조회 실패: 유저 정보가 존재하지 않음.',
      });
      return;
    }
    const userData = user?.get({ plain: true });
    // 사용자가 전달한 비밀번호와 데이터베이스 비밀번호 정보가 일치하는 지 확인
    if (compareSync(req.body.password, userData.password)) {
      const tokensInfomation = {
        id: userData.id,
        userId: userData.userId,
        created_at: userData.created_at,
      };
      const tokens = generateToken(tokensInfomation);
      const accessToken = tokens.accessToken;

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', String(tokens.refreshToken), {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
          httpOnly: true, // 클라이언트에서 접근할 수 없게
          secure: true, // HTTPS 연결에서만 설정
          path: '/', // 쿠키가 유효한 경로
          sameSite: 'none', // 크로스 사이트에서 쿠키를 보낼 수 있도록 설정
        })
      );
      res.status(200).json({
        status: 200,
        message: 'success',
        messageDev: '유저 정보 조회 성공',
        data: {
          accessToken: accessToken,
        },
      });
      return;
    } else if (!compareSync(req.body.password, userData.password)) {
      // 비밀번호가 일치하지 않는 경우 401 Unauthorized
      res.status(401).json({
        status: 401,
        message: '비밀번호가 일치하지 않습니다.',
        messageDev: '유저 정보 조회 실패: 비밀번호 불일치',
      });
      return;
    }
  } catch (error) {
    console.log('>>>>>>>> 유저정보 조회 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message:
        '유저정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '유저 정보 조회 실패: 조회 중 오류 발생',
    });
  }
}

// export async function postLogout(params) {}

export async function postUser(req: Request, res: Response): Promise<void> {
  try {
    const response = await tbl_default_keywords.findAll();
    const user: any = await tbl_users.create(req.body, {
      ignoreDuplicates: true,
    });
    if (!isEmpty(response)) {
      // `keyword`만 추출
      const keywords = response.map((el) => {
        return { keyword: el.dataValues.keyword, id: user?.id };
      });
      await tbl_keywords.bulkCreate(keywords);
    }
    res.status(201).json({
      status: 201,
      message: 'success',
      messageDev: '유저 등록 성공',
      data: user,
    });
  } catch (error) {
    console.log('>>>>>>>> 유저 등록 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '유저 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '유저 등록 실패',
    });
  }
}

export async function putUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await tbl_users.findOne({
      where: { userId: req.body.userId },
      attributes: ['id', 'password', 'updatedAt'],
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: '유저 정보를 찾을 수 없습니다.',
        messageDev: '유저 정보 수정 실패',
      });
    } else {
      // 아이디는 변경할 수 없습니다.
      await user.update({
        password: req.body.password,
        updated_at: new Date(),
      });
      res.status(200).json({
        status: 200,
        message: 'success',
        messageDev: '유저 정보 수정 성공',
        data: user,
      });
    }
  } catch (error) {
    console.log('>>>>>>>> 유저 정보 수정 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message:
        '유저 정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '유저 정보 수정 실패',
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const user = await tbl_users.findOne({
      where: { userId: req.query.userId },
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: '유저 정보를 찾을 수 없습니다.',
        messageDev: '유저 정보 삭제 실패',
      });
    } else {
      await user.destroy();
      res.status(200).json({
        status: 200,
        message: 'success',
        messageDev: '유저 정보 삭제 성공',
      });
    }
  } catch (error) {
    console.log('>>>>>>>> 유저 정보 삭제 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message:
        '유저 정보 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '유저 정보 삭제 실패',
    });
  }
}

export function checkAuth(req: Request, res: Response): void {
  try {
    if (
      isEmpty(req.headers.authorization) ||
      !req?.headers?.authorization?.startsWith('Bearer ')
    ) {
      throw new Error(
        "Bearer access token doesn't exist or is not in Bearer format."
      );
    }
    const accessToken = req.headers.authorization?.split(' ')[1];
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: 'OAuth Access Token 유효성 검증 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> OAuth Refresh Token 통신 중 오류 발생', error);
    res.status(403).json({
      status: 403,
      message: '유효하지 않은 세션입니다.',
      messageDev: 'OAuth Refresh Token 통신 실패',
    });
  }
}

export async function silentRefresh(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;
    // 리프래시 토큰이 유효한지 검증 및 복호화
    const decodedValue = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );

    const tokensInfomation = {
      id: decodedValue.id,
      userId: decodedValue.userId,
      created_at: decodedValue.created_at,
    };
    // 토큰 정보로 새로운 access token, refresh token 발행
    const tokens = generateToken(tokensInfomation);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', tokens.refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
        httpOnly: true, // 클라이언트에서 접근할 수 없게
        secure: true, // HTTPS 연결에서만 설정
        path: '/', // 쿠키가 유효한 경로
        sameSite: 'none', // 크로스 사이트에서 쿠키를 보낼 수 있도록 설정
      })
    );

    // 엑세스 토큰 반환
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: 'OAuth Refresh Token 발행 성공(RTR)',
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.log('>>>>>>>> OAuth Refresh Token 발행 중 오류 발생', error);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true, // 클라이언트에서 접근할 수 없게
        secure: true, // HTTPS 연결에서만 설정
        path: '/', // 쿠키가 유효한 경로
        sameSite: 'none', // 크로스 사이트에서 쿠키를 보낼 수 있도록 설정
      })
    );
    res.status(409).json({
      status: 409,
      message: '세션이 만료되었습니다. 다시 로그인 해 주세요.',
      messageDev: 'OAuth Refresh Token 발행 실패',
    });
  }
}
