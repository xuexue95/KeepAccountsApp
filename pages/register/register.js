// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile:'',
    captcha_key: '',
    captcha_code: '',
    nickname:'',
    password: '',
    showCaptcha:false
  },


  showCaptcha(){
    this.getCaptcha()
    this.setData({
      showCaptcha:true
    })
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
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: baseUrl+'api/captcha',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success:(res)=>{
        wx.hideLoading()
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
  getVerify() {
    var baseUrl = app.globalData.baseUrl
    var mobile = this.data.mobile
    var captcha_key = this.data.captcha_key
    var captcha_code = this.data.captcha_code
    console.log(mobile, captcha_key, captcha_code)
    wx.showLoading({ title: '加载中', mask: true })
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
        wx.hideLoading()
        console.log(res)
        if (res.data.status) {
          wx.showModal({
            title: '短信验证码',
            content: res.data.data,
            showCancel:false
          })
        } else {
          if (res.data.data == "INVALID_CAPTCHA"){
            wx.showModal({
              title: '获取失败',
              content:'图片验证码错误',
              showCancel: false
            })
          }else{
            wx.showModal({
              title: '获取失败',
              content: res.data.data,
              showCancel: false
            })
          }
          this.setData({
            verify: '',
            captcha_code: '',
            mobile:''
          })
          this.getCaptcha()
        }
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
    wx.showLoading({ title: '加载中', mask: true })
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
        wx.hideLoading()
        console.log(res)
        if (res.data.status) {
          showLogin = true
          modalContent = '注册成功'
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000,
            mask: true,
            complete: function(res) {
              wx.navigateBack({})
            },
          })
        } else {
          wx.showModal({
            title: '注册失败',
            content: res.data.data,
            showCancel:false
          })
          that.setData({
            verify: '',
            captcha_code: '',
            password:'',
            mobile:''
          })
          that.getCaptcha()
        }
      }
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

  }

})