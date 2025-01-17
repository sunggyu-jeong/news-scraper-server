import { verifyToken } from "../comm/jwt.js";
import tbl_default_keywords from "../public/database/models/tbl_default_keywords.js";
import tbl_keywords from "../public/database/models/tbl_keywords.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../secret.js";

export async function getKeywords(req, res) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decryptedAccessToken = verifyToken(
      accessToken,
      ACCESS_TOKEN_SECRET_KEY
    );
    const keywords = await tbl_keywords.findAll({
      where: { id: decryptedAccessToken.id },
      attributes: ["keywordId", "keyword", "createdAt"],
    });
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "키워드 조회 성공",
      data: keywords,
    });
  } catch (error) {
    console.log(">>>>>>>> 키워드 조회 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message: "키워드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "키워드 조회 실패",
    });
  }
}

export async function postKeywords(req, res) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decryptedAccessToken = verifyToken(
      accessToken,
      ACCESS_TOKEN_SECRET_KEY
    );
    const keywords = req.body.map((el) => {
      return { keyword: el, id: decryptedAccessToken.id };
    });
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", keywords);
    await tbl_keywords.bulkCreate(keywords, { ignoreDuplicates: true });
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "키워드 등록 성공",
    });
  } catch (error) {
    console.log(">>>>>>>> 키워드 등록 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message: "키워드 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "키워드 등록 실패",
    });
  }
}

export async function deleteKeywords(req, res) {
  try {
    console.log(
      ">>>>>>>> 키워드 삭제 요청",
      req.query,
      typeof req.query.keywordIds
    );
    const response = await tbl_keywords.destroy({
      where: { keywordId: req.query.keywordIds },
    });
    console.log(">>>>>>>>>>>>>>>>>>>>", response);
    if (response === 0) {
      return res.status(404).json({
        status: 404,
        message: "삭제된 키워드가 없습니다.",
        messageDev: "키워드 삭제 실패: 요청한 삭제 코드가 없음.",
      });
    }
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "키워드 삭제 성공",
    });
  } catch (error) {
    console.log(">>>>>>>> 키워드 삭제 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message: "키워드 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "키워드 삭제 실패",
    });
  }
}

export async function getDefaultKeywords(req, res) {
  try {
    const keywords = await tbl_default_keywords.findAll();
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "기본 키워드 조회 성공",
      data: keywords.map((el) => el.keyword),
    });
  } catch (error) {
    console.log(">>>>>>>> 기본 키워드 조회 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message:
        "기본 키워드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "기본 키워드 조회 실패",
    });
  }
}

export async function postDefaultKeywords(req, res) {
  try {
    const keywords = req.body.map((el) => {
      return { keyword: el };
    });
    await tbl_default_keywords.bulkCreate(keywords, { ignoreDuplicates: true });
    res.status(200).json({
      status: 200,
      message: "success",
      messageDev: "기본 키워드 등록 성공",
    });
  } catch (error) {
    console.log(">>>>>>>> 기본 키워드 등록 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message:
        "기본 키워드 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "기본 키워드 등록 실패",
    });
  }
}
