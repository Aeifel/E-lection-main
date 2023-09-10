'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ElectionCandidate extends Model {
   static associate(models) {
        this.belongsTo(models.Election, {foreignKey:'electionId'}),
        this.belongsTo(models.User, {foreignKey:'candidateId'})
    }
  }
  ElectionCandidate.init({
    electionId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    candidateId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'ElectionCandidate',
    tableName:'ElectionCandidate',
  });
  return ElectionCandidate;
};