$(document).ready(function () {
/* 获取 contarner 的margin固定连天框 */  
  setTimeout(() => {
    var marginR = $('.d-nav .container').css('marginRight')
    $('.right').css('right',marginR)
    console.log(marginR)
  }, 100);
  $(window).on('resize',function () { 
    var marginR = $('.d-nav .container').css('marginRight')
    $('.right').css('right',marginR)
  })
  /* load 帖子主页 */
  loadMain()
  /* 聊天框添加滚动事件 */
  var chatbox = document.getElementById('chatbox')
  var roll = new IScroll(chatbox,{
    scrollY:true,
    scrollX:true,
    mouseWheel: true, 
    snap: true
  })
  /* 房间用户滚动事件 */
  var usersroll = new IScroll($('.group-user')[0],{
    scrollY:true,
    scrollX:true,
    mouseWheel: true, 
    snap: true
  })
});

/* 提交发帖 */
var files = []
function imagechange(a) {
  files.push(a.files);
}
function upload1() {
  var fd = new FormData(document.getElementById('form1'))
  files.forEach(item => {
    fd.append('pic',item[0])
  });
  fd.append('postuser',$('#nickname').text())
  $.ajax({
    url: "/sendpost",
    type: "POST",
    data: fd,
    sync: false,
    processData: false,  // 告诉jQuery不要去处理发送的数据
    contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
    success: function(response,status,xhr){
      console.log(response);
      if (response.success) {
        loadMain()
      }
    }
  });
}

/* 加载首页 */
function loadMain() {
  $('.center .left').load("/main");
}
/* load发帖 */
function fatie() {
  $('.center .left').load("/sendpost");
}
/* 我的页面 */
function getme() {
  $('.center .left').load("/me");
}