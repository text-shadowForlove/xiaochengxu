// pages/mine/cardsIndex/myCards/myCards.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    cardData: []
  },
  getParam: {
    user_id: 0,
    page: 1,
    per_page: 6
  },
  navigateTo: '../../index/gethongbao/gethongbao?cardId=',
  totalCount: 0,
  onLoad: function (options) {

  },
  onShow: function () {
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.getParam.user_id = app.globalData.userInfo.user_id;
        this.getMyCardList();
      }
    } else {
      this.getParam.user_id = app.globalData.userInfo.user_id;
      this.getMyCardList();
    }
  },
  //获取我的贺卡信息
  getMyCardList(callback) {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_send_greeting_card_list_by_userid',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.getParam,
      success: res => {
        if (res.data.code == 200) {
          this.totalCount = res.data.data.total_count;
          let cardList = res.data.data.list;
          let tempList, temp = {}
          if (this.getParam.page == 1){
            tempList = [];
          } else {
            tempList = this.data.cardData;
          }
          for (let i = 0; i < cardList.length; i++){
            temp.showTimeOrMoney = {};
            temp.showTimeOrMoney.cardTitle = cardList[i].name;
            temp.showTimeOrMoney.showStatus = 1;
            temp.showTimeOrMoney.cardType = util.getCardType(cardList[i].card_category);
            if(cardList[i].card_category == 2){
              temp.showTimeOrMoney.cardType += '， ' + cardList[i].get_red_envelopes_count
                + '/' + cardList[i].red_envelopes_count;
            }
            temp.showTimeOrMoney.showInfo = util.formatDuration(cardList[i].bg_music_time);
            temp.showTimeOrMoney.createTime = util.formatTime(cardList[i].create_time*1000);
            temp.showTimeOrMoney.picturePath = util.handleSource(cardList[i].resource_path);
            temp.isCard = 1;
            temp.navigateTo = this.navigateTo + cardList[i].id;
            tempList.push(temp);
          }
          this.setData({
            cardData: tempList
          });
          if (callback){
            callback();
          }
        } else {
          util.errorToast()
        }
      },
      fail: () => {
        util.errorToast()
      }
    })
  },
  //下拉刷新
  /*onPullDownRefresh() {
    this.getParam.page = 1;
    this.getMyCardList(()=>{
      wx.stopPullDownRefresh();
    });
  },*/
  //上拉加载
  onReachBottom: function () {
    if (this.getParam.page * this.getParam.per_page >= this.totalCount){
      wx.showToast({
        title: '没有更多了哦~',
        icon: 'none'
      })
    } else {
      this.getParam.page++;
      this.getMyCardList();
    }
  }
})