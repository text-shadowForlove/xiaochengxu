const app = getApp();
Page({
  data: {
    bgResourcePath: '',
    isIos: app.globalData.systemInfo ? app.globalData.systemInfo.isIos : false
  },
  onLoad: function (options) {
    if(app.globalData.templateInfo){
      this.setData({
        bgResourcePath: app.globalData.templateInfo.bg_resource_path
      })
    }
  },
  goUseAward() {
    wx.navigateToMiniProgram({
      appId: 'wx6aaf792a02495471',
      fail: res => {
        // 跳转失败
      },
      success: res => {
        // 打开成功
      }
    })
  },
  goMarkCardAgain() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})