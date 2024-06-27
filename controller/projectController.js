const project = require("../db/models/project");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createProject = catchAsync( async (req, res, next)=>{
    const {title, productImage, price, shortDescription, description, productUrl, category, tags} = req.body;
    const userId = req.user.id;
    const newProject = await project.create({
        title,
        productImage,
        price,
        shortDescription,
        description,
        productUrl,
        category,
        tags,
        createdBy : userId,

    })
    return res.status(200).json({
        status : "success",
        data : newProject,
    })
})

const getAllProject = catchAsync(async (req, res, next)=>{
    // project assocication with user 
    const userId = req.user.id;
    const result = await project.findAll({include : "user", where : {createdBy : userId}});
    return res.status(200).json({
        status : "success",
        data : result,
    });

})
// get project by id
const getProjectById = catchAsync(async (req, res, next)    =>{
    const projectId = req.params.id;
    const result = await project.findByPk(projectId, {include : "user"});
    if(!result){
       return next(new AppError("Project not found", 404));
    }
    return res.status(200).json({
        status : "success",
        data : result,
    });
})
// updateProjectController
const updateProduct = catchAsync(async (req, res, next)=>{
    const userId = req.user.id;
    const projectId = req.params.id;
    const {title, productImage, price, shortDescription, description, productUrl, category, tags} = req.body;
//    the project credentials update by the user who create the project
    const result = await project.findOne({where : {id : projectId, createdBy : userId}});
    if(!result){
        return next(new AppError("Project not found", 404));
    }
    result.title = title;
    result.productImage = productImage;
    result.price = price;
    result.shortDescription = shortDescription;
    result.description = description;
    result.productUrl = productUrl;
    result.category = category;
    result.tags = tags;
    const updatedResult = await result.save();
    return res.status(200).json({
        status : "success",
        data : updatedResult,
    });
})
// delete project controller
const deleteProject = catchAsync(async (req, res, next)=>{
    const userId = req.user.id;
    const projectId = req.params.id;
    const result = await project.findOne({where : {id : projectId, createdBy : userId}});
    if(!result){
        return next(new AppError("Project not found", 404));
    }
    await result.destroy();
    return res.json({
        status : "success",
        message : "Project deleted successfully",
    })
})


module.exports = {createProject, getAllProject, getProjectById, updateProduct,deleteProject};

