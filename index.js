require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const postRoutes = require("./routes/postRoutes");
const cors = require("cors");
const axios = require("axios");
const compression = require("compression");
const helmet = require("helmet");
const app = express();

app.use(
  body_parser.json({ limit: "100000kb" }),
  productRoutes,
  userRoutes,
  postRoutes,
  cors(),
  helmet(),
  compression()
);
//mongoose.connect(
//  process.env.MONGODB_URI || "mongodb://localhost/Sneaker_Mart",
//  {
//    useNewUrlParser: true
//  }
//);
//mongoose.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.json("Welcome On API SneakerMart");
});

app.post("/toto", async (req, res) => {
  try {
    const getLoginpage = await axios.get(
      "https://www.instagram.com/accounts/login/"
    );
    console.log(getLoginpage);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(process.env.PORT || 5500, () => {
  console.log("server listening");
});
