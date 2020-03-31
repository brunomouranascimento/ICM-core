const Audit = require('../models/auditModel');

module.exports = (request, response, next) => {
  try {
    if (
      request.originalUrl === '/authenticate' ||
      request.originalUrl === '/register' ||
      request.originalUrl === '/forgot-password' ||
      request.originalUrl === '/reset-password'
    ) {
      return next();
    } else {
      const requestStart = Date.now();
      const log = async (request, response, errorMessage) => {
        const {
          rawHeaders,
          httpVersion,
          method,
          socket,
          url,
          userId,
          body
        } = request;
        const { remoteAddress, remoteFamily } = socket;

        const { statusCode, statusMessage } = response;
        const headers = response.getHeaders();

        Audit.create({
          statusCode,
          statusMessage,
          user: userId,
          route: url,
          method,
          body,
          processingTime: Date.now() - requestStart,
          completeAudit: JSON.stringify({
            timestamp: Date.now(),
            rawHeaders,
            errorMessage,
            httpVersion,
            remoteAddress,
            remoteFamily,
            response: {
              statusCode,
              statusMessage,
              headers
            }
          })
        });
      };

      let body = [];
      let requestErrorMessage = null;

      const getChunk = (chunk) => body.push(chunk);
      const assembleBody = () => {
        body = Buffer.concat(body).toString();
      };
      const getError = (error) => {
        requestErrorMessage = error.message;
      };
      request.on('data', getChunk);
      request.on('end', assembleBody);
      request.on('error', getError);

      const logClose = () => {
        removeHandlers();
        log(request, response, 'Client aborted.');
      };
      const logError = (error) => {
        removeHandlers();
        log(request, response, error.message);
      };
      const logFinish = () => {
        removeHandlers();
        log(request, response, requestErrorMessage);
      };
      response.on('close', logClose);
      response.on('error', logError);
      response.on('finish', logFinish);

      const removeHandlers = () => {
        request.off('data', getChunk);
        request.off('end', assembleBody);
        request.off('error', getError);
        response.off('close', logClose);
        response.off('error', logError);
        response.off('finish', logFinish);
      };
    }
    next();
  } catch (err) {
    return response.status(400).send({ err });
  }
};
