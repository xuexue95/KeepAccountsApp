// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 监听昵称输入
  setNickname(event) {
    this.setData({
      nickname: event.detail.value
    })
    console.log(this.data.nickname)
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
      url: baseUrl+'api/captcha',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status){
          this.setData({
            imgUrl: res.data.data.url,
            captcha_key: res.data.data.key
          })
        } else{
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
      url: baseUrl+'api/sms/verify',
      method: "POST",
      data: {
        mobile: mobile,
        captcha_key: captcha_key,
        captcha_code: captcha_code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
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

  // 注册
  register(e) {
    var that = this
    var baseUrl = app.globalData.baseUrl
    var modalContent
    var modalName = e.currentTarget.dataset.target
    var showLogin
    var mobile = this.data.mobile
    var verify = this.data.verify
    var password = this.data.password
    var nickname = this.data.nickname

    wx.request({
      url: baseUrl+ 'api/user/register',
      method: 'post',
      data: {
        mobile: mobile,
        verify: verify,
        password: password,
        nickname: nickname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res)
        if (res.data.status) {
          showLogin = true
          modalContent = '注册成功'
        } else {
          modalContent = res.data.data
          that.setData({
            verify: '',
            captcha_code: ''
          })
          that.getCaptcha()
        }
        that.setData({
          modalContent: modalContent,
          showLogin: showLogin
        })
        that.showModal(modalName)
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