const { Router } = require('express');

const churchController = require('../controllers/churchController');

const routes = Router();

routes.get('/churchs', churchController.index);
routes.get('/church/:id', churchController.show);
routes.post('/church', churchController.store);
routes.put('/church/:id', churchController.update);
routes.delete('/church/:id', churchController.destroy);

module.exports = (app) => app.use('/', routes);
