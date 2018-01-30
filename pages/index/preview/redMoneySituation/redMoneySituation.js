// pages/index/preview/redMoneySituation/redMoneySituation.js
const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    situationTopImg: '../../../../images/situationTopImg.png',
    fightingImg: '../../../../images/fighting.png',
    receiveInfo: {},
    senderInfo: {},
    isGetRedEnvelope: false, //是否领取红包
    getRedEnvelopesNumber: '',
    envelopeTotalCount: '',
    envelopeGeterCount: '',
    geterInfo: []
  },
  onLoad: function (options) {
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.getEnvelopeSituationList();
      }
    } else {
      this.getEnvelopeSituationList();
    }
  },
  //获取红包领取情况
  getEnvelopeSituationList() {
    let getParam = {
      user_id: app.globalData.userInfo.user_id,
      card_id: app.globalData.getCardInfo.id
    }
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_red_envelope',
      header: { "content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200 || res.data.code == 201 || res.data.code == 202 || res.data.code == 203) {
          let receiveData = res.data.data;
          receiveData.wx_avatar = util.handleSource(receiveData.wx_avatar);
          for (let i = 0; i < receiveData.list.length; i++){
            if (receiveData.list[i].wx_name_list){
              receiveData.list[i].wx_avatar_list = until.handleSource(receiveData.list[i].wx_avatar_list);
            }
            receiveData.list[i].getTime = util.formatTime(receiveData.list[i].get_red_envelopes_date_list * 1000);
          }
          this.setData({
            receiveInfo: receiveData
          });
          if (res.data.code == 200 || res.data.code == 201){
            this.setData({
              isGetRedEnvelope: true,
              getRedEnvelopesNumber: res.data.data.get_red_envelopes_amount
            })
          }
        } else {
          util.errorToast()
        }
      },
      fail: res => {
        util.errorToast();
      }
    })
  }
})