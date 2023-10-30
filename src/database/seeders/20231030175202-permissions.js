"use strict"

const permissions = require("../../constants/permissions");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("Permissions", Object.values(permissions).map((permission, index) => ({
            id: index,
            name: permission,
            createdAt: new Date(),
            updatedAt: new Date()
        })), {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Permissions", null, {});
    }
};
