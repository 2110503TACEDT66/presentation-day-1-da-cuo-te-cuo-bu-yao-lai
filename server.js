const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const cookieParser= require('cookie-parser');
const mongoSanitize=require('express-mongo-sanitize')
const helmet = require('helmet')
const {xss}= require('express-xss-sanitizer')
const rateLimit=require('express-rate-limit')
const hpp=require('hpp');
const cors=require('cors')


dotenv.config({path:'./config/config.env'});


connectDB();

const restaurants= require('./routes/restaurants.js');
const auth= require('./routes/auth.js');
const reservations= require('./routes/reservations.js')
const limiter=rateLimit({
    windowsMs:10*60*1000,
    max:100
})



const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use('/api/v1/restaurants',restaurants);
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservations',reservations);



const PORT = process.env.PORT|| 5000;
const server=app.listen(PORT,console.log('Server running in ',process.env.NODE_ENV,' mode on port ',PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);

    server.close(()=>process.exit(1));
});