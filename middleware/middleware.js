import jwt from "jsonwebtoken";
import { config } from "dotenv";
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
      req.headers.authorization.split(" ")[1] || "Bearer ",
      process.env.ACCESS_TOKEN_SECRET_KEY
    );
    return next();
  } catch (error) {
    console.log(">>>>>>>> JWT Verify Error:", error);

    const errorMessage =
      error.name === "TokenExpiredError" || error.name === "JsonWebTokenError"
        ? `JWT Verify Error: ${error.name}`
        : "JWT Verify Error: access token doesn't exist";

    return res.status(403).json({
      status: 403,
      message: "유효하지 않은 세션입니다.",
      messageDev: errorMessage,
    });
  }
};
