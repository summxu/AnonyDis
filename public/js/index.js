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
  /* 聊天框添加滚动事件 */
  var iscorll = new IScorll($('.right .content')[0],{
    scrollY:false
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
        $('#sendpost').toggle();
        location.reload()
      }
    }
  });
}
/* 发帖显示隐藏 */
function fatie() {
  $('#sendpost').toggle();
}
