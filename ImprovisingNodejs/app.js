const path = require('path');
const faceapi = require('face-api.js');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const {Canvas, Image} = require('canvas');
const fileUpload = require('express-fileupload');
faceapi.env.monkeyPatch({Canvas, Image});
const FaceDataset = require('./controllers/FaceDataset');
const ThisRouter = require('./routes/imagerouter');
const viewsrouter = require('./routes/viewsRouter');
const userRouter = require('./routes/userRoutes');
const timesheetRouter = require('./routes/timesheetRoutes');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


//Error handling and Global Error handling
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

app.use(
  fileUpload({
      useTempFiles: true,
  })
);

FaceDataset.LoadModels();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser());
app.use(helmet());

//Middleware to define the mode the program is running in and use the functionality based on that.
if (process.env.NODE_ENV === 'development') {
  //MiddleWares
  app.use(morgan('dev'));
}

//To limit the requests amount from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Request limit exceeded, please try again in an hour'
// })

// app.use('/', limiter);

//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// sanitize data against mongo nosql injections
app.use(mongoSanitize());

//defend agains xss attacks
app.use(xssClean());

//protecting the http parameter pollution from
app.use(hpp({
  whitelist: []
})
);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js" );
    next();
  });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(req.headers);
  next();
});

app.use('/', viewsrouter);
app.use('/faces', ThisRouter);
app.use('/users', userRouter);
app.use('/timesheet', timesheetRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(()=>{
    console.log('DB connection Successful');
}).catch(err => console.log(err));

const port = 8080;

app.listen(port, ()=>{
    console.log(`App running on port${port}....`);
})


