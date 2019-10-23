// pages/changeMobile/changeMobile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  pwdInout(event){
    this.setData({
      password: event.detail.value
    }) 
  },
  phoneNumInput(event){
    this.setData({
      mobile: event.detail.value
    })
    console.log(this.data.mobile)
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
      success(res) {
        console.log(res)
        if (res.data.status) {
          modalContent = res.data.data
          modalName = e.currentTarget.dataset.target
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
        })
        that.showModal(modalName)
      }
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
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if(res.data.status){
          that.setData({
            imgUrl: res.data.data.url,
            captcha_key: res.data.data.key
          })
        } else{
          wx.showModal({
            title: '错误',
            content: '图片验证码获取失败',
            showCancel: false
          })
        }
        
      }
    })
  },

  edit(){
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl +`api/user/mobile?token=${token}`
    wx.request({
      url: url,
      data:{
        password:this.data.password,
        mobile:this.data.mobile,
        verify:this.data.verify
      },
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      success:(res)=>{
        console.log(res.data)
        if (res.data.status) {
          app.getUserinfo(token)
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
            complete: (res) => {
              setTimeout(function () {
                wx.navigateBack({})
              }, 1500)
            }
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '修改失败',
            showCancel:false
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})