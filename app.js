import express, { json, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import news from "./routes/news.js";
import user from "./routes/user.js";
import sequelize from "./public/database/models/index.js";
import cookieParser from "cookie-parser";

sequelize
  .sync({ force: false })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Error connecting to the database:", err));

const app = express()
  .use(json())
  .use(helmet())
  .use(cors())
  .use(cookieParser())
  .use("/api", Router().use(news).use(user))
  .use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "ws://192.168.0.33:8080"],
        },
      },
    })
  );

export default app;
