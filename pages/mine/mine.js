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
    token:{
      type:String,
      value:''
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
      console.log(this.data.modalName)
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
    changePwd(){
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

    logOut(e) {
      var token = wx.getStorageSync('token')
      var baseUrl = app.globalData.baseUrl
      app.globalData.user = ''
      wx.request({
        url: baseUrl + 'api/user/logout?token=' + token,
        success: (res) => {
          console.log(res.data)
          if(res.data.status){
            var name = e.currentTarget.dataset.target
            this.showModal(name)

            wx.removeStorageSync("token")

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
            })
          }
        }
      })
    }
  },


  // 组件生命周期
  lifetimes: {

    //  节点树完成，可以用setData渲染节点，但无法操作节点
    attached() {
      this.setData({
        accountCount: app.globalData.accountCount,
      })
    },
  }
})