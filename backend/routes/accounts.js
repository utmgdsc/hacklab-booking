const express = require("express");
const router = express.Router();
const { Account } = require("../models/accounts");
const { Request } = require("../models/requests");
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");
const {addEvent} = require("../google/test");
const {sendEmail} = require("../google/test");

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

// change theme prop of an account
router.post('/modifyTheme', async (req, res) => {
    let account = await Account.findOne({ utorid: req.headers['utorid'] });
    account.theme = req.body.theme;
    await account.save();
    res.send(account);
});

// change the access prop of an account
router.post('/modifyAccess/:id', roleVerify(['admin']), async (req, res) => {
    let account = await Account.findOne({ utorid: req.params.id });
    account.accessGranted = req.body.accessGranted;
    account.needsAccess = false;
    await account.save();

    // for all requests in which this account is an owner, if the current status is "approval," then change it to "complete"
    let requests = await Request.find({owner: account["_id"]});

    if (account.accessGranted) {
      for (let i = 0; i < requests.length; i++) {
          if (requests[i].status === "approval") {
              requests[i].status = "completed";
              const event = {
                'summary': `HB ${requests[i]["_id"]} ${requests[i].title}`,
                'location': 'DH2014',
                'description': `${requests[i].description} ${requests[i].reason}`,
                'start': {
                  'dateTime': `${requests[i].start_date.toISOString()}`,
                  'timeZone': 'America/Toronto',
                },
                'end': {
                  'dateTime': `${requests[i].end_date.toISOString()}`,
                  'timeZone': 'America/Toronto',
                }
              };
              await addEvent(event);
              let group = await Group.findOne({_id: requests[i].group});
              let startTime = new Date(requests[i].start_date);
              let date =  startTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              let endTime = new Date(requests[i].end_date);
              await sendEmail({
                name: account.name,
                address: account.email,
                subject: 'HackLab Booking Completed',
                message: `Your booking request for the HackLab has been completed.\n Your reason for booking was: ${requests[i].title}.\n This booking is associated with the group ${group.name}.\n Your booking is on ${date} from ${startTime.getHours()}:00 to ${endTime.getHours() + 1}:00.`
              });
              await requests[i].save();
          }
      }
    }
    res.send(account);
});

module.exports = router;
