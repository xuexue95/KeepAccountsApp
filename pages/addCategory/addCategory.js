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
  },

  // 添加类别
  add() {
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    var type = this.data.type
    var name = this.data.name
    if (!name) {
      wx.showModal({
        title: '错误',
        content: '请正确输入类别名称',
        showCancel: false,
      })
    } else {
      wx.showLoading({ title: '加载中', mask: true })
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
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000,
              complete: () => {
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              }
            })
          } else {
            wx.showModal({
              title: '添加失败',
              content: res.data.data,
            })
          }
        }
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

  }
})