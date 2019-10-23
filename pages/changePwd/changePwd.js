// pages/changePwd/changePwd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  pwdInout(event) {
    this.setData({
      password: event.detail.value
    })
  },
  NewPwdInout(event) {
    this.setData({
      new_password: event.detail.value
    })
  },
  PwdAgainInout(event) {
    this.setData({
      password_again: event.detail.value
    })
  },

  edit() {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + `api/user/password?token=${token}`
    if (this.data.password && this.data.new_password && this.data.password_again) {
      if (this.data.new_password == this.data.password_again) {
        wx.request({
          url: url,
          data: {
            password: this.data.password,
            new_password: this.data.new_password
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: (res) => {
            console.log(res.data)
            if (res.data.status) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000,
                complete: (res) => {
                  setTimeout(function() {
                    wx.removeStorageSync('token')
                    wx.redirectTo({
                      url: '/pages/login/login',
                    })
                  }, 1000)
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
      }else{
        wx.showModal({
          title: '错误',
          content: '两次密码不一致',
          showCancel: false
        })
      }

    } else {
      wx.showModal({
        title: '错误',
        content: '密码不能为空',
        showCancel: false
      })
    }

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