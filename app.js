require('dotenv').config({path : `${process.cwd()}/.env`});
const express = require('express');
const app = express();
const authRouter = require('./route/authRoute');
const projectRouter = require('./route/projectRoute');
const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorcontroller');

app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/user', userRouter);
app.use('*', catchAsync(async(req, res, next)=>{
    throw new AppError("This is error", 404);
   
}))
app.use(globalErrorHandler)
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, ()=>{
    console.log("Server up and running ", PORT);
})



