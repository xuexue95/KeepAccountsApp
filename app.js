//app.js
App({
  globalData: {
    baseUrl: 'http://jizhang-api-dev.it266.com/',
    money: {
      inMoneyInteger: '0',
      outMoneyInteger: '0',
      inMoneyDecimal: '00',
      outMoneyDecimal: '00'
    },
  },

  getUserinfo(token) {
    var url = this.globalData.baseUrl + `api/user/profile?token=${token}`

    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.globalData.user = res.data.data
      }
    })
  },

  // 获取年月
  GetDate() {
    let date = new Date
    this.globalData.month = date.getFullYear() + '-' + (date.getMonth() + 1)
  },

  onLaunch: function() {

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })

    var token = wx.getStorageSync('token')
    if (token) {
      this.getUserinfo(token)
    }
    this.GetDate()
  },
})