// pages/my/my.js
import {
  config
} from '../../config.js'
import {
  HTTP
} from '../../utils/commonality.js';
let http = new HTTP();
const app = getApp();
const url = app.globalData.interfaceUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoPlan: false, //判断用户是否购买了计划
    planList: {},
    StatePlan: 1, // 控制计划的不同状态
    helpCount: 0, //控制帮助多少人
    userInfo: {},
    openId: null,
    unionId: null,
    LoginStates: false, //判断是否登录
    canIUse: wx.canIUse('button.open-type.contact'),
    //id
    openId: null,
    uniconId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.getUserPlan();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.showLoading({
      title: '加载中',
      duration: 1000
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getUserPlan()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 接收用户信息的计划
  // Authorization: app.globalData.AccessToken
  getUserPlan: function() {
    let that = this;
    if (app.globalData.access_token || wx.getStorageSync("AccessToken")) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.login({
              success: code => {
                http.RequestPromise({
                    url: '/v1/small/member-user/wechat-login-info',
                    data: {
                      code: code.code
                    }
                  })
                  .then(res => {
                    that.setData({
                      openId: res.data.openId,
                      uniconId: res.data.unionId,
                      LoginStates: true
                    })
                    return http._userInfo();
                  })
                  .then(userInfo => {
                    that.setData({
                      userInfo: {
                        nickName: userInfo.nickName,
                        avatarUrl: userInfo.avatarUrl
                      }
                    })
                    let mssage = {
                      client_id: config.appid,
                      unionId: that.data.uniconId,
                      openId: that.data.openId,
                      headImg: userInfo.avatarUrl,
                      nickName: userInfo.nickName
                    }
                    return http.RequestPromise({
                      url: '/v1/small/member-user/wechat-login',
                      method: 'POST',
                      data: mssage,
                    })
                  })
                  .then(tokens => {
                    that.setData({
                      LoginStates: true
                    })
                    app.globalData.AccessToken = tokens.data.access_token;
                    wx.setStorageSync('AccessToken', tokens.data.access_token)
                    let token = tokens.data.token_type + ' ' + tokens.data.access_token;
                    return http.RequestPromise({
                      url: '/v1/authority/samll/member/get-member-user',
                      token: token
                    })
                  })
                  .then(res => {
                    wx.hideLoading()
                    let datas = res.data
                    if (res.code === '0') {
                      that.setData({
                        isNoPlan: datas.isNotMember == 1 ? false : true,
                        planList: datas.memberItemList,
                        helpCount: datas.helpCount,
                      })
                    } else {
                      wx.showLoading({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  })
              }
            })
          } else {
            that.setData({
              LoginStates: false
            })
          }
        }
      })
    } else {

    }
  },


  // 授权
  getUserInfo: function() {
    let that = this;
    wx.getSetting({ //授权
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '加载中',
          })
          wx.getUserInfo({
            success: userInfo => {
              that.setData({
                userInfo: userInfo.userInfo
              })
              var mssage = {
                client_id: config.appid,
                unionId: app.globalData.unionId,
                openId: app.globalData.openId,
                headImg: userInfo.userInfo.avatarUrl,
                nickName: userInfo.userInfo.nickName,
              }
              http.RequestPromise({ //注册加登录
                  url: '/v1/small/member-user/wechat-login',
                  method: 'POST',
                  data: mssage
                })
                .then(res => { //获取用户项目信息
                  wx.hideLoading();
                  that.setData({
                    LoginStates: true
                  })
                  let datas = res.data;
                  app.globalData.AccessToken = datas.access_token;
                  wx.setStorageSync('AccessToken', datas.access_token)
                  app.globalData.bearer = datas.token_type;
                  let token = datas.token_type + ' ' + datas.access_token;
                  app.globalData.Authorization = token;
                  return http.RequestPromise({
                    url: '/v1/authority/samll/member/get-member-user',
                    token: token
                  })
                })
                .then(plan => {
                  let datas = plan.data
                  if (plan.code === '0') {
                    that.setData({
                      isNoPlan: datas.isNotMember == 1 ? false : true,
                      planList: datas.memberItemList,
                      helpCount: datas.helpCount,
                    })
                  } else {
                    wx.showLoading({
                      title: plan.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                })
            }
          })

        }
      }
    })
  },

  //路由
  attention: function() {
    wx.navigateTo({
      url: '../attention/attention'
    })
  },
  //退出

  logOff: function() {
    let that = this;
    wx.openSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.clearStorage('AccessToken');
          app.globalData.AccessToken = null;
          that.setData({
            isNoPlan: false,
            userInfo: null,
            LoginStates: false,
            planList: null
          })
        }

      }
    })
  }


})