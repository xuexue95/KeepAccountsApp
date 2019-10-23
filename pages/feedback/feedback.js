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
    console.log(event.detail.value)
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
          console.log(res.data)
          wx.showModal({
            title: '成功',
            content: '感谢您的意见',
            showCancel: false,
            success: () => {
              setTimeout(function () {
                wx.navigateBack({})
              }, 1000)
            }
          })
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