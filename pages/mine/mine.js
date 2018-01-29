// pages/mine/mine.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    userInfo:{},
    cardData: [{
        cardType: '我的贺卡',
        count: 2,
        noCountText: "还没有制作过贺卡,快给朋友制作一个吧~",
        showTimeOrMoney: {
          cardTitle:'我的贺卡',
          showStatus: 1,
          showInfo: "00:46",
          cardType:'红包贺卡',
          creatTime:'',         
          picturePath:''
        },
        isCard: 1,
        navigateTo: "myCards/myCards"
      },
      {
        cardType: '收到的贺卡',
        count: 2,
        noCountText: "还没有收到过贺卡,先给朋友制作一个吧~",
        showTimeOrMoney: {
          cardTitle: '我收到的贺卡',
          showStatus: 0,
          picturePath:'',
          senderName:'哈哈哈哈',
          creatTime: '',   
        },
        isCard: 1,
        navigateTo: "receiveCards/receiveCards"
      }, {
        cardType: '我的优惠券',
        count: 3,
        noCountText: "还没有收到优惠券,制作贺卡之后可以获得哦~",
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
  onLoad: function (options) {
    
  },
  onShow: function () {
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.getMyCardList();
        this.getReceiveCardList();
        this.getMyDiscountList();
      }
      app.rejectLogin = () => {

      }
    } else {
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
    console.log(this.data.userInfo);
    let objThis = this,cardList = {},
      getParam = {
        user_id:app.globalData.userInfo.user_id,
        page:1,
        per_page:20
        };
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_send_greeting_card_list_by_userid',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200) {
          let cardListData = res.data.data;
          if (cardListData.list.length){
            this.setData({
              'cardData[0].count': cardListData.total_count,
              'cardData[0].showTimeOrMoney.cardTitle': cardListData.list[0].name,
              'cardData[0].showTimeOrMoney.cardType': util.getCardType(cardListData.list[0].card_category),
              'cardData[0].showTimeOrMoney.showInfo': util.formatDuration(cardListData.list[0].bg_music_time),
              'cardData[0].showTimeOrMoney.createTime': util.formatTime(cardListData.list[0].create_time),
              'cardData[0].showTimeOrMoney.picturePath': util.handleSource(cardListData.list[0].picture_resource_path),
            })
          }else {
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
    let objThis = this, cardList = {},
      getParam = {
        user_id: app.globalData.userInfo.user_id,
        page: 1,
        per_page: 20
      };
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_recipient_greeting_card_list_by_userid',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200) {
          let receiveCardList = res.data.data;
          if (receiveCardList.list.length){
            this.setData({
              'cardData[1].count': receiveCardList.total_count,
              'cardData[1].showTimeOrMoney.cardTitle': receiveCardList.list[0].name,
              'cardData[1].showTimeOrMoney.showInfo': receiveCardList.list[0].sender_name,
              'cardData[1].showTimeOrMoney.cardType': util.getCardType(receiveCardList.list[0].card_category),
              'cardData[1].showTimeOrMoney.showInfo': util.formatDuration(receiveCardList.list[0].bg_music_time),
              'cardData[1].showTimeOrMoney.showInfo': util.formatTime(receiveCardList.list[0].create_time),
              'cardData[1].showTimeOrMoney.showInfo': util.handleSource(receiveCardList.list[0].picture_resource_path),
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
    let objThis = this, cardList = {},
      getParam = {
        user_id: app.globalData.userInfo.user_id
      };
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_wxhk_coupon_count',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200) {
          let receiveCardList = res.data.data;
          this.setData({
            'cardData[2].count': receiveCardList.wxhk_coupon_count
          })
          console.log(objThis.data.cardData[2]);
        }
      },
    })
  },
  onReady: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})