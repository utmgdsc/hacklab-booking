const express = require("express");
const router = express.Router();
const { Request } = require("../models/requests");
const { Account } = require("../models/accounts");
const { Room } = require("../models/room");
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");
const { addEvent } = require("../google/test.js");
const { sendEmail } = require("../google/test.js");

router.get("/myRequests", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let account = await Account.findOne({ utorid: req.headers["utorid"] });
  // iterate through every group that the user is in
  let group = await Group.find({ members: account });

  // concatenate all the requests from each group
  let requests = await Request.find({
    group: { $in: group },
    status: { $in: ["pending", "denied", "approval", "tcard", "completed"]}
  });

  // for each request, fill out group, owner, approved
  for (let i = 0; i < requests.length; i++) {
    requests[i].group = await Group.findOne({ _id: requests[i].group });
    requests[i].owner = await Account.findOne({ _id: requests[i].owner });
    requests[i].approver = await Account.findOne({ _id: requests[i].approver });
    requests[i].tcardapprover = await Account.findOne({ _id: requests[i].tcardapprover });
    requests[i].room = await Room.findOne({ _id: requests[i].room });
  }

  res.send(requests);
});

router.get("/allRequests", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let account = await Account.findOne({ utorid: req.headers["utorid"] });
  let requests = await Request.find({status: "pending"});

  if (account["role"] !== "admin") {
    requests = []
  }

  res.send(requests);
});

router.post("/submit", roleVerify(["student", "prof", "admin"]), async (req, res) => {
    let hacklab = await Room.findOne({ name: "Hacklab" });

    // date data checking
    // start date and end date must be in the future, and start date must be before end date
    let start_date = new Date(req.body["startTime"]);
    let end_date = new Date(req.body["endTime"]);
    if (start_date < new Date() || end_date < new Date() || start_date > end_date) {
      res.status(400).send("Invalid date");
      return;
    }

    // TODO: tcardapprover and approver should be a list of accounts
    let tcardapprover = await Account.findOne({ utorid: "wangandr" });
    let approver = await Account.findOne({ utorid: "liutmich" });

    let requester = await Account.findOne({ utorid: req.body["owner"] });
    let group = await Group.findOne({ _id: req.body["group"] });

    let request = new Request({
      status: "pending",
      group: group,
      owner: requester,
      approver: approver,
      tcardapprover: tcardapprover,
      start_date: req.body["startTime"],
      end_date: req.body["endTime"],
      description: req.body["details"],
      title: req.body["title"],
      room: hacklab,
    });
    await request.save();

    await group.update({ $push: { requests: request } });
    await requester.update({ $push: { activeRequests: request } });
    await hacklab.update({ $push: { requests: request } });

    // add request to approver and tcardapprover's pendingRequests
    await tcardapprover.update({ $push: { pendingRequests: request } });
    await approver.update({ $push: { pendingRequests: request } });

    let date = start_date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await sendEmail({ // Send approvers an email for new request
      name: approver.name,
      address: approver.email,
      subject: 'New HackLab Booking Request',
      message: `There's a new booking request for the HackLab from ${requester.name} (${requester.utorid}).\n Their reason for booking was: ${request.title}.\n This booking is associated with the group ${group.name}.\n The booking is on ${date} from ${start_date.getHours()}:00 to ${end_date.getHours() + 1}:00.`
    });

    res.send(request);
  }
);

router.post("/changeStatus/:id", roleVerify(["prof", "admin"]), async (req, res) => {
  // iterate through all requests in pendingRequests and find the one with the same id
  let account = await Account.findOne({ utorid: req.headers["utorid"] });

  console.log("Finding request" + req.params.id);

  let request = await Request.findOne({ _id: req.params.id });

  // console.log("Request found" + request + "name: " + request.title + " status: " + req.body["status"] + " reason: " + req.body["reason"]);

  if (request == null) {
    res.status(404).send("Request not found");
    return;
  } else {
    request.status = req.body["status"];
    request.reason = req.body["reason"];

    // find the owner of the request
    let owner = await Account.findOne({ _id: request.owner });

    // set the status as completed if the owner has hacklab
    if (request.status === "approval") {
      request.approver = account;

      if (owner.accessGranted) {
        request.status = "completed";
        // await request.save();
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
      }
      else {
        owner.needsAccess = true;
        await owner.save();
        let group = await Group.findOne({ _id: request.group });
        let start_date = new Date(request.start_date);
        let end_date = new Date(request.end_date);
        // send email to owner
        await sendEmail({
          name: owner.name,
          address: owner.email,
          subject: 'HackLab Booking Request Approved',
          message: `Your booking request for the HackLab has been approved, you will be sent an email soon once you're granted TCard access to the HackLab.\n Your reason for booking was: ${request.title}.\n This booking is associated with the group ${group.name}.\n The booking is on ${start_date.toDateString()} from ${start_date.getHours()}:00 to ${end_date.getHours() + 1}:00.`
        });
        let tcardapprover = await Account.findOne({ utorid: "wangandr" });
        // send email to tcard approver
        await sendEmail({
          name: tcardapprover.name,
          address: tcardapprover.email,
          subject: 'TCard Access Request for HackLab',
          message: `There's a new TCard access request for the HackLab from ${owner.name} (${owner.utorid}).\n Their reason for booking was: ${request.title}.\n This booking is associated with the group ${group.name}.\n The booking is on ${start_date.toDateString()} from ${start_date.getHours()}:00 to ${end_date.getHours() + 1}:00.`
      });
    }
    await request.save();

    console.log("Request found" +
      request + "name: " + request.title +
      " status: " + req.body["status"]
    );
    return;
    // res.send(request);
  }

  // req.status(200).send("Request found");
}});

router.get("/getRequest/:id", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let request = await Request.findOne({ _id: req.params.id });
  res.send(request);
});

router.post("/modifyRequest/:id", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let start_date = new Date(req.body["startTime"]);
  let end_date = new Date(req.body["endTime"]);
  if (start_date < new Date() || end_date < new Date() || start_date > end_date) {
    res.status(400).send("Invalid date");
    return;
  }

  let group = await Group.findOne({ _id: req.body["group"] });

  await Request.updateMany({ _id: req.params.id }, {$set: { title: req.body["title"] }});
  await Request.updateMany({ _id: req.params.id }, {$set: { description: req.body["title"] }});
  await Request.updateMany({ _id: req.params.id }, {$set: { reason: req.body["title"] }});
  await Request.updateMany({ _id: req.params.id }, {$set: { start_date: req.body["startTime"] }});
  await Request.updateMany({ _id: req.params.id }, {$set: { end_date: req.body["endTime"] }});
  await Request.updateMany({ _id: req.params.id }, {$set: { group: group }});

  return;
});

router.post("/cancelRequest/:id", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  await Request.updateMany({ _id: req.params.id }, {$set: { status: "cancelled" }});
  let acc = await Account.findOne({ utorid: req.headers["utorid"] });
  acc.needsAccess = false;
  await acc.save();
  return;
});

router.get("/getRoom/:id", roleVerify(["admin"]), async (req, res) => {
  let room = await Room.findOne({ _id: req.params.id });
  res.send(room);
});

router.get('/getUtorid/:id', roleVerify(['admin']), async (req, res) => {
  let account = await Account.findOne({ _id: req.params.id });
  res.send(account);
});

router.get('/getAllRequests', roleVerify(['admin']), async (req, res) => {
  let requests = await Request.find({});

  // for each request, fill out group, owner, approved
  for (let i = 0; i < requests.length; i++) {
    requests[i].group = await Group.findOne({ _id: requests[i].group });
    requests[i].owner = await Account.findOne({ _id: requests[i].owner });
    requests[i].approver = await Account.findOne({ _id: requests[i].approver });
    requests[i].tcardapprover = await Account.findOne({ _id: requests[i].tcardapprover });
    requests[i].room = await Room.findOne({ _id: requests[i].room });
  }

  res.send(requests);
});

module.exports = router;

router.get('/checkDate/:start/:end/:reqID', roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let start_date = new Date(req.params.start);
  let end_date = new Date(req.params.end);
  let reqID = null;
  if (req.params.reqID != "null") {
    reqID = req.params.reqID;
  }
  let requests = await Request.find({status: {$in: ["approval", "completed", "pending"]}, end_date: {$gte: new Date()}
  });

  for (let i = 0; i < requests.length; i++) {
    if (reqID && requests[i]._id == reqID) {
      continue;
    }
    let r_start = new Date(requests[i].start_date);
    let r_end = new Date(requests[i].end_date);
    if (start_date >= r_start && start_date <= r_end) {
      res.status(400).send("Invalid date");
      return;
    }
    if (end_date >= r_start && end_date <= r_end) {
      res.status(400).send("Invalid date");
      return;
    }
    if (start_date <= r_start && end_date >= r_end) {
      res.status(400).send("Invalid date");
      return;
    }
  }

  res.status(200).send("Valid date");
});

/** helper to check if a date is in range */
const dateInRange = (date, start, end) => {
  return (date >= start && date <= end);
}

/**
 * given a start and end date, return all dates that are blocked.
 * :start and :end MUST be in the ISO date format. (YYYY-MM-DD)
 */
router.get('/getBlockedDates/:start/:end/:reqID', roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let start_date = new Date(req.params.start);
  let end_date = new Date(req.params.end);
  let reqID = null;
  if (req.params.reqID != "null") {
    reqID = req.params.reqID;
  }
  let requests = await Request.find({status: {$in: ["approval", "completed", "pending"]}, end_date: {$gte: new Date()}});

  let blockedDates = [];

  for (let i = 0; i < requests.length; i++) {
    if (reqID && requests[i]._id == reqID) {
      continue;
    }
    let r_start = new Date(requests[i].start_date);
    let r_end = new Date(requests[i].end_date);

    // calculate duration of this request in hours
    let duration = (r_end - r_start) / 1000 / 60 / 60;

    if (dateInRange(r_start, start_date, end_date)) {
      for (let j = 0; j < duration + 1; j++) {
        blockedDates.push(new Date(r_start.getTime() + j * 60 * 60 * 1000));
      }
    }
  }

  res.status(200).send(blockedDates);
});
