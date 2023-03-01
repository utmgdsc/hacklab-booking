const express = require('express');
const mongoose = require('mongoose');
const accounts = require('./routes/accounts');
const {Account} = require("./models/accounts");

mongoose.connect(process.env.DB_URI);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());

// middleware to update the database with the user's information
// TODO: there should be a better way to do this instead of on every request
app.use(async (req, res, next) => {
  if (req.headers['utorid'] === undefined ||
    req.headers['http_mail'] === undefined ||
    req.headers['http_cn'] === undefined) {
    // shibboleth headers not present; only an issue with local development
    res.status(401).send('Unauthorized');
    console.log('Unauthorized');
    next();
  } else {
    let account = await Account.findOne({utorid: req.headers['utorid']})
    if (account === null) {
      let acc = new Account({utorid: req.headers['utorid'], email: req.headers['http_mail'], name: req.headers['http_cn']});
      await acc.save();
      next();
    } else {
      console.log(account);
      let acc = new Account(account);
      acc.email = req.headers['http_mail'];

      // ideally we should use this, but production shibboleth headers are not working
      // account.name = req.headers['http_cn'];

      // so we'll use the utorid instead for now
      acc.name = req.headers['utorid'];
      await acc.save();
      next();
    }
  }
})

app.use('/accounts', accounts);
// app.get('/', (req, res) => {
//   res.send(req.headers);
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})