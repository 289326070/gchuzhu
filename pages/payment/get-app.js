// pages/payment/app.js
import {HTTP} from '../../utils/commonality.js'
let http = new HTTP();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appStates: null,
    payStatus: '支付失败',
    showPayElement: false,
    payText: '', //显示文本内容
    heavyPlay: false, // 重新调起支付
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(ready) {
    this.AppPayments();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {


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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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
  //app跳转到小程序支付
  //app.globalData.order
  AppPayments: function(order) {
    var that = this;
    wx.showToast({
      title: '支付中',
      icon: 'loading',
      mask: true,
    })
    wx.login({
      success:res => {
        http.RequestPromise({
          url: '/v1/small/member-user/wechat-login-info',
          data: {
            code: res.code
          }
        })
        .then((openit)=>{
          let openId = openit.data.openId;
          return http.RequestPromise({
            url: '/small/pay/pre-pay',
            data: {
              orderNo: app.globalData.order,
              openId: openId
            },
          })
        })
        .then((pay)=>{
          let datas = pay.data;
          if (pay.code != '0000') {
            wx.showToast({
              title: pay.msg
            })
            that.setData({
              payText: '加入互助计划失败',
              showPayElement: true,
              heavyPlay: true,
              payStatus: '支付失败'
            })
            return;
          }
          wx.requestPayment({
            timeStamp: datas.timeStamp,
            nonceStr: datas.nonceStr,
            package: datas.packageStr,
            signType: datas.signType,
            paySign: datas.paySign,
            success(playRes) {
              if (playRes.errMsg == "requestPayment:ok") {
                that.setData({
                  payText: '恭喜您,加入互助计划成功',
                  showPayElement: true,
                  heavyPlay: false,
                  payStatus: '支付成功'
                })
              } else {
                that.setData({
                  payText: '加入互助计划失败',
                  payStatus: '支付失败',
                  showPayElement: true,
                  heavyPlay: true,
                })
              }
            },
            fail(err) {
              that.setData({
                payText: '加入互助计划失败',
                payStatus: '支付失败',
                showPayElement: true,
                heavyPlay: true,
              })
            }
          })
        })
      }
    })
  }

})