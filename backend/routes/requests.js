const express = require("express");
const router = express.Router();
const { Request } = require("../models/requests");
const { Account } = require("../models/accounts");
const { Room } = require("../models/room");
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");

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

module.exports = router;
