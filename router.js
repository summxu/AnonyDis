const express = require('express')
const config = require('./config')
const mongo = require('./mongo')
const multiparty = require('connect-multiparty')
const fs = require('fs')
const moment = require('moment')

moment.locale('zh-cn')

var mutipartMiddeware = multiparty();
var router = express.Router()

router
  .get('/', (req, res) => {
    mongo.Post.find((err, postdata) => {
      if (err) return res.status(500).send('Server error:' + err)
      /* 对象属性抽离，解决template陷入递归 */
      /* mogon取出的对象不正常，转换一下 */
      var data = JSON.stringify(postdata)
      data = JSON.parse(data)
      var images = []
      data.forEach((element,a) => {
        images.push(element.images)
        delete element.images
      });
      console.log(images)
      res.render('index.html', {
        config: config,
        post: data,
        images: images
      })
    })
  })
  .post('/sendpost', mutipartMiddeware, (req, res) => {
    /* 临时图片迁移 */
    console.log(req.body)
    postObj = new mongo.Post({
      title: req.body.title,
      content: req.body.content,
      postuser: req.body.postuser,
      posttime: moment().format('MMMM, h:mm:ss')
    })
    if (req.files.pic.length > 1) {
      var c = req.files.pic.length
      req.files.pic.forEach(item => {
        var target_path = './upload/' + item.name
        fs.rename('./' + item.path, target_path, function (err) {
          if (err) throw err;
          postObj.images.push(target_path.replace('.',''))
          
          c--;
          if (c === 0 ){
            console.log(postObj.images)
            postObj.save((err, result) => {
            if (err) throw err
              res.send('success')
            })
          }
          // 删除临时文件夹文件, 
          fs.unlink('./' + item.path, function () {
            if (err) throw err;
          });
        });
      });
    }else {
      var target_path = './upload/' + req.files.pic.name
      fs.rename('./' + req.files.pic.path, target_path, function (err) {
        if (err) throw err;
        postObj.images.push(target_path.replace('.',''))
        // 删除临时文件夹文件, 
        fs.unlink('./' + req.files.pic.path, function () {
          if (err) throw err;
        });
        postObj.save((err, result) => {
        if (err) throw err
          res.send('success')
        })
      });
    }
  })

module.exports = router