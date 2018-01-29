// pages/index/preview/envelope/envelope.js
const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: ["/images/upload.png ", "/images/muban.png"],
    musicPath: ["/images/msc.png", "/images/nomsc.png"],
    lookHongBao: false,

    getHongbaoStatus: {
      success: false,
      alreadyGetted: false,
      timeOver: true,
      noHave: false
    },
    cardInfo: app.globalData.cardInfo,
    card_id: ''
  },
  //音乐播放状态
  musicPlayStatus() {

    this.setData({
      musicPath: [this.data.musicPath[1], this.data.musicPath[0]]
    });

    // if (this.data.musicPath[0] == "/images/msc.png") {
    //   wx.playBackgroundAudio({
    //     dataUrl: '',
    //     title: '',
    //     coverImgUrl: ''
    //   })
    // }
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
  //收到贺卡 查看红包
  seeEnvelope() {
    this.setData({
      lookHongBao: true
    })
  },
  //关闭红包
  closeHongBao() {
    this.setData({
      lookHongBao: false
    })
  },
  //切换图片显示状态
  toggleImg() {
    this.setData({
      imgPath: [this.data.imgPath[1], this.data.imgPath[0]]
    })
  },
  //回到首页
  backIndex() {
    wx.switchTab({
      url: '/pages/index/index' + "yishuo/api_web/reception/received_card_by_userId"
    })
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      card_id: options.card_id
    })
    let getParam = {
      card_id: _this.data.card_id
    }
    console.log(options.card_id);

    wx.request({
      url: util.urlData.baseAjaxUrl + 'yishuo/api_web/reception/ get_send_greeting_card_list_by_userid',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200 || res.data.code == 202 || res.data.code == 201) {
          console.log(res);

        }
      }
    })

    this.setData({
      cardInfo: app.globalData.cardInfo,
      haveRedPackets: app.globalData.haveRedPackets,
      templateInfo: app.globalData.templateInfo,
      //imgPath: [app.globalData.cardInfo.upload_picture_path, app.globalData.templateInfo.default_resource_path]
    });
  }
})