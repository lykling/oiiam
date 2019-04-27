/**
 * Copyright (C) 2019 All rights reserved.
 *
 * @file modules
 * @author Pride Leong<lykling.lyk@gmail.com>
 */

import Sequelize from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './oiiam.sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export const User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING(254),
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: Sequelize.STRING(60).BINARY,
        allowNull: false,
    },
}, {
    tableName: 'oiiam_user',
    underscored: true,
    timestamps: true,
    createAt: 'create_at',
    updateAt: 'update_at',
    deleteAt: 'delete_at',
    paranoid: true,
});

export default sequelize;
