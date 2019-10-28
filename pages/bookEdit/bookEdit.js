// pages/bookEdit/bookEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookInfo:{},
    new_book_name:''
  },


  getName(e) {
    this.setData({
      new_book_name: e.detail.value
    })
  },

  // 获取账簿详情
  getBookInfo(book_id){
    var token = wx.getStorageSync('token')
    var baseUrl = app.globalData.baseUrl
    var url = baseUrl + `api/book/detail?token=${token}`
    wx.showLoading({ title: '加载中', mask: true })

    wx.request({
      url: url,
      data: {
        book_id: book_id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.status) {
          this.setData({
            bookInfo: res.data.data,
            book_name: res.data.data.name
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '数据请求失败,请重新登录',
            complete(){
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })
        }
      }
    })
  },

  // 提交修改
  editBook(e){
    var book_id = e.currentTarget.dataset.target
    var token = wx.getStorageSync('token')
    var baseUrl = app.globalData.baseUrl
    var url = baseUrl + `api/book/update?token=${token}`
    var booke_name = this.data.new_book_name
    if (!booke_name){
      wx.showModal({
        title: '修改失败',
        content: '账簿名不能为空' ,
        showCancel: false,
      })
    } else{
      wx.showLoading({ title: '加载中', mask: true })
      wx.request({
        method: 'post',
        url: url,
        data: {
          book_id: book_id,
          book_name: this.data.new_book_name
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
              duration: 1000,
              complete() {
                setTimeout(function () {
                  wx.navigateBack({})
                }, 1000)
              }
            })
          } else {
            wx.showModal({
              title: '修改失败',
              content: res.data.data,
              showCancel: false,
            })
          }
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var book_id = options.id
    this.getBookInfo(book_id)
  },
})