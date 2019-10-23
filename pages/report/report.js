// pages/report/report.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    category: ['支出', '收入'],
    choose: -1,
    date: '2018-12-25',
    imgList: [],
    fileKeys: [],
    company_name:'',
    remark:'',
    category_id:''
  },

  getDate() {
    let date = new Date
    this.setData({
      date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    })
    console.log(this.data.date)
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      choose: -1,
    })
    console.log(this.data.choose)
    
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
    console.log(this.data.date)
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
    wx.uploadFile({
      url: url,
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: null,
      success: (res) => {
        if(res.data.status){
          var fileKey = JSON.parse(res.data).data.file.fileKey
          console.log(fileKey)
          this.data.fileKeys.push(fileKey)
        } else {
          wx.showModal({
            title: '错误',
            content: '图片上传失败',
            showCancel: false
          })
        }
      }
    })
  },

  Bookkeeping() {
    var token = wx.getStorageSync('token')
    var url = app.globalData.baseUrl + 'api/record/create?token=' + token
    console.log(Number(app.globalData.accountId), this.data.category_id)
    console.log(this.data.date)
    wx.request({
      url: url,
      data: {
        total_money: this.data.total_money,
        money : this.data.money,
        account_id: Number(app.globalData.accountId),
        category_id: Number(this.data.category_id),
        date: this.data.date,
        company_name: this.data.company_name,
        remark: this.data.remark,
        image_keys: this.data.fileKeys.join(',')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        console.log(res.data)
        if (res.data.status){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1500,
            complete:(res)=>{
              setTimeout(function(){
                wx.navigateBack({})
              },1500)
            }
          })
          

        } else{
          this.setData({
            modalName2:'fail',
            modalContent:res.data.data
          })
        }
      }
    })
  },

  // 模态框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    console.log(this.data.modalName)
  },
  hideModal(e) {
    console.log(e.currentTarget.dataset.modalname)
    if (e.currentTarget.dataset.modalname=='bottomModal'){
      this.setData({
      modalName: null,
    })
    } else{
      this.setData({
        modalName2: null,
      })
    }
  },

  choose(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.categoryid)
    console.log(e.currentTarget.dataset)
    this.setData({
      choose: e.currentTarget.dataset.index,
      modalName: e.currentTarget.dataset.target,
      category_id:e.currentTarget.dataset.categoryid
    })
  },

  //  获取支出分类
  getExpenditureList(baseUrl, token) {
    var that = this
    wx.request({
      url: baseUrl + 'api/category?token=' + token,
      method: 'post',
      data: {
        type: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if(res.data.status){
          app.globalData.expenditureList = res.data
          that.setData({
            expenditureList: res.data.data
          })
          console.log(that.data.expenditureList)
        } else {
          wx.showModal({
            title: '错误',
            content: '数据请求失败',
            showCancel: false
          })
        }
        
      }
    })
  },

  // 获取收入分类
  getIncomeList(baseUrl, token) {
    var that = this
    wx.request({
      url: baseUrl + 'api/category?token=' + token,
      method: 'post',
      data: {
        type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if(res.data.status){
          app.globalData.incomeList = res.data
          that.setData({
            incomeList: res.data.data
          })
          console.log(that.data.incomeList)
        } else {
          wx.showModal({
            title: '错误',
            content: '数据请求失败',
            showCancel: false
          })
        }
        
      }
    })
  },

  // 监听记账金额输入
  setTotal_money(event) {
    this.setData({
      total_money: event.detail.value
    })
    console.log(event.detail.value)
  },
  // 监听实付金额输入
  setMoney(event) {
    this.setData({
      money: event.detail.value
    })
    console.log(event.detail.value)
  },
  // 监听交易对象输入
  setCompany_name(event) {
    this.setData({
      company_name: event.detail.value
    })
    console.log(event.detail.value)
  },
  // 监听备注输入
  setRemark(event) {
    this.setData({
      remark: event.detail.value
    })
    console.log(event.detail.value)
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDate()
    var baseUrl = app.globalData.baseUrl
    var token = wx.getStorageSync('token')
    this.getExpenditureList(baseUrl, token)
    this.getIncomeList(baseUrl, token)

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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})