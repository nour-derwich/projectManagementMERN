const { User } = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ADD NEW USER
module.exports.Register = async (req, res) => {
  try {
    const logUser = await User.findOne({ email: req.body.email });
    // CHECK IF USER EXIST
    if (logUser) {
      res.status(400).json({ msg: 'Email already exist' });
    } else {
      User.create(req.body)
        .then((user) => {
          // TOKEN
          const payload = {
            id: user._id,
          };

          const token = jwt.sign(payload, 'supersecret', {
            expiresIn: '10d',
          });
          res.status(200).json({ user, token });
        })
        .catch((err) => res.status(400).json(err));

      // return res.json({ user, token });
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

// LOGIN
module.exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ msg: 'Email not found' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Wrong password' });
    }
    // TOKEN
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, 'supersecret', {
      expiresIn: '10d',
    });

    return res.json({ user, token });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL USERS
module.exports.GetAllUsers = (req, res) => {
  User.find()
    .then((users) => res.json({ users }))
    .catch((err) => res.status(400).json({ msg: 'Something went wrong', err }));
};

// GET CONNECTED USER
module.exports.GetConnectedUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  // console.log(`** user => ${user}`);
  if (!user) {
    res.status(400).json({ msg: 'User not exist' });
  }
  return res.json(user);
};
