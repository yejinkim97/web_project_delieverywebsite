const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
router.use(bodyParser.json());
const {
  addPackage,
  getDataMeal,
  deletemeal,
  getMeal,
  editMeal,
} = require("../models/db");

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

router.get("/meals", (req, res) => {
  getDataMeal()
    .then((data) => {
      res.render("product/meals", {
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
  if (!req.session.user || !req.session.user.clerk) {
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
  getDataMeal().then((data) => {
    res.render("product/view", {
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

      getDataMeal()
        .then((data) => {
          res.render("product/meals", {
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
router.use((err, req, res, next) => {
  if (err) {
    let errors = [];
    errors.push("Please enter all the fields correctly");
    console.log(err.message);
    res.status(500).render("product/addpackages", {
      title: "Healthy & Fresh Meals",
      errorMessages: errors,
    });
  } else {
    res.status(404).send("No page found by that route");
  }
});

router.get("/delete", ensureAdmin, (req, res) => {
  if (req.query.name) {
    deletemeal(req.query.name)
      .then(() => {
        res.redirect("/udashboard");
      })

      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  } else {
    console.log("No Query");
    let errors = [];
    errors.push("Error occur");
    getDataMeal().then((data) => {
      res.render("product/view", {
        add: data.length != 0 ? data : undefined,
        errorMessages: errors,
        title: "Healthy & Fresh Meals",
      });
    });
  }
});

router.get("/edit", ensureAdmin, (req, res) => {
  if (req.query.name) {
    getMeal(req.query.name)
      .then((result) => {
        res.render("product/edit", {
          data: result[0],
          title: "Healthy & Fresh Meals",
        });
      })
      .catch(() => {
        console.log("couldn't find");
        res.redirect("/");
      });
  } else res.redirect("/udashboard");
});

router.post("/edit", ensureAdmin, (req, res) => {
  editMeal(req.body)
    .then(() => {
      res.redirect("/udashboard");
      console.log(`edit complete`);
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});

router.get("/detail", (req, res) => {
  if (req.query.name) {
    getMeal(req.query.name)
      .then((result) => {
        res.render("product/detail", {
          data: result[0],
          title: "Healthy & Fresh Meals",
        });
      })
      .catch(() => {
        console.log("couldn't find");
        res.redirect("/");
      });
  } else res.redirect("/udashboard");
});

router.get("/cart", ensureLogin, (req, res) => {
  res.render("product/cart", {
    data: usercart,
    title: "Shopping Cart",
  });
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}
var usercart = [];

router.post("/addProduct", ensureLogin, (req, res) => {
  const { name, price, img } = req.body;
  usercart.push({ name: name, price: price, img: img });

  res.render("product/cart", {
    data: usercart,
    title: "Shopping Cart",
  });
});

router.post("/removeItem", (req, res) => {
  for (var i = 0; i < usercart.length; i++) {
    usercart.splice(i, 1);
    i = usercart.length;
  }

  res.render("product/cart", {
    data: usercart,
    title: "Shopping Cart",
  });
});
router.post("/place", (req, res) => {
  for (var i = 0; i < usercart.length; i++) {
    usercart.splice(i);
    i = usercart.length;
  }
  res.render("product/cart", {
    data: usercart,
    title: "Shopping Cart",
  });
});
module.exports = router;
