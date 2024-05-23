'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('job', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      worker_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'worker',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      square_meters: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rooms: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      tasks: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      hourly_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_person: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      municipality: {
        type: Sequelize.STRING,
        allowNull: false,
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
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'accepted', 'completed'],
        allowNull: false,
        defaultValue: 'pending',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('job');
  },
};
