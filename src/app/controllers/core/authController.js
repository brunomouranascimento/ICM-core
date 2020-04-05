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

class AuthControler {
  async register(request, response) {
    try {
      const { email } = request.body;

      if (!email.match(validEmail)) {
        return response.status(400).send({
          message: 'Invalid e-mail.'
        });
      }

      if (await User.findOne({ email })) {
        return response.status(400).send({
          message: 'User already exists.'
        });
      } else {
        const user = await User.create(request.body);

        await transporter.sendMail({
          to: email,
          from: 'icm@listadelouvores.com',
          subject: 'Cadastro realizado',
          html: '<h1>Seu cadastro foi realizado com sucesso!</h1>'
        });

        user.password = undefined;

        return response.status(200).send({
          data: user,
          message: 'User created, confirmation e-mail sended.',
          token: generateToken({ id: user.id })
        });
      }
    } catch (error) {
      return response.status(400).send({
        message: 'Registration failed.'
      });
    }
  }

  async authenticate(request, response) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user)
        return response.status(400).send({
          message: 'User not found.'
        });

      if (!(await bcrypt.compare(password, user.password)))
        return response.status(401).send({
          message: 'Invalid user/password.'
        });

      user.password = undefined;
      user.token = generateToken({ id: user.id });

      response.send({
        data: user
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
      const user = await User.findOne({ email });

      if (!user)
        return response.status(400).send({
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

      await transporter.sendMail({
        to: email,
        from: 'icm@listadelouvores.com',
        subject: 'Redefinição de senha',
        html: `
            <p>Você solicitou uma redefinição de senha para sua conta.</p>
            <p>Clique neste
              <a href="${
                process.env.FRONTEND_URL || 'http://localhost:3000/'
              }reset-password/${token}">link</a> para redefinir sua senha.
            </p>

            <i>Este link tem validade de <strong>1 hora.</strong></i>
          `
      });

      return response.status(200).send({
        message: 'Token sent by email.',
        resetPasswordToken: token
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
      const user = await User.findOne({
        passwordResetToken: token
      }).select('+passwordResetToken passwordResetExpires email');

      if (!user)
        return response.status(400).send({
          message: 'Invalid token.'
        });

      if (token !== user.passwordResetToken)
        return response.status(401).send({
          message: 'Invalid token.'
        });

      const now = new Date();

      if (now > user.passwordResetExpires)
        return response.status(401).send({
          message: 'Token expired, generate a new one.'
        });

      user.password = password;
      user.updatedAt = new Date();
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      await transporter.sendMail({
        to: user.email,
        from: 'icm@listadelouvores.com',
        subject: 'Senha alterada',
        html: `<p>Sua senha foi alterada em ${new Date().toLocaleString()}!</p>`
      });

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
      const user = await User.findOne({
        passwordResetToken: token
      }).select('+passwordResetToken passwordResetExpires');

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
