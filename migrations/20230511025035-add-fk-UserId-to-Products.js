'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Products', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users'
      },
      allowNull: false,
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Products', 'UserId')
  }
};
