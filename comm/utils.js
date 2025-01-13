import { genSalt, hash } from "bcrypt";

/**
 * 지정된 시간 후에 실행 되는 Promise를 생성합니다.
 *
 * @param {number} timeout - Promise가 해결되기 전에 대기할 밀리초 단위의 시간.
 * @returns {Promise<void>} 지정된 시간 후에 해결되는 Promise.
 *
 */
export const waitForTimeout = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

/**
 * 비밀번호의 암호화를 설정합니다.
 *
 * @param {Number} password 암호화를 진행하려는 비밀번호
 * @returns 암호화된 비밀번호 반환
 */
export const hashedPassword = async (password) => {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  return hash(password, salt);
};
