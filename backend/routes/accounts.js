const express = require("express");
const router = express.Router();
const { Account } = require("../models/accounts");

// const mongoose = require('mongoose');
//
// const Account = mongoose.model(
//   'Account',
//   { utorid: String,
//     password: String,
//     name: String }
// );
router.get('/login' , (request, response) => {

});

router.get('/logout', (request, response) => {

});

router.post('/register', (request, response) => {
  const utorid = request.body.utorid;
  const password = request.body.password;
  const name = request.body.name;

  const account = new Account({ utorid, password, name });
  account.save().then(() => {
    response.send(account);
  });
});
router.get('/getAll', (request, response) => {
  Account.find({}).then((account) => {
    response.send(account);
  });
});

router.get('/getID/:id', (request, response) => {
  const accountId = Number(request.params.id);
  Account.find({ utorid: accountId }).then((account) => {
    response.send(account);
  });
});

module.exports = router;