const express = require("express");
const mongoose = require("mongoose");
const accounts = require("./routes/accounts");
const requests = require("./routes/requests");
const groups = require("./routes/groups");
const { Account } = require("./models/accounts");
const { Room } = require("./models/room");
const { Group } = require("./models/group");
const cors = require("cors");

mongoose.connect(process.env.DB_URI);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());

// middleware to update the database with the user's information
// TODO: there should be a better way to do this instead of on every request
app.use(async (req, res, next) => {
  if (
    req.headers["utorid"] === undefined ||
    req.headers["http_mail"] === undefined ||
    req.headers["http_cn"] === undefined
  ) {
    // shibboleth headers not present; only an issue with local development
    res.status(401).send("Unauthorized");
    console.log("Unauthorized");
    next();
  } else {
    let account = await Account.findOne({ utorid: req.headers["utorid"] });
    if (account === null) {
      let acc = new Account({
        utorid: req.headers["utorid"],
        email: req.headers["http_mail"],
        name: req.headers["utorid"],
      });
      await acc.save();
      next();
    } else {
      console.log(account);
      // this code should update the users information if it has changed
      // let acc = new Account(account);
      // await Account.findOneAndUpdate({utorid: req.headers['utorid']}, {email: req.headers['http_mail'], name: req.headers['http_cn']}, {new: true}, (err, doc) => {
      //   if (err) {
      //     console.log("Something wrong when updating data!");
      //   }
      //   console.log(doc);
      //   next();
      // });
      // acc.email = req.headers['http_mail'];
      //
      // // ideally we should use this, but production shibboleth headers are not working
      // // account.name = req.headers['http_cn'];
      //
      // // so we'll use the utorid instead for now
      // acc.name = req.headers['utorid'];
      // await acc.save();
      next();
    }
  }

  // Creating tcard approver and approver accounts
  // TODO: should also be a better way to do this instead of on every request
  let tcardapprover = await Account.findOne({ utorid: "wangandr" }); // change to andrew wang's actual utorid
  if (tcardapprover === null) {
    let tcardapprover = new Account({
      utorid: "wangandr",
      email: "a.wang@utoronto.ca",
      name: "Andrew Wang",
      role: "admin",
      accessGranted: true,
      theme: "light",
      language: "en",
    });
    await tcardapprover.save();
  }
  let approver = await Account.findOne({ utorid: "mliut" }); // change to michael liut's actual utorid
  if (approver === null) {
    let approver = new Account({
      utorid: "mliut",
      email: "michael.liut@utoronto.ca",
      name: "Michael Liut",
      role: "admin",
      accessGranted: true,
      theme: "light",
      language: "en",
    });
    await approver.save();
  }

  // Creating room if not already made
  let hacklab = await Room.findOne({ roomName: "DH 2014" });
  if (hacklab === null) {
    let hacklab = new Room({
      roomName: "DH 2014",
      friendlyName: "Hacklab",
      capacity: 20,
      requests: [],
    });
    await hacklab.save();
  }

  // Creating test group
  /*let account = await Account.findOne({utorid: req.headers['utorid']})
  let testGroup = new Group({
    name: "MDSC",
    members: [account],
    requests: [],
    managers: [account],
  });
  await testGroup.save();*/
});

app.use("/accounts", accounts);
app.use("/groups", groups);
app.use("/requests", requests);

// app.get('/', (req, res) => {
//   res.send(req.headers);
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
