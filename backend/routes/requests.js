const express = require("express");
const router = express.Router();
const { Request } = require("../models/requests");
const { Account } = require("../models/accounts");
const { Room } = require("../models/room");
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");

router.post("/submit", roleVerify(["student", "prof", "admin"]), async (req, res) => {
    let hacklab = new Room({
      roomName: "DH 2014",
      friendlyName: "Hacklab",
      capacity: "15",
      requests: [], // this room would probably already be made, can delete this
    });
    
    let tcardapprover = await Account.findOne({utorid: "wangandr"});
    let approver = await Account.findOne({utorid: "mliut"});

    let request = new Request({
      status: "pending",
      group: req.body.group,
      owner: req.body["owner"],
      approver: approver,
      tcardapprover: tcardapprover,
      start_date: req.body["startTime"],
      end_date: req.body["endTime"],
      description: req.body["details"],
      title: req.body["title"],
      room: hacklab,
    });
    await request.save();

    req.body.group.update({$push: {'requests': request}});

    res.send(request);
  }
);

module.exports = router;