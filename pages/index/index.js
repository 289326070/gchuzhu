// pages/index/index.js
import { config } from '../../config.js'
import { HTTP } from '../../utils/commonality.js';
let http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    advertiseList:[], //轮播
    faqList:[],//常见问题
    gcMeriList:[],//平台优势
    itemList:[],//互助
    title:[],
    array:[],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 1000,
    circular:true,
    heightStates:false,
    state:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http.RequestPromise({
      url: '/v1/app/homePage/getHomePage',
    })
    .then((res)=>{
      let datas = res.data;
      this.setData({
        advertiseList: datas.advertiseList,
        faqList: datas.faqList,
        gcMeriList: datas.gcMeriList,
        itemList: datas.itemList,
      })
      let arrays = new Array();
     for(let i=0;i<datas.faqList.length;i++){
       arrays.push(datas.faqList[i].answer.replace(/<br>/g, "\n"))
     }
      this.setData({
        array:arrays
      })
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //手风琴
  statesFun:function(e){
    let states = e.target.dataset.index
    let height = this.data.heightStates;
    this.setData({
      heightStates: states==height?'-1':states,
      state:true,
    })
  }
})