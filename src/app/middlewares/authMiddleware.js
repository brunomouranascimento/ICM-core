const jwt = require('jsonwebtoken');

const authConfig = require('../../config/authConfig.json');

module.exports = (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;
    if (
      request.originalUrl === '/authenticate' ||
      request.originalUrl === '/register' ||
      request.originalUrl === '/forgot-password' ||
      request.originalUrl === '/reset-password'
    ) {
      return next();
    } else {
      if (!authHeader)
        return response.status(401).send({
          message: 'No token provided.'
        });

      const parts = authHeader.split(' ');

      if (!parts.length === 2)
        return response.status(401).send({
          message: 'Token error.'
        });

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme))
        return response.status(401).send({
          message: 'Malformatted token.'
        });

      jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
          return response.status(401).send({
            message: 'Invalid token or expired.'
          });
        request.userId = decoded.id;
        return next();
      });
    }
  } catch (err) {
    return response.status(400).send({ err });
  }
};
