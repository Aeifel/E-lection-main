'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Election extends Model {
   static associate(models) {
    this.belongsTo(models.User, {foreignKey:'adminId'}),
      this.hasMany(models.ElectionCandidate),
      this.hasMany(models.ElectionVoter),
      this.hasMany(models.Vote),
      this.hasMany(models.Request)
    }
  }
  Election.init({
    name:DataTypes.STRING,
    adminId:DataTypes.INTEGER,
    status:DataTypes.ENUM("waiting", "ongoing", "finished"),
    winnerId:DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps:false,
    createdAt:false,
    updatedAt:false,
    modelName: 'Election',
    tableName:'Election',
  });
  return Election;
};