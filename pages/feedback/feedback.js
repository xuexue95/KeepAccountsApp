// pages/feedback/feedback.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contact:''
  },

  contentInput(event){
    this.setData({
      content:event.detail.value
    })
  },

  contactInput(event){
    this.setData({
      contact: event.detail.value
    })
  },

  submit(){
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl +'api/feedback/add?token='+token
    if (this.data.content){
      wx.showLoading({ title: '加载中', mask: true })
      wx.request({
        url: url,
        data: {
          content: this.data.content,
          contact: this.data.contact
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
          } else if (res.data.status){
            wx.showToast({
                title: '提交成功',
                icon: 'success',
              success: () => {
                setTimeout(function () {
                  wx.navigateBack({})
                }, 1000)
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提交失败',
        content: '内容不能为空',
        showCancel: false
      })
    }
    
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

  }
})