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

mongoose.set("useCreateIndex", true);
let Users;

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

const userModel = mongoose.model("users", users);
module.exports = { userModel, initialize, save, validateUser };
