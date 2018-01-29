const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    musicList: [],
    choiceMusicId: '',
    choiceMusic: null,
    playingMusicId: '',
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '背景音乐库'
    });
    if(options.musicId){
      this.setData({
        choiceMusicId: options.musicId
      })
    }

    if(app.globalData.audioContext){
      app.globalData.audioContext.stop();
      app.globalData.audioContext.onEnded(()=>{
        this.setData({
          playingMusicId: ''
        });
      });
      app.globalData.audioContext.onError(res => {
        console.log(res)
      });
    }

    this.getMusicList();
  },
  onShow(){
    if (app.globalData.audioContext) {
      if (!app.globalData.audioContext.paused) {
        this.setData({
          playingMusicId: options.musicId
        })
      }
      app.globalData.audioContext.onEnded(() => {
        this.setData({
          playingMusicId: ''
        });
      });
      app.globalData.audioContext.onError(res => {
        console.log(res)
      });
    }
  },
  getMusicList() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_music_list',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: res => {
        if (res.data.code == 200) {
          let musicList = res.data.data.list;
          for (let i = 0; i < musicList.length; i++) {
            musicList[i].music_intact_path = util.handleVoice(musicList[i].music_intact_path);
            musicList[i].music_before_path = util.handleVoice(musicList[i].music_before_path);
            musicList[i].music_after_path = util.handleVoice(musicList[i].music_after_path);
          }
          this.setData({
            musicList: res.data.data.list
          })
        }
      },
    })
  },
  changeChoiceMusic(e) {
    let choiceMusic = e.currentTarget.dataset.music;
    if (choiceMusic.music_id != this.data.choiceMusicId){
      this.setData({
        choiceMusicId: choiceMusic.music_id,
        choiceMusic: choiceMusic
      })
    }
  },
  changePlayingMusic(e) {
    let playMusic = e.currentTarget.dataset.music;
    if (app.globalData.audioContext){
      if (playMusic.music_id != this.data.playingMusicId) {
        this.setData({
          playingMusicId: playMusic.music_id
        });
        app.globalData.audioContext.src = playMusic.music_intact_path
      } else {
        this.setData({
          playingMusicId: ''
        });
        app.globalData.audioContext.stop();
      }
    }
  },
  sureChoiceMusic() {
    if (this.data.choiceMusic){
      app.globalData.audioContext.stop();
      app.globalData.templateInfo.music_id = this.data.choiceMusic.music_id;
      app.globalData.templateInfo.music_name = this.data.choiceMusic.music_name;
      app.globalData.templateInfo.music_intact_path = this.data.choiceMusic.music_intact_path;
      app.globalData.templateInfo.music_before_path = this.data.choiceMusic.music_before_path;
      app.globalData.templateInfo.music_after_path = this.data.choiceMusic.music_after_path;
      wx.navigateTo({
        url: '../../makeCard/recordVoice/recordVoice'
      })
    }
  }
})