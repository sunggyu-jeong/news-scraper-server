import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../secret.js";

/**
 * JWT 토큰 생성(Refresh token, access token)
 *
 * @param {Object} user 사용자 정보
 * @returns 생성된 access token, refresh token 반환
 */
export const generateToken = (user) => {
  return {
    accessToken: jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "15m",
    }),
    refreshToken: jwt.sign(user, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: "7d",
    }),
  };
};

/**
 * 토큰이 유효한지 확인
 *
 * @param {String} token 검사하려는 토큰
 * @param {String} key 토큰 키
 * @returns 복호화 된 토큰 반환
 */
export const verifyToken = (token, key) => {
  try {
    console.log(">>>>>>>> JWT Verify Start", token, key);
    return jwt.verify(token, key);
  } catch (error) {
    console.log(">>>>>>>> JWT Verify Error:", error);
    throw new Error("Invalid refresh token");
  }
};

/**
 * 주어진 토큰을 복호화하여 정보 반환
 *
 * @param {String} token Token
 * @returns jwt의 payload 반환
 */
export const decodedToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.log(">>>>>>>> JWT Decode Error:", error);
    throw new Error("Invalid access token");
  }
};
