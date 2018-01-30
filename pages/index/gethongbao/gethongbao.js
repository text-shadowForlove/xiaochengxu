// pages/index/preview/preview.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    card_id: 8
  },
  goGetCardInfoTimer: null,
  onLoad: function (options) {
    if (options.cardId){
      this.setData({
        card_id: 8 //options.cardId
      })
    }

    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.getCardInfo();
        this.receiveCard();
      }
    } else {
      this.getCardInfo();
      this.receiveCard();
    };

  },
  openCard() {
    let _this = this;
    if (app.globalData.userInfo && _this.goGetCardInfoTimer){
      clearTimeout(_this.goGetCardInfoTimer);
      wx.navigateTo({
        url: "./getenvelope/getenvelope?card_id=" + _this.data.card_id + "&user_id=" + 86974
      })
    } else {
      wx.showToast({
        title: '点击太快了，请稍后再试~',
        icon: 'none'
      })
    }
  },
  //获取贺卡信息
  getCardInfo() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_greeting_card_by_cardid',
      header: {
        "content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: { card_id: this.data.card_id },
      success: res => {
        // console.log(res);
        if (res.data.code == 200 || res.data.code == 202 || res.data.code == 201) {
          console.log(res);
          let getCardData = res.data.data;
          getCardData.bg_resource_path = util.handleSource(getCardData.bg_resource_path);
          getCardData.default_resource_path = util.handleSource(getCardData.default_resource_path);
          getCardData.resource_path = util.handleSource(getCardData.resource_path);
          getCardData.card_music = util.handleVoice(getCardData.card_music);
          app.globalData.getCardInfo = getCardData;
          this.goGetCardInfoTimer = setTimeout(() => {
            this.openCard()
          }, 5000);
        };
      }
    })
  },
  //收到贺卡
  receiveCard() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/received_card_by_userId',
      header: {
        "content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: { 
        user_id: app.globalData.userInfo.user_id,
        card_id: this.data.card_id
      },
      success: res => {
      
      }
    })
  }
})