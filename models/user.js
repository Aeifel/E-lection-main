'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   static associate(models) {
      // this.hasMany(models.Election),
      this.hasMany(models.ElectionCandidate, {foreignKey:'candidateId'}),
      this.hasMany(models.ElectionVoter, {foreignKey:'voterId'}),
      this.hasMany(models.Request, {foreignKey:'requesteeId'})
    }
  }
  User.init({
    name:DataTypes.STRING,
    email: DataTypes.STRING,
    password:DataTypes.STRING,
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'User',
    tableName:'User',
  });
  return User;
};