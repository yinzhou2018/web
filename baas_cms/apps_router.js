const express = require('express');

const api = express.Router();

const apps = [{
    appId: 'sample',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {
      mongo: {
        uri: 'mongodb://uther:uther@100.65.31.149:27017,100.102.135.2:27017,100.94.25.85:27017/mastertest?replicaSet=qbset0'
      },
      mysql: {
        host: 'pcqbtest.mdb.mig',
        port: 15916,
        user: 'writeuser',
        password: 'fWs2Wg3j36qynafQ',
        database: 'baas',
        charset: 'utf8',
        multipleStatements: true,
        connectionLimit: 3,
      }
    }
  },
  {
    appId: 'sample1',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {
      mongo: {
        uri: 'mongodb://uther:uther@100.65.31.149:27017,100.102.135.2:27017,100.94.25.85:27017/mastertest?replicaSet=qbset0'
      },
      mysql: {
        host: 'pcqbtest.mdb.mig',
        port: 15916,
        user: 'writeuser',
        password: 'fWs2Wg3j36qynafQ',
        database: 'baas',
        charset: 'utf8',
        multipleStatements: true,
        connectionLimit: 3,
      }
    }
  }
];

Date.prototype.format = function(fmt) { //author: meizz 
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

api.post('/', (req, res) => {
  let app = req.body;
  if (apps.find((e) => e.appId === app.appId)) {
    res.json({ errorCode: -2, errorMsg: `the app specified by ${app.appId} has existed.` });
  } else {
    app.updateTime = new Date();
    app.updateTime = app.updateTime.format("yyyy-MM-dd hh:mm:ss");
    apps.push(app);
    res.json({ errorCode: 0, app });
  }
});

api.get('/', (req, res) => {
  res.json({ errorCode: 0, apps, total: apps.length });
});

api.get('/:appId', (req, res) => {
  const app = apps.find((e) => e.appId === req.params.appId);
  if (app) {
    res.json({ errorCode: 0, app });
  } else {
    res.json({ errorCode: -1, errorMsg: `can't find the app specified by ${req.params.appId}.` });
  }
});

api.put('/:appId', (req, res) => {
  const index = apps.findIndex((e) => e.appId === req.params.appId);
  if (index === -1) {
    res.json({ errorCode: -1, errorMsg: `can't find the app specified by ${req.params.appId}.` });
  } else {
    const app = req.body;
    app.updateTime = new Date();
    app.updateTime = app.updateTime.format("yyyy-MM-dd hh:mm:ss");
    Object.assign(apps[index], app);
    res.json({ errorCode: 0, app: apps[index] });
  }
});

module.exports = api;