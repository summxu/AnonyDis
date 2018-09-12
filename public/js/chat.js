$(document).ready(function () {
  /* 获取用户聊天对象 */
  var user = {}
  user.name = $('#nickname').text();
  user.ascii = user.name.charCodeAt();
  user.img = $('#userimg').attr("src");
  var socket = io.connect('http://localhost')
  /* 初始化上线信息 */
  socket.emit('login',user)
  socket.on('userRender',(users) => {
    $('.group-user').html('')
    users.forEach(element => {
      $('.group-user').append(`
      <div id="${element.ascii}" class="user">
        <img src="${element.img}" alt="">
        <span>${element.name}</span>
      </div>`);
    });
  })
  /* 发送消息 */
  $('.sendmsg-btn').on('click', function () {
    user.msg = $('.sendmsg').val();
    socket.emit('msg',user)
    $('.sendmsg').val('');
  });
  /* 收到消息 */
  socket.on('inmsg',(msgObj) => {
    if (msgObj.name === user.name) {
    $('.right .content').append(`
    <div class="message">
      <img src="${msgObj.img}" alt="">
      <span>${msgObj.name}</span>
      <span>${msgObj.time}</span>
      <p>${msgObj.msg}</p>
    </div>
    `);
    }else{
    $('.right .content').append(`
    <div class="message">
      <img src="${msgObj.img}" alt="">
      <span>${msgObj.name}</span>
      <span>${msgObj.time}</span>
      <p>${msgObj.msg}</p>
    </div>
    `);
    }
    
  })
});