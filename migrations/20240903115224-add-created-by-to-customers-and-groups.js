'use strict';

/**
 * This migration adds a 'created_by' column to the 'customers' and 'groups' tables.
 * The 'created_by' column is a foreign key that references the 'id' column in the 'users' table.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Adding the 'created_by' column to the 'customers' table.
     */
    await queryInterface.addColumn('customers', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    });

    /**
     * Adding the 'created_by' column to the 'groups' table.
     */
    await queryInterface.addColumn('groups', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Removing the 'created_by' column from the 'customers' table.
     */
    await queryInterface.removeColumn('customers', 'created_by');
    /**
     * Removing the 'created_by' column from the 'groups' table.
     */
    await queryInterface.removeColumn('groups', 'created_by');
  }
};
