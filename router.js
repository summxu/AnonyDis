const express = require('express')
const mongo = require('./mongo')
const multiparty = require('connect-multiparty')
const fs = require('fs')
const moment = require('moment')
const md5 = require('blueimp-md5')

moment.locale('zh-cn')

var mutipartMiddeware = multiparty();
var router = express.Router()
/* 暴露函数，通过函数的参数传递IO对象 */
function admin(io) {
  var userGroup = []
  var loginStatus = false
  router
    .get('/', (req, res) => {
      /* 判断登录状态  */
      var userinfo = req.session.user
      console.log(userinfo)
      if (userinfo) {
        loginStatus = true
      } else {
        loginStatus = false
      }
      res.render('index.html', {
        loginStatus: loginStatus,
        userinfo: userinfo
      })
    })
    .post('/sendpost', mutipartMiddeware, (req, res) => {
      /* 临时图片迁移 */
      console.log(req.body)
      postObj = new mongo.Post({
        title: req.body.title,
        content: req.body.content,
        postuser: req.body.postuser,
      })
      if (req.files.pic.length > 1) {
        var c = req.files.pic.length
        req.files.pic.forEach(item => {
          var target_path = './upload/post/' + item.name
          fs.rename('./' + item.path, target_path, function (err) {
            if (err) res.status(500)
            postObj.images.push(target_path.replace('.', ''))
            c--;
            if (c === 0) {
              postObj.save((err, result) => {
                if (err) res.status(500)
                res.json({
                  success: true,
                  message: '发帖成功'
                });
              })
            }
            // 删除临时文件夹文件, 
            fs.unlink('./' + item.path, function () {
              if (err) res.status(500)
            });
          });
        });
      } else {
        var target_path = './upload/post/' + req.files.pic.name
        fs.rename('./' + req.files.pic.path, target_path, function (err) {
          if (err) res.status(500)
          postObj.images.push(target_path.replace('.', ''))
          // 删除临时文件夹文件, 
          fs.unlink('./' + req.files.pic.path, function () {
            if (err) res.status(500)
          });
          postObj.save((err, result) => {
            if (err) res.status(500)
            res.json({
              success: true,
              message: '发帖成功'
            });
          })
        });
      }
    })
    .get('/login', (req, res) => {
      if (loginStatus) res.redirect('/')
      res.render('login.html')
    })
    .get('/logout', (req, res) => {
      req.session.user = null; // 删除session
      loginStatus = false
      res.redirect('/login');
    })
    .post('/login', (req, res) => {
      console.log(req.body)
      mongo.User.findOne({
        username: req.body.username
      }, (err, result) => {
        if (result == null) {
          res.status(200).json({
            code: 1,
            message: '用户不存在'
          })
        } else if (result.status[0]) {
          res.status(200).json({
            code: 3,
            message: '该用户被封禁'
          })
        } else if (result.password === md5(md5(req.body.password))) {
          /* 记录session状态 */
          req.session.user = result
          /* 在响应之前做操作，响应之后的操作一律失效 */
          res.status(200).json({
            code: 0,
            message: '登录成功'
          })
        } else {
          res.status(200).json({
            code: 2,
            message: '密码错误'
          })
        }
      })
    })
    .get('/register', (req, res) => {
      if (loginStatus) res.redirect('/')
      res.render('register.html')
    })
    .post('/register', (req, res) => {
      console.log(req.body)
      mongo.User.findOne({
        username: req.body.username
      }, (err, result) => {
        if (result) {
          res.status(200).json({
            code: 1,
            message: '用户名重复'
          })
        }else if (req.body.password !== req.body.repassword) {
          res.status(200).json({
            code: 3,
            message: '两次密码不一致'
          })
        }else if (req.body.username.length > 12 || req.body.username.length < 5){
          res.status(200).json({
            code: 4,
            message: '用户名长度要5-12位之间'
          })
        }else if (req.body.password.length > 16 || req.body.password.length < 8){
          res.status(200).json({
            code: 5,
            message: '密码长度要8-16位之间'
          })
        }else if(false) {
          res.status(200).json({
            code: 2,
            message: '禁止新用户注册'
          })
        }else {
          new mongo.User({
            username: req.body.username,
            password: md5(md5(req.body.password)),
            nickname: getName()
          }).save((err, doc) => {
            if (err) res.status(500).send(err)
            /* 记录session状态 */
            req.session.user = doc
            res.status(200).json({
              code: 0,
              message: '注册成功'
            })
          })
        }
      })
    })
    .get('/main', (req, res) => {
      mongo.Post.find((err, postdata) => {
        if (err) return res.status(500)
        /* 对象属性抽离，解决template陷入递归 */
        /* mogon取出的对象不正常，转换一下 */
        var data = JSON.stringify(postdata)
        data = JSON.parse(data)
        var images = []
        data.forEach((element, a) => {
          images.push(element.images)
          delete element.images
        });
        res.render('./components/main.html', {
          post: data,
          images: images
        })
      })
    })
    .get('/sendpost', (req, res) => {
      if(!loginStatus) {
        res.send('不登陆无法发帖<script>location.href = "/login"</script>')
      } else {
        res.render('./components/sendpost.html')
      }
      
    })
    .get('/me', (req, res) => {
      res.render('components/me.html')
    })
  /* 进入聊天服务器 */
  io.on('connection', (socket) => {
    if (!loginStatus) return false
    userObj = {}
    socket.on('login', (user) => {
      userObj = user
      console.log(userObj.name + ' : is login')
      /* 上线用户加到组 */
      userGroup.push(userObj)
      io.emit('userRender', userGroup)
    })
    socket.on('msg', (msgObj) => {
      msgObj.time = moment().format('h:mm:ss a');
      io.emit('inmsg', msgObj)
    })
    /* 用户下线 */
    socket.on('disconnect', function () {
      console.log(userObj.name + ' : is logOut');
      var index = userGroup.indexOf(userObj)
      userGroup.splice(index, 1)
      console.log(userGroup)
      io.emit('userRender', userGroup)
    });
  })
  function getName(){
    var familyNames = new Array(
    "赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", 
    "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许",
    "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", 
    "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
    "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", 
    "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",
    "酆", "鲍", "史", "唐", "费", "廉", "岑", "薛", "雷", "贺", 
    "倪", "汤", "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
    "乐", "于", "时", "傅", "皮", "卞", "齐", "康", "伍", "余", 
    "元", "卜", "顾", "孟", "平", "黄", "和", "穆", "萧", "尹"
    );
    var givenNames = new Array(
    "子璇", "淼", "国栋", "夫子", "瑞堂", "甜", "敏", "尚", "国贤", "贺祥", "晨涛", 
    "昊轩", "易轩", "益辰", "益帆", "益冉", "瑾春", "瑾昆", "春齐", "杨", "文昊", 
    "东东", "雄霖", "浩晨", "熙涵", "溶溶", "冰枫", "欣欣", "宜豪", "欣慧", "建政", 
    "美欣", "淑慧", "文轩", "文杰", "欣源", "忠林", "榕润", "欣汝", "慧嘉", "新建", 
    "建林", "亦菲", "林", "冰洁", "佳欣", "涵涵", "禹辰", "淳美", "泽惠", "伟洋", 
    "涵越", "润丽", "翔", "淑华", "晶莹", "凌晶", "苒溪", "雨涵", "嘉怡", "佳毅", 
    "子辰", "佳琪", "紫轩", "瑞辰", "昕蕊", "萌", "明远", "欣宜", "泽远", "欣怡", 
    "佳怡", "佳惠", "晨茜", "晨璐", "运昊", "汝鑫", "淑君", "晶滢", "润莎", "榕汕", 
    "佳钰", "佳玉", "晓庆", "一鸣", "语晨", "添池", "添昊", "雨泽", "雅晗", "雅涵", 
    "清妍", "诗悦", "嘉乐", "晨涵", "天赫", "玥傲", "佳昊", "天昊", "萌萌", "若萌"
    );
    var i = parseInt(  Math.random() * familyNames.length );
    var j = parseInt(  Math.random() * givenNames.length );
    var name = familyNames[i]+givenNames[j];
    console.log(name)
    return name
  }
  return router
}
module.exports = admin