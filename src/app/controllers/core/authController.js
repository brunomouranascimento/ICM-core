const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../../config/authConfig.json');

const User = require('../../models/userModel');
const Result = require('../../models/core/resultModel');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

module.exports = {
  async register(request, response) {
    try {
      const { email } = request.body;

      if (await User.findOne({ email }))
        return response.status(400).send(
          new Result({
            notificationLevel: 'Warning',
            message: 'User already exists.'
          })
        );

      const user = await User.create(request.body);

      user.password = undefined;

      return response.status(400).send(
        new Result({
          data: user,
          notificationLevel: 'Success',
          message: 'User created.',
          token: generateToken({ id: user.id })
        })
      );
    } catch (err) {
      return response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Registration failed.'
        })
      );
    }
  },

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user)
        return response.status(401).send(
          new Result({
            notificationLevel: 'Error',
            message: 'User not found.'
          })
        );

      if (!(await bcrypt.compare(password, user.password)))
        return response.status(401).send(
          new Result({
            notificationLevel: 'Error',
            message: 'Invalid user/password.'
          })
        );

      user.password = undefined;
      user.token = generateToken({ id: user.id });

      response.send(
        new Result({
          data: user,
          notificationLevel: 'Success'
        })
      );
    } catch (err) {
      response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on authenticate, try again.'
        })
      );
    }
  },

  async forgotPassword(request, response) {
    const { email } = request.body;

    try {
      const user = await User.findOne({ email });

      if (!user)
        return response.status(400).send(
          new Result({
            notificationLevel: 'Error',
            message: 'User not found.'
          })
        );

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });
      return response.status(200).send(
        new Result({
          notificationLevel: 'Success',
          message: 'Sended token.',
          resetPasswordToken: token
        })
      );
    } catch (err) {
      response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Error on forgot password, try again.'
        })
      );
    }
  },

  async resetPassword(request, response) {
    const { email, token, password } = request.body;

    try {
      const user = await User.findOne({ email }).select(
        '+passwordResetToken passwordResetExpires'
      );

      if (!user)
        return response.status(400).send(
          new Result({
            notificationLevel: 'Error',
            message: 'User not found.'
          })
        );

      if (token !== user.passwordResetToken)
        return response.status(400).send(
          new Result({
            notificationLevel: 'Error',
            message: 'invalid token.'
          })
        );

      const now = new Date();

      if (now > user.passwordResetExpires)
        return res.status(400).send(
          new Result({
            notificationLevel: 'Error',
            message: 'Token expired, generate a new one.'
          })
        );

      user.password = password;
      user.updatedAt = new Date();

      await user.save();

      response.send(
        new Result({
          notificationLevel: 'Success',
          message: 'Password updated.'
        })
      );
    } catch (err) {
      response.status(400).send(
        new Result({
          notificationLevel: 'Error',
          message: 'Cannot reset password, try again.'
        })
      );
    }
  }
};
