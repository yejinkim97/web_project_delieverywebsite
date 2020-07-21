// Assignment #1 Ye Jin Kim 163291180

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/keys.env" });


const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const generalController = require("./controllers/general");
const productController = require("./controllers/product");

app.use("/", generalController);
app.use("/product", productController);

const data = require("./models/data.js");

const PORT = process.env.PORT || 3000;


const mongoose =require("mongoose");
data.initialize().then(()=>{
  console.log("Data read successfully");
  app.listen(PORT, () => {
    console.log("Webserver connectedWeb server is up and running");
  });
}).catch((data)=>{
  console.log(data);
});
/*
app.listen(PORT, () => {
  console.log("Webserver connectedWeb server is up and running");
});
const mongoose =require("mongoose");
let db = mongoose.createConnection("mongodb+srv://yjkim33:5edsDTECDJImaa4G@senecaweb.3ndwz.mongodb.net/web322_week8?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true });
        
db.on('error', (err)=>{
  console.log('error')
   
});

db.once('open', ()=>{
  console.log('connected')
   
  });
*/