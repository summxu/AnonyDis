const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
const session = require('express-session')
var app = express()
const http = require('http').Server(app)

var io = require('socket.io')(http)
io.on('connection',(socket) => {
  socket.on('msg',(msg) => {
    console.log(msg)
  })
})

app
  .use('/', express.static('./public'))
  .use('/upload', express.static('./upload'))
  .use(multiparty({uploadDir:'./temp'}))
  .use(bodyParser.urlencoded({ extenfed: false }))
  .use(bodyParser.json())
  .use(session({
    secret: 'anonydis', /* 配置加密字符串,保证安全性 */
    resave: false,
    saveUninitialized: true,   /* 无论你用不用session直接分配加密 */
    // cookie : {
    //   maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    // }
  }))
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