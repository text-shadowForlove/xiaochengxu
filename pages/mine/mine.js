// pages/mine/mine.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    userInfo:{},
    cardData: [{
        cardType: '我的贺卡',
        count: 0,
        noCountText: "还没有制作过贺卡，快给朋友制作一个吧~",
        showTimeOrMoney: {
          showStatus: 1
        },
        isCard: 1,
        navigateTo: "myCards/myCards"
      },
      {
        cardType: '收到的贺卡',
        count: 0,
        noCountText: "还没有收到过贺卡，先给朋友制作一个吧~",
        showTimeOrMoney: {
          showStatus: 0
        },
        isCard: 1,
        navigateTo: "receiveCards/receiveCards"
      }, {
        cardType: '我的优惠券',
        count: 0,
        noCountText: "还没有收到优惠券，制作贺卡之后可以获得哦~",
        showtime: 0,
        showTimeOrMoney: {
          cardTitle:'一说宝宝机器人优惠券',
          showStatus: 1,
          showInfo: "￥200"
        },
        isCard: 0,
        navigateTo: "Coupon/coupon"
      }
    ]
  },
  getParam: {
    user_id: 0,
    page: 1,
    per_page: 1
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.getParam.user_id = app.globalData.userInfo.user_id;
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.getMyCardList();
        this.getReceiveCardList();
        this.getMyDiscountList();
      } 
    } else {
      this.getParam.user_id = app.globalData.userInfo.user_id;
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.getMyCardList();
      this.getReceiveCardList();
      this.getMyDiscountList();
    }
  },
  //获取我的贺卡信息
  getMyCardList(){
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_send_greeting_card_list_by_userid',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.getParam,
      success: res => {
        if (res.data.code == 200) {
          let cardListData = res.data.data;
          if (cardListData.list.length >= 1){
            let cardData = cardListData.list[0];
            this.setData({
              'cardData[0].count': cardListData.total_count,
              'cardData[0].showTimeOrMoney.cardTitle': cardData.name,
              'cardData[0].showTimeOrMoney.cardType': util.getCardType(cardData.card_category),
              'cardData[0].showTimeOrMoney.showInfo': util.formatDuration(cardData.bg_music_time),
              'cardData[0].showTimeOrMoney.createTime': util.formatTime(cardData.create_time * 1000),
              'cardData[0].showTimeOrMoney.picturePath': util.handleSource(cardData.picture_resource_path)
            })
          } else {
            this.setData({
              'cardData[0].count': cardListData.total_count,
            })
          }
        }
      },
    })
  },
  //获取收到的贺卡信息
  getReceiveCardList() {
    let objThis = this, cardList = {};
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_recipient_greeting_card_list_by_userid',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.getParam,
      success: res => {
        if (res.data.code == 200) {
          let receiveCardList = res.data.data;
          if (receiveCardList.list.length >= 1){
            let receiveCardData = receiveCardList.list[0];
            this.setData({
              'cardData[1].count': receiveCardList.total_count,
              'cardData[1].showTimeOrMoney.cardTitle': receiveCardData.name,
              'cardData[1].showTimeOrMoney.senderName': receiveCardList.list[0].sender_name,
              'cardData[1].showTimeOrMoney.cardType': util.formatDuration(receiveCardList.list[0].bg_music_time),
              'cardData[1].showTimeOrMoney.createTime': util.formatTime(receiveCardList.list[0].create_time * 1000),
              'cardData[1].showTimeOrMoney.picturePath': util.handleSource(receiveCardList.list[0].picture_resource_path),
            })
          }else{
            this.setData({
              'cardData[1].count': receiveCardList.total_count,
            })
          }
        }
      },
    })
  },
  //获取我的优惠券信息
  getMyDiscountList() {
    let objThis = this, cardList = {};
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_wxhk_coupon_count',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.getParam,
      success: res => {
        if (res.data.code == 200) {
          let receiveCardList = res.data.data;
          this.setData({
            'cardData[2].count': receiveCardList.wxhk_coupon_count
          })
        }
      },
    })
  }
})