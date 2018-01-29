// pages/index/preview/envelope/envelope.js
const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  data: {
    cardInfo: {},
    templateInfo: {},
    imgPath: ["/images/upload.png", "/images/moren.png"],
    musicPath: ["/images/msc.png", "/images/nomsc.png"],
    fromPreview: '',
    fromsendFriend: '',
    haveRedPackets: '',
    btnStatus: ''
  },
  //音乐播放状态
  musicPlayStatus() {
    this.setData({
      musicPath: [this.data.musicPath[1], this.data.musicPath[0]]
    });
  },
  //支付方式
  payWay() {
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {},
      'fail': function (res) {}
    })
  },
  giveHongBao() {
    wx.navigateTo({
      url: '../../makeCard/giveRedMoney/giveRedMoney',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //收到贺卡 查看红包
  seeEnvelope() {

  },
  toggleImg() {
    this.setData({
      imgPath: [this.data.imgPath[1], this.data.imgPath[0]]
    })
  },
  onLoad: function (options) {
    this.setData({
      cardInfo: app.globalData.cardInfo,
      haveRedPackets: app.globalData.haveRedPackets,
      templateInfo: app.globalData.templateInfo,
      //imgPath: [app.globalData.cardInfo.upload_picture_path, app.globalData.templateInfo.default_resource_path]
    });
  }
})