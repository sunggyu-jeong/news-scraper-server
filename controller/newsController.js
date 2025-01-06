/* eslint-disable import/order */
/* eslint-disable import/extensions */
/* eslint-disable no-await-in-loop */
// controllers/newsController.js
const { waitForTimeout } = require("../comm/utils");
const puppeteer = require("puppeteer");

/**
 * 요청 유효성 검사
 * @param {Object} req - 요청 정보
 * @param {Object} res - 응답 정보
 * @returns {boolean} - 유효성 검사 통과 여부
 */
const validateRequest = (req, res) => {
  const { query, startDate, endDate } = req.query;
  if (!query) {
    res.status(400).json({
      status: 400,
      message: "검색어를 입력하세요.",
      messageDev: "사용자의 검색어 입력 오류",
    });
    return false;
  }

  if (!startDate || !endDate) {
    res.status(400).json({
      status: 400,
      message: "검색 시작일과 종료일을 입력하세요.",
      messageDev: "날짜 필터 입력 누락",
    });
    return false;
  }

  return true;
};

/**
 * 뉴스 크롤링 로직
 * @param {Object} req - 요청 정보
 * @param {Object} res - 응답 정보
 */
exports.getNews = async (req, res) => {
  if (!validateRequest(req, res)) return;
  const { query, startDate, endDate } = req.query;
  // 날짜 필터 적용
  const searchUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(
    query
  )}&ds=${startDate}&de=${endDate}&sort=0&field=0&photo=0&nso=so%3Ar%2Cp%3Afrom${startDate}to${endDate}`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log(">>>>>>>> searchUrl", searchUrl);
    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    let scrollAttempts = 0;
    const maxScrollAttempts = 1;

    let previousHeight = await page.evaluate(() => document.body.scrollHeight);
    while (scrollAttempts <= maxScrollAttempts) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await waitForTimeout(1000); // 스크롤 로딩 대기
      const newHeight = await page.evaluate(() => document.body.scrollHeight);

      console.log(
        ">>>>>>>> previeousHeight and newHeight",
        previousHeight,
        newHeight
      );
      previousHeight = newHeight;
      scrollAttempts += 1;
      if (scrollAttempts > maxScrollAttempts) {
        console.error("너무 많은 스크롤링이 감지되어 중지되었습니다.");
        break;
      }
    }

    console.log(">>>>>>>> newsList", page);
    // 뉴스 데이터 추출
    const newsList = await page.evaluate(() => {
      const newsItems = [];
      document.querySelectorAll("#main_pack .list_news .bx").forEach((el) => {
        const title = el.querySelector(".news_tit")?.innerText || "";
        const link = el.querySelector(".news_tit")?.href || "";
        const description = el.querySelector(".news_dsc")?.innerText || "";
        const source = el.querySelector(".info_group .press")?.innerText || "";
        const date = el.querySelector(".info_group .info")?.innerText || "";
        if (title && link) {
          newsItems.push({ title, link, description, source, date });
        }
      });
      return newsItems;
    });

    await browser.close();
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "뉴스 데이터 크롤링 성공",
      data: newsList,
    });
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
    res.status(500).json({
      status: 500,
      message: "크롤링 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: "크롤링 오류 발생",
    });
  }
};
