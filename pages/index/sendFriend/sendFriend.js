const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    bgResourcePath: ''
  },
  cardId: 0,
  onLoad: function (options) {
    if (options.cardId) {
      this.cardId = options.cardId;
    }
    if (app.globalData.templateInfo) {
      this.setData({
        bgResourcePath: app.globalData.templateInfo.bg_resource_path
      })
    }
  },
  openCard: function () {
    wx.navigateTo({
      url: "../preview/envelope/envelope"
    })
  },
  onShareAppMessage: function (res) {
    let festival, weChatName = app.globalData.userInfo.wx_name;
    let templateTitle = app.globalData.templateInfo.resource_name;
    if (templateTitle.indexOf('情人节') >= 0) {
      festival = '情人节表白';
    } else if (templateTitle.indexOf('春节') >= 0) {
      festival = '新春祝福';
    } else {
      festival = '节日祝福';
    }
    return {
      title: '来自' + weChatName + '的' + festival,
      path: 'pages/index/gethongbao/gethongbao?cardId=' + this.cardId,
      imageUrl: '',
      success: res => {
        // 转发成功
        wx.request({
          url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/redirect_card',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'post',
          data: {
            id: this.cardId,
            user_id: app.globalData.userInfo.user_id
          },
          success: res => {
            console.log(res);
            if (res.data.code == 200) {
              if (res.data.data.coupon == 'yes') console.log('yes');
              wx.navigateTo({
                url: '../../index/shareSucceed/shareSucceed',
              })
            } else {
              util.errorToast()
            }
          },
          fail: () => {
            util.errorToast()
          }
        })
      },
      fail: res => {
        // 转发失败
      }
    }
  },
})