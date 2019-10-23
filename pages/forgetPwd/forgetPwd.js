// pages/forgetPwd/forgetPwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
    wx.request({
      url: baseUrl + 'api/captcha',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res)
        if (res.data.status) {
          this.setData({
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

  // 获取短信验证码
  getVerify(e) {
    var baseUrl = app.globalData.baseUrl
    var mobile = this.data.mobile
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code
    var modalContent
    var modalName = e.currentTarget.dataset.target
    console.log(mobile, captcha_key, captcha_code)
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
        console.log(res)
        if (res.data.status) {
          modalContent = res.data.data
          modalName = e.currentTarget.dataset.target
        } else {
          modalContent = res.data.data
          this.setData({
            verify: '',
            captcha_code: ''
          })
          this.getCaptcha()
        }
        this.setData({
          modalContent: modalContent,
        })
        this.showModal(modalName)
      }
    })
  },

  save() {
    var url = app.globalData.baseUrl + `api/user/token/sms`
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
        console.log(res.data)
        if (res.data.status) {
          wx.showModal({
            title: '提示',
            content: '重置成功',
            showCancel: false,
            success: () => {
              wx.navigateBack({})
            }
          })

        } else {
          this.setData({
            verify: '',
            captcha_code: ''
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
  },


  // 模态框显示隐藏
  showModal(modalName) {
    this.setData({
      modalName: modalName
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})