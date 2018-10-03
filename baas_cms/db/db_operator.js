const conf = require('./db_config');
const MysqlAdapter = require('./mysql_adapter');
const mysql = new MysqlAdapter(conf);

const opMap = {
  'like': (value) => `%${value}%`,
  'not like': (value) => `%${value}%`,
  '=': (value) => value,
  '!=': (value) => value
};

function _checkTableName(tableName) {
  const validTableNames = ['apps', 'hooks', 'configs', 'containers', 'pages'];
  if (!validTableNames.includes(tableName)) {
    throw { errorCode: -4, errorMsg: `invalid path component: ${tableName}` };
  }
}

function _buiidCondition(condition) {
  let condPart = '';
  let params = [];
  for (const key in condition) {
    if (key !== '_offset_' && key !== '_limit_') {
      const v = condition[key];
      const value = v.value ? v.value : v;
      const op = v.op || 'like';
      const fn = opMap[op];
      if (!fn) {
        throw { errorCode: -3, errorMsg: `'${op}' is an invalid operator for field '${key}'` }
      }
      params = params.concat([key, fn(value)]);
      condPart += ` and ?? ${op} ?`;
    }
  }
  return [condPart, params];
}

Date.prototype.format = function(fmt) {
  const o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

async function query(tableName, condition) {
  _checkTableName(tableName);
  let [condPart, params] = _buiidCondition(condition);

  let limitPart = '';
  let offset = condition._offset_;
  let limit = condition._limit_;
  const numReg = /^[0-9]+$/;
  if (numReg.test(offset) && numReg.test(limit)) {
    limitPart = ' limit ?,?';
    params = params.concat([offset, limit]);
  }

  const result = {};

  if (limitPart.length !== 0) {
    const countSql = `select count(1) as total from ${tableName} where 1 = 1${condPart}`;
    const hr = await mysql.execute(countSql, params);
    Object.assign(result, { total: hr[0].total });
  }

  const dataSql = `select * from ${tableName} where 1 = 1${condPart} order by edit_time desc${limitPart}`;
  const entries = await mysql.execute(dataSql, params);
  entries.forEach((e) => e.edit_time = e.edit_time.format('yyyy-MM-dd hh:mm:ss'));

  Object.assign(result, { errorCode: 0, entries });
  return result;
}

async function insert(tableName, entry) {
  _checkTableName(tableName);
  const sql = `insert into ${tableName} set ?`;
  const result = await mysql.execute(sql, [entry]);
  return { errorCode: 0, id: result.insertId };
}

async function remove(tableName, condition) {
  _checkTableName(tableName);
  let [condPart, params] = _buiidCondition(condition);
  const sql = `delete from ${tableName} where 1 = 1${condPart}`;
  const result = await mysql.execute(sql, params);
  return { errorCode: 0 };
}

async function update(tableName, condition, entry) {
  _checkTableName(tableName);
  let [condPart, params] = _buiidCondition(condition);
  params.unshift(entry);
  const sql = `update ${tableName} set ? where 1 = 1${condPart}`;
  const result = await mysql.execute(sql, params);
  return { errorCode: 0 };
}

module.exports = { query, insert, remove, update };