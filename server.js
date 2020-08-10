// Assignment #4 Ye Jin Kim 163291180
// Heroku: https://as2yjkim33.herokuapp.com/
// Github: https://github.com/yejinkim97/WEB322AS
// Data entry clerk username: "dec" password: "Dec1"
// Image Source: https://livefitfood.ca/pages/meal-packages
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

require("dotenv").config({ path: "./config/keys.env" });

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const generalController = require("./controllers/general");
const productController = require("./controllers/product");

app.use("/", generalController);
app.use("/product", productController);

const data = require("./models/db.js");

const PORT = process.env.PORT || 3000;

data
  .initialize()
  .then(() => {
    console.log("Data read successfully");
    app.listen(PORT, () => {
      console.log("Webserver connected");
    });
  })
  .catch((db) => {
    console.log(db);
  });
