$(document).ready(function () {
  /* 获取用户聊天对象 */
  var user = {}
  user.name = $('#nickname').text();
  user.ascii = user.name.charCodeAt();
  user.img = $('#userimg').attr("src");
  var socket = io.connect('http://localhost')
  /* 初始化上线信息 */
  socket.emit('user',user)
  socket.on('useradd',(userObj) => {
    $('.group-user').append(`
    <div id="${userObj.ascii}" class="user">
      <img src="${userObj.img}" alt="">
      <span>${userObj.name}</span>
    </div>`);
    console.log(userObj)
  })
});

$(document).unload(function () { 
  io.disconnect()
});
