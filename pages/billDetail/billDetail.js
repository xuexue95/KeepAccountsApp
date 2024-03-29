// pages/billDetail/billDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Cur: false,
    imgList: [],
    fileKeys: [],
    picker: [],
    index: null,
  },

  changeCur() {
    this.setData({
      Cur: true
    })
  },

  // 模态框
  hideModal(e) {
    this.setData({
      modalName: null,
    })
  },


  // 获取用户输入-------------------
  moneyInput(e) {
    this.setData({
      total_money: e.detail.value
    })
  },
  companyInput(e) {
    this.setData({
      company_name: e.detail.value
    })
  },
  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  dateInput(e) {
    this.setData({
      date: e.detail.value
    })
  },
  // -------------------------------


  // 获取账单详情
  getBillDetail(token, id) {

    var url = app.globalData.baseUrl + `api/record/detail?id=${id}&token=${token}`
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: url,
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
          var imgRes = res.data.data.items[0].images
          var imgList = []
          for (var i in imgRes) {
            imgList.push(imgRes[i].original)
          }
          this.setData({
            detail: res.data.data,
            total_money: res.data.data.total_money,
            remark: res.data.data.remark,
            company_name: res.data.data.company_name,
            imgList: imgList,
            itemId: res.data.data.items[0].id,
            account_id: res.data.data.items[0].account_id,
            date: res.data.data.items[0].date
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            showCancel: false,
          })
        }
      }
    })
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url,
    });
  },


  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    })
  },


  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.fileKeys.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },


  UploadFile(imgurl) {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + 'api/upload/image?token=' + token
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.uploadFile({
      url: url,
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
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
        } else {
          var fileKey = JSON.parse(res.data).data.file.fileKey
          this.data.fileKeys.push(fileKey)
        }
      }
    })
  },

  // 提交修改
  saveEdit() {
    var token = wx.getStorageSync('token')
    var id = this.data.id
    var url1 = app.globalData.baseUrl + `api/record/update?id=${id}&token=${token}`
    var itemId = this.data.itemId
    var url2 = app.globalData.baseUrl + `api/record/item/update?itemId=${itemId}&token=${token}`

    if (this.data.total_money) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: url1,
        method: "post",
        data: {
          total_money: this.data.total_money,
          company_name: this.data.company_name,
          remark: this.data.remark
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.code == 'INVALID_TOKEN') {
            wx.showModal({
              title: '修改失败',
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
            wx.showLoading({
              title: '加载中',
              mask: true
            })
            if (this.data.index) {
              var account_id = this.data.accountList[this.data.index].id
            } else {
              var account_id = this.data.account_id
            }
            wx.request({
              url: url2,
              method: 'post',
              data: {
                account_id: account_id,
                date: this.data.date,
                image_keys: this.data.fileKeys
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              complete: (res) => {
                wx.hideLoading()
                if (res.data.status) {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1500,
                    complete: (res) => {
                      setTimeout(function() {
                        wx.navigateBack({})
                      }, 1500)
                    }
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
          } else {
            wx.showModal({
              title: '修改失败',
              content: res.data.data,
              showCancel: false
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '修改失败',
        content: '金额不能为空',
        showCancel: false
      })
    }
  },

  delete() {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          var token = wx.getStorageSync('token')
          var id = this.data.id
          var url = app.globalData.baseUrl + `api/record/delete?id=${id}&token=${token}`
          wx.showLoading({
            title: '加载中',
            mask: true
          })

          wx.request({
            url: url,
            header: {
              'content-type':'application/x-www-form-urlencoded'
            },
            success: (res) => {
              wx.hideLoading()
              if (res.data.code == 'INVALID_TOKEN') {
                wx.showModal({
                  title: '删除失败',
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
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                  complete: (res) => {
                    setTimeout(function() {
                      wx.navigateBack({})
                    }, 1000)
                  }
                })
              } else {
                wx.showModal({
                  title: '删除失败',
                  content: res.data.data,
                  showCancel: false,
                })
              }
            }
          })
        }
      }
    })
  },


  // 获取账户列表
  getAccountList(token) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.request({
      url: app.globalData.baseUrl + `api/account?token=${token}`,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 'INVALID_TOKEN') {
          wx.showModal({
            title: '提示',
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
          let accountList = res.data.data
          let picker = []
          for (let i in accountList) {
            picker.push(accountList[i].name)
          }
          this.setData({
            picker: picker,
            accountList: accountList
          })
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.data,
            showCancel: false,
          })
        }
      }
    })
  },

  accountChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id
    this.setData({
      id: id
    })
    var token = wx.getStorageSync('token')
    this.getBillDetail(token, id)
    this.getAccountList(token)
    this.setData({
      username: app.globalData.user.nickname
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

  }
})