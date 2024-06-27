const express = require('express');
const { createProject, getAllProject, getProjectById, updateProduct, deleteProject } = require('../controller/projectController');
const { authentication, restrictTo } = require('../controller/authController');
const router  = express.Router();


router.post('/', authentication, restrictTo('1'), createProject);
router.get('/', authentication, restrictTo('1'), getAllProject);
router.get('/:id', authentication, restrictTo('1'), getProjectById);
router.patch('/:id', authentication, restrictTo('1'), updateProduct);
router.delete('/:id', authentication,  restrictTo('1'), deleteProject);
module.exports = router;



