// pages/index/preview/preview.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    animation: {}
  },
  onLoad: function (options) {
    setTimeout(function () {
      wx.navigateTo({
        url: "./envelope/envelope?fromPreview=" + true
      })
    }, 5000)
  },
  openCard: function () {
    wx.navigateTo({
      url: "./envelope/envelope"
    })
  },
})