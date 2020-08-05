const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

let users = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  customer: Boolean,
});

let mealPackage = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  numOfMeal: {
    type: Number,
    required: true,
  },
  top: {
    type: Boolean,
  },
  img: {
    type: String,
    required: true,
  },
});

mongoose.set("useCreateIndex", true);
let Users;
let mealPackages;

const initialize = function () {
  return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(`${process.env.MONGO}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db.on("error", (err) => {
      console.log("error");
      reject(err);
    });

    db.once("open", () => {
      Users = db.model("datas", users);
      mealPackages = db.model("packages", mealPackage);

      console.log("connected");
      resolve();
    });
  });
};
users.pre("save", function (next) {
  bcrypt
    .genSalt(10)
    .then((salt) => {
      bcrypt
        .hash(this.password, salt)
        .then((encryptPassword) => {
          this.password = encryptPassword;
          next();
        })
        .catch((err) => console.log(`Error occurred when hashing ${err}`));
    })
    .catch((err) => console.log(`Error occurred when salting ${err}`));
});

const save = function (data) {
  return new Promise((resolve, reject) => {
    data.customer = data.customer ? true : false;
    data.top = data.top ? true : false;
    let user = new Users(data);
    user.save((err) => {
      if (err) {
        console.log(`Error: ${err}`);
        reject();
      } else {
        console.log("saved");
        resolve();
      }
    });
  });
};

const validateUser = function (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      console.log("if data");
      Users.find({ username: data.username })
        .exec()
        .then((users) => {
          if (users.length == 0) {
            reject("Unable to find user: " + data.username);
          } else {
            users.map((item) => item.toObject());
            console.log("if data");
            console.log(`${data.Password}`);

            bcrypt.compare(data.password, users[0].password).then((result) => {
              if (result) {
                console.log("if result");
                resolve(users);
              } else {
                reject("Wrong password");
                return;
              }
            });
          }
        });
    }
  });
};
const getDataMeal = function (data) {
  return new Promise((resolve, reject) => {
    mealPackages
      .find()
      .exec()
      .then((retMeals) => {
        resolve(retMeals.map((item) => item.toObject()));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const getMeal = function (inname) {
  return new Promise((resolve, reject) => {
    mealPackages
      .find({ name: inname })
      .exec()
      .then((retur) => {
        if (retur.length != 0) resolve(retur.map((item) => item.toObject()));
        else reject("No meals found");
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const editMeal = (editData) => {
  return new Promise((resolve, reject) => {
    editData.top = editData.top ? true : false;

    mealPackages
      .updateOne(
        { name: editData.name },
        {
          $set: {
            name: editData.name,
            price: editData.price,
            top: editData.top,
            description: editData.description,
            category: editData.category,
            numOfMeal: editData.numOfMeal,
          },
        }
      )
      .exec()
      .then(() => {
        console.log(`${editData.name} has been updated`);
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  }).catch(() => {
    reject(" error");
  });
};
const addPackage = function (data) {
  return new Promise((resolve, reject) => {
    data.top = data.top ? true : false;
    for (var formEntry in data) {
      if (data[formEntry] == "") data[formEntry] = null;
    }

    var newPackage = new mealPackages(data);

    newPackage.save((err) => {
      if (err) {
        console.log("Woopsie there was an error: " + err);
        reject(err);
      } else {
        console.log("Saved that student: " + data.name);
        resolve();
      }
    });
  });
};
const deletemeal = function (inname) {
  return new Promise((resolve, reject) => {
    mealPackages
      .deleteOne({ name: inname })
      .exec() //run as a promise
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject(); //maybe a problem communicating with server
      });
  });
};
const userModel = mongoose.model("users", users);
const mealModel = mongoose.model("mealPackage", mealPackage);
module.exports = {
  userModel,
  mealModel,
  getDataMeal,
  addPackage,
  initialize,
  save,
  validateUser,
  deletemeal,
  getMeal,
  editMeal,
};
