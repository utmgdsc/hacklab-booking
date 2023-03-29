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

router.post('/invite/:email', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = new Group(await Group.findOne({ email: req.params.email }));
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

router.get('/myGroups', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = await Group.find({ members: req.headers['utorid'] });
  res.send(group);
});

router.get('/search/byID/:id', roleVerify(['admin']), async (req, res) => {
  let group = await Group.findOne({ _id: req.params.id });
  res.send(group);
});

router.get('/search/byID/:id', roleVerify(['student', 'prof', 'admin']), async (req, res) => {
  let group = await Group.findOne({ _id: req.params.id });
  if (group.members.includes(req.headers['utorid'])) {
    res.send(group);
  } else {
    res.status(403).send('You are not a member of this group');
  }
});

module.exports = router;