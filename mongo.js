const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/anonydis',{useNewUrlParser: true})
module.exports = {
  Post: mongoose.model('Post', mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    postuser: {
      type: String,
      required: true
    },
    posttime: {
      type: Date,
      /* 创建时直接印入时间戳 */
      default: Date.now
    }
  })),
  User: mongoose.model('User', mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    nickname: {
      type: String,
      required: true
    },
    gender: {
      type: Number,
      /* 保密，女，男 */
      enum: [-1,0,1],
      default: -1
    },
    age: {
      type: Number,
      required: false
    },
    word: {
      type: String,
      required: false
    },
    photo: {
      type: String,
      default: '/img/me.png'
    },
    posts: {
      type: Array,
      required: false
    },
    discuss: {
      type: Array,
      required: false
    },
    lastposttime: {
      type: Date,
      required: false
    },
    registertime: {
      type: Date,
      default: Date.now
    },
    lastlogintime: {
      type: Date,
      required: false
    },
    status: {
      type: Array,
      /* 登录权限，帖子权限，评论权限，聊天权限 */
      default: [0,0,0,0]
    }
  }))
}

// new Post({
//   title:'你好啊我来了',
//   content: '你好啊我来了你好啊我来了你好啊我来了你好啊我来了你好啊我来了',
//   postuser: '小兵旭旭',
//   posttime: '2018-9-7'
// }).save()