const express = require('express');

const api = express.Router();

const apps = [{
    appId: 'sample',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample1',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample2',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample3',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample4',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample5',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample6',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample7',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample8',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample10',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample11',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample12',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample13',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample14',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample15',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
  {
    appId: 'sample16',
    updateTime: '2018-09-20',
    updateUser: 'yinzhou',
    configuration: {}
  },
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
  const query = req.query;
  const conditionApps = apps.filter((e) => {
    if (query.appId && !e.appId.includes(query.appId)) {
      return false;
    }
    if (query.updateUser && !e.updateUser.includes(query.updateUser)) {
      return false;
    }
    return true;
  });

  const start = query.offset || 0;
  const end = start + query.limit || apps.length;
  const returnApps = conditionApps.slice(start, end);
  res.json({ errorCode: 0, apps: returnApps, total: conditionApps.length });
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

api.delete('/:appId', (req, res) => {
  const index = apps.findIndex((e) => e.appId === req.params.appId);
  if (index === -1) {
    res.json({ errorCode: -1, errorMsg: `can't find the app specified by ${req.params.appId}.` });
  } else {
    apps.splice(index, 1);
    res.json({ errorCode: 0, appId: req.params.appId });
  }
});

module.exports = api;