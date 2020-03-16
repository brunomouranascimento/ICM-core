const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const churchController = require('../controllers/churchController');

const routes = Router();

routes.use(authMiddleware);

routes.get('/churchs', churchController.index);
routes.get('/church/:id', churchController.show);
routes.post('/church', churchController.store);

module.exports = (app) => app.use('/', routes);
