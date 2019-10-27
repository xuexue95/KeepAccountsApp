
API

------

### √ 图片验证码

method

```
 GET
```

url 

```
 api/captcha
```

response

```
 {"status": true, "data":{"key":"xxx", "url":"http://www.example.com/xxx"}}
```

------



### √ 发送手机短信验证码

method

```
 POST
```

url

```
 api/sms/verify
```

params

```
 mobile 手机号码
 captcha_code 图形验证码,默认传入空字符串即可。当频繁调用时,此字段启用
 captcha_key    图形验证码key,默认传入空字符串即可。调用`api/captcha`接口得到
```

response

```
 {"status": true,  "data": "发送成功"}

 图片验证码无效
 {"status": false,  "data": "INVALID_CAPTCHA", "code": "INVALID_CAPTCHA"}
```

------



------

### √ 使用手机号码注册

method

```
 POST
```

params

```
 mobile 手机号码
 verify 短信验证码
 password 密码
 nickname 昵称 可选参数
```

url

```
 api/user/register
```

response

```
 {"status": true,  "data": {"token":"xxx",'id'=>'用户id'}}
```

------



### √ 使用手机号和密码获取token

method

```
 POST
```

url

```
 api/user/token/mobile
```

params

```
 mobile    手机号码
 password  密码
 captcha_code   图形验证码,默认传入空字符串即可。当用户多次尝试登录失败后,此字段启用
 captcha_key    图形验证码key,默认传入空字符串即可。调用`api/captcha`接口得到
```

response

```
 {"status": true,  "data": {"token":"xxx",'id'=>'用户id'}}

 图片验证码无效
 {"status": false,  "data": "INVALID_CAPTCHA",  "code": "INVALID_CAPTCHA"}
```

------



------

### √ 使用手机号和短信验证码获取token,并重置密码

method

```
 POST
```

url

```
 api/user/token/sms
```

params

```
 mobile 手机号码
 password 密码
 verify 短信验证码
```

response

```
 {"status": true,  "data": {"token":"xxx",'id'=>'用户id'}}
```

------



------

### √ 注销(退出登录)

method

```
 GET
```

url

```
 api/user/logout?token=TOKEN
```

response

```
 {"status": true,  "data":null}
```

------



------

### √ 获取个人信息

method

```
 GET
```

url

```
 api/user/profile?token=TOKEN
```

response

```
 {
      "status": true,
      "data": {
          "mobile": "手机号",
          "nickname": "昵称"
          "avatar_url": "头像"
      }
 }
```

------



------

### √ 修改个人信息

method

```
 POST
```

params

```
 nickname 昵称
 avatar 头像 使用api/upload/image接口上传图片得到的fileKey
```

url

```
 api/user/profile/update?token=TOKEN
```

------



------

### √ 修改手机号码

url

```
 api/user/mobile?token=TOKEN
```

method

```
 POST
```

params

```
 password 密码
 mobile 新手机号 例如 13888888888
 verify 短信验证码(新手机号)
```

------



------

### √ 修改密码

url

```
 api/user/password?token=TOKEN
```

method

```
 POST
```

params

```
 password 密码
 new_password 新密码
```

------



------

### 首页数据接口

method

```
 get
```

url

```
 api/view/home?token=TOKEN
```

response

```
{
      "status": true,
      "data": {
          "cash": {"month":"2016-08", "in":888.18,"out":90}, //现金流(实收实付)
          "account": {"month":"2016-08", "in":100.50,"out":90},//帐面收支
          "waitingForCollection": 100,   //待付款
          "waitingForPayment": 90        //待收款
      }
 }
```

------



------

### √ 获取帐户信息 (包含停用的帐户 status为20表示停用)

method

```
 get
```

url

```
 api/account?token=TOKEN
```

response

```
{
      "status": true,
      "data": [
                 {"id":1, "name":"帐户名称1", "balance":100.25 ,"sort": 10},
                 {"id":2, "name":"帐户名称2", "balance":200, "sort":10 }
       ]
 }
```

------



------

### √ 新增帐户

method

```
 post
```

url

```
 api/account/create?token=TOKEN
```

params

```
 name 帐户名称 string
 type 帐户类型 int 1.现金 2.银行 3.支付平台 4.其它
 initial_balance 期初余额 可空 默认为0
 remark 备注 可空
 sort 排序值 int  可空 默认为10
```

response

```
{
      "status": true,
      "data": {"id":1}
 }
```

------



------

### √ 修改帐户

method

```
 post
```

url

```
 api/account/update?id=ID&token=TOKEN
```

params

```
 name 帐户名称 string
 type 帐户类型 int 1.现金 2.银行 3.支付平台 4.其它
 remark 备注 string
 sort 排序值  int
```

传入一个或多个参数均可

------



### √ 删除帐户

method

```
 post
```

url

```
 api/account/delete?id=ID&token=TOKEN
```

------



------

### √ 帐户详情

method

```
 get
```

url

```
 api/account/detail?id=ID&token=TOKEN
```

response

```
{
      "status": true,
      "data":  {"id":1, "name":"帐户名称1", "initial_balance":0, "balance":100.25 ,"sort": 10}
}
```



------

### √ 帐户月金额变化汇总

method

```
 get
```

url

```
 api/account/change?id=ID&token=TOKEN
```

params

```
 month 月份 例如 "2016-08" 可选参数 默认为当前月
```

response

```
{
      "status": true,
      "data": {"month":"2016-08", "in":888.18, "out":90}
 }
```

------



------

###  √ 获取收入(支出)类别

method

```
 get
```

url

```
 api/category?token=TOKEN
```

params

```
 type 类型 1收入类别 2支出类别
 dataType 响应数据格式   1.普通列表  2以父级id为key的结构  3树形结构  (默认1)
```

------



------

### √ 新增收入(支出)类别

method

```
 POST
```

url

```
 api/category/create?token=TOKEN
```

params

```
 parent_id  父级id int 如果是顶级大类,此字段填0
 type 类型 int 1收入类别 2支出类别
 name 名称
 sort 排序值 int
```

成功返回

```
{
      "status": true,
      "data": {"id":1}
 }
```

------



------

### √ 删除收入(支出)类别, 如果该分类下有子分类,将一并删除

method

```
 POST
```

url

```
 api/category/delete?id=ID&token=TOKEN
```

------



------

### 修改收入(支出)类别

method

```
 POST
```

url

```
 api/category/update?id=ID&token=TOKEN
```

params

```
 name
 sort 排序值 int
```

传入一个或多个参数均可

------



------

### √ 图片上传 (multipart/form-data)

method

```
 post
```

url

```
 api/upload/image?token=TOKEN
```

name: "file"

response

```
{
  "status": true,
  "data": {
    "status": true,
    "file": {
      "originalName": "1.png",
      "size": 166804,
      "type": "image/png",
      "thumbnailUrl": {
        "_temp": "http://example.com/b5f36.png"         //临时预览图片
      },
      "fileKey": "1e6a3b82-1892-2446-d0a4-f8c0680ad7ab"
    }
  },
  "code": "0"
}
```

------



------

### √ 新增记账

method

```
 POST
```

url

```
 api/record/create?token=TOKEN
```

params

```
 total_money    记帐金额
 money          实付金额
 account_id     帐户id
 category_id    类别id
 date           日期 例如 "2016-10-13"
 company_name   交易对象 允许为空
 remark         备注 允许为空
 image_keys     图片key,如果有多个,用逗号分隔 (使用图片上传接口得到key) 允许为空
```

------



------

### √ 记帐明细列表(已收已付)

method

```
 GET
```

url

```
 api/record/real?token=TOKEN?page=1
```

params

```
 begin_date   开始日期 例如 "2016-11-01" 可选参数 默认为当前月1日
 end_date     结束日期 例如 "2016-11-30" 可选参数 默认为当前月最后一日
 type         类型  1收入 2支付 3全部   可选参数 默认为全部
 category_id  类别ID  可选参数 默认为不限制
 account_id   帐户ID  可选参数 默认为不限制
 company_name 交易对象 可选参数 默认不限制 精确匹配
 page         页码  可选参数 默认为1
```

response

```
{
      "status": true,
      "data":{
          "in":1000.19,
          "out":500,
          "page":{"itemCount":100,"currentPage":1,"pageSize":20,"pageCount":5},
          "list":[
              {"date": "2016-10-13", "money":100, "type":1, "company_name":"交易对象", "remark":"备注"},
              {"date": "2016-10-14", "money":200, "type":2, "company_name":"交易对象", "remark":"备注"}
          ]
     }
```

}

description

```
 in 收入合计
 out 支出合计
 type 类型 1收入 2支出
```

------



------

### 记帐明细列表(帐面)

method

```
 GET
```

url

```
 api/record/account?token=TOKEN
```

params

```
 begin_date   开始日期 例如 "2016-11-01" 可选参数 默认为当前月1日
 end_date     结束日期 例如 "2016-11-30" 可选参数 默认为当前月最后一日
 type         类型  1收入 2支付 3全部   可选参数 默认为全部
 category_id  类别ID  可选参数 默认为不限制
 company_name 交易对象 可选参数 默认不限制 精确匹配
 excel  导出到excel， 默认为0 表示不导出，传入1时，为导出excel
 page 页码，默认为1
```

response

```
{
      "status": true,
      "data":{
          "in":1000.19,
          "out":500,
          "page":{},
          "list":[
              {"date": "2016-10-13", "total_money":200, "paid_money":100, "type":1, "company_name":"交易对象", "remark":"备注"},
              {"date": "2016-10-14", "total_money":200, "paid_money":200, "type":2, "company_name":"交易对象", "remark":"备注"}
          ]
     }
```

}

description

```
 in 收入合计
 out 支出合计
 total_money 帐面收支金额
 paid_money  已付(收)金额
 type 类型 1收入 2支出
```

------



------

### 待收或待付

method

```
 GET
```

url

```
 api/record/account/waiting?token=TOKEN
```

params

```
 type         类型  1收入 2支付 必填参数

 begin_date   开始日期 例如 "2016-11-01" 可选参数 默认为全部
 end_date     结束日期 例如 "2016-11-30" 可选参数 默认为全部
 category_id  类别ID  可选参数 默认为不限制
 company_name 交易对象 可选参数 默认不限制 精确匹配
```

response

```
{
      "status": true,
      "data":{
          "total":1000.19,
          "page":{},
          "list":[
              {"date": "2016-10-13", "total_money":200, "paid_money":100, "company_name":"交易对象", "remark":"备注"},
              {"date": "2016-10-14", "total_money":200, "paid_money":200, "company_name":"交易对象", "remark":"备注"}
          ]
     }
```

}

description

```
 total 金额合计
 total_money 帐面收支金额
 paid_money  已付金额
```

------



------

### √ 记帐单条详情

method

```
 GET
```

url

```
 api/record/detail?id=ID&token=TOKEN
```

response

```
{
      "status": true,
      "data":  {
         "type":1,
         "user_id":1,
         "user_nickname":"记帐人昵称",
         "total_money":300,
         "paid_money":100,
         "category_name":"类别名称",
         "company_name":"交易对象",
         "remark":"备注",
         "created_at":"2016-10-14 18:00:00",
         "updated_at":"2016-10-14 18:00:00",

         "items":[
             {"id":2, "record_id":1,  "account_id":1, "account_name":"帐户名称", "money":100, "date":"2016-11-14 18:00:00", "created_at":"2016-10-14 18:00:00",
                 "images":[
                     {"id":1, "thumbnail":"缩略图url","original":"原图url"}
                 ],
         },
             {"id":3, "record_id":1, "account_id":1, "account_name":"帐户名称", "money":100, "date":"2016-11-14 18:00:00", "created_at":"2016-10-14 18:00:00", "images":[]}
         ]
     }
 }
```

------



------

### √ 删除记帐

method

```
 POST
```

url

```
 api/record/delete?id=ID&token=TOKEN
```

------



------

### √ 修改记帐

method

```
 POST
```

url

```
 api/record/update?id=ID&token=TOKEN
```

params

```
 total_money    记帐金额
 company_name   交易对象
 remark         备注
```

参数至少传一个，例如，只传入total_money时，就只修改total_money内容

------



------

### √ 修改记帐(单条明细)

method

```
 POST
```

url

```
 api/record/item/update?itemId=ITEM_ID&token=TOKEN
```

params

```
 money          实付金额
 account_id     帐户id
 date           日期 例如 "2016-10-13"
 image_keys     图片key,如果有多个,用逗号分隔 (使用图片上传接口得到key) 允许为空
```

参数至少传一个，例如，只传入money时，就只修改money内容

------



------

### 删除记帐(单条明细) 此功能暂未开放

method

```
 POST
```

url

```
 api/record/item/delete?itemId=ITEM_ID&token=TOKEN
```

------



------

### 后续记帐

method

```
 POST
```

url

```
 api/record/sequel?token=TOKEN
```

params

```
 record_id      原始记录id
 money          实付金额
 account_id     帐户id
 date           日期 例如 "2016-10-13"
 image_keys     图片key,如果有多个,用逗号分隔 (使用图片上传接口得到key) 允许为空
```

------



------

### 有权访问的所有帐簿

method

```
 GET
```

url

```
 api/book?token=TOKEN
```

response

```
{
      "status": true,
      "data": [{"id":1, "name":"帐簿名称1", "user_id":创建者id,'user_name':'创建者名称',"sort": 10,"status": 10,"created_at": "1970-01-01 00:00:00","updated_at": "1970-01-01 00:00:00"}]
 }
```

------



------

### 获取当前账簿(激活)

method

```
 GET
```

url

```
 api/book/get-default?token=TOKEN
```

response

```
{
     "status": true,
     "data": {
         "id": 1003,
         "user_id": 1004,         账簿创建者
         'user_name':'创建者名称',
         "name": "默认账簿",       名称
         "sort": 10,              排序值
         "status": 10,            状态
         "created_at": "1970-01-01 00:00:00",
         "updated_at": "1970-01-01 00:00:00"
     }
}
```

没有当前账簿时，data值为null



------

### 设置当前账簿

method

```
 POST
```

url

```
 api/book/set-default?token=TOKEN
```

params

```
 book_id 账簿ID
```

response

```
 成功
{
     "status": true,
     "data": "设置成功"
}

 失败
 {
     "status": false,
     "data": "原因"
}
```

------



------

### 创建帐簿

method

```
 POST
```

url

```
 api/book/create?token=TOKEN
```

params

```
 name 账簿名称
```

response

```
{
      "status": true,
      "data": {id: 帐簿id }
 }
```

------



------

### 删除账簿

method

```
 POST
```

url

```
 api/book/delete?token=TOKEN
```

params

```
 book_id 账簿ID
```

response

```
 成功
{
     "status": true,
     "data": null
}

 失败
 {
     "status": false,
     "data": "原因"
}
```

------



------

### 修改账簿

method

```
 POST
```

url

```
 api/book/update?token=TOKEN
```

params

```
 book_id 账簿ID
 book_name 账簿名称
```

response

```
 成功
{
     "status": true,
     "data": null
}

 失败
 {
     "status": false,
     "data": "原因"
}
```

------



------

### 账簿详情

method

```
 GET
```

url

```
 api/book/detail?token=TOKEN
```

params

```
 book_id 账簿ID
```

response

```
 成功
{
     "status": true,
     "data": {"id":"xx", "name":"xxx"}
}

 失败
 {
     "status": false,
     "data": "原因"
}
```

------



------

### 获取记账成员，不包含该帐簿创建者 (只有账本创建人有此权限)

method

```
 GET
```

url

```
 api/member?token=TOKEN
```

params

```
 book_id 账本ID
```

response

```
{
      "status": true,
      "data": [{"id":1, "mobile":"手机", "nickname":"昵称"}, {"id":2, "mobile":"手机", "nickname":"昵称"}]
 }
```

------



------

### 邀请添加记账成员(只有账本创建人有此权限)

method

```
 POST
```

url

```
 api/member/add?token=TOKEN
```

params

```
 book_id 帐簿id
 mobile 被邀请成员的手机
```

------



------

### 删除记账成员(只有账本创建人有此权限)

method

```
 POST
```

url

```
 api/member/delete?token=TOKEN
```

params

```
 book_id 帐簿id
 user_id 被邀请成员的id
```

------



### √ 提交意见反馈

method

```
 POST
```

url

```
 api/feedback/add?token=TOKEN
```

params

```
 content 意见内容
 contact 联系方式（可选）
```

------


