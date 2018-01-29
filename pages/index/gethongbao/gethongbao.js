// pages/index/preview/preview.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    userInfo_id: '',
    card_id: ''
  },
  onLoad: function (options) {
    this.setData({
      card_id: options.card_id
    })
    if (!app.globalData.userInfo) {
      app.loginYiShuo();
      app.userInfoCallback = () => {
        this.setData({
          userInfo: app.globalData.userInfo
        })
      }
    } else {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    };
    this.getCardInfo();
  },
  openCard() {
    wx.navigateTo({
      url: "./getenvelope/getenvelope?card_id=" + 8 //card_id 
    })
  },
  onShow: function () {

  },
  //获得贺卡信息
  getCardInfo() {
    let _this = this;
    let getParam = {
      user_id: 86974,
      card_id: 8 //_this.data.card_id
    }
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/received_card_by_userId',
      header: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      method: 'post',
      data: getParam,
      success: res => {
        console.log(res);

        // if (res.data.code == 200 || res.data.code == 202 || res.data.code == 201) {
        //   setTimeout(() => {
        //     this.openCard()
        //   }, 5000);
        //   this.getCardInfo();
        // };
      }
    })
  }
})