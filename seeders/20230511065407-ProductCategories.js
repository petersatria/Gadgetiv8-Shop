'use strict';
const fs = require('fs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    const data = JSON.parse(fs.readFileSync('./data/productCategories.json', 'utf-8'))
    data.forEach(e => {
      e.createdAt = e.updatedAt = new Date()
    });
    return queryInterface.bulkInsert('ProductCategories', data)
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ProductCategories')
  }
};
