import html2canvas from 'html2canvas'
const downfile = (url, name) => {
  const aEle = document.createElement('a')
  document.body.appendChild(aEle)
  aEle.setAttribute('href', url)
  aEle.setAttribute('download', name)
  aEle.click()
  document.body.removeChild(aEle)
}
export default {
  methods: {
    getCapture (name) {
      let option = {
        backgroundColor: name === 'admin' ? '#9e9e9e' : '#ffffff'
      }
      html2canvas(document.getElementById('captureContent'), option)
        .then(function (canvas) {
          let url = canvas.toDataURL()
          let fileName = ''
          if (name === 'admin') {
            fileName = '管理员列表-'
          } else {
            fileName = name + '的任务列表-'
          }
          let now = new Date()
          let date = now.getFullYear() + '年' + now.getMonth() + '月' + now.getDay() + '日'
          downfile(url, fileName + date + '-Yioks任务统计系统')
        })
    }
  }
}
