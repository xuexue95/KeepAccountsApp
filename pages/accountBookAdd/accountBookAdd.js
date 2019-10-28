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
    this.setData({
      index: e.detail.value
    })
    this.setData({
      type: String(Number(this.data.index) + 1)
    })
  },

// 获取用户输入-----------
  getName(e) {
    this.setData({
      name: e.detail.value
    })
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
  // -----------------------

  addAccount(e) {
    var baseUrl = app.globalData.baseUrl
    var name = this.data.name
    var balance = this.data.balance
    var remark = this.data.remark
    var type = this.data.type
    var token = wx.getStorageSync('token')
    var url = baseUrl+`api/account/create?token=${token}`
    var content

    if(!name){
      wx.showModal({
        title: '添加失败',
        content: '请输入账户名称',
        showCancel: false
      })
    } else if(!type){
      wx.showModal({
        title: '添加失败',
        content: '请选择账户类型',
        showCancel: false
      })
    } else {
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
          if (res.data.code == 'INVALID_TOKEN') {
            wx.showModal({
              title: '添加失败',
              content: '登录信息失效,请重新登录',
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/login',
                  })
                }
              }
            })
          } else if (res.data.status) {
            app.globalData.accountId = ''
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              complete: setTimeout(() => {
                wx.navigateBack({})
              }, 1500)
            })
          } else {
            wx.showModal({
              title: '添加失败',
              content:res.data.data ,
              showCancel:false
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