import { Request, Response } from 'express';
import { verifyToken } from '../comm/jwt';
import tbl_default_keywords from '../public/database/models/tbl_default_keywords';
import tbl_keywords from '../public/database/models/tbl_keywords';

interface KeywordItem {
  keywordId: number;
  keyword: string;
  createdAt: string;
  updatedAt: string;
  id: number | null;
}

export async function getKeywords(req: Request, res: Response): Promise<void> {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const decryptedAccessToken = verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    const keywords = await tbl_keywords.findAll({
      where: { id: decryptedAccessToken.id },
      attributes: ['keywordId', 'keyword', 'createdAt'],
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '키워드 조회 성공',
      data: keywords,
    });
  } catch (error) {
    console.log('>>>>>>>> 키워드 조회 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '키워드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '키워드 조회 실패',
    });
  }
}

export async function postKeywords(req: Request, res: Response): Promise<void> {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const decryptedAccessToken = verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    const keywords = req.body.map((el: string) => {
      return { keyword: el, id: decryptedAccessToken.id };
    });
    await tbl_keywords.bulkCreate(keywords, { ignoreDuplicates: true });
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '키워드 등록 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 키워드 등록 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '키워드 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '키워드 등록 실패',
    });
  }
}

export async function deleteKeywords(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const response = await tbl_keywords.destroy({
      where: { keywordId: req.query.keywordIds },
    });
    if (response === 0) {
      res.status(404).json({
        status: 404,
        message: '삭제된 키워드가 없습니다.',
        messageDev: '키워드 삭제 실패: 요청한 삭제 코드가 없음.',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '키워드 삭제 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 키워드 삭제 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '키워드 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '키워드 삭제 실패',
    });
  }
}

export async function getDefaultKeywords(
  _: Request,
  res: Response
): Promise<void> {
  try {
    const keywords = await tbl_default_keywords.findAll();
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '기본 키워드 조회 성공',
      data: keywords
        .map((el) => el.get({ plain: true }))
        .map((el: KeywordItem) => el.keyword),
    });
  } catch (error) {
    console.log('>>>>>>>> 기본 키워드 조회 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message:
        '기본 키워드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '기본 키워드 조회 실패',
    });
  }
}

export async function postDefaultKeywords(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keywords = req.body.map((el: string) => {
      return { keyword: el };
    });
    await tbl_default_keywords.bulkCreate(keywords, { ignoreDuplicates: true });
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '기본 키워드 등록 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 기본 키워드 등록 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message:
        '기본 키워드 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '기본 키워드 등록 실패',
    });
  }
}
