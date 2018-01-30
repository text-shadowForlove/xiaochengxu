const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    withdrawMoney: 0,
    withdrawUser: '微信昵称',
    canWithdrawMoney: 0
  },
  onLoad: function (options) {
    this.setData({
      withdrawMoney: Number(app.globalData.withdrawInfo.withdrawMoney).toFixed(2),
      withdrawUser: app.globalData.userInfo.wx_name,
      canWithdrawMoney: Number(app.globalData.withdrawInfo.balanceMoney).toFixed(2)
    })
  },
  goWithdrawHistory() {
    wx.navigateTo({
      url: '../withdrawHistory/withdrawHistory',
    })
  }
})