'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            roleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'id',
                    as: 'roleId',
                }
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            activationCode: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            restoringCode: {
                type: Sequelize.STRING,
                unique: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};
