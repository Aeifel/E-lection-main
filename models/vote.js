'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
   static associate(models) {
        this.belongsTo(models.Election, {foreignKey:'electionId'}),
        this.belongsTo(models.ElectionVoter, {foreignKey:'voterId'}),
        this.belongsTo(models.ElectionCandidate, {foreignKey:'candidateId'})
    }
  }
  Vote.init({
    electionId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    voterId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
    },
    candidateId:DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'Vote',
    tableName:'Vote',
  });
  return Vote;
};