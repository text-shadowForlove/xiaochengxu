
const urlData = {
  baseAjaxUrlTrue: 'https://www.1shuo.me/jinjidian3.0',
  baseAjaxUrl: 'http://192.168.2.126:8080/MessagePush',
  baseUrl: 'http://www.1shuo.tt',
}

//日期格式转换
const formatTime = (date, isWeek) => {
  date = typeof date == 'object' ? date : new Date(Number(date));
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if (isWeek) {
    const weekDayArr = ["日", "一", "二", "三", "四", "五", "六"];
    return '星期' + weekDayArr[weekday] + ' ' + [hour, minute].map(formatNumber).join(':');
  } else {
    return [year, month, day].map(formatNumber).join('.')
  }
}

//时长转换
const formatDuration = duration => {
  const durationHour = parseInt(duration / 3600);
  const durationMin = parseInt((duration % 3600) / 60);
  const durationSec = parseInt((duration % 3600) % 60);
  if (durationHour > 0) {
    return [durationHour, durationMin, durationSec].map(formatNumber).join(':');
  } else {
    return [durationMin, durationSec].map(formatNumber).join(':');
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//后台返回的图片地址处理
const handleSource = src => {
  let val = '';
  if (src) {
    if (parseInt(src.indexOf("http")) >= 0) {
      val = src;
    } else if (parseInt(src.indexOf("uploads")) >= 0) {
      val = urlData.baseUrl + '/' + src;
    } else {
      val = urlData.baseUrl + '/' + src;
    }
  } else {
    val = urlData.baseUrl + '/';
  }
  return val;
}

//后台声音地址处理
const handleVoice = src => {
  let val = '';
  if (parseInt(src.indexOf("uploads")) >= 0) {
    val = urlData.baseUrl + '/' + src + '.mp3';
  } else {
    val = urlData.baseUrl + '/uploads/audio/voice/md5/' + src + '.mp3';
  }
  return val;
}

//请求后台接口错误
const errorToast = () => {
  wx.showToast({
    title: '网络状况不佳，请稍后再试',
    icon: 'none'
  })
}

//转换贺卡类型
const getCardType = cardType => {
  let cardCategory;
  if (cardType == 1) {
    cardCategory = '祝福贺卡'
  } else if (cardType == 2) {
    cardCategory = '红包贺卡'
  }
  return cardCategory
}

//转换提现状态
const getWithdrawType = status => {
  let withdrawType;
  if (status == 1) withdrawType = '失败';
  if (status == 2) withdrawType = '成功';
  if (status == 0) withdrawType = '审核中';
  return withdrawType;
}

module.exports = {
  urlData: urlData,
  formatTime: formatTime,
  formatDuration: formatDuration,
  handleSource: handleSource,
  handleVoice: handleVoice,
  getCardType: getCardType,
  errorToast: errorToast,
  getWithdrawType: getWithdrawType
}