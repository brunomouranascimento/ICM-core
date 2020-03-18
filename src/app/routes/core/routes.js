const fs = require('fs');
const path = require('path');

const dirRoutes = './src/app/routes';

module.exports = (app) => {
  fs.readdirSync(dirRoutes)
    .filter((file) => file.indexOf('.') !== 0 && file !== 'core')
    .forEach((file) => require(path.resolve(dirRoutes, file))(app));
};
