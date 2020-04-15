const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../../config/authConfig.json');
const transporter = require('../../../config/mailConfig');

const User = require('../../models/userModel');
const validEmail = require('../../../utils/util');

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
};
const repository = require('../../repositories/core/authRepository');
class AuthControler {
  async register(request, response) {
    try {
      const { email } = request.body;

      if (!email.match(validEmail)) {
        return response.status(400).send({
          message: 'Invalid e-mail.'
        });
      }

      const user = await repository.register(request.body, response);
      const { data, message, token } = user;

      if (user) {
        return response.status(400).send({
          message: 'User already exists.'
        });
      }

      return response.status(200).send({
        data,
        message,
        token
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Registration failed.'
      });
    }
  }

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await repository.authenticate(email);

      if (!user)
        return response.status(400).send({
          message: 'User not found.'
        });

      if (!(await bcrypt.compare(password, user.password)))
        return response.status(401).send({
          message: 'Invalid user/password.'
        });

      user.password = undefined;

      return response.status(200).send({
        user
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on authenticate, try again.',
        text: error
      });
    }
  }

  async forgotPassword(request, response) {
    const { email } = request.body;

    try {
      const user = await repository.forgotPassword(email);

      if (!user)
        return response.status(400).send({
          message: 'User not found.'
        });

      return response.status(200).send({
        message: 'Token sent by email.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on forgot password, try again.'
      });
    }
  }

  async resetPassword(request, response) {
    const { password } = request.body;
    const { token } = request.params;

    try {
      const user = await repository.resetPassword(token, password);

      return response.status(200).send({
        message: 'Password updated.'
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Cannot reset password, try again.'
      });
    }
  }

  async checkToken(request, response) {
    const { token } = request.params;

    try {
      const user = await repository.checkToken(token);

      if (!user)
        return response.status(400).send({
          message: 'Invalid token.'
        });
      return response.status(200).send({
        validToken: true
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Cannot check token, try again.'
      });
    }
  }
}

module.exports = new AuthControler();
