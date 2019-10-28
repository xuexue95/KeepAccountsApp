// pages/changeMobile/changeMobile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCaptcha: false,
  },


  showCaptcha() {
    this.setData({
      showCaptcha: true
    })
  },

  pwdInout(event) {
    this.setData({
      password: event.detail.value
    })
  },
  phoneNumInput(event) {
    this.setData({
      mobile: event.detail.value
    })
  },
  // 监听图片验证码输入
  captchaInput(event) {
    this.setData({
      captcha_code: event.detail.value
    })
  },

  // 监听短信验证码输入
  verifyInput(event) {
    this.setData({
      verify: event.detail.value
    })
  },

  // 获取短信验证码
  getVerify(e) {
    var that = this
    var baseUrl = app.globalData.baseUrl
    var mobile = this.data.mobile
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: baseUrl + 'api/sms/verify',
      method: "POST",
      data: {
        mobile: mobile,
        captcha_key: captcha_key,
        captcha_code: captcha_code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status) {
          wx.showModal({
            title: '短信验证码',
            content: res.data.data,
            showCancel: false
          })
        } else {
          if (res.data.code == "INVALID_CAPTCHA") {
            wx.showModal({
              title: '获取失败',
              content: '图片验证码错误',
              showCancel: false
            })
          } else {
            wx.showModal({
              title: '获取失败',
              content: res.data.data,
              showCancel: false
            })
          }
          this.setData({
            verify: '',
            captcha_code: '',
            mobile: ''
          })
          this.getCaptcha()
        }
      }
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
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 'INVALID_TOKEN') {
          wx.showModal({
            title: '添加失败',
            content: '登录信息失效,请重新登录',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/login/login',
                })
              }
            }
          })
        } else if (res.data.status) {
          that.setData({
            imgUrl: res.data.data.url,
            captcha_key: res.data.data.key
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            showCancel: false
          })
        }
      }
    })
  },

  edit() {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + `api/user/mobile?token=${token}`
    if (!this.data.password) {
      wx.showModal({
        title: '修改失败',
        content: '请输入密码',
        showCancel: false
      })
    } else if (!this.data.mobile) {
      wx.showModal({
        title: '修改失败',
        content: '请输入手机号码',
        showCancel: false
      })
    } else if (!this.data.verify) {
      wx.showModal({
        title: '修改失败',
        content: '请输入短信验证码',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: url,
        data: {
          password: this.data.password,
          mobile: this.data.mobile,
          verify: this.data.verify
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.code == 'INVALID_TOKEN') {
            wx.showModal({
              title: '添加失败',
              content: '登录信息失效,请重新登录',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          } else if (res.data.status) {
            app.getUserinfo(token)
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1500,
              complete: (res) => {
                setTimeout(function() {
                  wx.navigateBack({})
                }, 1500)
              }
            })
          } else {
            wx.showModal({
              title: '修改失败',
              content: res.data.data,
              showCancel: false
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCaptcha()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

})