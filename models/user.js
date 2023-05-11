'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile)
      User.hasMany(models.Product)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username is required'
        },
        notEmpty: {
          msg: 'Username is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email is required'
        },
        notEmpty: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Email is not valid'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password is required'
        },
        notEmpty: {
          msg: 'Password is required'
        },
        checkLength() {
          if (this.password.length < 8) {
            throw new Error('Password minimum 8 character');
          }
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user, option) {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(user.password, salt)

        user.password = hash
      },
      beforeUpdate(user, option) {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(user.password, salt)

        user.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};