const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.belongsTo(models.Role, {
                foreignKey: {
                    defaultValue: 1
                }
            });
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        activationCode: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }


    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true
    });


    return User;
};
