// pages/setCategory/setCategory.js
var app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    category: ['支出', '收入'],
    expenditureList: ''
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  addCategory(e) {
    var url = '/pages/addCategory/addCategory?TabCur=' + this.data.TabCur
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },

  delCategory(e) {
    var baseUrl = app.globalData.baseUrl
    console.log(e.currentTarget.dataset.categoryid)
    var id = e.currentTarget.dataset.categoryid
    var token = wx.getStorageSync('token')
    var url = baseUrl + `api/category/delete?id=${id}&token=${token}`
    console.log(url)
    wx.request({
      url: url,
      method: 'POST',
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        console.log(res.data)
        if(res.data.status){
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000,
            success: setTimeout(() => {
              this.onShow()
            }, 1000)
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '删除失败',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                this.onShow()
              }
            }
          })
        }
      }
    })
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
  //  获取支出分类
  getExpenditureList(baseUrl, token) {
    var that = this
    wx.request({
      url: baseUrl + 'api/category?token=' + token,
      method: 'post',
      data: {
        type: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        app.globalData.expenditureList = res.data
        that.setData({
          expenditureList: res.data.data
        })
        console.log(that.data.expenditureList)
      }
    })
  },

  // 获取收入分类
  getIncomeList(baseUrl, token) {
    var that = this
    wx.request({
      url: baseUrl + 'api/category?token=' + token,
      method: 'post',
      data: {
        type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        app.globalData.incomeList = res.data
        that.setData({
          incomeList: res.data.data
        })
        console.log(that.data.incomeList)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.setData({
        TabCur: options.TabCur,
   
    })
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight - this.data.CustomBar - 55 - 60
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
    var that = this
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    this.getExpenditureList(baseUrl, token)
    this.getIncomeList(baseUrl, token)
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