const app = getApp();
const util = require('../../../../utils/util.js');
Page({
  data: {
    templateInfo: null,
    cueWords: '',
    recordingTime: '',
    recordBtnImage: 'record',
    recordStatus: '点击开始录音',
    recordHint: '不超过60秒哦',
    isPlayingMusic: false,
    isRecording: false,
    isRecordEnd: false,
    isPlayingVoice: false,
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  recordUrl: '',
  recordingTimer: null,
  isFirstPlayVoice: true,   //用以判断试听是点击第一次播放还是暂停再播放
  voicePlayEndNum: 0,  //用以判断是更换到录音还是更换到背景音乐第二部分
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '创建贺卡'
    });
    this.changeCureWords();
    
    if (app.globalData.templateInfo){
      this.setData({
        templateInfo: app.globalData.templateInfo
      }) 
    }
    if (app.globalData.audioContext) {
      app.globalData.audioContextSecond.src = app.globalData.templateInfo.music_after_path;
    }
  },
  //播放背景音乐
  playMusic() {
    if (this.data.isRecording || this.data.isPlayingVoice){  //录音中或试听录音中不允许播放
      let toastTitle;
      if (this.data.isRecording) toastTitle = '录音中';
      else toastTitle = '试听中';
      wx.showToast({
        title: toastTitle + '无法播放背景音乐哦~',
        icon: 'none'
      });
    } else {
      this.isFirstPlayVoice = true;
      this.voicePlayEndNum = 0;
      if (app.globalData.audioContext){
        if (!this.data.isPlayingMusic){
          app.globalData.audioContext.src = this.data.templateInfo.music_intact_path;
          this.setData({
            isPlayingMusic: true
          })
        } else {
          app.globalData.audioContext.pause();
          this.setData({
            isPlayingMusic: false
          })
        }
      }
    }
    if (!this.isClickPlayMusic) {
      app.globalData.audioContext.onEnded(() => {
        if (this.data.isPlayingMusic) {
          this.setData({
            isPlayingMusic: false
          })
        }
      });
    }
    this.isClickPlayMusic = true;
  },
  //跳转到音乐库列表
  goMusicList(e) {
    if (this.data.isRecording) {
      wx.showToast({
        title: '录音中无法查看音乐库哦~',
        icon: 'none'
      });
    } else {
      this.livePage();
      wx.navigateTo({
        url: '../../makeCard/musicList/musicList?musicId=' + e.currentTarget.dataset.musicid
      })
    }
  },
  //更换提示词
  changeCureWords() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_random_document',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: res => {
        if(res.data.code == 200){
          this.setData({
            cueWords: res.data.data.document_desc
          })
        } else {
          util.errorToast()
        }
      },
      fail: () => {
        util.errorToast()
      }
    })
  },
  //判断点击按钮是录音还是播放
  recordOrPlay() {
    if (this.data.isPlayingMusic){
      this.setData({
        isPlayingMusic: false
      });
      if(app.globalData.audioContext) app.globalData.audioContext.stop();
    }
    if(!this.data.isRecordEnd){
      this.recordVoice();
    } else {
      this.playVoice();
    }
  },
  //录音
  recordVoice() {
    console.log('11111111');
    if (app.globalData.recorderManager) {
      if (!this.data.isRecording) {
        app.globalData.recorderManager.start({ format: 'mp3' });
      } else {
        app.globalData.recorderManager.stop();
      }
      if(!this.isClickRecord){
        app.globalData.recorderManager.onStart(() => {
          this.setData({
            isRecording: true,
            recordBtnImage: 'recording',
            recordStatus: '录音中'
          });
          let beginRecordTime = new Date().getTime(), duration;
          this.recordingTimer = setInterval(() => {
            duration = Math.round((new Date().getTime() - beginRecordTime) / 1000);
            if (duration < 60) {
              this.setData({
                recordingTime: util.formatDuration(duration)
              })
            } else {
              wx.showToast({
                title: '录音已达60秒了哦~',
                icon: 'none'
              });
              app.globalData.recorderManager.stop();
            }
          }, 1000);
        });
        app.globalData.recorderManager.onStop((res) => {
          this.recordUrl = res.tempFilePath;
          clearInterval(this.recordingTimer);
          this.setData({
            isRecording: false,
            isRecordEnd: true,
            recordBtnImage: 'play',
            recordStatus: '点击播放',
            recordHint: '不喜欢可以重录哦'
          });
        })
      }
      this.isClickRecord = true;
    }
  },
  //试听录音/暂停试听
  playVoice() {
    if (app.globalData.audioContext) {
      if (this.data.isPlayingVoice) {  //播放中点击为暂停
        this.setData({
          recordBtnImage: 'play',
          recordStatus: '点击继续播放',
          isPlayingVoice: false,
        })
        //app.globalData.audioContext.pause();
        if (this.voicePlayEndNum == 2) {
          app.globalData.audioContextSecond.pause();
        } else {
          app.globalData.audioContext.pause();
        };
      } else {
        this.setData({
          recordBtnImage: 'playing',
          recordStatus: '试听中',
          isPlayingVoice: true
        })
        if (this.isFirstPlayVoice) {  //第一次点击播放，设置播放地址：背景音乐的第一段
          this.voicePlayEndNum = 0;
          app.globalData.audioContext.src = this.data.templateInfo.music_before_path;
          //app.globalData.audioContext.src = 'http://pic.ibaotu.com/00/41/67/67G888piCJu8.mp3';
        } else {
          if (this.voicePlayEndNum == 2 ) {
            app.globalData.audioContextSecond.play();
          } else {
            app.globalData.audioContext.play();
          };
          //app.globalData.audioContext.play();
        }
      }
      this.isFirstPlayVoice = false;

      if(!this.isClickPlay) {
        app.globalData.audioContext.onEnded(() => {
          if (this.data.isPlayingVoice) {
            this.voicePlayEndNum++;
            if (this.voicePlayEndNum == 1) {  //第一次播放完成，直接转为录音地址继续播放
              app.globalData.audioContext.src = this.recordUrl;
            } else if (this.voicePlayEndNum == 2) {  //第二次播放完成，播放第二个播放器（不再使用第一个是为了防止加载时间过长）
              app.globalData.audioContextSecond.play();
            } else {
              this.voicePlayEndNum = 0;
              this.isFirstPlayVoice = true;
              this.setData({
                isPlayingVoice: false,
                recordBtnImage: 'play',
                recordStatus: '点击播放'
              })
            }
          } else {
            this.setData({
              isPlayingMusic: false
            })
          }
        });
        app.globalData.audioContextSecond.onEnded(() => {
          this.voicePlayEndNum = 0;
          this.isFirstPlayVoice = true;
          this.setData({
            isPlayingVoice: false,
            recordBtnImage: 'play',
            recordStatus: '点击播放'
          })
        });
      }
      this.isClickPlay = true;
    }
  },
  //重新录制
  recordAgain() {
    this.setData({
      isRecording: false,
      isRecordEnd: false,
      recordBtnImage: 'record',
      recordStatus: '点击开始录音',
      recordHint: '不超过60秒哦',
      recordingTime: ''
    });
    if(this.data.isPlayingVoice){
      this.setData({
        isPlayingVoice: false
      })
      if (app.globalData.audioContext) {
        //app.globalData.audioContext.stop()
        if (!app.globalData.audioContext.paused) app.globalData.audioContext.stop();
        if (!app.globalData.audioContextSecond.paused) app.globalData.audioContextSecond.stop();
      };
    }
    this.isFirstPlayVoice = true;
    this.voicePlayEndNum = 0;
  },
  //下一步：上传录音完成后跳转到包红包
  goGiveRedMoney() {   
    /*if (this.recordUrl != ''){
      wx.showLoading({
        title: '录音上传中~'
      });
      wx.uploadFile({
        url: util.urlData.baseAjaxUrlTrue + '/yishuo/api_web/upload/fileWeixin',
        filePath: this.recordUrl,
        name: 'file',
        formData: {},
        success: res => {
          let serverRes = JSON.parse(res.data);
          console.log(serverRes);
          if (serverRes.code == 200) {
            wx.hideLoading();
            app.globalData.cardInfo.bg_music_id = this.data.templateInfo.music_id;
            app.globalData.cardInfo.upload_record_path = serverRes.data.filePartName;
            this.livePage();
            wx.navigateTo({
              url: '../../makeCard/giveRedMoney/giveRedMoney'
            })
          } else {
            wx.showToast({
              title: '上传录音失败，请再试一次哦~',
              icon: 'none'
            })
          }
        },
        fail: res => {
          wx.showToast({
            title: '上传录音失败，请再试一次哦~',
            icon: 'none'
          })
        },
        complete: () => {
          wx.hideLoading();
        }
      })
    }*/
    app.globalData.cardInfo.bg_music_id = this.data.templateInfo.music_id;
    app.globalData.cardInfo.upload_record_path = '982274325719b3c3b00492ad79ed0ce5.mp3';
    this.livePage();
    wx.navigateTo({
      url: '../../makeCard/giveRedMoney/giveRedMoney'
    })
  },
  //离开页面时关闭播放器
  livePage() {
    if (this.data.isPlayingMusic || this.data.isPlayingVoice) {
      if (app.globalData.audioContext) {
        app.globalData.audioContext.stop();
        app.globalData.audioContextSecond.stop();
      }
      this.setData({
        isPlayingMusic: false,
        isPlayingVoice: false
      })
    }
  }
})