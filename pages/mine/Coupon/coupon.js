// pages/mine/Coupon/coupon.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    couponCount: 0
  },
  onLoad: function (options) {
    this.getCouponCount();
  },
  getCouponCount (callback) {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_wxhk_coupon_count',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {
        user_id: app.globalData.userInfo.user_id
        //user_id: 86974
      },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            couponCount: res.data.data.wxhk_coupon_count
          })
        } else {
          util.errorToast()
        }
        if (callback){
          callback();
        }
      },
      fail: () => {
        util.errorToast()
      }
    })
  },
  goUseCoupon() {
    wx.navigateToMiniProgram({
      appId: 'wx6aaf792a02495471',
      fail: res => {
        // 跳转失败
      },
      success: res => {
        // 打开成功
      }
    })
  }
})