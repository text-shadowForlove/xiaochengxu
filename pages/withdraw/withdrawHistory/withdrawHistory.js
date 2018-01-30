// pages/withdraw/withdrawHistory/withdrawHistory.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    historyTop:'../../../images/withDrawHistoryTop.png',
    historyBottomImg: '../../../images/withDrawBottom.png',
    hasHistory: false,
    withDrawHistory:[],
  },
  getParam: {
    user_id: 86958,
    page: 1,
    per_page: 15
  },
  totalCount: 0,
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现历史记录'
    })
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        //this.getParam.user_id = app.globalData.userInfo.user_id;
        this.getWithDrawHistory();
      }
    } else {
      //this.getParam.user_id = app.globalData.userInfo.user_id;
      this.getWithDrawHistory();
    }
  },
  //获取提现历史记录
  getWithDrawHistory(callback){
    console.log(this.getParam);
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_transfers_message',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.getParam,
      success: res => {
        console.log(res);
        if(res.data.code == 200){
          let withDrawHistoryData = res.data.data, withDrawHistoryList = res.data.data.list;
          this.totalCount = withDrawHistoryData.total_count;
          if (withDrawHistoryList.length){
            let withDrawHistoryItem = this.data.withDrawHistory;
            for (let i = 0; i < withDrawHistoryList.length; i++){
              withDrawHistoryList[i].create_time = util.formatTime(withDrawHistoryList[i].create_time*1000);
              withDrawHistoryList[i].amount = withDrawHistoryList[i].amount.toFixed(2);
              withDrawHistoryList[i].status = util.getWithdrawType(withDrawHistoryList[i].status);
            }
            this.setData({
              hasHistory: true,
              withDrawHistory: withDrawHistoryItem.concat(withDrawHistoryList)
            })
          }else{
            this.setData({
              hasHistory: false,
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
            });
        }
        if (callback){
          callback();
        }
      },
    })
  },
  //下拉刷新
  /*onPullDownRefresh() {
    this.getParam.page = 1;
    this.setData({
      hasHistory: false,
      withDrawHistory: []
    })
    this.getWithDrawHistory(() => {
      wx.stopPullDownRefresh();
    });
  },*/
  //上拉加载
  onReachBottom: function () {
    if (this.getParam.page * this.getParam.per_page >= this.totalCount) {
      wx.showToast({
        title: '没有更多了哦~',
        icon: 'none'
      })
    } else {
      this.getParam.page++;
      this.getWithDrawHistory();
    }
  }
})