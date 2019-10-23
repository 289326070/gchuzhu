//app.js
import {HTTP} from 'utils/commonality.js';
let http = new HTTP();

App({
  onLaunch: function(options) {
    // 登录
    this.login();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                this.globalData.userInfo = res.userInfo;
              }
            }
          })
        }
      }
    })
  
  },
  onShow: function(options) {
     this.globalData.order = options.query.order;
  },
  globalData: {
    userInfo: null,
    Authorization: null,
    openId: null,
    unionId: null,
    order: null, //参数
    AccessToken:null,//唯一标实
  },
  login: function() {
    wx.login({
      success: res => {
       
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let that = this;
        http.RequestPromise({
            url: '/v1/small/member-user/wechat-login-info',
            data: {
              code: res.code
            }
          })
          .then((res) => {
            if (res.success) {
              let datas = res.data;
              that.globalData.openId = datas.openId;
              that.globalData.unionId = datas.unionId;
              wx.setStorageSync('unionId', datas.unionId)
              wx.setStorageSync('openId', datas.openId)
            }
          })
      }
    })
  },
})