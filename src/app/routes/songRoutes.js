const { Router } = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const songController = require('../controllers/songController');

const routes = Router();

routes.use(authMiddleware);

routes.get('/songs', songController.index);
routes.get('/song/:id', songController.show);
routes.post('/song', songController.store);
routes.put('/song/:id', songController.update);
routes.delete('/song/:id', songController.destroy);

module.exports = (app) => app.use('/', routes);
