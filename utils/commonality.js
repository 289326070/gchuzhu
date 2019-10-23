import {
  config
} from '../config.js'
class HTTP {
  RequestPromise(params) {
    //封装wx.request请求
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.url + params.url,
        method: params.method || "GET",
        data: params.data,
        header: {
          'content-type': 'application/json',
          Authorization: params.token || ''
        },
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }

  //用户信息
  _userInfo() {
    return new Promise((resolve, reject)=>{
      wx.getUserInfo({
        success:res=>{
          resolve(res.userInfo)
        }
      })
    })
  }

}



export {
  HTTP
}