// pages/accountSet/accountSet.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    bookList: []
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

  // 账户列表
  getAccountList(baseUrl, token) {
    var url = baseUrl + `api/account?token=${token}`
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
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
        } else if (res.data.status) {
          this.setData({
            accountList: res.data.data
          })
        } else {
          this.setData({
            accountList: []
          })
        }
      }
    })
  },

  // 删除账户
  delAccount(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          var baseUrl = app.globalData.baseUrl
          var id = e.currentTarget.dataset.id
          var token = wx.getStorageSync('token')
          var url = baseUrl + `api/account/delete?id=${id}&token=${token}`
          wx.showLoading({
            title: '加载中',
            mask: true
          })
          wx.request({
            url: url,
            header: {
              "content-type": "application/x-www-form-urlencoded"
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
              } else if (res.data.status) {
                app.globalData.accountId = ''
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
                  title: '删除失败',
                  content: res.data.data,
                  showCancel: false,
                  complete: (res) => {
                    if (res.confirm) {
                      this.onShow()
                    }
                  }
                })
              }
            }
          })
        }
      },
    })
  },

  // 修改账户
  editAccount(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/editAccount/editAccount?id=${id}`,
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
})