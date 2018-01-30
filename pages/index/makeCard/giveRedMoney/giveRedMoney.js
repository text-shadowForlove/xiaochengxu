const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    moneyList: ['6.66', '6.88', '8.88', '9.99', '13.88', '16.88', '18.88', '20.18'],
    isChoicedId: 0,
    totalMoney: '',
    moneyNum: '',
    totalFocus: false,
    numFocus: false,
    haveMoney: 0,
    needPayMoney: 0,
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  isCanClick: true,
  userPaySuccess: false,
  onLoad: function (options) {
    this.getUserBalance();
  },
  //获取用户账号余额
  getUserBalance() {
    if(app.globalData.userInfo){
      wx.request({
        url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_user_balance',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        data: {user_id: app.globalData.userInfo.user_id},
        success: res => {
          if(res.data.code == 200){
            this.setData({
              haveMoney: Number(res.data.data.wxhk_balance).toFixed(2)
            })
          }
        },
      })
    }
  },
  //获取输入总金额
  getTotalMoney(e) {
    if (e.detail.value != ''){
      if (Number(e.detail.value) > 200 || Number(e.detail.value) < 0.01) {
        wx.showToast({
          title: '红包金额需在0.01~200元之间',
          icon: 'none'
        });
        this.setData({
          totalMoney: '',
          totalFocus: true,
          numFocus: false
        });
      } else {
        this.comparetTotalNum(e.detail.value, this.data.moneyNum);
      }
    } else {
      this.setData({
        totalMoney: '',
      });
    }
  },
  //获取输入数量
  getMoneyNum(e) {
    if (Number(e.detail.value) > 100 || Number(e.detail.value) < 1) {
      wx.showToast({
        title: '红包数量需在1~100之间',
        icon: 'none'
      });
      this.setData({
        moneyNum: '',
        totalFocus: false,
        numFocus: true
      });
    } else {
      this.comparetTotalNum(this.data.totalMoney, e.detail.value);
    }
  },
  //吉利数字点击时改变输入总金额
  changeTotalMoney(e) {
    let index = e.currentTarget.dataset.choicedid;
    this.comparetTotalNum(this.data.moneyList[index - 1], this.data.moneyNum);
    this.setData({
      isChoicedId: index
    })
  },
  //支付
  payMoney() {
    if (app.globalData.userInfo) {
      this.isCanEmptyAll = false;  //付款不能都为空
      this.estimateClick();
      if (this.isCanClick) {
        if (app.globalData.isPayRedPackets){
          app.createCard();
        } else {
          let payData = {
            pay_amount: this.data.totalMoney,
            user_id: app.globalData.userInfo.user_id,
            open_id: app.globalData.openId
          }
          app.weChatPay(payData, this.data.moneyNum);
        }
      }
    }
  },
  //前往预览贺卡
  previewCard() {
    this.isCanEmptyAll = true;  //预览可都为空
    this.estimateClick();
    if (this.isCanClick) {
      if (this.data.totalMoney != '') {
        app.globalData.cardInfo.red_envelopes_amount = this.data.totalMoney;
        app.globalData.cardInfo.red_envelopes_count = this.data.moneyNum;
        app.globalData.haveRedPackets = true;
      }
      wx.navigateTo({
        url: '../../preview/preview',
      })
    }
  },
  //金额和数量判断
  comparetTotalNum(total, num){
    if (Number(total) * 100 < Number(num)) {
      wx.showToast({
        title: '每个红包不能少于0.01元哦~',
        icon: 'none'
      });
      this.setData({
        moneyNum: '',
        totalFocus: false,
        numFocus: true
      });
    } else {
      let needPayMoney = Number(total)-this.data.haveMoney>0 ? Number(total)-this.data.haveMoney : 0;
      this.setData({
        totalMoney: total,
        moneyNum: num,
        needPayMoney: needPayMoney
      })
    }
  },
  //判断填写数据是否完成
  estimateClick() {
    if (!this.isCanEmptyAll){
      if (this.data.totalMoney == '' || this.data.moneyNum == '') {
        if (this.data.totalMoney == '') {
          wx.showToast({
            title: '请填写红包金额',
            icon: 'none'
          });
          this.setData({
            totalFocus: true,
            numFocus: false
          })
        } else {
          wx.showToast({
            title: '请填写红包数量',
            icon: 'none'
          });
          this.setData({
            totalFocus: false,
            numFocus: true
          })
        }
        this.isCanClick = false;
      }
    }
  },
  createCard() {
    app.createCard();
  }
})