const express = require("express");
const router = express.Router();
const { Account } = require("../models/accounts");
const { Request } = require("../models/requests");
const { roleVerify } = require("../middleware/role_middleware");
const {addEvent} = require("../google/test");

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
    await account.save();

    // for all requests in which this account is an owner, if the current status is "approval," then change it to "complete"
    let requests = await Request.find({owner: account["_id"]});

    if (account.accessGranted) {
      for (let i = 0; i < requests.length; i++) {
          if (requests[i].status === "approval") {
              requests[i].status = "completed";
              const event = {
                'summary': `HB ${request["_id"]} ${request.title}`,
                'location': 'DH2014',
                'description': `${request.description} ${request.reason}`,
                'start': {
                  'dateTime': `${request.start_date.toISOString()}`,
                  'timeZone': 'America/Toronto',
                },
                'end': {
                  'dateTime': `${request.end_date.toISOString()}`,
                  'timeZone': 'America/Toronto',
                }
              };
              await addEvent(event);
              await requests[i].save();
          }
      }
    }
    res.send(account);
});

module.exports = router;
