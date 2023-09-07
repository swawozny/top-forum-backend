'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RolePermissions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            roleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Roles',
                    key: 'id',
                    as: 'roleId',
                }
            },
            permissionId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Permissions',
                    key: 'id',
                    as: 'permissionId',
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('RolePermissions');
    }
};
