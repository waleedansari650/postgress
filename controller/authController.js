const user = require("../db/models/user");
const jwt = require("jsonwebtoken");   
const bcrypt = require('bcrypt');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}
const signup = catchAsync(async (req, res,  next) =>{
   const {userType, firstName, lastName, email, password, confirmPassword} = req.body;
    if(!['1', '2'].includes(userType)){
        throw new AppError("Invalid user type", 400);
    }
    const newUser = await user.create({
        userType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    })
    if(!newUser){
        return next(new AppError("Failed to create the user", 400));
    }
    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;
    result.token = generateToken({
        id : result.id
    })
   

    return res.status(201).json({
        status : "success",
        data : result
    })
})
const login = catchAsync(async (req, res, next)=>{
    const {email, password}  = req.body;
    if(!email || !password){
        return next(new AppError("Email and password are required", 400))
    }
        const result =  await user.findOne({where : {email} });
        console.log("USER : ", result)
        if(!result || !(await bcrypt.compare(password, result.password))){
            return next(new AppError("Incorrect Email or password ", 401))
        }
    const token = generateToken({id : result.id});
    return res.status(200).json({
        status : "success",
        token
        
    });
})   

const authentication  = catchAsync(async (req, res, next)=>{
    let idToken = '';
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        idToken = req.headers.authorization.split(' ')[1];
    }
    if(!idToken){
        return next(new AppError("Please login to getAccess", 401));
    }
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    const freshUser = await user.findByPk(tokenDetail.id);
    if(!freshUser){
        return next(new AppError("User not found", 401));
    }
    req.user = freshUser;
    return next();
})
const restrictTo = (...userType) =>{
    const checkPermision = (req, res, next) =>{
        if(!userType.includes(req.user.userType)){
            return next(new AppError("You don't have permission to perform this action", 403));
        }
        return next();
    }
    return checkPermision;
}


module.exports = {signup, login, authentication, restrictTo};

