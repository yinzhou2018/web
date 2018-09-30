const express = require('express');
const db = require('./db/db_operator')

const router = express.Router();

router.post('/:tableName', async(req, res) => {
  const result = await db.insert(req.params.tableName, req.body).catch(e => e);
  res.json(result);
});

router.get('/:tableName', async(req, res) => {
  const condition = JSON.parse(req.query.cond || '{}');
  const result = await db.query(req.params.tableName, condition).catch(e => e);
  res.json(result);
});

router.put('/:tableName', async(req, res) => {
  const condition = JSON.parse(req.query.cond || '{}');
  const result = await db.update(req.params.tableName, condition, req.body).catch(e => e);
  res.json(result);
});

router.delete('/:tableName', async(req, res) => {
  const condition = JSON.parse(req.query.cond || '{}');
  const result = await db.remove(req.params.tableName, condition).catch(e => e);
  res.json(result);
});

module.exports = router;