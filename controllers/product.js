const express = require("express");
const router = express.Router();
const { hows, packages } = require("../models/data");

router.get("/meals", (req, res) => {
  const fakepackage = new packages();

  res.render("product/meals", {
    package: fakepackage.getpackage(),

    title: "Healthy & Fresh Meals",
  });
});

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.customer) {
    res.redirect("/login");
  } else {
    next();
  }
}

router.get("/addpackages",ensureAdmin, (req,res)=>{

  res.render("product/addpackages",{
    title: "Healthy & Fresh Meals"
  })

})

module.exports = router;
