'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('worker', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      id_card_photo_front_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_card_photo_back_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hourly_rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cities: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      municipalities: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      terms_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verified_by_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('worker');
  },
};
