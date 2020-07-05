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

module.exports = router;
