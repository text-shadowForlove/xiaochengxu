// pages/withdraw/withdrawHistory/withdrawHistory.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    userInfo:{},
    historyTop:'../../../images/withDrawHistoryTop.png',
    historyBottomImg: '../../../images/withDrawBottom.png',
    hasHistory: false,
    withDrawHistory:[],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现历史记录'
    })
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.getWithDrawHistory();
      }
    } else {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.getWithDrawHistory();
    }
  },
  //获取提现历史记录
  getWithDrawHistory(){
    console.log(this.data.userInfo);
    let objThis = this,
        getParam = { 
          user_id: this.data.userInfo.user_id
        };
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_transfers_message',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        console.log(res);
        if(res.data.code == 200){
          let withDrawHistoryData = res.data.data, withDrawHistoryList = res.data.data.list;
          if (withDrawHistoryList.length){
            let withDrawHistoryItem = objThis.data.withDrawHistory;
            for (let i = 0; i < withDrawHistoryList.length; i++){
              withDrawHistoryList[i].create_time = util.formatTime(withDrawHistoryList[i].create_time);
              withDrawHistoryList[i].amount = withDrawHistoryList[i].amount;
              withDrawHistoryList[i].status = withDrawHistoryList[i].status;
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
        }else{
          wx.showToast({
            title: res.data.code,
            icon: 'success',
            duration: 2000
            });
        }
      },
    })
  },
  onPullDownRefresh: function () {
  
  },
  onReachBottom: function () {
  
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
  
  }
})