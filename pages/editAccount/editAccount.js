// pages/editAccount/editAccount.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 2,
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
  },

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


  // 提交修改
  editAccount(e) {
    var name = this.data.name
    var remark = this.data.remark
    var type = String(Number(this.data.index) + 1)
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    var id = this.data.id
    var sort = this.data.sort
    var url = baseUrl + `api/account/update?id=${id}&token=${token}`
    var content
    if (!name) {
      wx.showModal({
        title: '修改失败',
        content: '账户名不能为空',
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: url,
        method: 'post',
        data: {
          name: name,
          type: type,
          remark: remark,
          sort: sort
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
              title: '修改成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              complete: setTimeout(() => {
                wx.navigateBack({})
              }, 1500)
            })
          } else {
            wx.showModal({
              title: '修改失败',
              content: res.data.data,
              showCancel: false
            })
          }
        }
      })
    }
  },

  // 获取账户详情
  getAccountInfo(id, token) {
    var baseUrl = app.globalData.baseUrl
    var url = baseUrl + `api/account/detail?id=${id}&token=${token}`
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
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
          this.setData({
            index: String(Number(res.data.data.type) - 1),
            id: res.data.data.id,
            name: res.data.data.name,
            remark: res.data.data.remark,
            created_at: res.data.data.created_at,
            sort: res.data.data.sort,
            balance: res.data.data.balance
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            showCancel: false
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var id = options.id
    var token = wx.getStorageSync('token')

    this.getAccountInfo(id, token)
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

  },
})