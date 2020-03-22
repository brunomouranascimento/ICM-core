const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../../config/authConfig.json');

const User = require('../../models/userModel');

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
};

class AuthControler {
  async register(request, response) {
    try {
      const { email } = request.body;

      if (await User.findOne({ email }))
        response.status(400).send({
          message: 'User already exists.'
        });

      const user = await User.create(request.body);

      user.password = undefined;

      response.status(200).send({
        data: user,
        message: 'User created.',
        token: generateToken({ id: user.id })
      });
    } catch (err) {
      response.status(400).send({
        message: 'Registration failed.'
      });
    }
  }

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user)
        response.status(400).send({
          message: 'User not found.'
        });

      if (!(await bcrypt.compare(password, user.password)))
        response.status(401).send({
          message: 'Invalid user/password.'
        });

      user.password = undefined;
      user.token = generateToken({ id: user.id });

      response.send({
        data: user
      });
    } catch (err) {
      response.status(400).send({
        message: 'Error on authenticate, try again.'
      });
    }
  }

  async forgotPassword(request, response) {
    const { email } = request.body;

    try {
      const user = await User.findOne({ email });

      if (!user)
        response.status(400).send({
          message: 'User not found.'
        });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });
      response.status(200).send({
        message: 'Sended token.',
        resetPasswordToken: token
      });
    } catch (err) {
      response.status(400).send({
        message: 'Error on forgot password, try again.'
      });
    }
  }

  async resetPassword(request, response) {
    const { email, token, password } = request.body;

    try {
      const user = await User.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires'
      );

      if (!user)
        response.status(400).send({
          message: 'User not found.'
        });

      if (token !== user.passwordResetToken)
        response.status(401).send({
          message: 'invalid token.'
        });

      const now = new Date();

      if (now > user.passwordResetExpires)
        response.status(401).send({
          message: 'Token expired, generate a new one.'
        });

      user.password = password;
      user.updatedAt = new Date();

      await user.save();

      response.status(200).send({
        message: 'Password updated.'
      });
    } catch (err) {
      response.status(400).send({
        message: 'Cannot reset password, try again.'
      });
    }
  }
}

module.exports = new AuthControler();
