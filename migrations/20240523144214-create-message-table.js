'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('message', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sender_type: {
        type: Sequelize.ENUM('user', "worker"),
        allowNull: false,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      receiver_type: {
        type: Sequelize.ENUM('user', 'worker'),
        allowNull: false
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('message');
  }
};
