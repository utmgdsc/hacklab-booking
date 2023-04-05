const express = require("express");
const router = express.Router();
const { Request } = require("../models/requests");
const { Account } = require("../models/accounts");
const { Room } = require("../models/room");
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");

router.get("/myRequests", roleVerify(["student", "prof", "admin"]), async (req, res) => {
  let account = await Account.findOne({ utorid: req.headers["utorid"] });
  // iterate through every group that the user is in
  let group = await Group.find({ members: account });

  // concatenate all the requests from each group
  let requests = await Request.find({ group: { $in: group } });

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

router.get("/allRequests", roleVerify(["admin"]), async (req, res) => {
  let requests = await Request.find({status: "pending"});
  res.send(requests);
});

router.post("/submit", roleVerify(["student", "prof", "admin"]), async (req, res) => {
    let hacklab = await Room.findOne({ name: "Hacklab" });

    let tcardapprover = await Account.findOne({ utorid: "wangandr" });
    let approver = await Account.findOne({ utorid: "mliut" });

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
      }
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
});

module.exports = router;
