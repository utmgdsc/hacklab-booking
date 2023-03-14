const express = require("express");
const router = express.Router();
const { Group } = require("../models/group");
const { roleVerify } = require("../middleware/role_middleware");

router.get('/all', roleVerify(['admin']), async (req, res) => {
  let group = await Group.find({});
  res.send(group);
});

router.post('/create', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = new Group(req.body);
  await group.save();
  res.send(group);
});

router.post('/invite/:name', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = new Group(await Group.findOne({ name: req.params.name }));
  group.members.push(req.body.utorid);
  await group.save();
  res.send(group);
});

router.get('/search/byName/:name', roleVerify(['admin']), async (req, res) => {
  let group = await Group.findOne({ name: req.params.name });
  res.send(group);
});

router.get('/search/byMember/:utorid', roleVerify(['admin']), async (req, res) => {
  let group = await Group.find({ members: req.params.utorid });
  res.send(group);
});

router.get('/search/byID/:id', roleVerify(['admin']), async (req, res) => {
  let group = await Group.findOne({ _id: req.params.id });
  res.send(group);
});