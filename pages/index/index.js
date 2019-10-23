//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    PageCur: 'detail',
    money: app.globalData.money,
    hasDeatil: false
  },

  onMyEvent: function(e) {
    console.log(e.detail) // 自定义组件触发事件时提供的detail对象
    this.setData({
      PageCur: e.detail
    })
    this.onShow()
  },

  onDetailEvent: function() {

    this.onShow()
  },
  onMineEvent() {
    this.onShow()
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 获取账户列表
  getAccountList(baseUrl, token) {

    wx.request({
      url: baseUrl + `api/account?token=${token}`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if (res.data.status) {
          this.setData({
            accountList: res.data.data
          })
          app.globalData.accountList = res.data.data
          app.globalData.accountCount = res.data.data.length
          console.log({
            '账本列表': res.data.data
          })

          if (res.data.data.length !== 0 && !app.globalData.accountId) {
            var id = res.data.data[0].id
            app.globalData.accountId = id
            this.getMonthMoney(baseUrl, id, token)
            this.getRecordDetail()
          } else {
            var id = app.globalData.accountId
            this.getMonthMoney(baseUrl, id, token)
            this.getRecordDetail()
          }
          console.log('当前账本id:' + app.globalData.accountId)
          console.log(app.globalData.accountId)
          this.setData({
            accountId: app.globalData.accountId
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '收据请求失败',
            showCancel: false
          })
        }
      }
    })
  },

  // 帐户月金额变化汇总
  getMonthMoney(baseUrl, id, token) {
    var that = this
    var url = baseUrl + `api/account/change?id=${id}&token=${token}`
    var month = app.globalData.month
    console.log('当前月份:' + month)

    wx.request({
      url: url,
      method: 'post',
      data: {
        month: month
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.status) {
          console.log({
            '账户月记录': res.data.data
          })
          if (res.data.status) {
            var inMoney = String(parseInt(res.data.data.in).toFixed(2))
            var outMoney = String(parseInt(res.data.data.out).toFixed(2))
            var money = {
              inMoneyInteger: inMoney.split('.')[0],
              outMoneyInteger: outMoney.split('.')[0],
              inMoneyDecimal: inMoney.split('.')[1],
              outMoneyDecimal: outMoney.split('.')[1]
            }
            that.setData({
              money: money
            })
            app.globalData.money = money
          }
          console.log('收入:' + inMoney + ' 支出:' + outMoney)
        } else {
          wx.showModal({
            title: '错误',
            content: '收据请求失败',
            showCancel: false
          })
        }
      }
    })
  },


  // 账户记账记录
  getRecordDetail() {
    var token = wx.getStorageSync('token')
    var begin_date = app.globalData.month + '-1'
    var end_date = app.globalData.month + '-31'
    var account_id = app.globalData.accountId
    var url = app.globalData.baseUrl + `api/record/real?token=${token}`
    wx.request({
      url: url,
      method: 'post',
      data: {
        begin_date: begin_date,
        end_date: end_date,
        account_id: account_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        if(res.data.status){
          console.log({
            '记账列表': res.data.data.list
          })
          if (res.data.data.list.length !==0) {
            this.setData({
              RecordDetailList: res.data.data.list,
              hasDeatil: true

            })
          } else {
            this.setData({
              hasDeatil: false
            })
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '数据请求失败',
            showCancel: false
          })
        }
        
      }
    })
  },

  watchDetail(e) {
    console.log('单条记录id:' + e.currentTarget.dataset.recordid)
    var id = e.currentTarget.dataset.recordid

    wx.navigateTo({
      url: '/pages/billDetail/billDetail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight - this.data.CustomBar - 71 - 46.8 - 55
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
    this.setData({
      RecordDetailList: '',
      accountId: app.globalData.accountId
    })
    console.log(this.data.accountId)
    this.setData({
      money: app.globalData.money,
      userInfo: app.globalData.user
    })

    var token = wx.getStorageSync('token')

    if (token) {
      this.setData({
        token: token
      })
      let baseUrl = app.globalData.baseUrl
      this.getAccountList(baseUrl, token)
    } else {
      this.setData({
        token: ''
      })
    }
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