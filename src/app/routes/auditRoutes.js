const { Router } = require('express');

const auditMiddleware = require('../middlewares/auditMiddleware');
const auditController = require('../controllers/core/auditController');

const routes = Router();

routes.use(auditMiddleware);

routes.get('/audits', auditController.index);

module.exports = app => app.use('/', routes);
