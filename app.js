require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const config = require('./config');
const authRoutes = require('./api/routes/authRoutes');
const userRoutes = require('./api/routes/userRoutes');
const productRoutes = require('./api/routes/productRoutes');
const errorHandler = require('./api/middlewares/errorMiddleware');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.'
});

app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ message: 'API de Autenticación v1.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes) 

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 server running on: http://localhost:${config.port}`);
});