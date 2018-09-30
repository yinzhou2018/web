const mysql = require('mysql');

class MysqlAdapter {
  constructor(conf) {
    this.pool = mysql.createPool(conf);
  }

  execute(sql, params) {
    const fSql = params ? mysql.format(sql, params) : sql;
    const pool = this.pool;
    return new Promise((resolve, reject) => {
      const q = pool.query(fSql, (err, ret) => {
        if (!err) {
          resolve(ret);
        } else {
          console.error(`error sql: ${q.sql}`);
          reject({ errorCode: -2, errorMsg: err.message });
        }

        console.log(q.sql);
      });
    });
  }
}

module.exports = MysqlAdapter;