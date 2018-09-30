const MysqlAdapter = require('./mysql_adapter');

const development = {
  config_db: {
    host: 'pcqbtest.mdb.mig',
    port: 15916,
    user: 'writeuser',
    password: 'fWs2Wg3j36qynafQ',
    database: 'baas',
    charset: 'utf8',
    multipleStatements: true,
    connectionLimit: 3,
  },
};

const product = {
  config_db: {
    host: 'qbcloudctrl.mdb.mig',
    port: 15849,
    user: 'writeuser',
    password: 'CRW8iBYGZiPVRftv',
    database: 'baas',
    charset: 'utf8',
    multipleStatements: true,
    connectionLimit: 3,
  },
};

const local = {
  config_db: {
    user: 'root',
    database: 'baas',
    charset: 'utf8',
    multipleStatements: true
  }
}

let configDB = process.env.DOCKER_ENV === 'formal' ? product.config_db : development.config_db;
if (!process.env.IP) {
  configDB = local.config_db;
}

module.exports = configDB;