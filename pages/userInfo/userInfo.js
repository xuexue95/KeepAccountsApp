// pages/userInfo/userInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    console.log(e.currentTarget.dataset.url)
    console.log(this.data.imgList)
  },

  changeNickname(){
    wx.navigateTo({
      url: '/pages/changeNickname/changeNickname?name='+this.data.user.nickname,
    })
  },
  changeMobile(){
    wx.navigateTo({
      url: '/pages/changeMobile/changeMobile?name=' + this.data.user.mobile,
    })
  },
  changeAvatar(){
    wx.navigateTo({
      url: '/pages/changeAvatar/changeAvatar',
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
    if (app.globalData.user) {
      var list = []
      list.push(app.globalData.user.avatar_url)
      this.setData({
        user: app.globalData.user,
        isLogin: true,
        imgList: list
      })
    }
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