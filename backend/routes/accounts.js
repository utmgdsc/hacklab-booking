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
});

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

// change the access prop of an account
router.post('/modifyAccess/:id', roleVerify(['admin']), async (req, res) => {
    let account = await Account.findOne({ utorid: req.params.id });
    account.accessGranted = req.body.accessGranted;
    account.save();
    res.send(account);

    // for all requests in which this account is an owner, if the current status is "approval," then change it to "complete"
    let requests = await Request.find({owner: account._id});

    if (account.accessGranted) {
      for (let i = 0; i < requests.length; i++) {
          if (requests[i].status === "approval") {
              requests[i].status = "completed";
              await requests[i].save();
          }
      }
    }
});

module.exports = router;
