// pages/changeAvatar/changeAvatar.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    fileKeys:[]
  },

  ChooseImage() {
    var that = this
    wx.chooseImage({
      count: 1, //默认9
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
        var imgurl = res.tempFilePaths[0]
        console.log(res.tempFilePaths[0])
        this.UploadFile(imgurl)

      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    console.log(e.currentTarget.dataset.url)
    console.log(this.data.imgList)
  },

  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.fileKeys.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList
          })
        }
        console.log(this.data.fileKeys)
      }
    })
  },
  UploadFile(imgurl) {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + 'api/upload/image?token=' + token
    wx.showLoading({ title: '加载中', mask: true })
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
        console.log(res)
        var fileKey = JSON.parse(res.data).data.file.fileKey
        console.log(fileKey)
        this.data.fileKeys.push(fileKey)
        this.setData({
          fileKey: fileKey
        })
      }
    })
  },
  edit(){
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl +`api/user/profile/update?token=${token}`
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: url,
      data:{
        avatar: this.data.fileKey
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        wx.hideLoading()
        console.log(res.data)
        if (res.data.status) {
          app.getUserinfo(token)
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500,
            complete: (res) => {
              setTimeout(function () {
                wx.navigateBack({})
              }, 1500)
            }
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '修改失败',
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