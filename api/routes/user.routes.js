const isAuth = require('../middelwares/isAuth');

const {
  Register,
  GetAllUsers,
  Login,
  GetConnectedUser,
} = require('../controllers/user.controllers');

module.exports = (app) => {
  app.post('/api/users', Register);
  app.post('/api/login', Login);
  app.get('/api/users', isAuth, GetAllUsers);
  app.get('/api/user', isAuth, GetConnectedUser);
};
