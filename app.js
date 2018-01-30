const util = require('/utils/util.js');
App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
        let system = res.system;
        if (system.indexOf('iOS') >= 0) {
          this.globalData.systemInfo.isIos = true;
        } else {
          this.globalData.systemInfo.isIos = false;
        }
      }
    })

    if (wx.getRecorderManager) {
      this.globalData.recorderManager = wx.getRecorderManager();
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级到最新版本',
      })
    }

    if (wx.createInnerAudioContext) {
      this.globalData.audioContext = wx.createInnerAudioContext();
      this.globalData.audioContextSecond = wx.createInnerAudioContext();
      this.globalData.audioContext.autoplay = true;
      this.globalData.audioContextSecond.autoplay = false;
    }
  },
  //登陆一说
  loginYishuo () {
    wx.getUserInfo({
      success: resWxUserInfo => {
        let userMsg = resWxUserInfo.userInfo;
        wx.login({
          success: res => {
            if (res.code) {
              wx.request({
                url: util.urlData.baseAjaxUrlTrue + '/yishuo/api_web/passport/loginWeixinJs',
                method: 'get',
                data: {
                  code: res.code
                },
                success: msg => {
                  if (msg.data.code == 200) {
                    const userPrivacyInfo = msg.data.data;
                    this.globalData.openId = userPrivacyInfo.openid;
                    wx.request({
                      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/account/login',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      method: 'post',
                      data: {
                        login_type: 0x0020,
                        username: userPrivacyInfo.unionid,
                        nickname: userMsg.nickName,
                        avatar: userMsg.avatarUrl
                      },
                      success: resUser => {
                        if (resUser.data.code == 200) {
                          this.globalData.userInfo = resUser.data.data;
                          if (this.userInfoCallback) {
                            this.userInfoCallback(resUser.data.data);
                          }
                        }
                      }
                    });
                  }
                }
              })
            }
          }
        })
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '若不授权登录，将无法使用此功能',
          confirmText: '授权',
          cancelText: '不授权',
          success: res => {
            if (res.confirm) {
              wx.openSetting({})
            } else {
              //两次拒绝授权后
              if (this.rejectLogin) {
                this.rejectLogin();
              }
            }
          }
        })
      }
    })
  },
  //微信支付
  weChatPay(payData, receiveNum) {
    console.log(payData);
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/wxhk_pay',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: payData,
      success: res => {
        if (res.data.code == 200) {
          if (res.data.data) {
            let getData = res.data.data;
            wx.requestPayment({
              'timeStamp': getData.timestamp,
              'nonceStr': getData.noncestr,
              'package': 'prepay_id=' + getData.prepayid,
              'signType': 'MD5',
              'paySign': getData.sign,
              'success': res => {
                this.globalData.cardInfo.red_envelopes_amount = payData.pay_amount;
                this.globalData.cardInfo.red_envelopes_count = receiveNum;
                this.globalData.haveRedPackets = true;
                this.globalData.isPayRedPackets = true;
                this.createCard();
              },
              'fail': res => {
                let hnitInfo;
                if (res.errMsg.indexOf('cancel') >= 0) {
                  hnitInfo = '已取消支付'
                } else {
                  hnitInfo = res.err_desc;
                }
                wx.showToast({
                  title: hnitInfo,
                  icon: 'none'
                });
              }
            })
          } else {
            this.globalData.cardInfo.red_envelopes_amount = payData.pay_amount;
            this.globalData.cardInfo.red_envelopes_count = receiveNum;
            this.globalData.haveRedPackets = true;
            this.globalData.isPayRedPackets = true;
            this.createCard();
          }
        }
      },
    })
  },
  //创建贺卡
  createCard() {
    wx.showLoading({
      title: '生成贺卡中',
      mask: true
    });
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/insert_greeting_card',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: this.globalData.cardInfo,
      success: res => {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../../sendFriend/sendFriend?cardId=' + res.data.data.id
          })
        } else {
          wx.showToast({
            title: '生成贺卡失败，请重新尝试哦~',
            icon: 'none'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '生成贺卡失败，请重新尝试哦~',
          icon: 'none'
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    })
    /*wx.navigateTo({
      url: '../../sendFriend/sendFriend?cardId=8'
    })*/
  },
  //全局变量
  globalData: {
    systemInfo: null,
    userInfo: null,
    openId: '', //建贺卡  下单支付
    cardInfo: {}, //制作的贺卡信息
    getCardInfo: null, //收到的贺卡信息
    templateInfo: null, //模板信息  模板图片
    recorderManager: null,  //录音管理器
    audioContext: null,  //音频播放器
    audioContextSecond: null,
    haveRedPackets: false, //是否有塞红包
    isPayRedPackets: false //是否支付了
  }
})