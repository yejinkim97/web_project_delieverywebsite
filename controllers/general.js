const express = require("express");
const router = express.Router();
const { hows, packages } = require("../models/data");

const bcrypt = require("bcryptjs");
const session = require("client-sessions");
//Setup client-sessions
router.use(
  session({
    cookieName: "session", 
    secret: `${process.env.SECRET_SESSION}`, 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60,
  })
);
const db = require("../models/db");

router.get("/", (req, res) => {
  const fakehow = new hows();

  const fakepackage = new packages();
  res.render("general/home", {
    package: fakepackage.getpackage(),
    how: fakehow.gethow(),
    title: "Healthy & Fresh",
  });
});

router.get("/signup", (req, res) => {
  res.render("general/signup", {
    title: "Healthy & Fresh Sign up",
  });
});
router.get("/dashboard", (req, res) => {
  res.render("general/dashboard", {
    title: "Healthy & Fresh welcome",
  });
});

router.post("/signup", (req, res) => {
  const errors = [];

  if (req.body.email == "") {
    errors.push("*You must enter an email");
  }
  if (req.body.username == "" || req.body.fname == "" || req.body.lname == "") {
    errors.push("*You must enter your username/name");
  }

  if (req.body.cpassword == "") {
    errors.push("*You must confirm password");
  }

  if (req.body.password != req.body.cpassword) {
    errors.push("*Your password and confirmation password do not match");
  }

  const regex1 = new RegExp("^(?=.*[0-9])");
  if (!regex1.test(req.body.password)) {
    errors.push("*You must enter a password that has at least one digit");
  }
  const regex2 = new RegExp("^(?=.*[A-Z])");
  if (!regex2.test(req.body.password)) {
    errors.push("*You must enter a password that has at least one uppercase");
  }
  if (errors.length > 0) {
    res.render("general/signup", {
      title: "Healthy & Fresh Sign up",
      errorMessages: errors,
    });
  } else {
    console.log("email process");

    db.save(req.body)
      .then(() => {
        res.redirect("/dashboard");
      })
      .catch((err) => {
        res.redirect("general/signup", {
          title: "Healthy & Fresh Sign up",
        });
      });

    console.log(`end`);
  }
});

router.get("/login", (req, res) => {
  res.render("general/login", {
    title: "Healthy & Fresh login",
  });
});
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}


router.get("/cdashboard", ensureLogin, (req, res) => {
  res.render("general/cdashboard", {
    title: "Healthy & Fresh welcome",
    user: req.session.user,
  });
});
router.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/");
});

router.get("/udashboard", ensureLogin, (req, res) => {
  res.render("general/udashboard", {
    title: "Healthy & Fresh welcome",
    user: req.session.user,
  });
});
router.post("/login", (req, res) => {
  const errors = [];

  if (req.body.username == "") {
    errors.push("*You must enter an username");
  }
  if (req.body.password == "") {
    errors.push("*You must enter a password");
  }

  if (errors.length > 0) {
    res.render("general/login", {
      title: "Healthy & Fresh Sign up",
      errorMessages: errors,
    });
  } else {
    db.validateUser(req.body)
      .then((inData) => {
        req.session.user = inData[0];
        console.log(req.session.user);
        if (req.session.user.customer) {
          res.redirect("/udashboard");
        } else {
          res.redirect("/udashboard");
        }
      })
      .catch((message) => {
        console.log(message);
        errors.push("Please check your username/password");
        res.render("general/login", {
          title: "Healthy & Fresh Sign up",
          errorMessages: errors,
        });
        
      });
  }
});

module.exports = router;
