const express = require("express");
const router = express.Router();
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");
const { Account } = require("../models/accounts");
const {ObjectId} = require("mongodb");

router.get('/all', roleVerify(['admin']), async (req, res) => {
  let group = await Group.find({});
  res.send(group);
});

router.post('/create', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let acc = await Account.findOne({ utorid: req.headers['utorid'] });
  let group = new Group({name: req.body.name, members: [acc], requests: [], managers: [acc]});
  await group.save();
  res.send(group);
});

router.post('/invite', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  console.log(req)
  console.log(req.body)
  let group = await Group.findOne({ _id: new ObjectId(req.body.id) });
  console.log(group)
  if (group == null) {
    res.status(404).send('Group not found');
    return;
  }
  let acc = await Account.findOne({ utorid: req.headers['utorid'] });
  if (group.managers.includes(acc["_id"])) {
    let invacc = await Account.findOne({ utorid: req.body.utorid });
    group.members.push(invacc["_id"]);
    await group.save();
    res.send(group);
  } else {
    res.status(403).send('You are not a manager of this group');
  }
});

router.get('/search/byName/:name', roleVerify(['admin']), async (req, res) => {
  let group = await Group.findOne({ name: req.params.name });
  res.send(group);
});

router.get('/search/byMember/:utorid', roleVerify(['admin']), async (req, res) => {
  let group = await Group.find({ members: req.params.utorid });
  res.send(group);
});

router.get('/myGroups', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let acc = await Account.findOne({ utorid: req.headers['utorid'] });
  let group = await Group.find({ members: acc });
  res.send(group);
});

router.get('/search/byID/:id', roleVerify(['admin']), async (req, res) => {
  let group = await Group.findOne({ _id: req.params.id });
  res.send(group);
});

router.get('/search/byID/:id', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = await Group.findOne({ _id: req.params.id });
  let acc = await Account.findOne({ utorid: req.headers['utorid'] });
  console.log(group.members)
  console.log(acc)
  let peoples = []
  for (let i = 0; i < group.members.length; i++) {
    let p = await Account.findOne({ _id: group.members[i] });
    if (group.managers.includes(p["_id"])) {
      peoples.push({name: p.name, utorid: p.utorid, email: p.email, admin: true});
    } else {
      peoples.push({name: p.name, utorid: p.utorid, email: p.email, admin: false});
    }
  }
  console.log(peoples);
  if (group.members.includes(acc["_id"])) {
    group = group.toJSON();
    group["people"] = peoples;
    console.log(group)
    res.send(group);
  } else {
    res.status(403).send('You are not a member of this group');
  }
});

module.exports = router;
