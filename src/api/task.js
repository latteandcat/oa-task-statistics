import api from './index'
export default {
  addUser (idName) {
    return api({
      url: '/api/task/addUser',
      method: 'POST',
      data: {
        idName
      }
    })
  },
  changeTaskStatus (data) {
    return api({
      url: '/api/task/changeTaskStatus',
      method: 'PUT',
      data
    })
  },
  getMyTaskList (userUuid) {
    return api({
      url: '/api/task/getMyTaskList',
      method: 'GET',
      params: {
        userUuid
      }
    })
  },
  getCurrentTaskList () {
    return api({
      url: '/api/task/getCurrentTaskList',
      method: 'GET'
    })
  },
  getUserInfo () {
    return api({
      url: '/api/task/getUserInfo',
      method: 'GET'
    })
  },
  replaceTask (data) {
    return api({
      url: '/api/task/replaceTask',
      method: 'PUT',
      data
    })
  },
  getUserInfoByName (idName) {
    return api({
      url: '/api/task/getUserInfoByIdName',
      method: 'GET',
      params: {
        idName
      }
    })
  },
  passLogin (params) {
    return api({
      url: '/api/login/passLogin',
      method: 'GET',
      params
    })
  },
  checkLogin () {
    return api({
      url: '/api/login/checkToken',
      method: 'GET'
    })
  }
}
