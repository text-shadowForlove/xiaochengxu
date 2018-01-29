const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    templateInfo: null,
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  templateId: 0,
  onLoad: function (options) {
    this.templateId = options.templateId;
    this.getTemplateInfo();
    wx.setNavigationBarTitle({
      title: '选择贺卡样式'
    })
  },
  //获取模板详情
  getTemplateInfo(e) {
    let getParam;
    if(e){
      getParam = null;
    } else {
      getParam = { id: this.templateId}
    }
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_picture_by_id',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        if(res.data.code == 200){
          let tempData = res.data.data;
          tempData.bg_resource_path = util.handleSource(tempData.bg_resource_path);
          tempData.default_resource_path = util.handleSource(tempData.default_resource_path);
          tempData.resource_path = util.handleSource(tempData.resource_path);
          tempData.music_before_path = util.handleVoice(tempData.music_before_path);
          tempData.music_intact_path = util.handleVoice(tempData.music_intact_path);
          tempData.music_after_path = util.handleVoice(tempData.music_after_path);
          this.setData({
            templateInfo: tempData
          })
        }
      },
    })
  },
  //跳转到上传图片
  goUploadImg() {
    app.globalData.templateInfo = this.data.templateInfo;
    app.globalData.cardInfo.bg_picture_id = this.data.templateInfo.id;
    wx.navigateTo({
      url: '../../makeCard/uploadImage/uploadImage'
    })
  }
})