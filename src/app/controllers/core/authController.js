const bcrypt = require('bcryptjs');

const repository = require('../../repositories/core/authRepository');

const validEmail = require('../../../utils/util');

module.exports = {
  async register(request, response) {
    try {
      const { email } = request.body;

      if (!email.match(validEmail)) {
        return response.status(400).send({
          message: 'Invalid e-mail.',
        });
      }

      const user = await repository.register(request.body);
      const { data, message, token } = user;

      if (!user.data) {
        return response.status(400).send({
          message: user.message,
        });
      }

      return response.status(201).send({
        data,
        message,
        token,
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Registration failed.',
      });
    }
  },

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await repository.authenticate(email);

      if (!user)
        return response.status(400).send({
          message: 'User not found.',
        });

      if (!(await bcrypt.compare(password, user.password)))
        return response.status(401).send({
          message: 'Invalid user/password.',
        });

      user.password = undefined;

      return response.status(200).send({
        user,
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on authenticate, try again.',
        text: error,
      });
    }
  },

  async forgotPassword(request, response) {
    const { email } = request.body;

    try {
      const user = await repository.forgotPassword(email);

      if (!user)
        return response.status(400).send({
          message: 'User not found.',
        });

      return response.status(200).send({
        message: 'Token sent by email.',
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Error on forgot password, try again.',
      });
    }
  },

  async resetPassword(request, response) {
    const { password } = request.body;
    const { token } = request.params;

    try {
      const updatedPassword = await repository.resetPassword(token, password);

      if (updatedPassword.message) {
        return response.status(400).send({ message: updatedPassword.message });
      }

      return response.status(200).send({
        message: 'Password updated.',
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Cannot reset password, try again.',
      });
    }
  },

  async checkToken(request, response) {
    const { token } = request.params;

    try {
      const user = await repository.checkToken(token);

      if (!user)
        return response.status(400).send({
          message: 'Invalid token.',
        });
      return response.status(200).send({
        validToken: true,
      });
    } catch (error) {
      return response.status(400).send({
        message: 'Cannot check token, try again.',
      });
    }
  },
};
