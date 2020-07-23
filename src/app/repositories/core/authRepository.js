const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../../config/authConfig.json');
const transporter = require('../../../config/mailConfig');

const User = require('../../models/userModel');
const { model } = require('../../models/userModel');

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
};

module.exports = {
  async register(userData) {
    try {
      const { email } = userData;

      if (await User.findOne({ email })) {
        return {
          message: 'User already exists.',
        };
      }

      const user = await User.create(userData);
      await transporter.sendMail({
        to: email,
        from: 'icm@listadelouvores.com',
        subject: 'Cadastro realizado',
        html: '<h1>Seu cadastro foi realizado com sucesso!</h1>',
      });

      user.password = undefined;

      return {
        data: user,
        message: 'User created, confirmation e-mail sended.',
        token: generateToken({ id: user.id }),
      };
    } catch (error) {
      return error;
    }
  },

  async authenticate(email) {
    try {
      const user = await User.findOne({ email }).select('+password');

      user.token = generateToken({ id: user.id });

      return user;
    } catch (error) {
      return error;
    }
  },

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
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
          `,
      });

      user.passwordResetToken = token;

      return user;
    } catch (error) {
      return error;
    }
  },

  async resetPassword(token, password) {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
      }).select('+passwordResetToken passwordResetExpires email');

      if (!user) {
        return {
          message: 'Invalid token.',
        };
      }

      if (token !== user.passwordResetToken) {
        return {
          message: 'Invalid token.',
        };
      }

      const now = new Date();

      if (now > user.passwordResetExpires) {
        return {
          message: 'Token expired, generate a new one.',
        };
      }

      user.password = password;
      user.updatedAt = new Date();
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      await transporter.sendMail({
        to: user.email,
        from: 'icm@listadelouvores.com',
        subject: 'Senha alterada',
        html: `<p>Sua senha foi alterada em ${new Date().toLocaleString()}!</p>`,
      });

      return user;
    } catch (error) {
      return error;
    }
  },

  async checkToken(token) {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
      }).select('+passwordResetToken passwordResetExpires');
      return user;
    } catch (error) {
      return error;
    }
  },
};
