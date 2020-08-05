const express = require("express");
const router = express.Router();
const { hows, packages } = require("../models/data");
const path = require("path");
const multer = require("multer");

const { addPackage, getDataMeal, deletemeal } = require("../models/db");

const storage = multer.diskStorage({
  destination: "./public/img/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(new Error("Not an image! Please upload an image.", 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

// fix database files and finish the router and as4
router.get("/meals", (req, res) => {
  const fakepackage = new packages();

  getDataMeal()
    .then((data) => {
      res.render("product/meals", {
        package: fakepackage.getpackage(),
        add: data.length != 0 ? data : undefined,
        title: "Healthy & Fresh Meals",
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.customer) {
    res.redirect("/login");
  } else {
    next();
  }
}

router.get("/addpackages", ensureAdmin, (req, res) => {
  res.render("product/addpackages", {
    title: "Healthy & Fresh Meals",
  });
});
router.get("/view", ensureAdmin, (req, res) => {
  const fakepackage = new packages();

  getDataMeal().then((data) => {
    res.render("product/view", {
      package: fakepackage.getpackage(),
      add: data.length != 0 ? data : undefined,
      title: "Healthy & Fresh Meals",
    });
  });
});

router.post("/add", ensureAdmin, upload.single("img"), (req, res) => {
  req.body.img = req.file.filename;
  const errors = [];
  addPackage(req.body)
    .then(() => {
      console.log("add then ");
      const fakepackage = new packages();

      getDataMeal()
        .then((data) => {
          res.render("product/meals", {
            package: fakepackage.getpackage(),
            add: data.length != 0 ? data : undefined,
            title: "Healthy & Fresh Meals",
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => {
      errors.push("Please enter all the fields correctly");
      console.log("Error adding : " + err);
      res.render("product/addpackages", {
        title: "Healthy & Fresh Meals",
        errorMessages: errors,
      });
    });
});

router.get("/delete", (req, res) => {
  const fakepackage = new packages();
  if (req.query.name || req.query.title) {
    fakepackage.delete(req.query.title);
    deletemeal(req.query.name)
      .then(()=>{
        res.redirect("/udashboard")
      })
      
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  }
/*
  if (req.query.title) {
    fakepackage.delete(req.query.title);
    getDataMeal()
      .then((data) => {
        res.render("product/view", {
          package: fakepackage.getpackage(),
          add: data.length != 0 ? data : undefined,
          title: "Healthy & Fresh Meals",
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  } */
  else {
    console.log("No Query");
    let errors = [];
    errors.push("Error occur");
    getDataMeal().then((data) => {
      res.render("product/view", {
        package: fakepackage.getpackage(),
        add: data.length != 0 ? data : undefined,
        errorMessages: errors,
        title: "Healthy & Fresh Meals",
      });
    });
  }
});

module.exports = router;
