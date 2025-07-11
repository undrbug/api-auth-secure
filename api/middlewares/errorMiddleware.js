const config = require('../../config');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    msg: config.nodeEnv === 'production' 
      ? 'Ocurrió un error en el servidor.' 
      : err.message,
    stack: config.nodeEnv === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;