const express = require("express");
const router = express.Router();
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

router.get("/delete", (req, res) => {

  if (req.query.name ) {
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

  else {
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


router.get("/edit",(req,res)=>{
  if (req.query.name || req.query.title){ 
    db.getStudentsByEmail(req.query.email).then((students)=>{
      res.render("EditStudent", {data:students[0]}); //using [0] because students is an array
    }).catch(()=>{
      console.log("couldn't find the student");
      res.redirect("/");
    });
  }
  else
    res.redirect("/students");
});

router.post("/students/edit",(req,res)=>{
    db.editStudent(req.body).then(()=>{
      res.redirect("/students");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/students");
    })
});


module.exports = router;
