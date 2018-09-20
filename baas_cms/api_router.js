const express = require('express');

const api = express.Router();

api.get('/apps', (req, res) => {
  res.json([{
      appId: 'sample',
      createTime: '2018-09-20',
      createUser: 'yinzhou',
      updateTime: '2018-09-20',
      updateUser: 'yinzhou',
      description: 'sample应用',
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
      createTime: '2018-09-20',
      createUser: 'yinzhou',
      updateTime: '2018-09-20',
      updateUser: 'yinzhou',
      description: 'sample应用',
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
  ]);
});

module.exports = api;