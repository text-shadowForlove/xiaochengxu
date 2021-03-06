const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    templateInfo: null,
    userInfo: null,
    uplaodImage: '',
    isUpload: false,
    uploadTime: '',
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  onLoad: function (options) {
    this.setData({
      templateInfo: app.globalData.templateInfo,
      userInfo: app.globalData.userInfo,
      uplaodImage: app.globalData.templateInfo.default_resource_path,
      uploadTime: util.formatTime(new Date().getTime(), true)
    });
    wx.setNavigationBarTitle({
      title: '上传图片'
    })
  },
  //选择本地图片
  choiceLocalImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let nowTime = new Date().getTime()
        this.setData({
          uplaodImage: res.tempFilePaths[0],
          uploadTime: util.formatTime(new Date().getTime(), true),
          isUpload: true
        });
      },
    })
  },
  //下一步：上传图片完成后跳到录音
  goRecordVoice() {
    if (this.data.isUpload) {
      let tempFilePaths = this.data.uplaodImage;
      wx.uploadFile({
        url: util.urlData.baseAjaxUrl + '/yishuo/api_web/upload/image',
        filePath: tempFilePaths,
        name: 'file',
        formData: {},
        success: res => {
          let serverRes = JSON.parse(res.data);
          if(serverRes.code == 200) {
            app.globalData.cardInfo.upload_picture_path = serverRes.data;
            app.globalData.templateInfo.default_resource_path = util.handleSource(serverRes.data);
            wx.navigateTo({
              url: '../../makeCard/recordVoice/recordVoice'
            })
          } else {
            util.errorToast()
          }
        },
        fail: () => {
          util.errorToast()
        }
      })
    } else {
      let uploadPath = app.globalData.templateInfo.default_resource_path.split("uploads");
      app.globalData.cardInfo.upload_picture_path = 'uploads' + uploadPath[1];
      wx.navigateTo({
        url: '../../makeCard/recordVoice/recordVoice'
      })
    }
  }
})