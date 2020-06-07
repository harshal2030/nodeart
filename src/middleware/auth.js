const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize')

const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.KEY);
      console.log(decoded);
  
      const user = await User.findOne({
        where: {
          username: decoded.username,
          tokens: {
            [Op.contains]: [token],
          },
        },
      });

      console.log(user);
  
      if (!user) {
        throw new Error();
      }
  
      req.token = token;
      req.user = user.toJSON();
      next();
    } catch (e) {
      console.log(e);
      res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = { auth };
