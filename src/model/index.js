const { Sequelize, DataTypes } = require('sequelize')
const logger = require('../api/logger')
const env = require('../config/env').db
const sequelize = new Sequelize(
    env.database,
    env.user,
    env.password,
    {
        host: env.host,
        dialect: 'mariadb',
        port: env.port,
        pool: {
            max: 10,
            min: 10,
            acquire: 30000,
            idle: 10000
        }
    }, {
    define: {
        indexes: false,
    }
}
)


sequelize.authenticate().then(() => {
    logger.info("client_db Connection established")
}).catch(err => {
    logger.error("client_db Connection error: " + err);
})

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize
db.user = require("../user/model")(sequelize, DataTypes);
db.company = require("../company/model")(sequelize, DataTypes);
db.appPort = require("../appport/model")(sequelize, DataTypes);

db.company.belongsTo(db.user, {
    foreignKey: 'userId',
    as: 'user'
})
db.user.hasOne(db.company,{
    foreignKey: 'companyId',
    as: 'company'
})
db.appPort.belongsTo(db.company, {
    foreignKey: 'companyId',
    as: 'company'
})
db.company.hasMany(db.appPort,{
    as:'appports'
})
db.sequelize.sync({ force: false, alter: true }).then(() => {
    logger.info("Datatase client is synchronize")
})

module.exports = db