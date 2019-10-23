// pages/addCategory/addCategory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  // 获取input输入内容
  getInput(event) {
    this.setData({
      name: event.detail.value
    })
    console.log(this.data.name)
  },

  // 添加类别
  add() {
    var that = this
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    var type = this.data.type
    var name = this.data.name
    if (name) {
      wx.request({
        url: baseUrl + 'api/category/create?token=' + token,
        method: 'post',
        data: {
          parent_id: 0,
          type: type,
          name: name,
          sort: 0
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          console.log(that.data.TabCur)
          wx.navigateBack()
        }
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '请正确输入类别名称',
        showCancel:false,
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      TabCur: options.TabCur
    })
    this.setData({
      type: this.data.TabCur == 0 ? 2 : 1
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