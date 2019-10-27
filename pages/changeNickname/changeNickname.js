// pages/changeNickname/changeNickname.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  nameInput(e) {
    console.log(e.detail.value)
    this.setData({
      nickname: e.detail.value
    })
  },
  clear() {
    this.setData({
      nickname: ''
    })
  },
  save() {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + `api/user/profile/update?token=${token}`
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
      data: {
        nickname: this.data.nickname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.status) {
          app.getUserinfo(token)
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500,
            complete: setTimeout(function() {
              wx.navigateBack({})
            }, 1500)

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      nickname: options.name
    })
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