const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const news = require("./routes/news");

const app = express()
  .use(express.json())
  .use(helmet())
  .use(cors())
  .use("/api", news)
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

module.exports = app;
