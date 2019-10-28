// pages/login/login.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCaptcha: false,
    mobile: '',
    password: ''
  },

  // 监听手机号输入
  setPhoneNum(event) {
    this.setData({
      mobile: event.detail.value
    })
  },

  // 监听密码输入
  setPwd(event) {
    this.setData({
      password: event.detail.value
    })
  },

  // 监听图片验证码输入
  setCaptcha(event) {
    this.setData({
      captcha_code: event.detail.value
    })
  },

  // 监听短信验证码输入
  setVerify(event) {
    this.setData({
      verify: event.detail.value
    })
  },

  // 获取图片验证码
  getCaptcha() {
    var that = this
    var baseUrl = app.globalData.baseUrl
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: baseUrl + 'api/captcha',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.status) {
          that.setData({
            imgUrl: res.data.data.url,
            captcha_key: res.data.data.key
          })
        } else {
          wx.showModal({
            title: '获取失败',
            content: res.data.data,
            showCancel: false
          })
        }
      }
    })
  },

  // 登录
  login() {
    var baseUrl = app.globalData.baseUrl
    var modalContent
    var showLogin
    var mobile = this.data.mobile
    var password = this.data.password
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code
    if (!mobile) {
      wx.showModal({
        title: '登录失败',
        content: '请输入手机号码',
        showCancel: false
      })
    } else if (!password) {
      wx.showModal({
        title: '登录失败',
        content: '请输密码',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: baseUrl + 'api/user/token/mobile',
        method: 'post',
        data: {
          mobile: mobile,
          password: password,
          captcha_key: captcha_key,
          captcha_code: captcha_code
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.status) {
            var token = res.data.data.token
            wx.setStorageSync('token', token)
            app.getUserinfo(token)
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500,
              complete: (res) => {
                setTimeout(function() {
                  wx.navigateBack({})
                }, 1500)
              }
            })
          } else {
            if (res.data.code == 'INVALID_CAPTCHA' && this.data.showCaptcha) {
              wx.showModal({
                title: '登录失败',
                content: '验证码错误',
                showCancel: false
              })
            } else if (res.data.code == 'INVALID_CAPTCHA') {
              this.setData({
                showCaptcha: true
              })
            } else {
              wx.showModal({
                title: '登录失败',
                content: res.data.data,
                showCancel: false
              })
            }
            this.setData({
              captcha_code: '',
              password: ''
            })
          }
        }
      })
    }
  },

  forget() {
    this.setData({
      mobile: '',
      password: ''
    })
    wx.navigateTo({
      url: '/pages/forgetPwd/forgetPwd',
    })
  },

  register() {
    this.setData({
      mobile: '',
      password: ''
    })
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  goIndex() {
    wx.navigateBack({})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCaptcha()
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

})