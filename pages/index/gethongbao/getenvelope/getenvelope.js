// pages/index/preview/envelope/envelope.js
const app = getApp();
const util = require('../../../../utils/util.js');

Page({

  data: {
    imgPath: ["/images/upload.png ", "/images/muban.png"],
    musicPath: ["/images/msc.png", "/images/nomsc.png"],
    lookHongBao: false,
    haveRedPackets: false,
    getHongbaoStatus: '',
    hongbaoTitle: '拼手气红包',
    hongbaoMoney: 0,
    getCardInfo: {},
    isPlayingMusic: false
  },
  onLoad: function (options) {
    console.log(app.globalData.getCardInfo);
    this.setData({
      getCardInfo: app.globalData.getCardInfo
    });
    if (app.globalData.getCardInfo.card_category == 2){
      if (app.globalData.getCardInfo.red_envelopes_count == 1){
        this.setData({
          hongbaoTitle: '普通红包'
        })
      }
    }

    if (app.globalData.audioContext){
      app.globalData.audioContext.src = app.globalData.getCardInfo.card_music;
      app.globalData.audioContext.loop = true;
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  //音乐播放状态
  musicPlayStatus() {
    this.setData({
      musicPath: [this.data.musicPath[1], this.data.musicPath[0]]
    });
    if (app.globalData.audioContext) {
      if (this.data.isPlayingMusic){
        app.globalData.audioContext.pause();
      } else {
        app.globalData.audioContext.play();
      }
    }
  },
  //领取红包
  receiveEnvelope() {
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
        if (res.data.code == 200 || res.data.code == 201 || res.data.code == 202 || res.data.code == 203){
          this.setData({
            lookHongBao: true,
            getHongbaoStatus: res.data.code
          });
          if (res.data.code == 200) {
            this.setData({
              hongbaoMoney: res.data.data.get_red_envelopes_amount
            })
          }
        } else {
          
        }
      }
    })
  },
  //关闭红包
  closeHongBao() {
    this.setData({
      lookHongBao: false
    })
  },
  //切换图片显示状态
  toggleImg() {
    this.setData({
      imgPath: [this.data.imgPath[1], this.data.imgPath[0]]
    })
  },
  //回到首页
  backIndex() {
    if (app.globalData.recorderManager) {
      app.globalData.audioContext.loop = false;
    }
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})