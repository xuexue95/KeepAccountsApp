// pages/mine/mine.js

const app = getApp()
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持

  },
  /**
   * 组件的属性列表
   */

  properties: {
    userInfo: {
      type: Object,
      value: ''
    },
    token: {
      type: String,
      value: ''
    },
    bookCount: {
      type: Number,
      value: ''
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isLogin: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(name) {
      this.setData({
        modalName: name
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },

    feedback() {
      wx.navigateTo({
        url: '/pages/feedback/feedback',
      })
    },
    changePwd() {
      wx.navigateTo({
        url: '/pages/changePwd/changePwd',
      })
    },

    login() {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    },
    userInfo() {
      wx.navigateTo({
        url: '/pages/userInfo/userInfo',
      })
    },
    accountSet() {
      wx.navigateTo({
        url: '/pages/accountSet/accountSet',
      })
    },

    goBookSet() {
      wx.navigateTo({
        url: '/pages/bookSet/bookSet',
      })
    },

    logOut(e) {
      var token = wx.getStorageSync('token')
      var baseUrl = app.globalData.baseUrl
      if (token) {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        wx.request({
          url: baseUrl + 'api/user/logout?token=' + token,
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
              wx.removeStorageSync("token")
              wx.removeStorageSync('bookId')
              app.globalData.money = {
                inMoneyInteger: '0',
                outMoneyInteger: '0',
                inMoneyDecimal: '00',
                outMoneyDecimal: '00'
              }
              this.setData({
                userInfo: '',
                isLogin: false,
                token: '',
                bookCount: 0
              })

              wx.showToast({
                title: '退出成功',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
        app.globalData.user = ''
      } else {
        wx.showModal({
          title: '未登录',
          content: '请先登录后再试',
          showCancel:false
        })
      }
    }
  },


  // 组件生命周期
  lifetimes: {

    //  节点树完成，可以用setData渲染节点，但无法操作节点
    attached() {

    },
  }
})