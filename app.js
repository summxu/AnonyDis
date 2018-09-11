const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
var app = express()

app
  .use('/', express.static('./public'))
  .use('/upload', express.static('./upload'))
  .use(multiparty({uploadDir:'./temp'}))
  .use(bodyParser.urlencoded({ extenfed: false }))
  .use(bodyParser.json())
  .engine('html',require('express-art-template'))
  /* 加载路由 */
  .use(router)
  /* 处理404 */
  .use((erq,res) =>{
    res.render('404.html')
  })
  .listen(80, () => {
    console.log('Server lunach success!')
  })