const express = require("express");
const router = express.Router();
const { Account } = require("../models/accounts");

router.get("/info", async (req, res) => {
  console.log(req.headers);
  let account = await Account.findOne({ utorid: req.headers['utorid'] })
  res.send(account);
});

// router.get('/getAll', (req, res) => {
//   Account.find({}).then((account) => {
//     res.send(account);
//   });
// });
//
// router.get('/getID/:id', (req, res) => {
//   const accountId = Number(req.params.id);
//   Account.findOne({ utorid: accountId }).then((account) => {
//     res.send(account);
//   });
// });

module.exports = router;