'use strict';
/** @type {import('DataTypes-cli').Migration} */
import { QueryInterface, DataTypes } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fullName: {
        type: DataTypes.STRING
      },
      userName: {
        type: DataTypes.STRING
      },
      socketId: {
        type: DataTypes.STRING
      },
      communicationUserId: {
        type: DataTypes.STRING
      },
      communicationUserToken: {
        type: DataTypes.TEXT
      },
      password: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue:true
      },
      deletedAt: {
        defaultValue: null,
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('users');
  }
};