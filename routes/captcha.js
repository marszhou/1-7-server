const { query } = require('express');
var express = require('express')
var router = express.Router()
var svgCaptcha = require('svg-captcha');
const { success, testCaptcha, error } = require('../common')

router.get('/', function (req, res) {
	var captcha = svgCaptcha.create();
	req.session.captcha = {ts: Date.now(), text:captcha.text};
	res.type('svg');
	res.status(200).send(captcha.data);
});

router.get('/test', (req, res) => {
  const i = req.url.indexOf('?')
  const queryString = req.url.substr(i+1);
  const captcha = req.session.captcha
  req.session.captcha = null
  if (testCaptcha(captcha, queryString)) {
    success(res, {})
  } else {
    error(res, {})
  }
})

module.exports = router
