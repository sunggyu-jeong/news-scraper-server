const { hashedPassword } = require("../comm/utils");
const { tbl_users } = require("../public/database/models");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
  try {
    // ID로 유저 정보 조회
    const user = await tbl_users.findOne({
      where: { user_id: req.query.user_id },
    });
    // 비밀번호와 데이터베이스 정보가 일치하는 지 확인
    if (bcrypt.compareSync(req.query.password, user.password)) {
      res.status(200).json({
        status: 200,
        message: "success",
        messageDev: "유저 정보 조회 성공",
        data: user,
      });
    } else if (!bcrypt.compareSync(req.query.password, user.password)) {
      // 비밀번호가 일치하지 않는 경우 401 Unauthorized
      res.status(401).json({
        status: 401,
        message: "비밀번호가 일치하지 않습니다.",
        messageDev: "비밀번호 조회 실패",
      });
    } else {
      // ID가 존재하지 않는 경우 404 Not Found
      res.status(404).json({
        status: 404,
        message: "유저 정보를 찾을 수 없습니다.",
        messageDev: "유저 정보 조회 실패",
      });
    }
  } catch (error) {
    console.log(">>>>>>>> 유저정보 조회 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message:
        "유저정보 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "유저 정보 조회 실패",
    });
  }
};

exports.postUser = async (req, res) => {
  try {
    const user = await tbl_users.create(req.body);
    res.status(201).json({
      status: 201,
      message: "success",
      messageDev: "유저 등록 성공",
      data: user,
    });
  } catch (error) {
    console.log(">>>>>>>> 유저 등록 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message: "유저 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "유저 등록 실패",
    });
  }
};

exports.putUser = async (req, res) => {
  try {
    const user = await tbl_users.findOne({
      where: { user_id: req.body.user_id },
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: "유저 정보를 찾을 수 없습니다.",
        messageDev: "유저 정보 수정 실패",
      });
    } else {
      // 아이디는 변경할 수 없습니다.
      await user.update({
        password: req.body.password,
        updated_at: new Date(),
      });
      res.status(200).json({
        status: 200,
        message: "success",
        messageDev: "유저 정보 수정 성공",
        data: user,
      });
    }
  } catch (error) {
    console.log(">>>>>>>> 유저 정보 수정 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message:
        "유저 정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "유저 정보 수정 실패",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await tbl_users.findOne({
      where: { user_id: req.query.user_id },
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: "유저 정보를 찾을 수 없습니다.",
        messageDev: "유저 정보 삭제 실패",
      });
    } else {
      await user.destroy();
      res.status(200).json({
        status: 200,
        message: "success",
        messageDev: "유저 정보 삭제 성공",
      });
    }
  } catch (error) {
    console.log(">>>>>>>> 유저 정보 삭제 중 오류 발생", error);
    res.status(500).json({
      status: 500,
      message:
        "유저 정보 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      messageDev: "유저 정보 삭제 실패",
    });
  }
};
