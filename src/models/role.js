const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            this.hasMany(models.User);
        }
    }

    Role.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles'
    });


    return Role;
};
