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
    console.log(e);
    this.setData({
      index: e.detail.value
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


// 提交修改
  editAccount(e){
    var name = this.data.name
    var remark = this.data.remark
    var type = String(Number(this.data.index) + 1)
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    var id = this.data.id
    var sort = this.data.sort
    var url = baseUrl+`api/account/update?id=${id}&token=${token}`
    var content
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
      method:'post',
      data:{
        name:name,
        type:type,
        remark:remark,
        sort:sort
      },
      header:{
        "content-type": "application/x-www-form-urlencoded"
      },
      success:(res)=>{
        wx.hideLoading()
        console.log(res.data)
        if (res.data.status) {
          var addSuccess = true
          content = "修改成功"
          this.showModal(e)
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
  },

  // 获取账户详情
  getAccountInfo(id,token){
    var baseUrl = app.globalData.baseUrl
    var url = baseUrl + `api/account/detail?id=${id}&token=${token}`
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:(res)=>{
        wx.hideLoading()
        console.log(res.data)
        if (res.data.status) {
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
            content: '数据加载失败',
            showCancel: false
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var id = options.id
    var token = wx.getStorageSync('token')

    this.getAccountInfo(id,token)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})