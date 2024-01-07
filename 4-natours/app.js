const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ? GLOBAL MIDDLEWARES

// ? Set security HTTP headers
app.use(helmet());

// ? Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ? Limit requests from same API
const limiter = rateLimit({
  max: 100, // ? 100 request per
  windowMs: 60 * 60 * 1000, // ? one hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ? Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// ? Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ? Data sanitization against XSS
app.use(xss());

// ? Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// ? Serving static files
app.use(express.static(`${__dirname}/public`));

// ? Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ? ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ? Error Handler/Middleware
app.use(globalErrorHandler);

module.exports = app;
