import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} from "../secret.js";

export const generateToken = (user) => {
  return {
    accessToken: jwt.sign(user, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "1m",
    }),
    refreshToken: jwt.sign(user, REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: "2m",
    }),
  };
};

/**
 * 리프래시 토큰이 유효한지 확인
 *
 * @param {String} token 리프래시 토큰
 * @returns
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
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
