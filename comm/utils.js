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
