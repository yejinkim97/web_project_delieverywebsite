// Assignment #1 Ye Jin Kim 163291180

/*class products{
    product=[];

    constructor(){
        this.product.push({title: "Buffalo Goat Cheese Chicken", price:"$11.95", img: "/img/Buffalo_Goat_Cheese_Chicken_plate_1_x300.jpg", alt:"f1"});
        this.product.push({title: "Bombay Spiced Chicken", price:"$11.95", img: "/img/Bombay_Spiced_Chicken_plate_1_x300.jpg", alt:"f2"});
        this.product.push({title: "Coconut Curry Shrimp", price:"$11.95", img: "/img/Coconut_Curry_Shrimp_plate_4_x300.jpg", alt:"f3"});
        this.product.push({title: "Chicken Teriyaki", price:"$11.95", img: "/img/Chicken_Teriyaki_plate_2_x300.jpg", alt:"f4"});
        this.product.push({title: "Keto Cheese Steak", price:"$11.95", img: "/img/Keto_Cheese_Steak_plate_1_x300.jpg", alt:"f5"});
        this.product.push({title: "Pan Roast Mushroom Chicken", price:"$11.95", img: "/img/Pan_Roast_Mushroom_Chicken_plate_1_x300.jpg", alt:"f6"});
        this.product.push({title: "Roasted Chicken and Gravy", price:"$11.95", img: "/img/Roasted_Chicken_and_Gravy_plate_1_x300.jpg", alt:"f7"});
        this.product.push({title: "Sun-dried Tomato and Basil Pesto Chicken Linguine", price:"$11.95", img: "/img/Sun-dried_Tomato_and_Basil_Pesto_Chicken_Linguine_plate_1_x300.jpg", alt:"f8"});

    }

    getproduct(){
        return this.product;
    }
}
*/

const mongoose = require("mongoose");
const initialize = function () {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(
      "mongodb+srv://yjkim33:5edsDTECDJImaa4G@senecaweb.3ndwz.mongodb.net/web322_week8?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    db.on("error", (err) => {
      console.log("error");
      reject(err);
    });

    db.once("open", () => {

      // video from 50:12, he explains about as3, it is very similar to what he showed in the video  ("https://web.microsoftstream.com/video/a8c97005-ab0a-48d3-a773-7553af61c313?list=user&userId=18b626cb-01ce-48fc-8538-6589772e2e4f")
      // check course note and code example
      // and then https://web.microsoftstream.com/video/a7d000e8-d715-4f27-8d0f-61bef2db9184?list=user&userId=18b626cb-01ce-48fc-8538-6589772e2e4f
      console.log("connected");
      resolve();
    });
  });
};



class hows {
  how = [];

  constructor() {
    this.how.push({
      src: "/img/prep.png",
      alt: "p1",
      h2: "Choose your favorite meals",
      p1: "We have variety of options to pick.",
      p2: "Keto Packages, Vegan Packages, Vegetarian Packages and more!",
    });
    this.how.push({
      src: "/img/prep2.png",
      alt: "p2",
      h2: "Prepare your meals",
      p1: "Our chief prepare your meal with our fresh ingredients ",
      p2: "right when you place an order.",
    });
    this.how.push({
      src: "/img/prep3.jpg",
      alt: "p3",
      h2: "Deliver to your door",
      p1: "We deliver to your door in 24 hours. ",
      p2: "You can enjoy your meals fresh and healthy!",
    });
  }

  gethow() {
    return this.how;
  }
}
class packages {
  package = [];

  constructor() {
    this.package.push({
      title: "Fat Burner",
      category: "w",
      meals: "14",
      top: true,
      content:
        "Low carb, nutrient-rich meals with fat-burning profiles to support fat loss",
      price: "from $159",
      img: "/img/pf-754d17d4--FATBURNERNBV2500x.jpg",
      alt: "m1",
    });
    this.package.push({
      title: "Prebiotic Soup Cleanse",
      category: "h",
      meals: "14",
      top: true,
      content:
        "A protein-packed meal and two superb prebiotic soups per day for up to 14 days",
      price: "from $129",
      img: "/img/pf-2677c175--PREBIOTICNBV2500x.jpg",
      alt: "m2",
    });
    this.package.push({
      title: "Keto",
      category: "h",
      meals: "14",
      top: true,
      content:
        "High fat, low carb meals with moderate protein to achieve and sustain ketosis",
      price: "from $159",
      img: "/img/pf-8661c283--KETONBV2500x.jpg",
      alt: "m3",
    });
    this.package.push({
      title: "Muscle Gain",
      category: "w",
      meals: "14",
      top: true,
      content:
        "Higher protein and calorie portions to support your muscle gain momentum",
      price: "from $159",
      img: "/img/pf-15920cc6--MuscleGainNBV2500x.jpg",
      alt: "m4",
    });
    this.package.push({
      title: "Gluten Free",
      category: "h",
      meals: "14",
      top: false,
      content:
        "A gluten-free package with the same balanced profile as our other packages",
      price: "from $117",
      img: "/img/pf-02164599--GLUTEENFREENBV2500x.jpg",
      alt: "m5",
    });
    this.package.push({
      title: "Weight Loss",
      category: "w",
      meals: "14",
      top: false,
      content:
        "High protein, low-calorie meals with a nutrient profile tuned for weight loss",
      price: "from $145",
      img: "/img/pf-53859440--WEIGHTLOSSNBV2500x.jpg",
      alt: "m6",
    });
    this.package.push({
      title: "Veggie",
      category: "h",
      meals: "14",
      top: false,
      content:
        "A vegetarian-friendly package with a natural and nutrient-rich approach",
      price: "from $159",
      img: "/img/pf-b32c2038--VEGGIESNBV24500x.jpg",
      alt: "m7",
    });
    this.package.push({
      title: "Vegan",
      category: "h",
      meals: "14",
      top: false,
      content:
        "A fully plant-based package featuring vegan meat and no animal products",
      price: "from $159",
      img: "/img/pf-c337819e--VEGANNBV2500x.jpg",
      alt: "m8",
    });
  }

  getpackage() {
    return this.package;
  }
}
module.exports = { hows, packages, initialize };
