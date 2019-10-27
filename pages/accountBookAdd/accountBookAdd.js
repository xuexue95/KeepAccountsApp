// pages/accountBookAdd/accountBookAdd.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: ['现金', '银行', '支付平台', '其他'],
    name: '',
    balance: '',
    remark: '',
    addSuccess: ''
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
    this.setData({
      type: String(Number(this.data.index) + 1)
    })
  },

  getName(e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
  },
  getBalance(e) {
    this.setData({
      balance: e.detail.value
    })
  },
  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  addAccount(e) {
    var baseUrl = app.globalData.baseUrl
    var name = this.data.name
    var balance = this.data.balance
    var remark = this.data.remark
    var type = this.data.type
    var token = wx.getStorageSync('token')
    var url = baseUrl+`api/account/create?token=${token}`
    var content
   
    if(type){
      wx.showLoading({ title: '加载中', mask: true })
      wx.request({
        url: url,
        data: {
          name: name,
          type: type,
          initial_balance: balance,
          remark: remark,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          wx.hideLoading()
          console.log(res.data)
          if (res.data.status) {
            var addSuccess = true
            content = "添加成功"
            app.globalData.accountId = ''
          } else {
            content = res.data.data
          }
          this.setData({
            content: content,
            addSuccess: addSuccess
          })
          this.showModal(e)
        }
      })
    } else {
      wx.showModal({
        title: '错误',
        content: '请选择账户类型',
        showCancel:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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