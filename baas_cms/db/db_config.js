const MysqlAdapter = require('./mysql_adapter');

const local = {
  config_db: {
    user: 'root',
    database: 'baas',
    charset: 'utf8',
    multipleStatements: true
  }
}

module.exports = local.config_db;