// Assignment #1 Ye Jin Kim 163291180

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
require('dotenv').config({path:"./config/keys.env"})

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const generalController = require("./controllers/general");
const productController = require("./controllers/product");

app.use("/", generalController);
app.use("/product", productController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Webserver connectedWeb server is up and running");
});
