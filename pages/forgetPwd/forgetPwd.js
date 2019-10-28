// pages/forgetPwd/forgetPwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCaptcha: false
  },

  showCaptcha() {
    this.getCaptcha()
    this.setData({
      showCaptcha: true
    })
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
          this.setData({
            imgUrl: res.data.data.url,
            captcha_key: res.data.data.key
          })
        } else {
          wx.showModal({
            title: '失败',
            content: res.data.data,
            showCancel: false
          })
        }
      }
    })
  },

  // 获取短信验证码
  getVerify(e) {
    var baseUrl = app.globalData.baseUrl
    var mobile = this.data.mobile
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code
    var modalContent
    var modalName = e.currentTarget.dataset.target
    if (!mobile) {
      wx.showModal({
        title: '获取失败',
        content: '请输入手机号',
        showCancel: false
      })
    } else if (!captcha_code) {
      wx.showModal({
        title: '获取失败',
        content: '请输图片验证码',
        showCancel: false
      })
    } else {
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
              password: ''
            })
            this.getCaptcha()
          }
        }
      })
    }
  },

  save() {
    var url = app.globalData.baseUrl + `api/user/token/sms`
    if (!this.data.mobile) {
      wx.showModal({
        title: '重置失败',
        content: '请输入手机号',
        showCancel: false
      })
    } else if (!this.data.password) {
      wx.showModal({
        title: '重置失败',
        content: '请输入密码',
        showCancel: false
      })
    } else if (!this.data.verify) {
      wx.showModal({
        title: '重置失败',
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
        method: 'post',
        data: {
          mobile: this.data.mobile,
          password: this.data.password,
          verify: this.data.verify
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.status) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              complete: setTimeout(() => {
                wx.navigateBack({})
              }, 1500)
            })
          } else {
            this.setData({
              verify: '',
              captcha_code: '',
              password: ''
            })
            this.getCaptcha()
            wx.showModal({
              title: '提示',
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
})