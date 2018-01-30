// pages/index/preview/envelope/envelope.js
const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  data: {
    animationData: {},
    cardInfo: {},
    templateInfo: {},
    imgPath: ["/images/upload.png", "/images/moren.png"],
    musicPath: ["/images/msc.png", "/images/nomsc.png"],
    fromPreview: '',
    fromsendFriend: '',
    haveRedPackets: 'true',
    btnStatus: '',
    needPayMoney: 8
  },
  //音乐播放状态
  musicPlayStatus() {
    this.setData({
      musicPath: [this.data.musicPath[1], this.data.musicPath[0]]
    });
  },
  //支付方式
  payWay() {
    let payData = {
      pay_amount: this.data.needPayMoney,
      user_id: app.globalData.userInfo.user_id,
      open_id: app.globalData.openId
    }
    util.weChatPay(payData, () => {
      //console.log('1111111111');
      wx.navigateTo({
        url: "../../sendFriend/sendFriend",

      })
    });
  },
  giveHongBao() {
    wx.navigateTo({
      url: '../../makeCard/giveRedMoney/giveRedMoney'
    })
  },
  toggleImg() {
    /*this.setData({
      imgPath: [this.data.imgPath[1], this.data.imgPath[0]]
    })*/
    wx.createAnimation({
      duration: 1000,
      timingFunction: "ease"
    })
  },
  onLoad: function (options) {
    console.log(app.globalData.cardInfo.upload_picture_path);
    console.log(app.globalData.templateInfo.default_resource_path);

    if (!app.globalData.userInfo) {
      app.loginYishuo();
    }
    this.setData({
      cardInfo: app.globalData.cardInfo,
      haveRedPackets: app.globalData.haveRedPackets,
      templateInfo: app.globalData.templateInfo,

      needPayMoney: app.globalData.cardInfo.red_envelopes_amount,
      // imgPath: [util.handleSource(app.globalData.cardInfo.upload_picture_path), app.globalData.templateInfo.default_resource_path]
    });
    // wx.playVoice({

    // })
  },
})