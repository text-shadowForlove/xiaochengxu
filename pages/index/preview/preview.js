// pages/index/preview/preview.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    timeId: ''
  },
  onLoad: function (options) {
    let timeId = setTimeout(function () {
      wx.navigateTo({
        url: "./envelope/envelope"
      })
    }, 5000);
    this.setData({
      timeId: timeId
    })
  },
  openCard: function () {
    wx.navigateTo({
      url: "./envelope/envelope"
    });
    clearTimeout(this.data.timeId);
  }
})