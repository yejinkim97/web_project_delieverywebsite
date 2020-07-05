const express = require("express");
const router = express.Router();
const { hows, packages } = require("../models/data");


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
router.get("/dashboard",(req,res)=>{
    res.render("general/dashboard", {
       
      title: "Healthy & Fresh welcome",
    });
})
router.post("/signup", (req, res) => {
  const errors = [];
  const { email, username } = req.body;
  if (req.body.email == "") {
    errors.push("*You must enter an email");
  }
  if (req.body.username == "") {
    errors.push("*You must enter an username");
  }

  if (req.body.cPassword == "") {
    errors.push("*You must confirm password");
  }

  if (req.body.Password != req.body.cPassword) {
    errors.push("*Your password and confirmation password do not match");
  }

  const regex1 = new RegExp("^(?=.*[0-9])");
  if (!regex1.test(req.body.Password)) {
    errors.push("*You must enter a password that has at least one digit");
  }
  const regex2 = new RegExp("^(?=.*[A-Z])");
  if (!regex2.test(req.body.Password)) {
    errors.push("*You must enter a password that has at least one uppercase");
  }
  if (errors.length > 0) {
    res.render("general/signup", {
      title: "Healthy & Fresh Sign up",
      errorMessages: errors,
    });
  } else {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const msg = {
      to: `${email}`,
      from: process.env.EMAIL,
      subject: "Thank you for Registering Healthy & Fresh",
      html: `<h3>Hello, <br></h3>
            <p>Thank you for signing up our website.<br>
            We are happy to inform you have successfully signed up.<br></p> `,
    };
    sgMail
      .send(msg)
      .then(() => {
        res.redirect("/dashboard");
        
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }
});

router.get("/login", (req, res) => {
  res.render("general/login", {
    title: "Healthy & Fresh login",
  });
});
router.post("/login", (req, res) => {
  const errors = [];

  if (req.body.username == "") {
    errors.push("*You must enter an username");
  }
  if (req.body.Password == "") {
    errors.push("*You must enter a password");
  }

  if (errors.length > 0) {
    res.render("general/login", {
      title: "Healthy & Fresh Sign up",
      errorMessages: errors,
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
