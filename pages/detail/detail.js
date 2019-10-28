// pages/detail/detail.js
const app = getApp()
Component({

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持

  },
  /**
   * 组件的属性列表
   */

  properties: {
    // 接受父组件的给的数据
    bookList: {
      type: Object,
      value: ''
    },
    token: {
      type: String,
      value: ''
    },
    money: {
      type: Object,
      value: ''
    },
    bookId: {
      type: Number,
      value: ''
    }

  },
  /**
   * 组件的初始数据
   */
  data: {

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target,
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    DateChange(e) {
      let date = e.detail.value
      let year = date.split('-')[0]
      let month = date.split('-')[1]
      this.setData({
        year: year,
        month: month
      })
      app.globalData.month = year + '-' + month
      this.triggerEvent('myevent')
    },

    toBookSet() {
      wx.navigateTo({
        url: '../bookSet/bookSet'
      })
    },
    toSetCategory() {
      var TabCur = 0
      wx.navigateTo({
        url: '/pages/setCategory/setCategory?TabCur=' + TabCur,
      })
    },
    goLogin() {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    },
    getDate() {
      let date = new Date
      this.setData({
        year: date.getFullYear(),
        month: date.getMonth() + 1
      })
    },

    chooseBook(e) {
      wx.setStorageSync('bookId', e.currentTarget.dataset.id)
      this.setData({
        modalName: null
      })
      this.triggerEvent('myevent')
    }
  },


  // 组件生命周期
  lifetimes: {

    //  节点树完成，可以用setData渲染节点，但无法操作节点
    attached() {
      this.getDate()
      let scrollHeight = wx.getSystemInfoSync().windowHeight;
      this.setData({
        scrollHeight: scrollHeight - this.data.CustomBar - 50 - 70
      })
    },
  }
})