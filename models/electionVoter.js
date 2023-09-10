'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElectionVoter extends Model {
   static associate(models) {
        this.belongsTo(models.Election, {foreignKey:'electionId'}),
        this.belongsTo(models.User, {foreignKey:'voterId'})
    }
  }
  ElectionVoter.init({
    electionId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    voterId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'ElectionVoter',
    tableName:'ElectionVoter',
  });
  return ElectionVoter;
};