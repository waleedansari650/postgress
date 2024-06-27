"use strict";
const { Model, Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/database");
const AppError = require("../../utils/appError");
const project = require("./project");
// validations enforce on models

// now copy the object from the migration file and paste it here sequelize.define(user, paste here)
const user = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "User type cannot be null",
        },
        notEmpty: {
          msg: "User type cannot be empty",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "First name cannot be null",
        },
        notEmpty: {
          msg: "First name cannot be empty",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last name cannot be null",
        },
        notEmpty: {
          msg: "Last name cannot be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email cannot be null",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
        isEmail :{
          msg : "Email must be in valid format"
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be null",
        },
        notEmpty: {
          msg: "Password cannot be empty",
        },
      },
    },
    // Sequelize.VIRTUAL just store in the program only not store into the database
    confirmPassword: {
      // type : Sequelize.VIRTUAL,
      type: DataTypes.VIRTUAL,
      set(value) {
        if(this.password.length < 7){
          throw new AppError("Password must be at least 8 characters", 400)
        }
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPassword);
        } else {
          throw new AppError(
            "Password and confirm password must be the same",
            400
          );
        }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "user",
  }
);
// associations
user.hasMany(project, {foreignKey : 'createdBy'});
project.belongsTo(user,{
  foreignKey : 'createdBy'
});

module.exports = user;
