const db = wx.cloud.database()
Page({
  data: {
    imgs: [],
    fileID: []
  },
  uploadImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // console.log(res.tempFilePaths)
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imgs: res.tempFilePaths
        })
      }
    })
  },
  submit() {
    wx.showToast({
      title: '提交中',
    })
    let promissAll = []
    this.data.imgs.forEach((item, index) => {
      // console.log(index)
      promissAll.push(
        new Promise((resolve, reject) => {
          wx.cloud.uploadFile({
            cloudPath: index + '.jpg',
            filePath: this.data.imgs[index],
            success: res => {
              // console.log(res.fileID)
              this.setData({
                //数组追加哦,否则后面会覆盖前面
                fileID: this.data.fileID.concat(res.fileID)
              })
              //返回处理结果
              resolve()
            },
            fail: console.error
          })
        })
      )
    })
    Promise.all(promissAll).then(res => {
      //所有的上传都结束了才会执行入库操作
      // console.log('upload done')
      db.collection('imgs').add({
          data: {
            fileID: this.data.fileID
          }
        })
        .then(res => {
          wx.hideToast()
          wx.showToast({
            title: '提交成功',
          })
        })
        .catch(err => {
          console.error(err)
        })
    }).catch()
  },
  onLoad: function(options) {},


  onReady: function() {},


  onShow: function() {},


  onHide: function() {},


  onUnload: function() {},


  onPullDownRefresh: function() {},


  onReachBottom: function() {},


  onShareAppMessage: function() {}
})