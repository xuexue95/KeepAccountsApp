// pages/login/login.js

var app = getApp()
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
    var that = this
    var baseUrl = app.globalData.baseUrl
    wx.request({
      url: baseUrl + 'api/captcha',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          imgUrl: res.data.data.url,
          captcha_key: res.data.data.key
        })
      }
    })
  },

  // 登录
  login(e) {
    var that = this
    var baseUrl = app.globalData.baseUrl
    var modalContent
    var modalName = e.currentTarget.dataset.target
    var showLogin
    var mobile = this.data.mobile
    var password = this.data.password
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code

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
      success(res) {
        if (res.data.status) {
          var token = res.data.data.token
          console.log({'登录成功':  res.data.data})
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
          modalContent = res.data.data
          that.setData({
            captcha_code: '',
            modalContent: modalContent,
          })
          that.showModal(modalName)
        }
      }
    })
  },
  forget(){
    wx.navigateTo({
      url: '/pages/forgetPwd/forgetPwd',
    })
  },

  register() {
    wx.navigateTo({
      url: '/pages/register/register',
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

  goIndex() {
    wx.navigateBack({

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