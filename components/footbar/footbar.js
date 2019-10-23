// components/footbar/footbar.js
const app = getApp()
Component({

  options: {　　　　
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    token: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    PageCur: 'detail',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toAccBookSet() {
      wx.navigateTo({
        url: '../accountBookSet/accountBookSet'
      })
    },
    toReport() {
      console.log(app.globalData.accountId)
      var accountId = app.globalData.accountId
      wx.navigateTo({
        url: '../report/report?accountId='+accountId
      })
    },
    goLogin() {
      wx.navigateTo({
        url: '../login/login',
      })
    },

    NavChange(e) {
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
      var myEventDetail = this.data.PageCur
      this.triggerEvent('myevent', myEventDetail)
    },
  },

  // 组件生命周期
  lifetimes: {

    //  节点树完成，可以用setData渲染节点，但无法操作节点
    attached() {

    },
  }
})