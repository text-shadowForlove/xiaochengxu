// pages/index/preview/redMoneySituation/redMoneySituation.js
const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    userInfo: {},
    situationTopImg: '../../../../images/situationTopImg.png',
    fightingImg: '../../../../images/fighting.png',
    senderInfo: {
      senderImg: '../../../../images/userName.jpg',
      senderName: '九亿人'
    },
    isGetRedEnvelope: false, //是否领取红包
    getRedEnvelopesNumber: '',
    envelopeTotalCount: '',
    envelopeGeterCount: '',
    geterInfo: [],
    cardId: ''
  },
  onLoad: function (options) {
    this.setData({
      cardId: options.cardId
    })
    if (!app.globalData.userInfo) {
      app.loginYishuo();
      app.userInfoCallback = () => {
        this.setData({
          userInfo: app.globalData.userInfo
        })
        this.getEnvelopeSituationList();
      }
    } else {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.getEnvelopeSituationList();
    }
  },
  onShow: function () {

  },
  //获取红包领取情况
  getEnvelopeSituationList() {
    console.log(this.data.userInfo);
    let objThis = this,
      getParam = {
        user_id: objThis.data.userInfo.user_id, //,15113
        card_id: objThis.data.cardId
      };
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_red_envelope',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: getParam,
      success: res => {
        if (res.data.code == 200 || res.data.code == 202 || res.data.code == 201) {
          let EnvelopeSituationData = res.data.data,
            geterInfoList = res.data.data.list;
          let geterInfoItem = objThis.data.geterInfo;
          objThis.setData({
            //geterInfo: geterInfoItem.splice(0, geterInfoItem.length),//清空数组
            envelopeTotalCount: EnvelopeSituationData.all_counts,
            envelopeGeterCount: EnvelopeSituationData.get_counts,
            getRedEnvelopesNumber: EnvelopeSituationData.get_red_envelopes_amount,
            'senderInfo.senderName': EnvelopeSituationData.wx_name,
            'senderInfo.senderImg': until.handleSource(EnvelopeSituationData.wx_avatar),
          })
          //红包领取人列表信息
          for (let i = 0; i < geterInfoList.length; i++) {
            geterInfoList[i].wx_avatar_list = until.handleSource(EnvelopeSituationData.list[i].wx_avatar_list),
              geterInfoList[i].wx_name_list = EnvelopeSituationData.list[i].wx_name_list,
              geterInfoList[i].get_red_envelopes_date_list = util.formatTime(EnvelopeSituationData.list[i].get_red_envelopes_date_list * 1000),
              geterInfoList[i].get_red_envelopes_amount_list = EnvelopeSituationData.list[i].get_red_envelopes_amount_list
          }
          objThis.setData({
            geterInfo: geterInfoItem.concat(geterInfoList)
          })
          if (res.data.code == 200 || res.data.code == 201) { //红包领取成功、领取过
            objThis.setData({
              isGetRedEnvelope: true
            })
          }
        } else {

        }
      }
    })
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
})