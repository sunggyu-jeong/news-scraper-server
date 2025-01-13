const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const news = require("./routes/news");
const user = require("./routes/user");
const { sequelize } = require("./public/database/models");

sequelize
  .sync({ force: false })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Error connecting to the database:", err));

const app = express()
  .use(express.json())
  .use(helmet())
  .use(cors())
  .use("/api", express.Router().use(news).use(user))
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
