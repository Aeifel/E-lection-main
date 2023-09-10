"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.createTable("Election", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      adminId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: "User",
          key: "id",
        }
      },
      status: {
        type:Sequelize.STRING,
        values:["waiting", "ongoing", "finished", "draw"],
        defaultValue:"waiting",
      },
      winnerId:{
        type: Sequelize.INTEGER,
        foreignKey: true,
        references: {
          model: "User",
          key: "id",
        }
      }

    });

    await queryInterface.createTable("ElectionCandidate", {
      electionId: {
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey:true,
        references:{
          model: "Election",
          key: "id",
        },
      },
      candidateId: {
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey:true,
        references:{
          model:"User",
          key:"id",
        },
      },
    }, {
      uniqueKeys: {
        actions_unique: {
          customIndex: true,
          fields: ['electionId', 'candidateId']
      }
    }
    });

    await queryInterface.createTable("ElectionVoter", {
      electionId: {
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey: true,
        references:{
          model: "Election",
          key: "id",
        },
      },
      voterId: {
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey: true,
        references:{
          model:"User",
          key:"id",
        },
      },
    }, 
    {
      uniqueKeys: {
        actions_unique: {
          fields:['electionId', 'voterId'],
          customIndex: true,
        }
      }
    });

    queryInterface.createTable("Vote",{
      electionId:{
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey:true,
        references:{
          model:"Election",
          key:"id",
        },
      },
      voterId: {
        type:Sequelize.INTEGER,
        foreignKey:true,
        primaryKey:true,
        references:{
          model:"ElectionVoter",
          key:"voterId",
        },
      },
      candidateId: {
        type:Sequelize.INTEGER,
        foreignKey:true,
        references:{
          model:"ElectionCandidate",
          key:"candidateId",
        },
      }
    },
    {
      uniqueKeys: {
        actions_unique: {
            customIndex: true,
            fields: ['electionId', 'voterId']
        }
      }
    });

    await queryInterface.createTable("Request", {
      requesteeId:{
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey:true,
        references:{
          model:"User",
          key:"id",
        }
      },

      electionId:{
        type:Sequelize.INTEGER,
        foreignKey: true,
        primaryKey:true,
        references:{
          model:"Election",
          key:"id",
        }
      },

      requestType: {
        type:Sequelize.STRING,
        values:["candidate", "voter"],
        allowNull:false,
      },

      status:{
        type:Sequelize.STRING,
        values:["waiting", "approved", "rejected"],
        defaultValue:"waiting",
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Request");
    await queryInterface.dropTable("Vote");
    await queryInterface.dropTable("ElectionVoter");
    await queryInterface.dropTable("ElectionCandidate");
    await queryInterface.dropTable("Election");
    await queryInterface.dropTable("User");
  },
};
