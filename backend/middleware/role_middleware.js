const {Account} = require('../models/accounts');

function roleVerify (role_names) {
  return async (req, res, next) => {
    console.log(role_names);
    let account = await Account.findOne({ utorid: req.headers['utorid'] })
    console.log(account);

    if (role_names.includes(account.role)){
      next();
    } else {
      next('route')
    }
  };
}

module.exports = {
  roleVerify
};