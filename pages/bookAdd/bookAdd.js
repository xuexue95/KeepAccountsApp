// pages/bookAdd/bookAdd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  bookAdd(){
    var baseUrl = app.globalData.baseUrl
    var name = this.data.name
    var token = wx.getStorageSync('token')
    var url = baseUrl + `api/book/create?token=${token}`
    if(this.data.name){ 
      wx.showLoading({ title: '加载中', mask: true })

      wx.request({
        url: url,
        method: 'post',
        data: {
          name: this.data.name
        },
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
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1000,
              complete() {
                setTimeout(function () {
                  wx.navigateBack({})
                }, 1000)
              }
            })
          } else {
            wx.showModal({
              title: '添加失败',
              content: res.data.data,
              showCancel: false,
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '添加失败',
        content:'账簿名称不能为空',
        showCancel: false,
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