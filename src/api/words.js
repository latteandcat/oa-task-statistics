import api from './index'
export default {
  replace (data) {
    return api({
      url: '/api/lifeWord/replace',
      method: 'PUT',
      data
    })
  },
  getCount () {
    return api({
      url: '/api/lifeWord/countAll',
      method: 'GET'
    })
  },
  getWord (params) {
    return api({
      url: '/api/lifeWord/allLifeWordPage',
      method: 'GET',
      params
    })
  },
  getRankWord (params, direction, property) {
    return api({
      url: `/api/lifeWord/allLifeWordPage?orders%5B0%5D.direction=${direction}&orders%5B0%5D.property=${property}`,
      method: 'GET',
      params
    })
  },
  like (lifeWordUuid) {
    return api({
      url: '/api/lifeWord/like',
      method: 'GET',
      params: {
        lifeWordUuid
      }
    })
  },
  dislike (lifeWordUuid) {
    return api({
      url: '/api/lifeWord/dislike',
      method: 'GET',
      params: {
        lifeWordUuid
      }
    })
  }
}
