'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Request extends Model {
   static associate(models) {
        this.belongsTo(models.User, {foreignKey:'requesteeId'})
        this.belongsTo(models.Election, {foreignKey:'electionId'})
    }
  }
  Request.init({
    requesteeId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    electionId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    requestType:DataTypes.STRING,
    status:DataTypes.STRING,
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'Request',
    tableName:'Request',
    freezeTableName: true, 
  });
//   Request.removeAttribute('id'); //removing the default primary key
  return Request;
};