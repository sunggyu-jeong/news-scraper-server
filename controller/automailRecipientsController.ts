import axios from 'axios';
import { isValidEmail } from '../comm/utils';
import tbl_automail_recipients from '../public/database/models/tbl_automail_recipients';
import { Request, Response } from 'express';

export async function getAutomailRecipients(req: Request, res: Response) {
  try {
    const users = await tbl_automail_recipients.findAll();
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '수신자 조회 성공',
      data: users.map((el) => el.get({ plain: true })),
    });
  } catch (error) {
    console.log('>>>>>>>> 수신자 조회 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '수신자 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '수신자 조회 실패',
    });
  }
}

export async function postAutomailRecipients(req: Request, res: Response) {
  try {
    if (!isValidEmail(req.body.email)) {
      res.status(404).json({
        status: 404,
        message: '유효하지 않은 이메일 주소입니다.',
        messageDev: '사용자의 이메일 주소 입력 오류',
      });
      return;
    }
    const response = await tbl_automail_recipients.create(req.body, {
      ignoreDuplicates: true,
    });
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>디버깅 로그',
      response,
      req.body
    );
    res.status(201).json({
      status: 201,
      message: 'success',
      messageDev: '수신자 생성 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 수신자 생성 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '수신자 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '수신자 생성 실패',
    });
  }
}

export async function putAutomailRecipients(req: Request, res: Response) {
  try {
    if (!isValidEmail(req.body.nEmail)) {
      res.status(404).json({
        status: 404,
        message: '유효하지 않은 이메일 주소입니다.',
        messageDev: '사용자의 이메일 주소 입력 오류',
      });
      return;
    }
    const user = await tbl_automail_recipients.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: '수신자를 찾을 수 없습니다.',
        messageDev: '수신자 조회 실패: 수신자 정보가 존재하지 않음.',
      });
      return;
    }
    await user.update({
      name: req.body.nName,
      email: req.body.nEmail,
      recipientType: req.body.nRecipientType,
      updatedAt: new Date(),
    });
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '수신자 수정 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 수신자 수정 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '수신자 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '수신자 수정 실패',
    });
  }
}

export async function deleteAutomailRecipients(req: Request, res: Response) {
  try {
    const user = await tbl_automail_recipients.findOne({
      where: { email: req.query.email },
    });
    if (!user) {
      res.status(404).json({
        status: 404,
        message: '수신자 삭제 요청이 실패했습니다.',
        messageDev: '수신자 삭제 실패: 삭제하려는 수신자 조회 실패',
      });
      return;
    }
    await user.destroy();
    res.status(200).json({
      status: 200,
      message: 'success',
      messageDev: '수신자 삭제 성공',
    });
  } catch (error) {
    console.log('>>>>>>>> 수신자 삭제 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '수신자 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '수신자 삭제 실패',
    });
  }
}

export async function manualBatch(req: Request, res: Response) {
  try {
    console.log('>>>>>>>>>>>>> 수동 배치 실행 요청', req.body.jobName, process.env.BATCH_INTERNAL_URL);
    const response = await axios.post(
      `${process.env.BATCH_INTERNAL_URL}/api/batchjob/manual/run`, req.body.jobName
    );
    res.status(200).json({
      status: 200,
      message: '수동 배치 실행 성공',
      data: response.data,
    });
  } catch(error) {
    console.log('>>>>>>>>>>>>> 수동 배치 중 오류 발생', error);
    res.status(500).json({
      status: 500,
      message: '수동 배치 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      messageDev: '수동 배치 실패',
    });
  }
}