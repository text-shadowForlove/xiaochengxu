const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    haveMoney: 0.00,
    withdrawMoney: '',
    withdrawFocus: false,
    isValidMoney: true,
    enterHint: '输入金额大于用户余额'
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
            haveMoney: res.data.data.wxhk_balance.toFixed(2)
          })
        }
      },
    })
  },
  checkDecimals(e) {
    let withdrawInput = e.detail.value;
    let withdrawMoneyArr = withdrawInput.split('.');
    if (withdrawMoneyArr.length > 1) {
      if (withdrawMoneyArr[1].length > 2) {
        this.setData({
          withdrawMoney: Number(withdrawInput).toFixed(2)
        })
      }
    }
  },
  changeWithdrawMoney(e) {
    let withdrawMoney, withdrawFocus = false, isValidMoney = true, enterHint = '输入金额大于用户余额';
    if(e.type == 'tap'){
      withdrawMoney = this.data.haveMoney;
    } else {
      withdrawMoney = e.detail.value;
      if (Number(withdrawMoney) > Number(this.data.haveMoney) || Number(withdrawMoney) < 1){
        withdrawMoney = '';
        withdrawFocus = true;
        isValidMoney = false;
        if (Number(withdrawMoney) < 1) enterHint = '由微信支付商户平台规定，每次提现不小于1元哦';
      }
    }
    this.setData({
      withdrawMoney: withdrawMoney,
      withdrawFocus: withdrawFocus,
      isValidMoney: isValidMoney,
      enterHint: enterHint
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
      wx.request({
        url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/wxhk_transfers',
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        method: 'post',
        data: paramsData,
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            app.globalData.withdrawInfo = {
              withdrawMoney: this.data.withdrawMoney,
              balanceMoney: Number(this.data.haveMoney) - Number(this.data.withdrawMoney)
            }
            wx.navigateTo({
              url: '../withdraw/withdrawSuccess/withdrawSuccess',
            })
          }
        },
      })
    }
    /*console.log(this.data.withdrawMoney);
    app.globalData.withdrawInfo = {
      withdrawMoney: this.data.withdrawMoney,
      balanceMoney: Number(this.data.haveMoney) - Number(this.data.withdrawMoney)
    }
    wx.navigateTo({
      url: '../withdraw/withdrawSuccess/withdrawSuccess',
    })*/
  },
  goWithdrawHistory() {
    wx.navigateTo({
      url: '../withdraw/withdrawHistory/withdrawHistory',
    })
  }
})