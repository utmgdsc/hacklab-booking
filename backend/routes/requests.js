const express = require("express");
const router = express.Router();
const { Request } = require("../models/requests");
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

    let group = await Group.findOne({members: req.headers['owner']});

    let request = new Request({
      status: "pending",
      group: group,
      owner: req.headers["owner"],
      approver: "Michael Liut", // idk what this should be
      tcardapprover: "Andrew Wang", // this too
      start_date: req.headers["startTime"],
      end_date: req.headers["endTime"],
      description: req.headers["details"],
      title: req.headers["title"],
      room: hacklab,
    });
    await request.save();

    group.update({$push: {'requests': request}});

    res.send(request);
  }
);

module.exports = router;