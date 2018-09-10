const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/user',{useNewUrlParser: true})
module.exports = {
  Post: mongoose.model('Post', mongoose.Schema({
    title: String,
    content: String,
    images: Array,
    postuser: String,
    posttime: String
  }))
}

// new Post({
//   title:'你好啊我来了',
//   content: '你好啊我来了你好啊我来了你好啊我来了你好啊我来了你好啊我来了',
//   postuser: '小兵旭旭',
//   posttime: '2018-9-7'
// }).save()