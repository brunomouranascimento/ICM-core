const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const authController = require('../controllers/core/authController');

const routes = Router();

routes.use(authMiddleware);

routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);
routes.post('/forgot-password', authController.forgotPassword);
routes.post('/reset-password', authController.resetPassword);

module.exports = (app) => app.use('/', routes);
