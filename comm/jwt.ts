import jwt from 'jsonwebtoken';

interface UserType {
  id: number | undefined;
  userId: string;
  created_at: string;
}

interface TokenItem {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT 토큰 생성(Refresh token, access token)
 *
 * @param {Object} user 사용자 정보
 * @returns 생성된 access token, refresh token 반환
 */
export const generateToken = (user: UserType): TokenItem => {
  return {
    accessToken: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
      expiresIn: '15m',
    }),
    refreshToken: jwt.sign(
      user,
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
      {
        expiresIn: '7d',
      }
    ),
  };
};

/**
 * 토큰이 유효한지 확인
 
 * @param {String} token 검사하려는 토큰
 * @param {String} key 토큰 키
 * @returns 복호화 된 토큰 반환
 */
export const verifyToken = (
  token: string | undefined,
  key: string | undefined
): UserType => {
  try {
    console.log('>>>>>>>> JWT Verify Start', token);
    return jwt.verify(token as string, key as string) as UserType;
  } catch (error) {
    console.log('>>>>>>>> JWT Verify Error:', error);
    throw new Error('Invalid refresh token');
  }
};

/**
 * 주어진 토큰을 복호화하여 정보 반환
 *
 * @param {String} token Token
 * @returns jwt의 payload 반환
 */
export const decodedToken = (token: string): string => {
  try {
    const decoded = jwt.decode(token);
    if (decoded === null || typeof decoded !== 'string') {
      throw new Error('Invalid access token');
    }
    return decoded;
  } catch (error) {
    console.log('>>>>>>>> JWT Decode Error:', error);
    throw new Error('Invalid access token');
  }
};
