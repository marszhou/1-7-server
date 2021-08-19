# 1-7-server

用途：教学，教导学生实现一些简单实用的网站功能，以练习js/dom/ajax方面的知识点。

## Quick Start

```
cp init-data/* ./fake-api

yarn
yarn run dev

或

npm i
npm start
```

## CORS

```
axios.defaults.withCredentials = true
```

服务器只接受http://localhost:5503, http://127.0.0.1:5503, http://mytest.chouti.com:5503的跨域访问

## APIs

### 新闻列表

```
GET /feeds?page=
```

### 排行榜

```
// 24小时排行
GET /top10/h24
// 72小事排行
GET /top10/h72
// 一周排行
GET /top10/h168
```

### 注册

```
POST /account/signUp
contentType: 'application/x-www-form-urlencoded'
phone=&nickname=&passwd=&smsCode=
```

### 登录

```
POST /account/signIn
contentType: 'application/x-www-form-urlencoded'

phone=&passwd=
```

登录身份客户端需发送header

```js
axios.defaults.headers.common['authorization'] = `Bear ${user.token}`
```

### 退出登录

```
POST /account/signOut
```

### 上传头像

```
POST /account/avatar

contentType: 'application/x-www-form-urlencoded'
avatar
```

### 获取评论

```
GET /comments/:feedId
```

### 发评论

```
POST /comments/:feedId

contentType: 'application/x-www-form-urlencoded'
parentId=&content=
```