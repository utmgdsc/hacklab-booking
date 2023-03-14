const express = require("express");
const router = express.Router();
const { Account } = require("../models/accounts");
const { roleVerify } = require("../middleware/role_middleware");

router.get("/info", async (req, res) => {
  console.log(req.headers);
  let account = await Account.findOne({ utorid: req.headers['utorid'] });
  res.send(account);
});

router.get('/all', roleVerify(['admin']), async (req, res) => {
  let account = await Account.find({});
  res.send(account);
});

router.get('/:id', roleVerify(['admin']), async (req, res) => {
  let account = await Account.findOne({ utorid: req.params.id });
  res.send(account);
});S

// router.post('/:id', roleVerify(['admin']), async (req, res) => {
//   let account = new Account(await Account.findOne({ utorid: req.params.id }));
//   if (req.body.role) {
//     account.role = req.body.role;
//   }
//   if (req.body.accessGranted) {
//     account.accessGranted = req.body.accessGranted;
//   }
//   account.save();
//   res.send(account);
// });

module.exports = router;
