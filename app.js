var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var session = require('express-session')

var indexRouter = require('./routes/index')
var feedsRouter = require('./routes/feeds')
var top10Router = require('./routes/top10')
var usersRouter = require('./routes/users')
var captchaRouter = require('./routes/captcha')
var accountRouter = require('./routes/account')
const { middleware_authorization } = require('./account')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'keyboard cat'}))
app.use(middleware_authorization)

app.use('/', indexRouter)
app.use('/feeds', feedsRouter)
app.use('/top10', top10Router)
app.use('/users', usersRouter)
app.use('/captcha', captchaRouter)
app.use('/account', accountRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
