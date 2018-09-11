const express = require('express')

const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
var app = express()
const http = require('http').Server(app)
var io = require('socket.io').listen(http)

const router = require('./router')(io)
app
  .use('/', express.static('./public'))
  .use('/upload', express.static('./upload'))
  .use(multiparty({uploadDir:'./temp'}))
  .use(bodyParser.urlencoded({ extenfed: false }))
  .use(bodyParser.json())
  /* 试用 redis 存储session会话 */
  .use(session({
    store: new redisStore({
      host: '127.0.0.1',
      port: 6379,
      pass: ''
    }),
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
/* 兼容websocket 要用原生的http组件监听 */
http.listen(80, () => {
  console.log('Server lunach success on 80 port!')
})
