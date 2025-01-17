// controllers/newsController.js
import { launch } from "puppeteer";
import { waitForTimeout } from "../comm/utils.js";

/**
 * 요청 유효성 검사
 * @param {Object} req - 요청 정보
 * @param {Object} res - 응답 정보
 * @returns {boolean} - 유효성 검사 통과 여부
 */
const validateRequest = (req, res) => {
  const { queries, startDate, endDate } = req.query;
  if (!queries) {
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
export async function getNews(req, res) {
  if (!validateRequest(req, res)) return;
  const { queries, startDate, endDate } = req.query;

  // 검색 URL 생성
  const searchUrls = queries.split(",").map((query) => {
    return `https://search.naver.com/search.naver?where=news&query=${query}&ds=${startDate}&de=${endDate}&sort=0&field=0&photo=0&nso=so%3Ar%2Cp%3Afrom${startDate.replace(
      /\./g,
      ""
    )}to${endDate.replace(/\./g, "")}`;
  });

  try {
    const browser = await launch({
      headless: true,
      defaultViewport: false,
      args: ["--start-maximized"],
    });
    const maxScrollAttempts = 10;
    const maxConcurrentTabs = 2; // 최대 탭 개수(두개 이상 설정 시 검색이 제대로 이루어지지 않음..)
    const allNews = [];

    /**
     * 단일 탭에서 크롤링 작업 수행
     * @param {string} url - 크롤링할 URL
     * @returns {Array} - 크롤링된 뉴스 데이터
     */
    const processTab = async (url) => {
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
      console.log(`크롤링 시작: ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForSelector("#main_pack", {
        visible: true,
        timeout: 60000,
      });
      let scrollAttempts = 0;
      let previousHeight = await page.evaluate(
        () => document.body.scrollHeight
      );

      while (scrollAttempts <= maxScrollAttempts) {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await waitForTimeout(800); // 스크롤 로딩 대기
        const newHeight = await page.evaluate(() => document.body.scrollHeight);
        console.log(
          `스크롤 시도 #${scrollAttempts + 1}, ${previousHeight}, ${newHeight}`
        );
        if (previousHeight === newHeight) {
          break;
        }

        previousHeight = newHeight;
        scrollAttempts += 1;
      }

      const queryParam = url.match(/query=([^&]*)/);
      const query = queryParam[1]
        .split(",")
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(",");

      // 뉴스 데이터 추출
      const newsList = await page.evaluate((keyword) => {
        const newsItems = [];
        document.querySelectorAll("#main_pack .list_news .bx").forEach((el) => {
          const newsType = "네이버뉴스";
          const source =
            el.querySelector(".info_group .press")?.innerText || "";
          const title = el.querySelector(".news_tit")?.innerText || "";
          const link = el.querySelector(".news_tit")?.href || "";
          const description = el.querySelector(".news_dsc")?.innerText || "";
          const date = el.querySelector(".info_group .date")?.innerText || "";
          if (title && link) {
            newsItems.push({
              newsType,
              keyword,
              source,
              title,
              link,
              description,
              date,
            });
          }
        });
        return newsItems;
      }, query);

      await page.close();
      return newsList;
    };

    // 병렬 실행 제한을 적용하여 URL 처리
    for (let i = 0; i < searchUrls.length; i += maxConcurrentTabs) {
      const batchUrls = searchUrls.slice(i, i + maxConcurrentTabs);
      const batchResults = await Promise.all(batchUrls.map(processTab));
      allNews.push(...batchResults.flat());
    }

    await browser.close();

    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "뉴스 데이터 크롤링 성공",
      data: allNews,
    });
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
    res.status(500).json({
      status: 500,
      message: "크롤링 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: "크롤링 오류 발생",
    });
  }
}
