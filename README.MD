# 页面结构
  - 登录注册页
    1.  按钮两行排列
  - 主页
    1.  顶部下部通栏banner
      - 通栏有主页、发帖、提醒、我的
      - 提醒有帖子更新提醒、新消息提醒
    2.  右侧聊天室，M不显示，群成员双排，可折叠
    3.  左侧内容区，可下滑，显示详细
  - M聊天室页
    1.  上方滚动在线user，群成员单排，可折叠
    2.  全屏幕，新开页
    3.  新消息直接在窗口顶部显示
  - 私聊页
    1.  pc直接在右侧直接下方弹出，新消息在顶部banner显示
    2.  chrome提醒
  - 帖子详情页
    1.  两列布局，左方头像和签名，右方帖子主题。
    2.  有显示个数，分页
    3.  下方回复
    4.  详情页聊天室右侧隐藏，可调出
  - 手机帖子详情页
    1.  单列分布
    2.  聊天室弹出
  - 我的页面
    1.  设置头像，用户名，个性签名，年龄，性别
    2.  帖子页面
      - 我发布的，可以删除，但要经过审核
      - 我回复的，可以直接删除
# 路由设计

| 请求方法 | 请求路径 | 请求参数 | 备注 |
| :------| ------: | :------: | :------: |
| GET | / |  | 渲染初始化首页，聊天上线初始化 |
| POST | /sendpost | postid posttitle postimages postcontent postuser posttime| 发帖子 |

# 数据库设计

- user 
  - username
  - password
  - gender
  - age
  - word
  - photo
  - posts
  - discuss
  - registertime
  - lastlogintime

- post
  - title
  - images
  - content
  - postuser
  - posttime

- discuss
  - postid
  - images
  - content
  - discussuser
  - discusstime

- im
  - imtext
  - imuser
  - imtime