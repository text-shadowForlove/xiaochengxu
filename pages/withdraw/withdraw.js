const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    haveMoney: '',
    withdrawMoney: '',
    withdrawFocus: false,
    isValidMoney: true,
    isZero: false,
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.getUserBalance();
      }
    } else {
      this.getUserBalance();
    }
  },
  //获取用户账号余额
  getUserBalance() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_user_balance',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: { user_id: app.globalData.userInfo.user_id },
      success: res => {
        if (res.data.code == 200) {
          this.setData({
            haveMoney: res.data.data.wxhk_balance
          })
        }
      },
    })
  },
  changeWithdrawMoney(e) {
    let withdrawMoney, withdrawFocus = false, isValidMoney = true;
    if(e.type == 'tap'){
      withdrawMoney = this.data.haveMoney;
    } else {
      withdrawMoney = e.detail.value;
      if (Number(withdrawMoney) > Number(this.data.haveMoney) || Number(withdrawMoney) <= 0.009){
        withdrawMoney = '';
        withdrawFocus = true;
        isValidMoney = false;  
      }
      if (Number(withdrawMoney) <= 0.009) {
        this.setData({
          isZero: true
        })
      } else {
        this.setData({
          isZero: false
        })
      }
    }
    this.setData({
      withdrawMoney: withdrawMoney,
      withdrawFocus: withdrawFocus,
      isValidMoney: isValidMoney
    })
  },
  //提现
  withdrawOut() {
    if (this.data.isValidMoney){
      let paramsData = {
        transfers_amount: this.data.withdrawMoney,
        open_id: app.globalData.openId,
        user_id: app.globalData.userInfo.user_id
      }
      console.log(paramsData);
      wx.request({
        url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/wxhk_transfers',
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        method: 'post',
        data: paramsData,
        success: res => {
          if (res.data.code == 200) {
            app.globalData.withdrawInfo = {
              withdrawMoney: this.data.withdrawMoney,
              balanceMoney: Number(this.data.haveMoney) - Number(this.data.withdrawMoney)
            }
            wx.navigateTo({
              url: '../withdraw/withdraw/withdrawSuccess/withdrawSuccess',
            })
          }
        },
      })
    }
  },
  goWithdrawList() {
    wx.navigateTo({
      url: '../withdraw/withdrawHistory/withdrawHistory',
    })
  }
})