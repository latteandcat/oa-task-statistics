import api from './index'
export default {
  bind (idName) {
    return api({
      url: '/api/login/wechatBinding',
      method: 'GET',
      params: {
        idName
      }
    })
  },
  login (params) {
    return api({
      url: '/api/login/wechatLogin',
      method: 'GET',
      params
    })
  }
}
