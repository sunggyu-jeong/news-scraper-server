import { Request, Response } from 'express';
import puppeteer from 'puppeteer-core';
import { waitForTimeout } from '../comm/utils';

interface NewsItem {
  newsType: string;
  keyword: string;
  source: string;
  title: string;
  link: string;
  description: string;
  date: string;
}

/**
 * 요청 유효성 검사
 * @param {Object} req - 요청 정보
 * @param {Object} res - 응답 정보
 * @returns {boolean} - 유효성 검사 통과 여부
 */
const validateRequest = (req: Request, res: Response): boolean => {
  const queries = req.query.queries as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  if (!queries) {
    res.status(400).json({
      status: 400,
      message: '검색어를 입력하세요.',
      messageDev: '사용자의 검색어 입력 오류',
    });
    return false;
  }

  if (!startDate || !endDate) {
    res.status(400).json({
      status: 400,
      message: '검색 시작일과 종료일을 입력하세요.',
      messageDev: '날짜 필터 입력 누락',
    });
    return false;
  }

  return true;
};

/**
 * <네이버뉴스> 검색하려는 URL 정렬
 *
 * @param {string} queries 검색어
 * @param {String} startDate 검색 시작일
 * @param {string} endDate 검색 종료일
 * @returns {Array<string>} 검색 URL 목록 반환
 */
const generateSearchUrls = (queries: string, startDate: string, endDate: string): Array<string> => {
  return queries.split(',').map((query) => {
    return `https://search.naver.com/search.naver?where=news&query=${query}&ds=${startDate}&de=${endDate}&sort=0&field=0&photo=0&nso=so%3Ar%2Cp%3Afrom${startDate.replace(
      /\./g,
      ''
    )}to${endDate.replace(/\./g, '')}`;
  });
};

/**
 * 페이지의 맨 아래에 도달하거나 최대 스크롤 시도 횟수에 도달할 때까지 더 많은 콘텐츠를 로드하기 위해 페이지를 스크롤
 *
 * @param {any} page - 스크롤할 Puppeteer 페이지 객체.
 * @param {number} [maxScrollAttempts=15] - 최대 스크롤 시도 횟수. 서버 부하를 막기 위해 디폴트 14(최대 150개의 데이터만 조회되게) 설정
 * @returns {Promise<void>} - 스크롤이 완료되면 resolve되는 Promise.
 */
const scrollPageToLoad = async (page: any, maxScrollAttempts: number = 14): Promise<void> => {
  let scrollAttempts = 0;

  while (scrollAttempts < maxScrollAttempts) {
    // 페이지 로딩 상태를 확인
    await page.waitForFunction(() => document.readyState === 'complete');

    // 스크롤을 끝까지 내리기
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await waitForTimeout(300);
    // 로딩 인디케이터의 display 상태가 'none'으로 변경되었는지 확인
    const isLoadingFinished = await page.evaluate(() => {
      const loadingElement = document.querySelector('.mod_more_wrap2.type_loading._infinite_loading');
      if (loadingElement) {
        const style = window.getComputedStyle(loadingElement);
        return style.display === 'none';
      }
      return false;
    });

    if (isLoadingFinished) {
      console.log('>>>>>>>>>>>> 전체 뉴스 컨텐츠의 로딩이 완료되었습니다.');
      break;
    }

    scrollAttempts++;
    if (scrollAttempts >= maxScrollAttempts) {
      console.log('>>>>>>>>>>>> 최대 스크롤 한도에 도달했습니다. 검색 요청을 종료합니다.');
    }
  }
};

/**
 * 뉴스 데이터를 크롤링하기 위해 브라우저의 탭 처리
 *
 * @param {object} browser - Puppeteer 브라우저 인스턴스.
 * @param {string} url - 스크랩할 페이지의 URL.
 * @returns {Promise<Array>} - 뉴스 데이터 배열로 resolve되는 Promise.
 */
const processTab = async (browser: any, url: string): Promise<NewsItem[]> => {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setRequestInterception(true);
  page.on('request', (req: any) => {
    const resourceType = req.resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
      req.abort();
      return;
    }
    // 광고 및 트래킹 관련 URL 패턴 차단
    if (/adservice|doubleclick|analytics/i.test(url)) {
      req.abort();
      return;
    }
    req.continue();
  });
  console.log(`크롤링 시작: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // 크롬 환경에서 페이지 로딩이 완료되기를 기다림.(최대 1분)
  await page.waitForSelector('#main_pack', { visible: true, timeout: 60000 });

  // 페이지 스크롤링
  await scrollPageToLoad(page);

  // 쿼리 파라미터 추출 >> 검색어만 별도로 가져오기 위한 설정
  const queryParam = url.match(/query=([^&]*)/)?.[1] || '';
  const query = queryParam
    .split(',')
    .filter((value, index, self) => self.indexOf(value) === index)
    .join(',');

  // 뉴스 데이터 추출
  const newsList = await extractNewsData(page, query);

  await page.close();
  return newsList;
};

/**
 * 스크롤이 완료된 페이지에서 제공된 정보를 기반으로 뉴스 데이터 추출
 *
 * @param {object} page - 스크롤이 완료된 Puppeteer 페이지 객체.
 * @param {string} keyword - 검색 키워드 정보
 * @returns {Promise<Array>} 뉴스 내 원하는 정보반 추출한 배열
 *
 *   - {string} newsType - 뉴스 유형
 *   - {string} keyword - 검색 키워드
 *   - {string} source - 뉴스 출처
 *   - {string} title - 뉴스 제목
 *   - {string} link - 뉴스 링크
 *   - {string} description - 뉴스 설명
 *   - {string} date - 뉴스 날짜
 */
const extractNewsData = async (page: any, keyword: string): Promise<Array<NewsItem>> => {
  return await page.evaluate((keyword: string) => {
    const newsItems: Array<NewsItem> = [];

    document.querySelectorAll(
      '#main_pack .list_news._infinite_list .sds-comps-text-type-headline1'
    ).forEach(span => {
      let card: HTMLElement | null = span.parentElement as HTMLElement | null;
      while (card && !card.querySelector('.sds-comps-profile-info-title-text')) {
        card = card.parentElement;
      }
      if (!card) return;
      const title = span.textContent?.trim();
      const link  = (span.closest('a') as HTMLAnchorElement)?.href ?? '';
      const source = card.querySelector('.sds-comps-profile-info-title-text')?.textContent?.trim() ?? '';
      const description = card.querySelector('.sds-comps-text-type-body1')?.textContent?.trim() ?? '';
      const date = card.querySelector('.sds-comps-profile-info-subtext')?.textContent?.trim() ?? '';
    
      if (title && link) {
        newsItems.push({
          newsType: '네이버뉴스',
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
  }, keyword);
};

// 뉴스 데이터를 크롤링하는 메소드
export async function getNews(req: Request, res: Response): Promise<void> {
  if (!validateRequest(req, res)) return;
  const queries = req.query.queries as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  // 검색 URL 생성
  const searchUrls = generateSearchUrls(queries, startDate, endDate);

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BROWSERLESS_TOKEN,
      defaultViewport: null,
    });

    // 최대 탭 개수
    const maxConcurrentTabs = 5;
    const allNews: NewsItem[] = [];

    // 병렬 실행 제한을 적용하여 URL 처리
    for (let i = 0; i < searchUrls.length; i += maxConcurrentTabs) {
      const batchUrls = searchUrls.slice(i, i + maxConcurrentTabs);
      const batchResults = await Promise.allSettled(batchUrls.map((url) => processTab(browser, url)));
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          allNews.push(...result.value);
        } else {
          console.error('탭 처리 중 오류:', result.reason);
        }
      });
    }
    await browser.close();

    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '뉴스 데이터 크롤링 성공',
      data: allNews,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('크롤링 중 오류 발생:', error.message, error.stack);
    } else {
      console.error('크롤링 중 알 수 없는 오류 발생:', error);
    }
    res.status(500).json({
      status: 500,
      message: '크롤링 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      error: '크롤링 오류 발생',
    });
  }
}
