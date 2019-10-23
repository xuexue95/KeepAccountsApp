// pages/accountBookSet/accountBookSet.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    accountList: '' //账户列表
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },


  // 删除账户
  delAccount(e) {

    var baseUrl = app.globalData.baseUrl
    var id = e.currentTarget.dataset.id
    var token = wx.getStorageSync('token')
    var url = baseUrl + `api/account/delete?id=${id}&token=${token}`
    wx.request({
      url: url,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status) {
          app.globalData.accountId =''
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000,
            complete: setTimeout(() => {
              this.onShow()
            }, 1000)
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '删除失败',
            showCancel:false,
            complete:(res) =>{
              if (res.confirm) {
                console.log('用户点击确定')
                this.onShow()
              }
            }
          })
        }
      }
    })
  },

  // 修改账户
  editAccount(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/editAccount/editAccount?id=${id}`,
    })
  },

  // 账户列表
  getAccountList(baseUrl, token) {
    var url = baseUrl + `api/account?token=${token}`
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status) {
          this.setData({
            accountList: res.data.data
          })
          app.globalData.accountList = res.data.data
        } else {
          this.setData({
            accountList: []
          })
          app.globalData.accountList = []
        }
        console.log({
          '账户列表': app.globalData.accountList
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight - this.data.CustomBar - 65
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var baseUrl = app.globalData.baseUrl
    let token = wx.getStorageSync('token')
    this.getAccountList(baseUrl, token)
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