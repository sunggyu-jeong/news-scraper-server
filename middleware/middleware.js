import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ACCESS_TOKEN_SECRET_KEY } from "../secret.js";
import { isEmpty } from "../comm/utils.js";

config();

export const verifyAccessToken = (req, res, next) => {
  try {
    console.log(">>>>>>>> JWT Verify Start", req.headers.authorization);
    if (
      isEmpty(req.headers.authorization) ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      throw new Error(
        "Bearer access token doesn't exist or is not in Bearer format."
      );
    }
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      ACCESS_TOKEN_SECRET_KEY
    );
    return next();
  } catch (error) {
    console.log(">>>>>>>> JWT Verify Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        status: 403,
        message: "유효하지 않은 세션입니다.",
        messageDev: "JWT Verify Error: TokenExpiredError",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        status: 403,
        message: "유효하지 않은 세션입니다.",
        messageDev: "JWT Verify Error: JsonWebTokenError",
      });
    }
    return res.status(403).json({
      status: 403,
      message: "유효하지 않은 세션입니다.",
      messageDev: "JWT Verify Error: access token doesn't exist",
    });
  }
};
