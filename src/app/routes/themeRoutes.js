const { Router } = require('express');

const themeController = require('../controllers/themeController');

const routes = Router();

routes.get('/themes', themeController.index);
routes.get('/theme/:id', themeController.show);
routes.post('/theme', themeController.store);
routes.put('/theme/:id', themeController.update);
routes.delete('/theme/:id', themeController.destroy);

module.exports = (app) => app.use('/', routes);
