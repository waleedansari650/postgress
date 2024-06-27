const {Sequelize} = require("sequelize");
const user = require('../db/models/user');
const catchAsync = require("../utils/catchAsync");

const getAllUser = catchAsync(async (req, res, next)=>{
    //   [Sequelize.Op.ne] : '0'  means not equal to 0
    // OP operator is used to perform logical operations
    // ne not equal to
    //  the us of userType : {[Sequelize.Op.ne] : '0'},}, is not to include the admin user

    const users  = await user.findAndCountAll({
        where : {
            userType : {
                [Sequelize.Op.ne] : '0'
            },
        },
        // and also exclude the password
        attributes : {
            exclude : ['password']
        }
    });
    return res.status(200).json({
        status : "success",
        data : users
    })
})
module.exports = {getAllUser};








