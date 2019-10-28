//index.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    PageCur: 'detail',
    money: app.globalData.money,
    hasDeatil: false,
    bookCount: null,
    bookList: [],
    bookId: wx.getStorageSync('bookId'),
  },

  onMyEvent: function(e) {
    this.setData({
      PageCur: e.detail
    })
    this.onShow()
  },

  onDetailEvent: function() {
    let book_id = wx.getStorageSync('bookId')
    this.changeBook(book_id)
    this.onShow()
  },
  onMineEvent() {
    this.onShow()
  },

  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 获取所有帐簿
  getBook(baseUrl, token) {
    let url = baseUrl + `api/book?token=${token}`
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
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
          let bookList = res.data.data
          let bookCount = bookList.length
          this.setData({
            bookList: bookList,
            bookCount: bookCount
          })
          app.globalData.bookList = bookList
          app.globalData.bookCount = bookCount
          let bookId = wx.getStorageSync('bookId')
          if (bookList.length !== 0 && !bookId) {
            var bookId = bookList[0].id
            wx.setStorageSync('bookId', bookId)

            this.getRecordsList(baseUrl, token)

          } else {

            this.getRecordsList(baseUrl, token)
          }
        }
      }
    })
  },

  // 切换账簿
  changeBook(book_id) {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + `api/book/set-default?token=${token}`
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
      method:'post',
      data:{
        book_id: book_id
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
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
        } else{
          wx.setStorageSync('bookId', book_id)
          this.setData({
            bookId: book_id
          })
        }
      }
    })
  },

  // 记帐明细列表(帐面)
  getRecordsList(baseUrl, token) {
    var url = baseUrl + `api/record/account?token=${token}`
    var begin_date = app.globalData.month + '-1'
    var end_date = app.globalData.month + '-31'
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
      method: 'post',
      data: {
        begin_date: begin_date,
        end_date: end_date
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
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
          if (res.data.data.list.length !== 0) {
            this.setData({
              RecordsList: res.data.data.list,
              hasDeatil: true
            })
            var inMoney = String(parseInt(res.data.data.in).toFixed(2))
            var outMoney = String(parseInt(res.data.data.out).toFixed(2))
            var money = {
              inMoneyInteger: inMoney.split('.')[0],
              outMoneyInteger: outMoney.split('.')[0],
              inMoneyDecimal: inMoney.split('.')[1],
              outMoneyDecimal: outMoney.split('.')[1]
            }
            this.setData({
              money: money
            })
            app.globalData.money = money
          } else {
            var money= {
                inMoneyInteger: '0',
                outMoneyInteger: '0',
                inMoneyDecimal: '00',
                outMoneyDecimal: '00'
            }
            this.setData({
              money: money
            })
            app.globalData.money = money

            this.setData({
              hasDeatil: false
            })
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '账户记账记录数据请求失败,请重新登录',
            showCancel: false,
            complete: () => {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          })
        }
      }
    })
  },

  watchDetail(e) {
    var id = e.currentTarget.dataset.recordid

    wx.navigateTo({
      url: '/pages/billDetail/billDetail?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scrollHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      scrollHeight: scrollHeight - this.data.CustomBar - 71 - 46.8 - 55
    })
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
    this.setData({
      money: app.globalData.money,
      userInfo: app.globalData.user,
    })

    var token = wx.getStorageSync('token')

    if (token) {
      this.setData({
        token: token
      })
      let baseUrl = app.globalData.baseUrl
      this.getBook(baseUrl, token)
    } else {
      this.setData({
        token: ''
      })
    }
  },
})