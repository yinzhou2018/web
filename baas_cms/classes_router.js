const express = require('express');
const db = require('./db/db_operator')

const router = express.Router();

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

router.post('/', async(req, res) => {
  const result = await db.insert(req.params.tableName, req.body).catch(e => e);
  return result;
});

api.get('/', async(req, res) => {
  const result = await db.query(req.params.tableName, req.query).catch(e => e);
  return result;
});

api.get('/:id', (req, res) => {
  const app = apps.find((e) => e.appId === req.params.appId);
  if (app) {
    res.json({ errorCode: 0, entry: app });
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
    res.json({ errorCode: 0, entry: apps[index] });
  }
});

api.delete('/:appId', (req, res) => {
  const index = apps.findIndex((e) => e.appId === req.params.appId);
  if (index === -1) {
    res.json({ errorCode: -1, errorMsg: `can't find the app specified by ${req.params.appId}.` });
  } else {
    apps.splice(index, 1);
    res.json({ errorCode: 0, id: req.params.appId });
  }
});

module.exports = router;