import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ACCESS_TOKEN_SECRET_KEY } from "../secret.js";

config();

export const verifyAccessToken = (req, res, next) => {
  try {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      ACCESS_TOKEN_SECRET_KEY
    );
    return next();
  } catch (error) {
    console.log(">>>>>>>> JWT Verify Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        message: "만료된 엑세스 토큰입니다.",
        messageDev: "JWT Verify Error: TokenExpiredError",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 401,
        message: "유효하지 않은 엑세스 토큰입니다.",
        messageDev: "JWT Verify Error: JsonWebTokenError",
      });
    }
  }
};
