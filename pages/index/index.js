const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    defaultTemplate: null,
    makeCardNum: [],
    receivedCardNum: [],
    templateRow: null
  },
  onLoad: function () {
    this.getRecommendTemplate();
    this.getPersonNum();
    this.getTemplateList();
  },
  //获取推荐模板
  getRecommendTemplate() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_recommend_picture',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: res => {
        if(res.data.code == 200){
          let tempData = res.data.data;
          tempData.bg_resource_path = util.handleSource(tempData.bg_resource_path);
          tempData.default_resource_path = util.handleSource(tempData.default_resource_path);
          tempData.resource_path = util.handleSource(tempData.resource_path);
          this.setData({
            defaultTemplate: tempData
          })
        }
      },
    })
  },
  //获取制作及收到人数
  getPersonNum() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_greeting_card_counts',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: res => {
        if(res.data.code == 200) {
          let makeCardNum = res.data.data.make_sum,
            receivedCardNum = res.data.data.receive_sum;
          let makeCardNumString = makeCardNum.toString(),
            receivedCardNumString = receivedCardNum.toString();
          this.setData({
            makeCardNum: makeCardNumString.split(""),
            receivedCardNum: receivedCardNumString.split("")
          })
        }
      },
    })
  },
  //获取模板列表
  getTemplateList() {
    wx.request({
      url: util.urlData.baseAjaxUrl + '/yishuo/api_web/reception/get_picture_list',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      data: {},
      success: res => {
        if(res.data.code == 200) {
          let templateList = res.data.data.list;
          for (let i = 0; i < templateList.length; i++){
            templateList[i].resource_path = util.handleSource(templateList[i].resource_path);
          }
          let tempRow = new Array(Math.ceil(templateList.length / 3));
          for (let i = 0; i < tempRow.length; i++) {
            tempRow[i] = new Array();
          }
          for (let i = 0; i < templateList.length; i++) {
            tempRow[parseInt(i / 3)][i % 3] = templateList[i];
          }
          this.setData({
            templateRow: tempRow
          })
        }
      },
    })
  },
  //点击模板跳转(未登录需授权)
  goMakeCard (e) {
    var templateId = e.currentTarget.dataset.templateid;
    if (app.globalData.userInfo) {
      app.globalData.cardInfo.user_id = app.globalData.userInfo.user_id;
      wx.navigateTo({
        url: '../index/makeCard/choiceTemplate/choiceTemplate?templateId=' + templateId
      })
    } else {
      app.loginYishuo();
      app.userInfoCallback = () => {
        app.globalData.cardInfo.sender_id = app.globalData.userInfo.user_id;
        wx.navigateTo({
          url: '../index/makeCard/choiceTemplate/choiceTemplate?templateId=' + templateId
        })
      }
    }    
  }
})
