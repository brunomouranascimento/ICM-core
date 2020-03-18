const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const auditController = require('../controllers/core/auditController');

const routes = Router();

routes.use(authMiddleware);

routes.get('/audits', auditController.index);

module.exports = (app) => app.use('/', routes);
